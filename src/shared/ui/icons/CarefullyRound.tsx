import { FC, SVGProps } from 'react';

interface IProps extends SVGProps<SVGSVGElement> {
  className?: string;
  onClick?: () => void;
}

const CarefullyRound: FC<IProps> = ({ className, onClick, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    onClick={onClick}
    {...props}
  >
    <g clipPath="url(#clip0_5828_23305)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.199219 12C0.199219 5.48618 5.48539 0.200012 11.9992 0.200012C18.513 0.200012 23.7992 5.48618 23.7992 12C23.7992 18.5138 18.513 23.8 11.9992 23.8C5.48539 23.8 0.199219 18.5138 0.199219 12ZM12 6C12.5523 6 13 6.44772 13 7V8C13 8.55229 12.5523 9 12 9C11.4477 9 11 8.55229 11 8V7C11 6.44772 11.4477 6 12 6ZM13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12V17C11 17.5523 11.4477 18 12 18C12.5523 18 13 17.5523 13 17V12Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0_5828_23305">
        <rect width="24" height="24" fill="none" />
      </clipPath>
    </defs>
  </svg>
);

export default CarefullyRound;
