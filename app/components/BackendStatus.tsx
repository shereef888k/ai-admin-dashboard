'use client';

import { useEffect, useState } from 'react';

export default function BackendStatus() {
  const [status, setStatus] = useState('Checking...');

  useEffect(() => {
    fetch('http://65.0.125.150/health')
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
