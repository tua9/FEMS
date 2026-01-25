import { useEffect, useState } from 'react';
import { checkBackend } from '../services/api';

function Check() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    checkBackend()
      .then(data => setStatus(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>FEMS Demo</h1>

      {status ? (
        <>
          <p>Status: {status.status}</p>
          <p>{status.message}</p>
        </>
      ) : (
        <p>Connecting to backend...</p>
      )}
    </div>
  );
}

export default Check;