const WIDTH_IMAGE_IN_PERCENTAGE = 90;

const START_CROP_IMAGE_IN_PERCENTAGE_BY_X = 6;

const FULL_PERCENT = 100;

const percentToNumber = (fullNumber: number, percent: number) => {
  return (fullNumber * percent) / FULL_PERCENT;
};

export const prepareCameraSetting = (passport: boolean) => {
  let START_CROP_Y = 20;
  let HEIGHT_IMAGE = 230;
  const WIDTH_IMAGE = window.innerWidth;

  if (WIDTH_IMAGE >= 320 && WIDTH_IMAGE < 375) {
    HEIGHT_IMAGE = 180;
  } else if (passport && WIDTH_IMAGE >= 375 && WIDTH_IMAGE < 480) {
    HEIGHT_IMAGE = 200;
  } else if (passport && WIDTH_IMAGE >= 480 && WIDTH_IMAGE < 768) {
    START_CROP_Y = 60;
  } else if (!passport && WIDTH_IMAGE >= 480 && WIDTH_IMAGE < 550) {
    START_CROP_Y = 15;
    HEIGHT_IMAGE = 300;
  } else if (!passport && WIDTH_IMAGE >= 550 && WIDTH_IMAGE < 600) {
    START_CROP_Y = 15;
    HEIGHT_IMAGE = 350;
  } else if (!passport && WIDTH_IMAGE >= 600 && WIDTH_IMAGE < 650) {
    START_CROP_Y = 20;
    HEIGHT_IMAGE = 370;
  } else if (!passport && WIDTH_IMAGE >= 650 && WIDTH_IMAGE < 700) {
    START_CROP_Y = 20;
    HEIGHT_IMAGE = 410;
  } else if (passport && WIDTH_IMAGE <= 1120) {
    START_CROP_Y = 250;
  } else if (!passport && WIDTH_IMAGE <= 1120) {
    START_CROP_Y = 30;
    HEIGHT_IMAGE = 650;
  } else if (!passport && WIDTH_IMAGE > 1120) {
    START_CROP_Y = 50;
    HEIGHT_IMAGE = 700;
  } else if (passport && WIDTH_IMAGE > 1120) {
    START_CROP_Y = 300;
  }

  if (!passport) alert(HEIGHT_IMAGE);

  return {
    canvasSettings: {
      height: HEIGHT_IMAGE,
      width: percentToNumber(WIDTH_IMAGE, WIDTH_IMAGE_IN_PERCENTAGE),
    },
    cropSettings: {
      sx: percentToNumber(WIDTH_IMAGE, START_CROP_IMAGE_IN_PERCENTAGE_BY_X), // начальная точка вырезки фото по оси X
      sy: START_CROP_Y, // начальная точка вырезки фото по оси Y
      sw: percentToNumber(WIDTH_IMAGE, WIDTH_IMAGE_IN_PERCENTAGE), // ширина фотографии для вырезки
      sh: HEIGHT_IMAGE, // высота фотографии для вырезки
      dx: 0, // отступ результата вырезанной фото по оси X
      dy: 0, // отступ результата вырезанной фото по оси Y
      dw: percentToNumber(WIDTH_IMAGE, WIDTH_IMAGE_IN_PERCENTAGE), // ширина вырезанной фотографии
      dh: HEIGHT_IMAGE, // высота вырезанной фотографии
    },
  };
};

export const cropImage = (
  base64?: string | null,
  passport?: boolean,
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

      const { cropSettings } = prepareCameraSetting(passport as boolean);

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
