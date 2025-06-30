import React, { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { meetingService } from '@/services/api/meetingService';
import { caseReportService } from '@/services/api/caseReportService';

const Meetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [schedulingMeeting, setSchedulingMeeting] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    scheduledDate: '',
    location: '',
    triggerCaseNumber: ''
  });

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await meetingService.getAll();
      setMeetings(data);
    } catch (err) {
      setError('Failed to load meetings');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleMeeting = async () => {
    if (!newMeeting.scheduledDate || !newMeeting.location || !newMeeting.triggerCaseNumber) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setSchedulingMeeting(true);
      await meetingService.create({
        ...newMeeting,
        triggerCaseNumber: parseInt(newMeeting.triggerCaseNumber),
        completed: false,
        notes: ''
      });
      
      toast.success('Meeting scheduled successfully');
      setShowScheduleModal(false);
      setNewMeeting({ scheduledDate: '', location: '', triggerCaseNumber: '' });
      loadMeetings();
    } catch (err) {
      toast.error('Failed to schedule meeting');
    } finally {
      setSchedulingMeeting(false);
    }
  };

  const handleMarkComplete = async (meetingId) => {
    try {
      const meeting = meetings.find(m => m.Id === meetingId);
      await meetingService.update(meetingId, { ...meeting, completed: true });
      toast.success('Meeting marked as completed');
      loadMeetings();
    } catch (err) {
      toast.error('Failed to update meeting');
    }
  };

  const upcomingMeetings = meetings.filter(m => !m.completed && new Date(m.scheduledDate) >= new Date());
  const pastMeetings = meetings.filter(m => m.completed || new Date(m.scheduledDate) < new Date());

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadMeetings} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meetings</h1>
          <p className="text-gray-600 mt-2">Manage your supervision meetings and appointments</p>
        </div>
        <Button 
          onClick={() => setShowScheduleModal(true)}
          icon="Plus"
        >
          Schedule Meeting
        </Button>
      </div>

      {/* Upcoming Meetings */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Upcoming Meetings</h2>
        
        {upcomingMeetings.length === 0 ? (
          <div className="text-center py-8">
            <ApperIcon name="Calendar" className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">No upcoming meetings scheduled</p>
            <Button 
              onClick={() => setShowScheduleModal(true)}
              icon="Plus"
              size="sm"
            >
              Schedule Your First Meeting
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingMeetings.map((meeting) => (
              <div key={meeting.Id} className="border border-gray-200 rounded-lg p-6 hover:border-primary-300 transition-colors duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Case #{meeting.triggerCaseNumber} Supervision Meeting
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 space-x-4">
                      <div className="flex items-center">
                        <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                        {format(new Date(meeting.scheduledDate), 'MMM dd, yyyy')}
                      </div>
                      <div className="flex items-center">
                        <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
                        {format(new Date(meeting.scheduledDate), 'h:mm a')}
                      </div>
                      <div className="flex items-center">
                        <ApperIcon name="MapPin" className="w-4 h-4 mr-1" />
                        {meeting.location}
                      </div>
                    </div>
                  </div>
                  <Badge variant="warning">Scheduled</Badge>
                </div>
                
                <div className="flex items-center justify-end space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    icon="CheckCircle"
                    onClick={() => handleMarkComplete(meeting.Id)}
                  >
                    Mark Complete
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Edit"
                  >
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Past Meetings */}
      {pastMeetings.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Past Meetings</h2>
          
          <div className="space-y-4">
            {pastMeetings.map((meeting) => (
              <div key={meeting.Id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Case #{meeting.triggerCaseNumber} Supervision Meeting
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 space-x-4">
                      <div className="flex items-center">
                        <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                        {format(new Date(meeting.scheduledDate), 'MMM dd, yyyy')}
                      </div>
                      <div className="flex items-center">
                        <ApperIcon name="MapPin" className="w-4 h-4 mr-1" />
                        {meeting.location}
                      </div>
                    </div>
                  </div>
                  <Badge variant={meeting.completed ? 'success' : 'error'}>
                    {meeting.completed ? 'Completed' : 'Missed'}
                  </Badge>
                </div>
                
                {meeting.notes && (
                  <div className="mt-3 p-3 bg-white rounded border">
                    <p className="text-sm text-gray-700">{meeting.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Schedule Meeting Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Schedule New Meeting</h3>
              <Button
                variant="ghost"
                size="sm"
                icon="X"
                onClick={() => setShowScheduleModal(false)}
              />
            </div>
            
            <div className="space-y-4">
              <Input
                label="Case Number"
                type="number"
                value={newMeeting.triggerCaseNumber}
                onChange={(e) => setNewMeeting(prev => ({ ...prev, triggerCaseNumber: e.target.value }))}
                placeholder="Enter case number"
                required
              />
              
              <Input
                label="Date & Time"
                type="datetime-local"
                value={newMeeting.scheduledDate}
                onChange={(e) => setNewMeeting(prev => ({ ...prev, scheduledDate: e.target.value }))}
                required
              />
              
              <Input
                label="Location"
                value={newMeeting.location}
                onChange={(e) => setNewMeeting(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Meeting location or video link"
                required
              />
            </div>
            
            <div className="flex items-center justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowScheduleModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleScheduleMeeting}
                loading={schedulingMeeting}
                icon="Calendar"
              >
                Schedule Meeting
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Meetings;