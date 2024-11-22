import { SVGProps } from 'react';

interface IProps extends SVGProps<SVGSVGElement> {
  className?: string;
  onClick?: () => void;
}

const Cross = ({ className, onClick, ...props }: IProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    onClick={onClick}
    {...props}
  >
    <path
      d="M18 6L6 18"
      stroke="#33363F"
      strokeWidth="2.83333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 6L18 18"
      stroke="#33363F"
      strokeWidth="2.83333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Cross;
