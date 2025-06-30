import React from 'react';
import { format } from 'date-fns';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const DocumentGrid = ({ documents, loading }) => {
  const getFileIcon = (fileType) => {
    const type = fileType.toLowerCase();
    if (type.includes('pdf')) return 'FileText';
    if (type.includes('doc')) return 'FileType2';
    if (type.includes('image') || type.includes('jpg') || type.includes('png')) return 'Image';
    if (type.includes('video')) return 'Video';
    return 'File';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
            <div className="w-full h-4 bg-gray-200 rounded mb-2"></div>
            <div className="w-24 h-4 bg-gray-200 rounded mb-4"></div>
            <div className="flex justify-between items-center">
              <div className="w-16 h-4 bg-gray-200 rounded"></div>
              <div className="w-20 h-8 bg-gray-200 rounded"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {documents.map((doc) => (
        <Card key={doc.Id} className="p-6 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name={getFileIcon(doc.fileType)} className="w-6 h-6 text-white" />
            </div>
            <Button variant="ghost" size="sm" icon="Download" />
          </div>
          
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-1 truncate group-hover:text-primary-600 transition-colors duration-200">
              {doc.filename}
            </h4>
            <p className="text-sm text-gray-600 capitalize">{doc.category}</p>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{formatFileSize(doc.fileSize)}</span>
            <span>{format(new Date(doc.uploadDate), 'MMM dd')}</span>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DocumentGrid;