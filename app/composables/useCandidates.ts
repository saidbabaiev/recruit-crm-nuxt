import type { Database } from "@/types/supabase";
import type { Candidate, CandidateInsert, CandidateUpdate } from "@/types/database";

export const useCandidates = () => {
    const supabase = useSupabaseClient<Database>()

    // Fetch all candidates (with cache and SSR)
    const getCandidates = async () => {
        return useAsyncData<Candidate[]>('candidates', async () => {
            const { data, error } = await supabase
                .from('candidates')
                .select('*')
                .order('created_at', { ascending: false })
            
            if (error) throw error
            return data || []
        },
        {
           watch: [], // disable re-fetching on focus or network reconnect
           lazy: false, // fetch immediately   
        })
    }

    // Get candidate by ID
    const getCandidateById = async (id: string) => {
        return useAsyncData<Candidate>(`candidate-${id}`, async () => { 
            const { data, error } = await supabase
                .from('candidates')
                .select('*')
                .eq('id', id)
                .single()
            
            if (error) throw error
            return data as Candidate
        })
    }

    // Create a new candidate
    const createCandidate = async (candidate: CandidateInsert) => {
        const { data, error } = await supabase
            .from('candidates')
            .insert(candidate)
            .select()
            .single()
        
        if (error) throw error

        // Invalidate candidates cache
        await refreshNuxtData('candidates')

        return data as Candidate
    }

    // Update an existing candidate
    const updateCandidate = async ( id: string, updates: CandidateUpdate) => { 
        const { data, error } = await supabase
            .from('candidates')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        // Invalidate candidates cache
        await refreshNuxtData('candidates')
        await refreshNuxtData(`candidate-${id}`)

        return data as Candidate
    }

    // Delete a candidate
    const deleteCandidate = async (id: string) => { 
        const { data, error } = await supabase
            .from('candidates')
            .delete()
            .eq('id', id)
            .select()
            .single()
            
        if (error) throw error

        // Invalidate candidates cache
        await refreshNuxtData('candidates')
    }

    // Search candidates
    const searchCandidates = async (query: string) => {
        return useAsyncData<Candidate[]>(`search-candidates-${query}`, async () => { 
            const { data, error } = await supabase
                .from('candidates')
                .select('*')
                .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`)
                    .order('created_at', { ascending: false })
            
            if (error) throw error
            return data || []
        })
    }

    const helpers = {
        getFullName: (c: Candidate) => `${c.first_name} ${c.last_name}`,
        getInitials: (c: Candidate) => {
            if (!c.first_name || !c.last_name) return ''
            return `${c.first_name.charAt(0).toUpperCase()}${c.last_name.charAt(0).toUpperCase()}`
        },
        getExperienceLabel: (c: Candidate) => 
            c.experience_years ? `${c.experience_years}+ years experience` : 'No experience',
    }

    return {
        getCandidates,
        getCandidateById,
        createCandidate,
        updateCandidate,
        deleteCandidate,
        searchCandidates,
        ...helpers,
    }

}