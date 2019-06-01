import React from 'react';

export default ({ node }) => {
  const {
    label,
    radius = 15,
    fill = "#21D4FD",
    fontSize = 10,
    opacity = 1.0,
    onClick,
  } = node;

  return (
    <React.Fragment>
      <circle
        r={radius}
        fill={fill}
        opacity={opacity}
        onClick={onClick}
        id={`node-${label}`}
        style={{ cursor: 'pointer' }}
      />
      <text
        textAnchor="middle"
        fontSize={fontSize}
        fill="#ffffff"
        y={radius + 15}
      >
        {label}
      </text>
    </React.Fragment>
  );
}
