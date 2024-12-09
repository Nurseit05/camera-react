const WIDTH_IMAGE_IN_PERCENTAGE = 90;
const HEIGHT_IMAGE = 230;
const FULL_PERCENT = 100;

const percentToNumber = (fullNumber: number, percent: number) => {
  return (fullNumber * percent) / FULL_PERCENT;
};

export const prepareCameraSetting = () => {
  const width = percentToNumber(window.innerWidth, WIDTH_IMAGE_IN_PERCENTAGE);
  const height = HEIGHT_IMAGE;

  return {
    canvasSettings: {
      height,
      width,
    },
    cropSettings: {
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
        img.width, // Используем полную ширину изображения, если passport == false
        img.height, // Используем полную высоту изображения, если passport == false
        cropSettings.dx,
        cropSettings.dy,
        cropSettings.dw,
        cropSettings.dh,
      );
      alert(img.width);
      alert(img.height);

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
