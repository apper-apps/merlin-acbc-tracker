import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { caseReportService } from '@/services/api/caseReportService';

const CaseReportForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    caseType: '',
    interventions: [''],
    outcomes: '',
    status: 'draft'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      loadCaseReport();
    }
  }, [id, isEditing]);

  const loadCaseReport = async () => {
    try {
      const report = await caseReportService.getById(parseInt(id));
      setFormData({
        title: report.title,
        caseType: report.caseType,
        interventions: report.interventions.length > 0 ? report.interventions : [''],
        outcomes: report.outcomes,
        status: report.status
      });
    } catch (err) {
      toast.error('Failed to load case report');
      navigate('/case-reports');
    }
  };

  const caseTypeOptions = [
    { value: 'individual', label: 'Individual Counseling' },
    { value: 'couples', label: 'Couples Counseling' },
    { value: 'family', label: 'Family Therapy' },
    { value: 'group', label: 'Group Therapy' }
  ];

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'under-review', label: 'Under Review' },
    { value: 'approved', label: 'Approved' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.caseType) {
      newErrors.caseType = 'Case type is required';
    }

    if (!formData.outcomes.trim()) {
      newErrors.outcomes = 'Outcomes are required';
    }

    const validInterventions = formData.interventions.filter(i => i.trim());
    if (validInterventions.length === 0) {
      newErrors.interventions = 'At least one intervention is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleInterventionChange = (index, value) => {
    const newInterventions = [...formData.interventions];
    newInterventions[index] = value;
    setFormData(prev => ({ ...prev, interventions: newInterventions }));
  };

  const addIntervention = () => {
    setFormData(prev => ({ 
      ...prev, 
      interventions: [...prev.interventions, ''] 
    }));
  };

  const removeIntervention = (index) => {
    if (formData.interventions.length > 1) {
      const newInterventions = formData.interventions.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, interventions: newInterventions }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const validInterventions = formData.interventions.filter(i => i.trim());
      const reportData = {
        ...formData,
        interventions: validInterventions,
        submissionDate: new Date().toISOString()
      };

      if (isEditing) {
        await caseReportService.update(parseInt(id), reportData);
        toast.success('Case report updated successfully');
      } else {
        await caseReportService.create(reportData);
        toast.success('Case report created successfully');
      }

      navigate('/case-reports');
    } catch (err) {
      toast.error(isEditing ? 'Failed to update case report' : 'Failed to create case report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          icon="ArrowLeft"
          onClick={() => navigate('/case-reports')}
        >
          Back to Case Reports
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Case Report' : 'New Case Report'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEditing ? 'Update your case report details' : 'Create a new case report for supervision tracking'}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Case Title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              error={errors.title}
              required
              placeholder="Enter a descriptive title for this case"
            />

            <Select
              label="Case Type"
              value={formData.caseType}
              onChange={(e) => handleInputChange('caseType', e.target.value)}
              options={caseTypeOptions}
              error={errors.caseType}
              required
            />
          </div>

          {/* Interventions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Interventions Used
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                icon="Plus"
                onClick={addIntervention}
              >
                Add Intervention
              </Button>
            </div>
            
            <div className="space-y-3">
              {formData.interventions.map((intervention, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Input
                    value={intervention}
                    onChange={(e) => handleInterventionChange(index, e.target.value)}
                    placeholder={`Intervention ${index + 1}`}
                    className="flex-1"
                  />
                  {formData.interventions.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      icon="X"
                      onClick={() => removeIntervention(index)}
                      className="text-red-600 hover:text-red-700"
                    />
                  )}
                </div>
              ))}
            </div>
            {errors.interventions && (
              <p className="text-sm text-red-600 flex items-center">
                <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
                {errors.interventions}
              </p>
            )}
          </div>

          {/* Outcomes */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Outcomes and Results
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              className="form-input min-h-32"
              value={formData.outcomes}
              onChange={(e) => handleInputChange('outcomes', e.target.value)}
              placeholder="Describe the outcomes, client progress, and any significant results from this case..."
              rows={6}
            />
            {errors.outcomes && (
              <p className="text-sm text-red-600 flex items-center">
                <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
                {errors.outcomes}
              </p>
            )}
          </div>

          {/* Status */}
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            options={statusOptions}
          />

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/case-reports')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              icon={isEditing ? "Save" : "Plus"}
            >
              {isEditing ? 'Update Case Report' : 'Create Case Report'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CaseReportForm;