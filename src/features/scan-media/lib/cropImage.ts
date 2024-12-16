const WIDTH_IMAGE_IN_PERCENTAGE = 90;

const START_CROP_IMAGE_IN_PERCENTAGE_BY_X = 6;

const FULL_PERCENT = 100;

const percentToNumber = (fullNumber: number, percent: number) => {
  return (fullNumber * percent) / FULL_PERCENT;
};

export const prepareCameraSetting = (passport: boolean, height: number) => {
  let HEIGHT_IMAGE = 230;
  let TOP_CONTAINER = 15;
  const WIDTH_IMAGE = window.innerWidth;
  const WINDOW_HEIGHT = height;

  function getRange(width: number, passport: boolean) {
    if (!passport && width >= 320 && width < 425) return 'topingForeign';
    if (width >= 320 && width < 375) return 'smallContainer';
    return 'default';
  }

  switch (getRange(WIDTH_IMAGE, passport)) {
    case 'smallContainer':
      HEIGHT_IMAGE = 180;
      break;
    case 'topingForeign':
      TOP_CONTAINER = 10;
      break;
    default:
  }

  const CROP_CENTER_Y = (WINDOW_HEIGHT - HEIGHT_IMAGE) / 2;
  const CONTAINER_FOREIGN = WINDOW_HEIGHT * 0.9;

  return {
    canvasSettings: {
      height: HEIGHT_IMAGE,
      width: percentToNumber(WIDTH_IMAGE, WIDTH_IMAGE_IN_PERCENTAGE),
    },
    cropSettings: {
      sx: percentToNumber(WIDTH_IMAGE, START_CROP_IMAGE_IN_PERCENTAGE_BY_X), // начальная точка вырезки фото по оси X
      sy: passport ? CROP_CENTER_Y : TOP_CONTAINER, // начальная точка вырезки фото по оси Y
      sw: percentToNumber(WIDTH_IMAGE, WIDTH_IMAGE_IN_PERCENTAGE), // ширина фотографии для вырезки
      sh: passport ? HEIGHT_IMAGE : CONTAINER_FOREIGN, // высота фотографии для вырезки
      dx: 0, // отступ результата вырезанной фото по оси X
      dy: 0, // отступ результата вырезанной фото по оси Y
      dw: percentToNumber(WIDTH_IMAGE, WIDTH_IMAGE_IN_PERCENTAGE), // ширина вырезанной фотографии
      dh: passport ? HEIGHT_IMAGE : CONTAINER_FOREIGN, // высота вырезанной фотографии
    },
  };
};

export const cropImage = (
  base64?: string | null,
  passport?: boolean,
  height?: number,
  quality = 0.5,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject('Failed to get canvas context');
        return;
      }

      const { cropSettings } = prepareCameraSetting(
        passport as boolean,
        height as number,
      );

      canvas.width = cropSettings.dw;
      canvas.height = cropSettings.dh;

      ctx.drawImage(
        img,
        cropSettings.sx,
        cropSettings.sy,
        cropSettings.sw,
        cropSettings.sh,
        cropSettings.dx,
        cropSettings.dy,
        cropSettings.dw,
        cropSettings.dh,
      );

      const originalSize = getBase64Size(base64 as string); // Размер исходного файла
      const croppedBase64 = canvas.toDataURL('image/webp', quality); // Результат
      const croppedSize = getBase64Size(croppedBase64); // Размер результата

      alert(`Original size: ${(originalSize / 1024).toFixed(2)} KB`);
      alert(`Cropped size: ${(croppedSize / 1024).toFixed(2)} KB`);

      resolve(croppedBase64);
    };

    img.onerror = (error) => {
      reject(`Failed to load image: ${error}`);
    };

    if (!base64) {
      reject('Image not loaded');
      return;
    }

    img.src = base64;
  });
};

const getBase64Size = (base64String: string) => {
  const padding = (base64String.match(/=/g) || []).length;
  return (base64String.length * 3) / 4 - padding;
};
