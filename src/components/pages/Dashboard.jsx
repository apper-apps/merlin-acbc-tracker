import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "@/components/molecules/StatCard";
import ProgressRing from "@/components/molecules/ProgressRing";
import UpcomingMeetings from "@/components/organisms/UpcomingMeetings";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { caseReportService } from "@/services/api/caseReportService";
import { meetingService } from "@/services/api/meetingService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const [reportsData, meetingsData] = await Promise.all([
        caseReportService.getAll(),
        meetingService.getAll()
      ]);
      setReports(reportsData);
      setMeetings(meetingsData.filter(m => !m.completed));
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading type="dashboard" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
  }

  const totalCases = reports.length;
  const submittedCases = reports.filter(r => r.status === 'submitted' || r.status === 'approved').length;
  const approvedCases = reports.filter(r => r.status === 'approved').length;
  const pendingReviews = reports.filter(r => r.status === 'under-review').length;
  const progress = totalCases > 0 ? (submittedCases / totalCases) * 100 : 0;
  const nextMilestone = Math.ceil(totalCases / 5) * 5;
  const casesToMilestone = nextMilestone - totalCases;

  const recentReports = reports
    .sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your ACBC supervision progress</p>
        </div>
        <Button 
          onClick={() => navigate('/case-reports/new')}
          icon="Plus"
          className="shadow-lg"
        >
          New Case Report
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Cases"
          value={totalCases}
          icon="FileText"
          gradient="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Submitted Cases"
          value={submittedCases}
          icon="Send"
          gradient="from-green-500 to-green-600"
        />
        <StatCard
          title="Approved Cases"
          value={approvedCases}
          icon="CheckCircle"
          gradient="from-emerald-500 to-emerald-600"
        />
        <StatCard
          title="Pending Reviews"
          value={pendingReviews}
          icon="Clock"
          gradient="from-yellow-500 to-yellow-600"
        />
      </div>

      {/* Progress and Meetings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Progress Overview */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Progress Overview</h3>
          <div className="flex items-center space-x-8">
            <ProgressRing progress={progress} size={120} />
            <div className="flex-1">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cases to Next Meeting</span>
                  <span className="font-semibold text-primary-600">{casesToMilestone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Next Milestone</span>
                  <span className="font-semibold text-gray-900">Case #{nextMilestone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completion Rate</span>
                  <span className="font-semibold text-accent-600">{Math.round(progress)}%</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Upcoming Meetings */}
        <UpcomingMeetings meetings={meetings} />
      </div>

      {/* Recent Case Reports */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Case Reports</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            icon="ArrowRight"
            onClick={() => navigate('/case-reports')}
          >
            View All
          </Button>
        </div>
        
        <div className="space-y-4">
          {recentReports.map((report) => (
            <div 
              key={report.Id} 
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
              onClick={() => navigate(`/case-reports/${report.Id}`)}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  report.caseNumber % 5 === 0 
                    ? 'bg-gradient-accent text-white' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {report.caseNumber}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{report.title}</p>
                  <p className="text-sm text-gray-600">{report.caseType}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant={report.status}>{report.status.replace('-', ' ')}</Badge>
                <ApperIcon name="ChevronRight" className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          ))}
          
          {recentReports.length === 0 && (
            <div className="text-center py-8">
              <ApperIcon name="FileText" className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No case reports yet</p>
              <Button 
                className="mt-4"
                onClick={() => navigate('/case-reports/new')}
                icon="Plus"
              >
                Create Your First Case Report
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;