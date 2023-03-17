import React from "react";

import { IconProps } from "../../utils/IconUtils";

export const InstagramIcon = ({
  className = "",
  color = "#D4D4D4",
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
    viewBox="-143 145 512 512"
    fill={color}
    className={className}
  >
    <g>
      <path
        d="M113,446c24.8,0,45.1-20.2,45.1-45.1c0-9.8-3.2-18.9-8.5-26.3c-8.2-11.3-21.5-18.8-36.5-18.8s-28.3,7.4-36.5,18.8
		c-5.3,7.4-8.5,16.5-8.5,26.3C68,425.8,88.2,446,113,446z"
      />
      <polygon points="211.4,345.9 211.4,308.1 211.4,302.5 205.8,302.5 168,302.6 168.2,346 	" />
      <path
        d="M329,145h-432c-22.1,0-40,17.9-40,40v432c0,22.1,17.9,40,40,40h432c22.1,0,40-17.9,40-40V185C369,162.9,351.1,145,329,145z
		 M241,374.7v104.8c0,27.3-22.2,49.5-49.5,49.5h-157C7.2,529-15,506.8-15,479.5V374.7v-52.3c0-27.3,22.2-49.5,49.5-49.5h157
		c27.3,0,49.5,22.2,49.5,49.5V374.7z"
      />
      <path
        d="M183,401c0,38.6-31.4,70-70,70c-38.6,0-70-31.4-70-70c0-9.3,1.9-18.2,5.2-26.3H10v104.8C10,493,21,504,34.5,504h157
		c13.5,0,24.5-11,24.5-24.5V374.7h-38.2C181.2,382.8,183,391.7,183,401z"
      />
    </g>
  </svg>
);

export default InstagramIcon;