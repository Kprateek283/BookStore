import React from 'react';

const colorMap = {
  error: 'bg-red-500',
  warning: 'bg-yellow-500',
  success: 'bg-green-500',
};

const Alert = ({ type = "success", title = "Alert", message = "This is an alert!", onClose }) => {
  return (
    <div className="shadow-md p-4 flex items-center rounded-lg max-w-md mx-auto mb-4 animate-fade-in-up">
      <div className={`${colorMap[type] || 'bg-blue-500'} inline-block rounded-lg p-1 mr-2 h-5 w-5`} />
      <div className="flex-1">
        <b className="block">{title}</b>
        <p className="text-sm">{message}</p>
      </div>
      <button className="h-5 w-5 text-gray-500 ml-2" onClick={onClose}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default Alert;
