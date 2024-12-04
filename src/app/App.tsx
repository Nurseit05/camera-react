import { useState } from 'react';

import { clsx } from 'clsx';

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
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const handlePassportScan = (passport: boolean) => {
    setScan(true);
    setPassport(passport);
  };

  const handleResetImage = () => {
    setScan(true);
    setImageUrl('');
    setNotification(null);
  };

  return (
    <section className={clsx(styles.container, imageUrl && styles.image)}>
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
          onMakeShot={(photo) =>
            fetchPhoto(photo, setImageUrl, setNotification)
          }
        />
      )}

      {imageUrl && (
        <div
          className={clsx(
            styles.urls,
            !passport && styles.foreignPassport,
            notification?.status === 200 && styles.image,
          )}
        >
          <img src={imageUrl} alt="Captured" />
          <div className={styles.wrapperImage}>
            <button className={styles.again} onClick={handleResetImage}>
              Заново
            </button>
            <button className={styles.close} onClick={handleResetImage}>
              Закрыть
            </button>
          </div>
        </div>
      )}

      {notification && (
        <Notification {...notification} onClose={() => setNotification(null)} />
      )}
    </section>
  );
}
