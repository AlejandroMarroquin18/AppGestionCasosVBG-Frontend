import React from 'react';

const LoadingSpinner = ({ 
  message = "Cargando...", 
  size = "medium",
  overlay = false,
  className = "" 
}) => {
  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-12 h-12",
    large: "w-16 h-16"
  };

  const textSizes = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg"
  };

  const spinnerContent = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Spinner animado */}
      <div className={`${sizeClasses[size]} border-4 border-red-200 border-t-red-600 rounded-full animate-spin`}></div>
      
      {/* Mensaje */}
      {message && (
        <p className={`mt-3 text-gray-600 font-medium ${textSizes[size]}`}>
          {message}
        </p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
};

export default LoadingSpinner;