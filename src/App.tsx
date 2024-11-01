import { useState } from 'react';

import styles from './App.module.scss';
import { ScanMedia } from './features/scan-media';

function App() {
  const [scan, setScan] = useState(false);
  const [passport, setPassport] = useState(true);

  const handlePassportScan = (passport: boolean) => {
    setScan(true);
    setPassport(passport);
  };

  return (
    <>
      <div className={styles.container}>
        <button onClick={() => handlePassportScan(true)}>
          Загрузить Паспарт
        </button>
        <button onClick={() => handlePassportScan(false)}>
          Загрузить Загрантпаспорт
        </button>
      </div>

      {scan && (
        <ScanMedia
          passport={passport}
          onError={() => {}}
          onMakeShot={(photo) => {
            console.log('[photo]', photo);
          }}
          onClick={() => setPassport((prev) => !prev)}
        />
      )}
    </>
  );
}

export default App;
