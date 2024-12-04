import { Dispatch, SetStateAction } from 'react';

import Uploading from '@/assets/Uploading.svg';

import { clsx } from 'clsx';

import s from './styles.module.scss';

const Main = ({
  setUploading,
}: {
  setUploading: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <main className={clsx(s.main, 'container')}>
      <button onClick={() => setUploading(true)} className={s.wrapperBtn}>
        <img src={Uploading} /> <p className={s.text}>Загрузить документ</p>
      </button>
    </main>
  );
};

export default Main;
