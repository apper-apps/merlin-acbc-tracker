import React from 'react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Header = ({ onMenuClick, title }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 lg:ml-72">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              icon="Menu"
              onClick={onMenuClick}
              className="lg:hidden"
            />
            {title && (
              <h2 className="ml-4 text-xl font-semibold text-gray-900 lg:ml-0">
                {title}
              </h2>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" icon="Bell" />
            <Button variant="ghost" size="sm" icon="Settings" />
            <div className="w-8 h-8 bg-gradient-secondary rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;