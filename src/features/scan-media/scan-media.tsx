import { FC, useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';

import ArrowRight from '@/assets/arrowRight.svg';
import FacingCameraIcon from '@/assets/facingCamera.svg';

import { clsx } from 'clsx';

import { cropImage } from './lib';
import { Props } from './model';
import s from './styles.module.scss';

const HEIGHT = 400;
const SCREEN_QUALITY = 1;
const FRONT_CAMERA = 'user';
const BACK_CAMERA = { exact: 'environment' };

export const ScanMedia: FC<Props> = ({
  passport,
  onMakeShot,
  onError,
  setUploading,
  setScan,
}) => {
  const [isFrontCamera, setIsFrontCamera] = useState(
    process.env.NODE_ENV !== 'production' ? FRONT_CAMERA : BACK_CAMERA,
  );

  const webcamRef = useRef<Webcam>(null);

  const videoConstraints = {
    width: {
      min: window.screen.width,
      max: 2560,
      ideal: 2560,
    },
    height: {
      min: 400,
      max: 1440,
      ideal: 1440,
    },
    facingMode: isFrontCamera,
  };

  const captureScreenshot = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();

    if (!imageSrc) {
      onError();
      return;
    }

    try {
      const croppedImage = await cropImage(imageSrc);
      onMakeShot(croppedImage);
    } catch {
      onError();
    }
  }, [webcamRef, onMakeShot, onError]);

  const handleBack = () => {
    setUploading(true);
    setScan(false);
  };

  return (
    <div className={s.container}>
      <div className={clsx(s.wrapperTitle, 'container')}>
        <button onClick={handleBack} className={s.arrowRightBtn}>
          <img src={ArrowRight} alt="ArrowRight" />
        </button>
        <h1 className={s.title}>
          {passport ? 'Загрузка ID-паспорта' : 'Загрузка загранпаспорта'}
        </h1>
      </div>

      <div className={s.wrapperCamera}>
        <Webcam
          audio={false}
          ref={webcamRef}
          height={HEIGHT}
          forceScreenshotSourceSize={true}
          screenshotQuality={SCREEN_QUALITY}
          width={window.screen.width}
          videoConstraints={videoConstraints}
          onUserMediaError={onError}
          onUserMedia={() => {}}
          screenshotFormat="image/jpeg"
        />
      </div>

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
      </div>
    </div>
  );
};
