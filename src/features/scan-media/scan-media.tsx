import { FC, useCallback, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';

import FacingCameraIcon from '@/assets/facingCamera.svg';

import { cropImage, prepareCameraSetting } from './lib';
import { Props } from './model';
import s from './styles.module.scss';
import { cropSettings as CropSettingsType } from './type';

const HEIGHT = 500;
const SCREEN_QUALITY = 1;
const FRONT_CAMERA = 'user';
const BACK_CAMERA = { exact: 'environment' };

export const ScanMedia: FC<Props> = ({ onMakeShot, onError }) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [cropSettings, setCropSettings] = useState<CropSettingsType | null>(
    null,
  );
  const [isFrontCamera, setIsFrontCamera] = useState(
    process.env.NODE_ENV !== 'production' ? FRONT_CAMERA : BACK_CAMERA,
  );

  const webcamRef = useRef<Webcam>(null);

  useEffect(() => {
    const settings = prepareCameraSetting();
    setCropSettings(settings.cropSettings);
  }, []);

  const videoConstraints = {
    width: window.screen.width,
    height: HEIGHT,
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
      setImageUrl(croppedImage);
    } catch {
      onError();
    }
  }, [webcamRef, onMakeShot, onError]);

  return (
    <div className={s.container}>
      <Webcam
        audio={false}
        ref={webcamRef}
        height={HEIGHT}
        screenshotQuality={SCREEN_QUALITY}
        width={window.screen.width}
        videoConstraints={videoConstraints}
        onUserMediaError={onError}
        onUserMedia={() => {}}
        screenshotFormat="image/jpeg"
      />
      {cropSettings && (
        <div
          className={s.blockPhoto}
          style={{
            width: `${cropSettings.sw}px`,
            height: `${cropSettings.sh}px`,
          }}
        ></div>
      )}

      <button
        onClick={() => setIsFrontCamera(FRONT_CAMERA)}
        className={s.btnFrontCamera}
      >
        <img src={FacingCameraIcon} alt="Switch Camera" />
      </button>

      {imageUrl && (
        <div className={s.urls}>
          <img src={imageUrl} alt="Captured" />
        </div>
      )}

      <div className={s.wrapperButton}>
        <button className={s.button} onClick={captureScreenshot} />
      </div>
    </div>
  );
};
