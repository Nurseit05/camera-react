export interface Props {
  onError: () => void;
  onMakeShot: (photo?: string) => void;
  onClick: () => void;
  passport: boolean;
}
