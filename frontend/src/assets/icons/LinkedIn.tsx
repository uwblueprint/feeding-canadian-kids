import React from "react";

import { IconProps } from "../../utils/IconUtils";

export const LinkedinIcon = ({
  className = "",
  color = "#647488",
  size = 28,
  style = {},
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    style={{
      isolation: "isolate",
      ...style,
    }}
    width={`${size}px`}
    height={`${size}px`}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <g
      fill="#141010"
      fillRule="nonzero"
      stroke={color}
      strokeWidth="1"
      strokeLinecap="butt"
      strokeLinejoin="miter"
      strokeMiterlimit="10"
      strokeDasharray=""
      strokeDashoffset="0"
      fontFamily="none"
      fontWeight="none"
      fontSize="none"
      textAnchor="none"
    >
      <path d="M0,256v-256h256v256z" id="bgRectangle" />
    </g>
    <g
      fillRule="nonzero"
      stroke={color}
      strokeWidth="1"
      strokeLinecap="butt"
      strokeLinejoin="miter"
      strokeMiterlimit="10"
      strokeDasharray=""
      strokeDashoffset="0"
      fontFamily="none"
      fontWeight="none"
      fontSize="none"
      textAnchor="none"
    >
      <g transform="scale(4,4)">
        <path d="M40.227,12c10.918,0 11.773,0.854 11.773,11.773v16.453c0,10.919 -0.855,11.774 -11.773,11.774h-16.454c-10.918,0 -11.773,-0.855 -11.773,-11.773v-16.454c0,-10.919 0.855,-11.773 11.773,-11.773zM25.029,43v-16.272h-5.057v16.272zM22.501,24.401c1.625,0 2.947,-1.322 2.947,-2.949c0,-1.625 -1.322,-2.947 -2.947,-2.947c-1.629,0 -2.949,1.32 -2.949,2.947c0,1.627 1.318,2.949 2.949,2.949zM44,43v-8.925c0,-4.382 -0.946,-7.752 -6.067,-7.752c-2.46,0 -4.109,1.349 -4.785,2.628h-0.068v-2.223h-4.851v16.272h5.054v-8.05c0,-2.122 0.405,-4.178 3.036,-4.178c2.594,0 2.628,2.427 2.628,4.315v7.913z" />
      </g>
    </g>
  </svg>
);

export default LinkedinIcon;
