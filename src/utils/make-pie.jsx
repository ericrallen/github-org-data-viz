import React from 'react';

import { Pie } from '@vx/shape';

const white = '#ffffff';
const black = '#000000';

const retrieveValues = d => d.value;

export default (data, radius, donut, graphTitle = {}, fillColors = { arc: white, text: black }) => {
  const pieAttributes = {
    data: data,
    pieValue: retrieveValues,
    outerRadius: radius - 80,
    cornerRadius: 3,
    padAngle: 0,
  };

  if (donut) {
    pieAttributes.innerRadius = radius - 120;
  }

  const hasGraphTitle = Object.keys(graphTitle).length > 0;

  const renderArcs = pie => pie.arcs.map((arc, i) => {
    const opacity = 1 / (i + 2);
    const [centroidX, centroidY] = pie.path.centroid(arc);
    const { startAngle, endAngle } = arc;
    const hasSpaceForLabel = endAngle - startAngle >= 0.1;
    return (
      <g key={`browser-${arc.data.label}-${i}`}>
        <path d={pie.path(arc)} fill={fillColors.arc} fillOpacity={opacity} />
        <text
          fill={fillColors.text}
          x={(hasSpaceForLabel) ? centroidX : centroidX + centroidX * Math.random()}
          y={(hasSpaceForLabel) ? centroidY : centroidY + centroidY * Math.random()}
          dy=".33em"
          fontSize={9}
          textAnchor="middle"
        >
          {arc.data.label}: {arc.data.value}
        </text>
      </g>
    );
  });

  return (
    <Pie {...pieAttributes}>
      {pie => (
        <React.Fragment>
          {hasGraphTitle &&
            <text
              textAnchor="middle"
              fontSize={12}
              y={graphTitle.top}
            >
              {graphTitle.text}
            </text>
          }
          {renderArcs(pie)}
        </React.Fragment>
      )}
    </Pie>
  );
};
