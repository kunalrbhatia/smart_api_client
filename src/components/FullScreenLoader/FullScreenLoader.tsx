import React from 'react';
type FullScreenLoaderType = { visible: boolean };
const FullScreenLoader = ({ visible }: FullScreenLoaderType) => {
  if (!visible) {
    return null; // If the visible prop is false, don't render anything
  }

  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-75 z-50"
      role="status"
    >
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]">
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
    </div>
  );
};

export default FullScreenLoader;
