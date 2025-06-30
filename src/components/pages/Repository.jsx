import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import DocumentGrid from '@/components/organisms/DocumentGrid';
import SearchBar from '@/components/molecules/SearchBar';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { documentService } from '@/services/api/documentService';

const Repository = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  useEffect(() => {
    filterDocuments();
  }, [documents, searchTerm, categoryFilter]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await documentService.getAll();
      setDocuments(data);
    } catch (err) {
      setError('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const filterDocuments = () => {
    let filtered = [...documents];

    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(doc => doc.category === categoryFilter);
    }

    setFilteredDocuments(filtered);
  };

  const handleUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    try {
      setUploading(true);
      
      for (const file of files) {
        const documentData = {
          filename: file.name,
          category: 'supervision',
          fileSize: file.size,
          fileType: file.type,
          uploadDate: new Date().toISOString(),
          relatedCaseId: null
        };

        await documentService.create(documentData);
      }

      toast.success(`${files.length} document(s) uploaded successfully`);
      loadDocuments();
      setShowUploadModal(false);
    } catch (err) {
      toast.error('Failed to upload documents');
    } finally {
      setUploading(false);
    }
  };

  const categoryOptions = [
    { value: 'supervision', label: 'Supervision Documents' },
    { value: 'case-notes', label: 'Case Notes' },
    { value: 'assessments', label: 'Assessments' },
    { value: 'forms', label: 'Forms & Templates' },
    { value: 'resources', label: 'Resources' }
  ];

  const uniqueCategories = [...new Set(documents.map(doc => doc.category))];
  const activeFilters = [searchTerm, categoryFilter].filter(Boolean).length;

  if (loading) {
    return <Loading type="grid" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadDocuments} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Document Repository</h1>
          <p className="text-gray-600 mt-2">Centralized storage for all your supervision documents</p>
        </div>
        <Button 
          onClick={() => setShowUploadModal(true)}
          icon="Upload"
        >
          Upload Documents
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mr-4">
              <ApperIcon name="Files" className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
              <p className="text-sm text-gray-600">Total Documents</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center mr-4">
              <ApperIcon name="FolderOpen" className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{uniqueCategories.length}</p>
              <p className="text-sm text-gray-600">Categories</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mr-4">
              <ApperIcon name="HardDrive" className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {(documents.reduce((sum, doc) => sum + doc.fileSize, 0) / (1024 * 1024)).toFixed(1)} MB
              </p>
              <p className="text-sm text-gray-600">Total Size</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
              <ApperIcon name="Calendar" className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {documents.filter(doc => {
                  const uploadDate = new Date(doc.uploadDate);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return uploadDate >= weekAgo;
                }).length}
              </p>
              <p className="text-sm text-gray-600">This Week</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-6">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search documents..."
          className="lg:w-96"
        />
        <div className="flex items-center space-x-4">
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={categoryOptions}
            placeholder="All Categories"
            className="min-w-48"
          />
          {activeFilters > 0 && (
            <Button
              variant="outline"
              size="sm"
              icon="X"
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('');
              }}
            >
              Clear ({activeFilters})
            </Button>
          )}
        </div>
      </div>

      {/* Documents Grid */}
      {documents.length === 0 ? (
        <Empty
          title="No Documents Yet"
          description="Start building your document repository by uploading your first file."
          actionLabel="Upload Documents"
          onAction={() => setShowUploadModal(true)}
          icon="Upload"
        />
      ) : filteredDocuments.length === 0 ? (
        <Empty
          title="No Matching Documents"
          description="Try adjusting your search criteria or filters to find what you're looking for."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchTerm('');
            setCategoryFilter('');
          }}
          icon="Search"
        />
      ) : (
        <DocumentGrid documents={filteredDocuments} />
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Upload Documents</h3>
              <Button
                variant="ghost"
                size="sm"
                icon="X"
                onClick={() => setShowUploadModal(false)}
              />
            </div>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors duration-200">
                <ApperIcon name="Upload" className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500">PDF, DOC, DOCX, Images up to 10MB each</p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                  onChange={handleUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading}
                />
              </div>
              
              {uploading && (
                <div className="flex items-center justify-center space-x-2 text-primary-600">
                  <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Uploading documents...</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowUploadModal(false)}
                disabled={uploading}
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Repository;