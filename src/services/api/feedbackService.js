import feedbacksData from '@/services/mockData/feedbacks.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class FeedbackService {
  constructor() {
    this.feedbacks = [...feedbacksData];
  }

  async getByReportId(reportId) {
    await delay(300);
    return [...this.feedbacks]
      .filter(f => f.reportId === reportId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  async getById(id) {
    await delay(200);
    const feedback = this.feedbacks.find(f => f.Id === id);
    if (!feedback) {
      throw new Error('Feedback not found');
    }
    return { ...feedback };
  }

  async create(feedbackData) {
    await delay(400);
    
    const maxId = Math.max(...this.feedbacks.map(f => f.Id), 0);
    
    const newFeedback = {
      Id: maxId + 1,
      ...feedbackData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.feedbacks.push(newFeedback);
    return { ...newFeedback };
  }

  async update(id, feedbackData) {
    await delay(350);
    
    const index = this.feedbacks.findIndex(f => f.Id === id);
    if (index === -1) {
      throw new Error('Feedback not found');
    }
    
    this.feedbacks[index] = {
      ...this.feedbacks[index],
      ...feedbackData,
      Id: id,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.feedbacks[index] };
  }

  async delete(id) {
    await delay(250);
    
    const index = this.feedbacks.findIndex(f => f.Id === id);
    if (index === -1) {
      throw new Error('Feedback not found');
    }
    
    // Also delete all replies to this feedback
    const feedbacksToDelete = [id];
    const findReplies = (parentId) => {
      const replies = this.feedbacks.filter(f => f.parentId === parentId);
      replies.forEach(reply => {
        feedbacksToDelete.push(reply.Id);
        findReplies(reply.Id);
      });
    };
    findReplies(id);
    
    this.feedbacks = this.feedbacks.filter(f => !feedbacksToDelete.includes(f.Id));
    return true;
  }
}

export const feedbackService = new FeedbackService();