const WIDTH_IMAGE_IN_PERCENTAGE = 90;

const HEIGHT_IMAGE = 250;

const START_CROP_IMAGE_IN_PERCENTAGE_BY_X = 7;

const FULL_PERCENT = 100;

const START_CROP_Y = 125;

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
      dx: percentToNumber(
        window.innerWidth,
        START_CROP_IMAGE_IN_PERCENTAGE_BY_X,
      ), //отступ результата вырезанной фото по оси X
      dy: START_CROP_Y, //отступ результата вырезанной фото по оси Y
      dw: percentToNumber(window.innerWidth, WIDTH_IMAGE_IN_PERCENTAGE), // ширина вырезанной фотографии
      dh: HEIGHT_IMAGE, // высота вырезанной фотографии
    },
  };
};

export const cropImage = (base64?: string | null): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject('Failed to get canvas context');
        return;
      }

      const { canvasSettings, cropSettings } = prepareCameraSetting();

      canvas.width = canvasSettings.width;
      canvas.height = canvasSettings.height;

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
      resolve(canvas.toDataURL());
    };

    img.onerror = (error) => {
      reject(`Failed to load image: ${error}`);
    };

    if (!base64) {
      reject(`Image not loaded`);

      return;
    }

    img.src = base64;
  });
};
