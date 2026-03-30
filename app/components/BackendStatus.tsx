'use client';

import { useEffect, useState } from 'react';

export default function BackendStatus() {
  const [status, setStatus] = useState('Checking...');

  useEffect(() => {
    fetch('http://localhost:8000/health')
      .then((res) => {
        if (res.ok) {
          setStatus('🟢 Backend Online');
        } else {
          setStatus('🔴 Backend Offline');
        }
      })
      .catch(() => {
        setStatus('🔴 Backend Offline');
      });
  }, []);

  return (
    <div style={{ marginBottom: '20px', fontWeight: 'bold' }}>
      {status}
    </div>
  );
}