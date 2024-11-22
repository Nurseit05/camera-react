import { useState } from 'react';

import clsx from 'clsx';

import { ScanMedia } from '@/features/scan-media';

import PassportButtons from '@/entities/passport/';
import { fetchPhoto } from '@/entities/passport/model/fetchPhoto';

import Notification from '@/shared/ui/Notification';
import { NotificationType } from '@/shared/ui/Notification/type';

import styles from './App.module.scss';

export function App() {
  const [scan, setScan] = useState(false);
  const [passport, setPassport] = useState(true);
  const [notification, setNotification] = useState<NotificationType | null>(
    null,
  );
  const [imageUrl, setImageUrl] = useState('');

  const handlePassportScan = (passport: boolean) => {
    setScan(true);
    setPassport(passport);
  };

  const handleResetImage = () => {
    setScan(true);
    setImageUrl('');
  };

  return (
    <section className={clsx(styles.container, imageUrl && styles.image)}>
      {!imageUrl && <PassportButtons onScan={handlePassportScan} />}

      {scan && (
        <ScanMedia
          passport={passport}
          onClick={() => setPassport((prev) => !prev)}
          onError={() => {}}
          onMakeShot={(photo) =>
            fetchPhoto(photo, setImageUrl, setNotification, setScan)
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
            <button onClick={handleResetImage}>Занова</button>
            <button onClick={handleResetImage}>Закрыть</button>
          </div>
        </div>
      )}

      {notification && (
        <Notification {...notification} onClose={() => setNotification(null)} />
      )}
    </section>
  );
}
