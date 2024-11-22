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
    try {
      const trimmedBase64 = photo.replace(/^data:image\/\w+;base64,/, '');

      const binary = atob(trimmedBase64);
      const array = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([array], { type: 'image/png' });

      const formData = new FormData();
      formData.append('file', blob, 'photo.png');

      const response = await fetch(
        'https://ai.mdigital.kg/api/v1/mrz_recognition/process/',
        {
          method: 'POST',
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const json = await response.json();
      alert(JSON.stringify(json));
      console.log(json);
    } catch (error) {
      console.error('Error:', error);
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
