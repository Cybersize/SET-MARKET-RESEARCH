import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Company } from '@/types';

export function useCompanies() {
  const { data: companies, isLoading: loading, error, refetch } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const querySnapshot = await getDocs(collection(db, 'companies'));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Company));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return { companies: companies || [], loading, error, refetch };
}
