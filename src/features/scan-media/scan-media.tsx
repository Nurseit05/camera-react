import { FC, useCallback, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';

import FacingCameraIcon from '@/assets/facingCamera.svg';

import { cropImage } from './lib';
import { Props } from './model';
import s from './styles.module.scss';

const HEIGHT = 400;
const SCREEN_QUALITY = 1;
const FRONT_CAMERA = 'user';
const BACK_CAMERA = { exact: 'environment' };

export const ScanMedia: FC<Props> = ({ onMakeShot, onError }) => {
  const [isFrontCamera, setIsFrontCamera] = useState(
    process.env.NODE_ENV !== 'production' ? FRONT_CAMERA : BACK_CAMERA,
  );
  const [images, setImages] = useState('');
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  const webcamRef = useRef<Webcam>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const videoConstraints = {
    width: {
      min: 640,
      max: 2560,
      ideal: 1920,
    },
    height: {
      min: 480,
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
      setImages(croppedImage);
      onMakeShot(croppedImage);
    } catch {
      onError();
    }
  }, [webcamRef, onMakeShot, onError]);

  useEffect(() => {
    if (imgRef.current) {
      const handleLoad = () => {
        setImageDimensions({
          width: imgRef.current!.naturalWidth,
          height: imgRef.current!.naturalHeight,
        });
      };

      imgRef.current.addEventListener('load', handleLoad);
      return () => {
        imgRef.current?.removeEventListener('load', handleLoad);
      };
    }

    alert(imageDimensions);
  }, [images, imageDimensions]);

  return (
    <div className={s.container}>
      <div className={s.wrapperCamera}>
        {images ? (
          <>
            <img ref={imgRef} src={images} alt="Captured" />
            <p>
              Image dimensions: {imageDimensions.width}px ×{' '}
              {imageDimensions.height}px
            </p>
          </>
        ) : (
          <Webcam
            style={{
              width: '100%',
              height: 'auto',
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
      </div>
    </div>
  );
};
