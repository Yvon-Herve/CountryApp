import React from "react";

function SpotlightButton({ children, ...props }) {
  return (
    <button
      className="relative px-6 py-3 overflow-hidden rounded-lg group bg-gray-800 shadow-md hover:shadow-lg transition duration-300"
      {...props} // Transmet toutes les props, y compris onClick
    >
      <span className="absolute inset-0 w-full h-full transition duration-300 bg-gradient-to-r from-gray-700 to-gray-900 opacity-0 group-hover:opacity-40"></span>
      <span className="relative z-10 text-gray-200 group-hover:text-gray-50 transition duration-300">
        {children}
      </span>
    </button>
  );
}

export default SpotlightButton;
