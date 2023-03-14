import React from "react";

import { IconProps } from '../../utils/IconUtils';

export const TwitterIcon = ({
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
      d="M7.5 3H16.504C18.987 3 21 5.013 21 7.496V16.505C21 18.987 18.987 21 16.504 21H7.496C5.013 21 3 18.987 3 16.504V7.5C3 5.015 5.015 3 7.5 3V3Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.25 15.35C6.269 15.347 8.05 14.75 8.05 14.75C6.046 12.724 5.894 9.72305 7.45 7.55005C8.188 8.92305 9.566 10.189 11.05 10.55C11.107 8.81705 12.283 7.55005 14.05 7.55005C15.253 7.55005 15.961 8.00905 16.45 8.75005H18.25L17.05 10.55"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>

);

export default TwitterIcon;