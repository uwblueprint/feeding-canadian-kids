import React from "react";

import { IconProps } from '../../utils/IconUtils';

export const InstagramIcon = ({
  className = '',
  color = '#647488',
  size = 28,
  style = {},
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    style={{
      isolation: 'isolate',
      ...style,
    }}
    width={`${size}px`}
    height={`${size}px`}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.496 3H16.505C18.987 3 21 5.012 21 7.496V16.505C21 18.987 18.988 21 16.504 21H7.496C5.013 21 3 18.988 3 16.504V7.496C3 5.013 5.012 3 7.496 3V3Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.9491 6.71289C16.7631 6.71389 16.6121 6.86489 16.6121 7.05089C16.6121 7.23689 16.7641 7.38789 16.9501 7.38789C17.1361 7.38789 17.2871 7.23689 17.2871 7.05089C17.2881 6.86389 17.1361 6.71289 16.9491 6.71289Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.5456 9.45432C15.9515 10.8602 15.9515 13.1396 14.5456 14.5455C13.1397 15.9514 10.8603 15.9514 9.45444 14.5455C8.04855 13.1396 8.04855 10.8602 9.45444 9.45432C10.8603 8.04843 13.1397 8.04843 14.5456 9.45432"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default InstagramIcon;
