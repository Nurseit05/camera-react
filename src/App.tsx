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

  const fetchPhoto = async (photo: string) => {
    const formData = new FormData();

    formData.append('file', photo);
    try {
      const response = await fetch(
        'https://ai.mdigital.kg/api/v1/mrz_recognition/process/',
        {
          method: 'POST',
          body: JSON.stringify(formData),
        },
      );

      const json = await response.json();
      alert(json);
    } catch {
      console.log('error');
    }
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
            fetchPhoto(photo);
          }}
          onClick={() => setPassport((prev) => !prev)}
        />
      )}
    </>
  );
}

export default App;
