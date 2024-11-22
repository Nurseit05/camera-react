import { FC, useCallback, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';

import FacingCameraIcon from '@/assets/facingCamera.svg';
import ForeignPassport from '@/assets/foreignPassport.svg';
import Passport from '@/assets/passport.svg';

import { cropImage, prepareCameraSetting } from './lib';
import { Props } from './model';
import s from './styles.module.scss';
import { cropSettings as CropSettingsType } from './type';

const HEIGHT = 400;
const SCREEN_QUALITY = 1;
const FRONT_CAMERA = 'user';
const BACK_CAMERA = { exact: 'environment' };

export const ScanMedia: FC<Props> = ({
  passport,
  onMakeShot,
  onError,
  onClick,
}) => {
  const [cropSettings, setCropSettings] = useState<CropSettingsType | null>(
    null,
  );
  const [isFrontCamera, setIsFrontCamera] = useState(
    process.env.NODE_ENV !== 'production' ? FRONT_CAMERA : BACK_CAMERA,
  );

  const webcamRef = useRef<Webcam>(null);

  useEffect(() => {
    const settings = prepareCameraSetting(passport);
    setCropSettings(settings.cropSettings);
  }, [passport]);

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
      const croppedImage = await cropImage(imageSrc, passport);
      onMakeShot(croppedImage);
    } catch {
      onError();
    }
  }, [webcamRef, onMakeShot, onError, passport]);

  return (
    <div className={s.container}>
      <div className={s.wrapperCamera}>
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
        {cropSettings && passport && (
          <div
            className={s.blockPhoto}
            style={{
              width: `${cropSettings.sw}px`,
              height: `${cropSettings.sh}px`,
            }}
          ></div>
        )}
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
        <button onClick={onClick} className={s.btnPassport}>
          <img src={passport ? Passport : ForeignPassport} alt="Passport" />
        </button>
      </div>
    </div>
  );
};
