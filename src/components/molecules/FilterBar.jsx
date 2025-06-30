import React from 'react';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';

const FilterBar = ({ 
  statusFilter, 
  onStatusChange, 
  typeFilter, 
  onTypeChange, 
  onClear,
  className = '' 
}) => {
  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'under-review', label: 'Under Review' },
    { value: 'approved', label: 'Approved' }
  ];

  const typeOptions = [
    { value: 'individual', label: 'Individual Counseling' },
    { value: 'couples', label: 'Couples Counseling' },
    { value: 'family', label: 'Family Therapy' },
    { value: 'group', label: 'Group Therapy' }
  ];

  return (
    <div className={`flex flex-wrap gap-4 items-end ${className}`}>
      <Select
        label="Status"
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        options={statusOptions}
        placeholder="All Statuses"
        className="min-w-48"
      />
      <Select
        label="Case Type"
        value={typeFilter}
        onChange={(e) => onTypeChange(e.target.value)}
        options={typeOptions}
        placeholder="All Types"
        className="min-w-48"
      />
      <Button 
        variant="outline" 
        onClick={onClear}
        icon="X"
        size="md"
      >
        Clear Filters
      </Button>
    </div>
  );
};

export default FilterBar;