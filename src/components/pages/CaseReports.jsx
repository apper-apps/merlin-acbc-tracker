import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CaseReportTable from '@/components/organisms/CaseReportTable';
import SearchBar from '@/components/molecules/SearchBar';
import FilterBar from '@/components/molecules/FilterBar';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { caseReportService } from '@/services/api/caseReportService';

const CaseReports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    filterReports();
  }, [reports, searchTerm, statusFilter, typeFilter]);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await caseReportService.getAll();
      setReports(data);
    } catch (err) {
      setError('Failed to load case reports');
    } finally {
      setLoading(false);
    }
  };

  const filterReports = () => {
    let filtered = [...reports];

    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.caseType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(report => report.status === statusFilter);
    }

    if (typeFilter) {
      filtered = filtered.filter(report => report.caseType === typeFilter);
    }

    setFilteredReports(filtered);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setTypeFilter('');
  };

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadReports} />;
  }

  if (reports.length === 0) {
    return (
      <Empty
        title="No Case Reports Yet"
        description="Start tracking your supervision progress by creating your first case report."
        actionLabel="Create Case Report"
        onAction={() => navigate('/case-reports/new')}
        icon="FileText"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Case Reports</h1>
          <p className="text-gray-600 mt-2">Manage and track all your case submissions</p>
        </div>
        <Button 
          onClick={() => navigate('/case-reports/new')}
          icon="Plus"
        >
          New Case Report
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-6">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search case reports..."
          className="lg:w-96"
        />
        <FilterBar
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
          onClear={handleClearFilters}
          className="flex-1"
        />
      </div>

      {/* Results */}
      {filteredReports.length === 0 && (searchTerm || statusFilter || typeFilter) ? (
        <Empty
          title="No Matching Reports"
          description="Try adjusting your search criteria or filters to find what you're looking for."
          actionLabel="Clear Filters"
          onAction={handleClearFilters}
          icon="Search"
        />
      ) : (
        <CaseReportTable reports={filteredReports} />
      )}
    </div>
  );
};

export default CaseReports;