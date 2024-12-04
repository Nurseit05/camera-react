'use client';

import { Dispatch, SetStateAction } from 'react';

import IdPassword from '@/assets/IdPassword.svg';
import Password from '@/assets/Password.svg';

import Cross from '@/shared/ui/icons/Cross';

import styles from './styles.module.scss';

const ModalUploading = ({
  closeModal,
  passwordScan,
}: {
  closeModal: Dispatch<SetStateAction<boolean>>;
  passwordScan: () => void;
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapperModal}>
        <div className={styles.wrapperTitle}>
          <h1 className={styles.title}>Загрузка документов</h1>
          <div className={styles.wrapperIcon}>
            <Cross
              onClick={() => closeModal(false)}
              className={styles.crossPoint}
            />
          </div>
        </div>
        <div className={styles.btn}>
          <button onClick={passwordScan} className={styles.wrapperBtn}>
            <img src={IdPassword} />
            <p className={styles.text}>Загрузка ID-паспорта</p>
          </button>
          <button onClick={passwordScan} className={styles.wrapperBtn}>
            <img src={Password} />
            <p className={styles.text}>Загрузка загранпаспорта</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalUploading;
