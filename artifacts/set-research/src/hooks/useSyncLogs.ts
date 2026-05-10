import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SyncLog } from '@/types';

export function useSyncLogs() {
  const { data: logs, isLoading: loading, error, refetch } = useQuery({
    queryKey: ['sync_logs'],
    queryFn: async () => {
      const q = query(collection(db, 'sync_logs'), orderBy('started_at', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SyncLog));
    },
  });

  return { logs: logs || [], loading, error, refetch };
}
