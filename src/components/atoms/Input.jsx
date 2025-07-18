import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = ({ 
  label, 
  error, 
  icon, 
  className = '', 
  required = false,
  ...props 
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          className={`form-input ${icon ? 'pl-10' : ''} ${
            error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
          }`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;