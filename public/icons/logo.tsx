import React from "react";

type StoardLogoProps = {
  color?: string; // to change the outline color
  className?: string; // to apply tailwindcss classes or something
  size?: number | string; // Accepts both numbers (e.g., 64) and strings (e.g., '4rem')
};

const StoardLogo: React.FC<StoardLogoProps> = ({
  color = "#757575",
  className,
  size = 228, // Default width from original SVG
}) => {
  // Calculate height based on original aspect ratio (228:255)
  const height = typeof size === "number" 
    ? (size * 255) / 228 
    : `calc(${size} * 255 / 228)`;

  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 228 255"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M0.75 225C0.75 226.243 1.75736 227.25 3 227.25C4.24264 227.25 5.25 226.243 5.25 225H0.75ZM11.1278 11.1278L9.53679 9.53677L9.53677 9.53679L11.1278 11.1278ZM222.561 5.43832L220.97 7.02917L220.971 7.02949L222.561 5.43832ZM222.75 193.282C222.75 194.524 223.757 195.532 225 195.532C226.243 195.532 227.25 194.524 227.25 193.282H222.75ZM30.75 195C29.5074 195 28.5 196.007 28.5 197.25C28.5 198.493 29.5074 199.5 30.75 199.5V195ZM225 199.5C226.243 199.5 227.25 198.493 227.25 197.25C227.25 196.007 226.243 195 225 195V199.5ZM30.75 250.5C29.5074 250.5 28.5 251.507 28.5 252.75C28.5 253.993 29.5074 255 30.75 255V250.5ZM225 255C226.243 255 227.25 253.993 227.25 252.75C227.25 251.507 226.243 250.5 225 250.5V255ZM5.25 225V30.75H0.75V225H5.25ZM5.25 30.75C5.25 23.987 7.93661 17.501 12.7188 12.7187L9.53677 9.53679C3.91073 15.1629 0.75 22.7935 0.75 30.75H5.25ZM12.7187 12.7188C17.501 7.93661 23.9868 5.25 30.75 5.25V0.75C22.7933 0.75 15.1629 3.91073 9.53679 9.53677L12.7187 12.7188ZM30.75 5.25H216.675V0.75H30.75V5.25ZM216.675 5.25C218.286 5.25 219.831 5.89007 220.97 7.02917L224.153 3.84747C222.17 1.86415 219.48 0.75 216.675 0.75V5.25ZM220.971 7.02949C222.11 8.16868 222.75 9.71372 222.75 11.325H227.25C227.25 8.52043 226.136 5.83054 224.152 3.84716L220.971 7.02949ZM222.75 11.325V193.282H227.25V11.325H222.75ZM30.75 199.5H225V195H30.75V199.5ZM30.75 255H225V250.5H30.75V255Z"
        fill={color}
      />
      <path
        d="M30.75 252.75C23.39 252.75 16.3319 249.827 11.1278 244.622C5.92367 239.418 3 232.36 3 225C3 217.64 5.92367 210.582 11.1278 205.378C16.3319 200.173 23.39 197.25 30.75 197.25"
        stroke={color}
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M145.067 47.1513C149.521 53.0111 149.943 61.5555 146.24 70.9063C142.538 80.2564 135.014 89.6463 125.325 97.0104C115.635 104.374 104.574 109.109 94.5738 110.172C84.5729 111.236 76.4534 108.542 72 102.682"
        stroke={color}
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M72.375 58.5H155.625"
        stroke={color}
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M73 101.469H156.25"
        stroke={color}
        strokeWidth="4.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default StoardLogo;