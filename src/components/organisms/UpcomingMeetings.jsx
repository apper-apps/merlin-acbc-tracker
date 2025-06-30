import React from 'react';
import { format } from 'date-fns';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const UpcomingMeetings = ({ meetings, loading }) => {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="w-48 h-6 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="w-32 h-4 bg-gray-200 rounded"></div>
                  <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
                </div>
                <div className="w-24 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Upcoming Meetings</h3>
        <Button variant="ghost" size="sm" icon="Calendar">
          View All
        </Button>
      </div>
      
      <div className="space-y-4">
        {meetings.slice(0, 5).map((meeting) => (
          <div key={meeting.Id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors duration-200">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-medium text-gray-900">
                  Case #{meeting.triggerCaseNumber} Review
                </p>
                <p className="text-sm text-gray-600">
                  {format(new Date(meeting.scheduledDate), 'MMM dd, yyyy')} at {format(new Date(meeting.scheduledDate), 'h:mm a')}
                </p>
              </div>
              <Badge variant={meeting.completed ? 'success' : 'warning'}>
                {meeting.completed ? 'Completed' : 'Scheduled'}
              </Badge>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <ApperIcon name="MapPin" className="w-4 h-4 mr-1" />
              {meeting.location}
            </div>
          </div>
        ))}
        
        {meetings.length === 0 && (
          <div className="text-center py-8">
            <ApperIcon name="Calendar" className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No upcoming meetings scheduled</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default UpcomingMeetings;