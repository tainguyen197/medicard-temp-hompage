import React from "react";

interface StarburstIconProps {
  size?: number;
  className?: string;
}

const StarburstIcon: React.FC<StarburstIconProps> = ({
  size = 24,
  className = "",
}) => {
  const spikes = 16;
  const outerRadius = size / 2;
  const innerRadius = size / 4;
  const center = size / 2;
  const angleStep = Math.PI / spikes;

  // Generate alternating outer and inner points
  const points: string[] = [];
  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = -Math.PI / 2 + angleStep * i;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    points.push(`${x},${y}`);
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <polygon points={points.join(" ")} fill="currentColor" />
    </svg>
  );
};

export default StarburstIcon;
