import { useState } from 'react';

import './App.css';
import { ScanMedia } from './features/scan-media';

function App() {
  const [scan, setScan] = useState(false);

  return (
    <>
      <button onClick={() => setScan(true)}>Загрузить фото</button>

      {scan && (
        <ScanMedia
          onError={() => {}}
          onMakeShot={(photo) => {
            console.log('[photo]', photo);
          }}
        />
      )}
    </>
  );
}

export default App;
