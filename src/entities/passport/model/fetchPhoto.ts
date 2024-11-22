import { NotificationType } from '@/shared/ui/Notification/type';

import { API_BASE_URL } from './api';

export const fetchPhoto = async (
  photo: string,
  setImageUrl: (url: string) => void,
  setNotification: (notification: NotificationType) => void,
  setScan: (scan: boolean) => void,
) => {
  setImageUrl(photo);

  const trimmedBase64 = photo.replace(/^data:image\/\w+;base64,/, '');
  const binary = atob(trimmedBase64);
  const array = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }

  const blob = new Blob([array], { type: 'image/png' });
  const formData = new FormData();
  formData.append('file', blob, 'photo.png');

  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: ${data.detail}`);
    }

    setNotification({ status: 200, visible: true, passport: data });
  } catch (error: any) {
    setNotification({
      status: error.status || 400,
      message: error.message || 'Неизвестная ошибка',
      visible: true,
    });
  }
  setScan(false);
};
