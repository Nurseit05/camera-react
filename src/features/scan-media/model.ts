import { Dispatch, SetStateAction } from 'react';

export interface Props {
  onError: () => void;
  onMakeShot: (photo: string) => void;
  onClick: () => void;
  passport: boolean;
  setUploading: Dispatch<SetStateAction<boolean>>;
  setScan: Dispatch<SetStateAction<boolean>>;
}
