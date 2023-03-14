import React from "react";

import { IconProps } from '../../utils/IconUtils';

export const FacebookIcon = ({
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
      d="M7.5 3H16.504C18.987 3 21 5.013 21 7.496V16.505C21 18.987 18.987 21 16.504 21H7.496C5.013 21 3 18.987 3 16.504V7.5C3 5.015 5.015 3 7.5 3V3Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.1 12.8999H16.5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.5 8.3999H15.555C14.089 8.3999 12.9 9.5889 12.9 11.0549V11.9999V20.9999"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>

);

export default FacebookIcon;

