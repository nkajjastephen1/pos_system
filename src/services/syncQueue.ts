import * as database from './database';

export async function syncOfflineQueue() {
  const syncQueue = JSON.parse(localStorage.getItem('sync_queue') || '[]');
  
  if (syncQueue.length === 0 || !navigator.onLine) return;

  for (const item of syncQueue) {
    try {
      if (item.type === 'transaction') {
        await database.addTransaction(item.data, item.userId);
      }
    } catch (err) {
      console.error('Sync failed:', err);
      return; // Stop on first error
    }
  }

  localStorage.setItem('sync_queue', '[]');
}

// Call this when app comes online
window.addEventListener('online', syncOfflineQueue);