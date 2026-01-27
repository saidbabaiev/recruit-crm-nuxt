
with ctx as (
  select public.get_user_company_id() as company_id
),
job as (
  select j.*
  from public.jobs j
  join ctx on true
  where j.id = p_job_id
    and j.company_id = ctx.company_id
),
cands as (
  select c.*
  from public.candidates c
  join ctx on true
  where c.company_id = ctx.company_id
),
calc as (
  select
    c.id as candidate_id,

    coalesce(ms.matched_skills, '{}'::text[]) as matched_skills,
    coalesce(ms.matched_count, 0) as matched_count,
    cardinality(j.skills) as required_count,

    -- SKILLS
    case
      when cardinality(j.skills) = 0 then 0
      else round(coalesce(ms.matched_count,0)::numeric / cardinality(j.skills)::numeric, 4)
    end as skills_score,

    -- FORMAT
    case
      when c.remote_work_preference is null then 0.7
      when c.remote_work_preference::text = j.work_format::text then 1
      else 0
    end as format_score,

    -- EXPERIENCE
    case
      when j.min_experience_value is null then 0.7
      when c.experience_years is null then 0.6
      else
        case
          when c.experience_years >=
            case
              when j.min_experience_period is null then j.min_experience_value::numeric
              when lower(j.min_experience_period) like 'month%' then (j.min_experience_value::numeric / 12.0)
              else j.min_experience_value::numeric
            end
          then 1
          else round(
            greatest(
              c.experience_years::numeric /
              nullif(
                case
                  when j.min_experience_period is null then j.min_experience_value::numeric
                  when lower(j.min_experience_period) like 'month%' then (j.min_experience_value::numeric / 12.0)
                  else j.min_experience_value::numeric
                end
              , 0)
            , 0)
          , 4)
        end
    end as experience_score,

    -- SALARY (кандидат ожидает, job предлагает)
    case
      when (j.salary_min is null and j.salary_max is null) then 0.7
      when (c.expected_salary_min is null and c.expected_salary_max is null) then 0.7
      when j.salary_currency is not null and c.salary_currency is not null and j.salary_currency <> c.salary_currency then 0.7
      when j.salary_period is not null and c.salary_period is not null and j.salary_period <> c.salary_period then 0.7
      else
        case
          when j.salary_max is not null and c.expected_salary_min is not null and c.expected_salary_min > j.salary_max then 0
          when j.salary_min is not null and c.expected_salary_max is not null and c.expected_salary_max < j.salary_min then 0
          else 1
        end
    end as salary_score,

    -- flags
    (c.remote_work_preference is not null and c.remote_work_preference::text <> j.work_format::text) as format_mismatch,

    (
      j.min_experience_value is not null
      and c.experience_years is not null
      and c.experience_years <
        case
          when j.min_experience_period is null then j.min_experience_value::numeric
          when lower(j.min_experience_period) like 'month%' then (j.min_experience_value::numeric / 12.0)
          else j.min_experience_value::numeric
        end
    ) as experience_below_min,

    (
      j.salary_currency is not null and c.salary_currency is not null and j.salary_currency = c.salary_currency
      and j.salary_period is not null and c.salary_period is not null and j.salary_period = c.salary_period
      and (
        (j.salary_max is not null and c.expected_salary_min is not null and c.expected_salary_min > j.salary_max)
        or
        (j.salary_min is not null and c.expected_salary_max is not null and c.expected_salary_max < j.salary_min)
      )
    ) as salary_out_of_range

  from cands c
  cross join job j
  left join lateral (
    select
      array_agg(distinct s) as matched_skills,
      count(distinct s)::int as matched_count
    from unnest(c.skills) s
    join unnest(j.skills) r on r = s
  ) ms on true

  where
    (c.skills && j.skills) or p_include_partial_skill_match
)
select
  candidate_id,
  round(
    (skills_score      * 0.70) +
    (format_score      * 0.10) +
    (experience_score  * 0.15) +
    (salary_score      * 0.05)
  , 4) as total_score,
  skills_score,
  experience_score,
  salary_score,
  format_score,
  matched_count,
  required_count,
  matched_skills
from calc
where
  (not p_strict_format or not format_mismatch)
  and (not p_strict_experience or not experience_below_min)
  and (not p_strict_salary or not salary_out_of_range)
  and round(
    (skills_score      * 0.70) +
    (format_score      * 0.10) +
    (experience_score  * 0.15) +
    (salary_score      * 0.05)
  , 4) >= p_min_total_score
order by total_score desc, matched_count desc
limit p_limit;
