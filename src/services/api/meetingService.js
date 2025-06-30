import meetingsData from '@/services/mockData/meetings.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class MeetingService {
  constructor() {
    this.meetings = [...meetingsData];
  }

  async getAll() {
    await delay(250);
    return [...this.meetings].sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate));
  }

  async getById(id) {
    await delay(200);
    const meeting = this.meetings.find(m => m.Id === id);
    if (!meeting) {
      throw new Error('Meeting not found');
    }
    return { ...meeting };
  }

  async create(meetingData) {
    await delay(300);
    
    const maxId = Math.max(...this.meetings.map(m => m.Id), 0);
    
    const newMeeting = {
      Id: maxId + 1,
      ...meetingData,
      completed: false,
      notes: meetingData.notes || ''
    };
    
    this.meetings.push(newMeeting);
    return { ...newMeeting };
  }

  async update(id, meetingData) {
    await delay(300);
    
    const index = this.meetings.findIndex(m => m.Id === id);
    if (index === -1) {
      throw new Error('Meeting not found');
    }
    
    this.meetings[index] = {
      ...this.meetings[index],
      ...meetingData,
      Id: id
    };
    
    return { ...this.meetings[index] };
  }

  async delete(id) {
    await delay(250);
    
    const index = this.meetings.findIndex(m => m.Id === id);
    if (index === -1) {
      throw new Error('Meeting not found');
    }
    
    this.meetings.splice(index, 1);
    return true;
  }
}

export const meetingService = new MeetingService();