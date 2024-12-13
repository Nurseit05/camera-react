const WIDTH_IMAGE_IN_PERCENTAGE = 90;

const HEIGHT_IMAGE = 230;

const START_CROP_IMAGE_IN_PERCENTAGE_BY_X = 6;

const FULL_PERCENT = 100;

const START_CROP_Y = 20;

const percentToNumber = (fullNumber: number, percent: number) => {
  return (fullNumber * percent) / FULL_PERCENT;
};

export const prepareCameraSetting = () => {
  return {
    canvasSettings: {
      height: HEIGHT_IMAGE,
      width: percentToNumber(window.innerWidth, WIDTH_IMAGE_IN_PERCENTAGE),
    },
    cropSettings: {
      sx: percentToNumber(
        window.innerWidth,
        START_CROP_IMAGE_IN_PERCENTAGE_BY_X,
      ), //начальная точка вырезки фото по оси X
      sy: START_CROP_Y, //начальная точка вырезки фото по оси Y
      sw: percentToNumber(window.innerWidth, WIDTH_IMAGE_IN_PERCENTAGE), //ширина фотографии для вырезки
      sh: HEIGHT_IMAGE, //высова фотографии для вырезки
      dx: 0, //отступ результата вырезанной фото по оси X
      dy: 0, //отступ результата вырезанной фото по оси Y
      dw: percentToNumber(window.innerWidth, WIDTH_IMAGE_IN_PERCENTAGE), // ширина вырезанной фотографии
      dh: HEIGHT_IMAGE, // высота вырезанной фотографии
    },
  };
};

export const cropImage = (
  base64?: string | null,
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

      const { cropSettings } = prepareCameraSetting();

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
