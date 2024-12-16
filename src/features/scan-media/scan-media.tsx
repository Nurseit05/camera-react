import { FC, useCallback, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';

import TorchIcon from '@/assets/Torch.svg';
import FacingCameraIcon from '@/assets/facingCamera.svg';

import { cropImage, prepareCameraSetting } from './lib';
import { Props } from './model';
import s from './styles.module.scss';
import { cropSettings } from './type';

const SCREEN_QUALITY = 0.5;
const FRONT_CAMERA = 'user';
const BACK_CAMERA = { exact: 'environment' };

export const ScanMedia: FC<Props> = ({ onMakeShot, onError, passport }) => {
  const [isFrontCamera, setIsFrontCamera] = useState(
    process.env.NODE_ENV !== 'production' ? FRONT_CAMERA : BACK_CAMERA,
  );
  const [images, setImages] = useState('');
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);
  const [cropSettings, setCropSettings] = useState<cropSettings | null>(null);
  const [isWebcamReady, setIsWebcamReady] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const parentWebcamRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const height = parentWebcamRef?.current?.getBoundingClientRect().height;
    const settings = prepareCameraSetting(passport, height as number);
    setCropSettings(settings.cropSettings);
  }, [passport]);

  const videoConstraints = {
    width: { min: 320, ideal: 1080, max: 1080 },
    height: { min: 240, ideal: 1080, max: 1080 },
    facingMode: isFrontCamera,
  };

  const handleImages = () => {
    setImages('');
  };

  const captureScreenshot = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    const height = parentWebcamRef?.current?.getBoundingClientRect().height;

    if (!imageSrc) {
      onError();
      return;
    }

    try {
      const compressedFile = await cropImage(
        imageSrc,
        passport,
        height as number,
      );
      setImages(imageSrc);
      onMakeShot(compressedFile);
    } catch {
      onError();
    }
  }, [webcamRef, onError, onMakeShot, passport]);

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
      <div ref={parentWebcamRef} className={s.wrapperCamera}>
        {passport && !images && isWebcamReady && (
          <div className={s.header}>Отсканируйте обратную сторону паспорта</div>
        )}
        {images && <img className={s.img} src={images} alt="Captured" />}
        <Webcam
          style={{
            display: images ? 'none' : 'inline',
          }}
          audio={false}
          ref={webcamRef}
          screenshotQuality={SCREEN_QUALITY}
          width={window.screen.availWidth}
          videoConstraints={videoConstraints}
          onUserMediaError={onError}
          onUserMedia={() => setIsWebcamReady(true)}
          screenshotFormat="image/webp"
        />
        {cropSettings && !images && isWebcamReady && (
          <div
            className={s.blockPhoto}
            style={{
              left: `${cropSettings.sx}px`,
              width: `${cropSettings.sw}px`,
              height: `${cropSettings.sh}px`,
              top: `${cropSettings.sy}px`,
            }}
          ></div>
        )}
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
