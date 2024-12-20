import { FC, useCallback, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';

import TorchIcon from '@/assets/Torch.svg';
import Gallery from '@/assets/gallery.jpeg';

import { clsx } from 'clsx';

import { cropImage, prepareCameraSetting } from './lib';
import { Props } from './model';
import s from './styles.module.scss';
import { cropSettings } from './type';

const SCREEN_QUALITY = 0.5;

const BACK_CAMERA = { exact: 'environment' };

export const ScanMedia: FC<Props> = ({ onMakeShot, onError, passport }) => {
  const [images, setImages] = useState('');
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);
  const [cropSettings, setCropSettings] = useState<cropSettings | null>(null);
  const [isWebcamReady, setIsWebcamReady] = useState(false);
  const [height, setHeight] = useState(0);
  const [galleryPhoto, setGalleryPhoto] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const parentWebcamRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const settings = prepareCameraSetting(passport, height);
    setCropSettings(settings.cropSettings);
  }, [passport, height]);

  const videoConstraints = {
    width: { min: 640, ideal: 1080, max: 1080 },
    height: { min: 480, ideal: 1080, max: 1080 },
    facingMode: BACK_CAMERA,
  };

  const handleImages = () => {
    setImages('');
  };

  const handleWebcamHeight = useCallback(() => {
    setTimeout(() => {
      const updatedHeight =
        parentWebcamRef?.current?.getBoundingClientRect().height;

      setHeight(updatedHeight as number);
    }, 100);
    setIsWebcamReady(true);
  }, []);

  const captureScreenshot = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();

    if (!imageSrc) {
      onError();
      return;
    }

    try {
      const compressedFile = await cropImage(imageSrc, passport, height);
      setImages(imageSrc);
      onMakeShot(compressedFile);
    } catch {
      onError();
    }
  }, [webcamRef, onError, onMakeShot, passport, height]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const compressImage = (image: HTMLImageElement, quality = 0.5) => {
      return new Promise<string>((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        canvas.width = image.width;
        canvas.height = image.height;

        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        try {
          const dataUrl = canvas.toDataURL('image/webp', quality);
          resolve(dataUrl);
        } catch (error) {
          reject(error);
        }
      });
    };

    const reader = new FileReader();
    reader.onload = async () => {
      const imageSrc = reader.result as string;
      const image = new Image();

      image.onload = async () => {
        try {
          const compressedImage = await compressImage(image, 0.5);
          setGalleryPhoto(true);
          setImages(compressedImage);
          onMakeShot(compressedImage);
        } catch (error) {
          console.error('Ошибка при сжатии изображения:', error);
          onError();
        }
      };

      image.onerror = () => {
        console.error('Ошибка загрузки изображения');
        onError();
      };

      image.src = imageSrc;
    };

    reader.onerror = () => {
      console.error('Ошибка чтения файла');
      onError();
    };

    reader.readAsDataURL(file);
  };

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
      <div className={s.wrapperCamera}>
        {passport && !images && isWebcamReady && (
          <div className={s.header}>Отсканируйте обратную сторону паспорта</div>
        )}
        {images && (
          <img
            className={clsx(galleryPhoto && s.galleryPhoto)}
            src={images}
            width={window.screen.availWidth}
            alt="Captured"
          />
        )}
        <div ref={parentWebcamRef}>
          <Webcam
            onLoadedMetadata={handleWebcamHeight}
            style={{
              display: images ? 'none' : 'inline',
            }}
            audio={false}
            ref={webcamRef}
            screenshotQuality={SCREEN_QUALITY}
            width={window.screen.availWidth}
            videoConstraints={videoConstraints}
            onUserMediaError={onError}
            onUserMedia={() => {}}
            screenshotFormat="image/webp"
          />
        </div>
        {cropSettings && !images && isWebcamReady && height > 0 && (
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
          <div className={s.galleryInput}>
            <img className={s.img} src={Gallery} alt="gallery" />
            <input
              type="file"
              accept="image/png, image/webp, image/jpeg"
              onChange={handleFileUpload}
            />
          </div>
          <button className={s.button} onClick={captureScreenshot} />
          <button className={s.torch} onClick={toggleTorch}>
            <img src={TorchIcon} alt="torch" />
          </button>
        </div>
      )}
    </div>
  );
};
