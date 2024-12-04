import clsx from 'clsx';

import CarefullyRound from '@/shared/ui/icons/CarefullyRound';
import Cross from '@/shared/ui/icons/Cross';

import styles from './notification.module.scss';
import { NotificationType } from './type';

const Notification = ({
  status,
  message,
  visible,
  onClose,
  passport,
}: NotificationType & { onClose: () => void }) => {
  const backgroundClass =
    status && status >= 500
      ? styles.bgRed
      : status && status >= 400
        ? styles.bgOrange
        : '';

  if (!visible) {
    return null;
  }

  return (
    <div
      className={clsx(
        styles.container,
        backgroundClass,
        status === 200 && styles.response,
      )}
    >
      <CarefullyRound className={styles.carefullyIcon} />
      {status === 200 ? (
        <div>
          <p>Тип документа: {passport?.document_type}</p>
          <p>Страна: {passport?.country}</p>
          <p>Имя: {passport?.first_name}</p>
          <p>Фамилия: {passport?.last_name}</p>
          <p>Номер документа: {passport?.document_number}</p>
          <p>Гражданство: {passport?.nationality}</p>
          <p>Пол: {passport?.sex}</p>
          <p>Дата истечения срока: {passport?.expiry_date}</p>
          <p>ИНН: {passport?.inn}</p>
          <p>Проверка хеша: {passport?.check_hash ? 'Да' : 'Нет'}</p>
        </div>
      ) : (
        <div className={styles.wrapperText}>
          <h1 className={styles.title}>Произошла техническая ошибка</h1>
          <p className={styles.description}>{message}</p>
        </div>
      )}
      <Cross className={styles.crossIcon} onClick={onClose} />
    </div>
  );
};

export default Notification;
