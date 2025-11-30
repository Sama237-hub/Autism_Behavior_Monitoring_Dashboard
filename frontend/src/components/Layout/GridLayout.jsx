import React from 'react';

const GridLayout = ({ children, columns = 1, gap = '1rem', className = '' }) => {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: gap
  };

  return (
    <div style={gridStyle} className={className}>
      {children}
    </div>
  );
};

export default GridLayout;