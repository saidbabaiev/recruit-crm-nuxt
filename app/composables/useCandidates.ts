import type { Database } from "@/types/supabase";
import type { Candidate } from "@/types/database";

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



    return {
        getCandidates,
    }

}