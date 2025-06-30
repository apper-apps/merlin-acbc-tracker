import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import FeedbackThread from '@/components/organisms/FeedbackThread';
import { caseReportService } from '@/services/api/caseReportService';
const CaseReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReport();
  }, [id]);

  const loadReport = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await caseReportService.getById(parseInt(id));
      setReport(data);
    } catch (err) {
      setError('Failed to load case report');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this case report? This action cannot be undone.')) {
      return;
    }

    try {
      await caseReportService.delete(parseInt(id));
      toast.success('Case report deleted successfully');
      navigate('/case-reports');
    } catch (err) {
      toast.error('Failed to delete case report');
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadReport} />;
  }

  if (!report) {
    return <Error message="Case report not found" showRetry={false} />;
  }

  const isMilestone = report.caseNumber % 5 === 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            icon="ArrowLeft"
            onClick={() => navigate('/case-reports')}
          >
            Back to Case Reports
          </Button>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold text-gray-900">{report.title}</h1>
              {isMilestone && (
                <div className="flex items-center space-x-2 bg-gradient-accent text-white px-3 py-1 rounded-full text-sm font-medium">
                  <ApperIcon name="Calendar" className="w-4 h-4" />
                  <span>Milestone Case</span>
                </div>
              )}
            </div>
            <p className="text-gray-600 mt-2">Case #{report.caseNumber} • {report.caseType}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            icon="Edit"
            onClick={() => navigate(`/case-reports/${report.Id}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            icon="Trash2"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Case Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Case Details</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Case Type</h3>
                <p className="text-gray-900">{report.caseType}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Interventions Used</h3>
                <div className="space-y-2">
                  {report.interventions.map((intervention, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      <span className="text-gray-900">{intervention}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Outcomes and Results</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-900 whitespace-pre-wrap">{report.outcomes}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Attachments */}
          {report.attachments && report.attachments.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Attachments</h2>
              <div className="space-y-3">
                {report.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <ApperIcon name="Paperclip" className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">{attachment.name}</span>
                    </div>
                    <Button variant="ghost" size="sm" icon="Download">
                      Download
                    </Button>
                  </div>
                ))}
</div>
            </Card>
          )}

          {/* Feedback Thread */}
          <FeedbackThread reportId={report.Id} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Information</h3>
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-600">Current Status</span>
                <div className="mt-1">
                  <Badge variant={report.status} size="lg">
                    {report.status.replace('-', ' ')}
                  </Badge>
                </div>
              </div>
              
              <div>
                <span className="text-sm text-gray-600">Submission Date</span>
                <p className="font-medium text-gray-900">
                  {format(new Date(report.submissionDate), 'MMM dd, yyyy')}
                </p>
              </div>

              <div>
                <span className="text-sm text-gray-600">Case Number</span>
                <p className="font-medium text-gray-900">#{report.caseNumber}</p>
              </div>
            </div>
          </Card>

          {/* Milestone Info */}
          {isMilestone && (
            <Card className="p-6 bg-gradient-to-br from-accent-50 to-accent-100 border-accent-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-accent rounded-full flex items-center justify-center">
                  <ApperIcon name="Calendar" className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-accent-900">Milestone Case</h3>
              </div>
              <p className="text-accent-700 text-sm">
                This is your {Math.floor(report.caseNumber / 5) * 5}th case report, which triggers a supervision meeting. 
                A meeting should be scheduled to review your progress.
              </p>
            </Card>
          )}

          {/* Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                icon="Copy"
              >
                Duplicate Case
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                icon="Share"
              >
                Share Report
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                icon="Download"
              >
                Export PDF
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CaseReportDetail;