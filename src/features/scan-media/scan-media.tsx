import { FC, useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';

import TorchIcon from '@/assets/Torch.svg';
import FacingCameraIcon from '@/assets/facingCamera.svg';

import { cropImage } from './lib';
import { Props } from './model';
import s from './styles.module.scss';

const HEIGHT = 480;
const SCREEN_QUALITY = 0.5;
const FRONT_CAMERA = 'user';
const BACK_CAMERA = { exact: 'environment' };

export const ScanMedia: FC<Props> = ({ onMakeShot, onError, passport }) => {
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
      const compressedFile = await cropImage(imageSrc);
      setImages(compressedFile);
      onMakeShot(compressedFile);
    } catch {
      onError();
    }
  }, [webcamRef, onError, onMakeShot]);

  const toggleTorch = () => {
    setIsTorchOn((prev) => !prev);

    const videoTrack = (
      webcamRef.current?.video?.srcObject as MediaStream
    )?.getVideoTracks?.()[0];

    if (videoTrack && 'applyConstraints' in videoTrack) {
      if (videoTrack.getCapabilities) {
        const capabilities = videoTrack.getCapabilities() as any;
        if (!capabilities.torch) {
          console.warn('Фонарик не поддерживается на этом устройстве');
          return;
        }
      }

      videoTrack
        .applyConstraints({
          advanced: [
            { torch: isTorchOn },
          ] as unknown as MediaTrackConstraintSet[],
        })
        .catch((error) => {
          console.error('Ошибка при переключении фонарика:', error);
        });
    }
  };

  return (
    <div className={s.container}>
      {passport && (
        <div className={s.header}>Отсканируйте обратную сторону паспорта</div>
      )}
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
          onUserMediaError={onError}
          onUserMedia={() => {}}
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
            <img src={TorchIcon} alt="torch" />
          </button>
        </div>
      )}
    </div>
  );
};
