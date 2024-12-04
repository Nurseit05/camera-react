import Mbank from '@/assets/Mbank.svg';

import { clsx } from 'clsx';

import Digital from '@/shared/ui/icons/Digital';

import s from './styles.module.scss';

const Header = () => {
  return (
    <header className={clsx(s.header, 'container')}>
      <img src={Mbank} alt="Mbank" />
      <Digital />
    </header>
  );
};

export default Header;
