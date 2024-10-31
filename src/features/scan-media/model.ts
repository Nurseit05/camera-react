import { ReactNode } from 'react';

export interface Props {
  mask: ReactNode;
  onError: () => void;
  onMakeShot: (photo?: string) => void;
}
