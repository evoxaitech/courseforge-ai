import { useState, useCallback } from 'react';

export function useNotification() {
  const [notif, setNotif] = useState(null);

  const show = useCallback((message, type = 'success') => {
    setNotif({ message, type });
    setTimeout(() => setNotif(null), 3000);
  }, []);

  return { notif, show };
}