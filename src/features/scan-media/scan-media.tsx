import { FC, useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';

import FacingCameraIcon from '@/assets/facingCamera.svg';

import { Props } from './model';
import s from './styles.module.scss';

const HEIGHT = 480;
const SCREEN_QUALITY = 0.5;
const FRONT_CAMERA = 'user';
const BACK_CAMERA = { exact: 'environment' };

export const ScanMedia: FC<Props> = ({ onMakeShot, onError }) => {
  const [isFrontCamera, setIsFrontCamera] = useState(
    process.env.NODE_ENV !== 'production' ? FRONT_CAMERA : BACK_CAMERA,
  );
  const [images, setImages] = useState('');
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);

  const webcamRef = useRef<Webcam>(null);

  const videoConstraints = {
    width: { min: 640, ideal: 1080, max: 1080 },
    height: { min: 480, ideal: 1080, max: 1080 },
    facingMode: isFrontCamera,
  };

  const handleImages = () => {
    setImages('');
  };

  const captureScreenshot = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();

    if (!imageSrc) {
      onError();
      return;
    }

    try {
      setImages(imageSrc);
      onMakeShot(imageSrc);
    } catch {
      onError();
    }
  }, [webcamRef, onMakeShot, onError]);

  const handleUserMedia = (stream: MediaStream) => {
    const videoTrack = stream.getVideoTracks()[0];

    if ('applyConstraints' in videoTrack) {
      try {
        videoTrack.applyConstraints({
          advanced: [{ torch: isTorchOn }] as any,
        });
      } catch (error) {
        console.error('Ошибка при попытке включить фонарик:', error);
      }
    }
  };

  const toggleTorch = () => {
    setIsTorchOn((prev) => !prev);
  };

  return (
    <div className={s.container}>
      <div className={s.wrapperCamera}>
        {images && (
          <img width={window.innerWidth} src={images} alt="Captured" />
        )}
        <Webcam
          style={{
            width: '100%',
            height: 'auto',
            display: images ? 'none' : 'inline',
          }}
          audio={false}
          ref={webcamRef}
          height={HEIGHT}
          forceScreenshotSourceSize={true}
          screenshotQuality={SCREEN_QUALITY}
          videoConstraints={videoConstraints}
          onUserMedia={handleUserMedia}
          onUserMediaError={onError}
          screenshotFormat="image/jpeg"
        />
      </div>

      {images ? (
        <div className={s.wrapperButton}>
          <button onClick={handleImages} className={s.again}>
            Попробовать еще раз
          </button>
        </div>
      ) : (
        <div className={s.wrapperButton}>
          <button className={s.button} onClick={captureScreenshot} />
          <button
            onClick={() =>
              setIsFrontCamera((prev) =>
                prev === FRONT_CAMERA ? BACK_CAMERA : FRONT_CAMERA,
              )
            }
            className={s.btnFrontCamera}
          >
            <img src={FacingCameraIcon} alt="Switch Camera" />
          </button>
          <button className={s.torch} onClick={toggleTorch}>
            {isTorchOn ? 'Выключить фонарик' : 'Включить фонарик'}
          </button>
        </div>
      )}
    </div>
  );
};
