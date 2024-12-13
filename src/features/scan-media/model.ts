export interface Props {
  onError: () => void;
  onMakeShot: (photo: string) => void;
  passport: boolean;
}
