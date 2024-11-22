interface PassportButtonsProps {
  onScan: (passport: boolean) => void;
}

export const PassportButtons: React.FC<PassportButtonsProps> = ({ onScan }) => (
  <>
    <button onClick={() => onScan(true)}>Загрузить Паспарт</button>
    <button onClick={() => onScan(false)}>Загрузить Загрантпаспорт</button>
  </>
);
