-- ================================
-- Function: get_current_user_role
-- ================================
CREATE OR REPLACE FUNCTION public.get_current_user_role()
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$
  SELECT uc.role::text 
  FROM public.user_companies uc
  JOIN public.profiles p ON p.id = auth.uid()
  WHERE uc.user_id = auth.uid() 
    AND uc.company_id = p.current_company_id;
$function$


CREATE OR REPLACE FUNCTION public.get_user_company_id()
 RETURNS uuid
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$
  SELECT current_company_id FROM public.profiles WHERE id = auth.uid();
$function$

CREATE OR REPLACE FUNCTION public.get_user_companies()
 RETURNS TABLE(company_id uuid, company_name text, user_role app_role, joined_at timestamp with time zone, is_current boolean)
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$
  SELECT 
    uc.company_id,
    c.name as company_name,
    uc.role as user_role,
    uc.joined_at,
    (uc.company_id = p.current_company_id) as is_current
  FROM public.user_companies uc
  JOIN public.companies c ON c.id = uc.company_id
  JOIN public.profiles p ON p.id = auth.uid()
  WHERE uc.user_id = auth.uid()
  ORDER BY is_current DESC, c.name ASC;
$function$

CREATE OR REPLACE FUNCTION public.get_user_role_in_company(user_id_param uuid, company_id_param uuid)
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$
  SELECT role::text 
  FROM public.user_companies 
  WHERE user_id = user_id_param AND company_id = company_id_param;
$function$

CREATE OR REPLACE FUNCTION public.has_role(required_role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_companies uc
    JOIN public.profiles p ON p.id = auth.uid()
    WHERE uc.user_id = auth.uid() 
      AND uc.company_id = p.current_company_id 
      AND uc.role = required_role
  );
$function$


CREATE OR REPLACE FUNCTION public.switch_company(target_company_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Проверить что пользователь действительно член этой компании
  IF NOT EXISTS (
    SELECT 1 FROM public.user_companies 
    WHERE user_id = auth.uid() AND company_id = target_company_id
  ) THEN
    RETURN FALSE;
  END IF;
  
  -- Обновить current_company_id в профиле
  UPDATE public.profiles 
  SET current_company_id = target_company_id,
      updated_at = now()
  WHERE id = auth.uid();
  
  RETURN TRUE;
END;
$function$

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  invitation_record RECORD;
  new_company_id UUID;
  company_name TEXT;
  user_role public.app_role;
BEGIN
  -- Check for active invitation
  SELECT * INTO invitation_record
  FROM public.team_invitations
  WHERE email = NEW.email
    AND used_at IS NULL
    AND expires_at > now()
    AND (
      CASE 
        WHEN NEW.raw_user_meta_data ? 'invitation_token' THEN
          token = NEW.raw_user_meta_data ->> 'invitation_token'
        ELSE
          true
      END
    )
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- If invitation found
  IF invitation_record.id IS NOT NULL THEN
    new_company_id := invitation_record.company_id;
    user_role := invitation_record.role::public.app_role;
    
    -- Mark invitation as used
    UPDATE public.team_invitations
    SET used_at = now()
    WHERE id = invitation_record.id;
  ELSE
    -- Create new company
    company_name := COALESCE(
      NEW.raw_user_meta_data ->> 'company_name',
      NEW.raw_user_meta_data ->> 'full_name' || '''s Company',
      'My Company'
    );
    
    INSERT INTO public.companies (name)
    VALUES (company_name)
    RETURNING id INTO new_company_id;
    
    user_role := 'owner'::public.app_role;
  END IF;
  
  -- Create profile with trial period
  INSERT INTO public.profiles (
    id, 
    company_id, 
    current_company_id, 
    first_name, 
    last_name, 
    email,
    trial_ends_at,
    subscription_status
  )
  VALUES (
    NEW.id,
    new_company_id,
    new_company_id,
    COALESCE(
      NEW.raw_user_meta_data ->> 'first_name',
      split_part(COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email), ' ', 1),
      split_part(NEW.email, '@', 1)
    ),
    COALESCE(
      NEW.raw_user_meta_data ->> 'last_name',
      CASE 
        WHEN NEW.raw_user_meta_data ->> 'full_name' LIKE '% %' THEN
          split_part(NEW.raw_user_meta_data ->> 'full_name', ' ', 2)
        ELSE
          NULL
      END
    ),
    NEW.email,
    NOW() + INTERVAL '14 days',
    'trial'
  );
  
  -- Add user to company
  INSERT INTO public.user_companies (user_id, company_id, role)
  VALUES (NEW.id, new_company_id, user_role);
  
  RETURN NEW;
END;
$function$


CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
