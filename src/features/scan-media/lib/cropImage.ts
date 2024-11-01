const WIDTH_IMAGE_IN_PERCENTAGE = 90;
const HEIGHT_IMAGE = 200;
const START_CROP_IMAGE_IN_PERCENTAGE_BY_X = 7;
const FULL_PERCENT = 100;
const START_CROP_Y = 75;

const percentToNumber = (fullNumber: number, percent: number) => {
  return (fullNumber * percent) / FULL_PERCENT;
};

export const prepareCameraSetting = (isPassport: boolean) => {
  const width = percentToNumber(window.innerWidth, WIDTH_IMAGE_IN_PERCENTAGE);
  const height = HEIGHT_IMAGE;

  console.log(width);

  return {
    canvasSettings: {
      height,
      width,
    },
    cropSettings: isPassport
      ? {
          sx: percentToNumber(
            window.innerWidth,
            START_CROP_IMAGE_IN_PERCENTAGE_BY_X,
          ), //начальная точка вырезки фото по оси X
          sy: START_CROP_Y, //начальная точка вырезки фото по оси Y
          sw: width, //ширина фотографии для вырезки
          sh: height, //высова фотографии для вырезки
          dx: 0, //отступ результата вырезанной фото по оси X
          dy: 0, //отступ результата вырезанной фото по оси Y
          dw: width, // ширина вырезанной фотографии
          dh: height, // высота вырезанной фотографии
        }
      : {
          sx: 0,
          sy: 0,
          sw: width,
          sh: height,
          dx: 0,
          dy: 0,
          dw: width,
          dh: height,
        },
  };
};

export const cropImage = (
  base64?: string | null,
  passport: boolean = true,
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

      const { canvasSettings, cropSettings } = prepareCameraSetting(passport);

      canvas.width = canvasSettings.width;
      canvas.height = canvasSettings.height;

      ctx.drawImage(
        img,
        cropSettings.sx,
        cropSettings.sy,
        passport ? cropSettings.sw : img.width, // Используем полную ширину изображения, если passport == false
        passport ? cropSettings.sh : img.height, // Используем полную высоту изображения, если passport == false
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
