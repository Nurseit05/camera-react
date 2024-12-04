import { useState } from 'react';

import ModalUploading from '@/features/modalUploading';
import { ScanMedia } from '@/features/scan-media';

import { fetchPhoto } from '@/entities/passport/model/fetchPhoto';

import Notification from '@/shared/ui/Notification';
import { NotificationType } from '@/shared/ui/Notification/type';
import Header from '@/shared/ui/header';
import Main from '@/shared/ui/main';

import styles from './App.module.scss';

export function App() {
  const [scan, setScan] = useState(false);
  const [passport, setPassport] = useState(true);
  const [notification, setNotification] = useState<NotificationType | null>(
    null,
  );
  const [uploading, setUploading] = useState(false);

  const handlePassportScan = (passport: boolean) => {
    setScan(true);
    setPassport(passport);
  };

  return (
    <section className={styles.container}>
      <Header />
      {uploading ? (
        <ModalUploading
          passwordScan={handlePassportScan}
          closeModal={setUploading}
        />
      ) : (
        <Main setUploading={setUploading} />
      )}

      {scan && (
        <ScanMedia
          passport={passport}
          setUploading={setUploading}
          setScan={setScan}
          onClick={() => setPassport((prev) => !prev)}
          onError={() => {}}
          onMakeShot={(photo) => fetchPhoto(photo, setNotification)}
        />
      )}

      {notification && (
        <Notification {...notification} onClose={() => setNotification(null)} />
      )}
    </section>
  );
}
