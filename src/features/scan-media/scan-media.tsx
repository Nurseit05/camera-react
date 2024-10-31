import { FC, useCallback, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';

import { cropImage, prepareCameraSetting } from './lib';
import { Props } from './model';
import s from './styles.module.scss';
import { cropSettings as CropSettingsType } from './type';

const HEIGHT = 500;

const SCREEN_QUALITY = 1;

const FRONT_CAMERA = 'user';

const BACK_CAMERA = { exact: 'environment' };

const videoConstraints = {
  width: window.screen.width,
  height: HEIGHT,
  facingMode:
    process.env.NODE_ENV !== 'production' ? FRONT_CAMERA : BACK_CAMERA,
};

export const ScanMedia: FC<Props> = ({ mask, onMakeShot, onError }) => {
  const [, setLoading] = useState<boolean>(true);
  const [url, setUrl] = useState('');
  const [cropSettings, setCropSettings] = useState<CropSettingsType | null>(
    null,
  );
  console.log('test');

  const webcamRef = useRef<Webcam>(null);

  useEffect(() => {
    const { cropSettings } = prepareCameraSetting();
    setCropSettings(cropSettings);
  }, []);

  const onScreenShot = useCallback(async () => {
    const imageSrc = webcamRef?.current?.getScreenshot();

    try {
      const result = await cropImage(imageSrc);
      onMakeShot(result);
      setUrl(result);
    } catch {
      onError();
    }
  }, [webcamRef, onMakeShot, onError]);

  const onStartLoader = () => {
    setLoading(false);
  };

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
        onUserMedia={onStartLoader}
        screenshotFormat="image/jpeg"
      />

      {/* Динамическое применение cropSettings к стилю blockPhoto */}
      {cropSettings && (
        <div
          className={s.blockPhoto}
          style={{
            width: `${cropSettings.sw}px`,
            height: `${cropSettings.sh}px`,
          }}
        ></div>
      )}

      {url && (
        <div className={s.urls}>
          <img src={url} />
        </div>
      )}

      {
        <>
          {mask}

          <div className={s.wrapperButton}>
            <button className={s.button} onClick={onScreenShot} />
          </div>
        </>
      }
    </div>
  );
};
