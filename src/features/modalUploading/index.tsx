'use client';

import { Dispatch, SetStateAction } from 'react';

import IdPassword from '@/assets/IdPassword.svg';
import Password from '@/assets/Password.svg';

import Cross from '@/shared/ui/icons/Cross';

import styles from './styles.module.scss';

interface Props {
  closeModal: Dispatch<SetStateAction<boolean>>;
  passwordScan: (passport: boolean) => void;
}

const ModalUploading = ({ closeModal, passwordScan }: Props) => {
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
          <button
            onClick={() => passwordScan(true)}
            className={styles.wrapperBtn}
          >
            <img src={IdPassword} />
            <p className={styles.text}>Загрузка ID-паспорта</p>
          </button>
          <button
            onClick={() => passwordScan(false)}
            className={styles.wrapperBtn}
          >
            <img src={Password} />
            <p className={styles.text}>Загрузка загранпаспорта</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalUploading;
