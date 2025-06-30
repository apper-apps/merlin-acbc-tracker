import caseReportsData from '@/services/mockData/caseReports.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CaseReportService {
  constructor() {
    this.reports = [...caseReportsData];
  }

  async getAll() {
    await delay(300);
    return [...this.reports].sort((a, b) => b.caseNumber - a.caseNumber);
  }

  async getById(id) {
    await delay(200);
    const report = this.reports.find(r => r.Id === id);
    if (!report) {
      throw new Error('Case report not found');
    }
    return { ...report };
  }

  async create(reportData) {
    await delay(400);
    
    const maxId = Math.max(...this.reports.map(r => r.Id), 0);
    const maxCaseNumber = Math.max(...this.reports.map(r => r.caseNumber), 0);
    
    const newReport = {
      Id: maxId + 1,
      caseNumber: maxCaseNumber + 1,
      ...reportData,
      submissionDate: new Date().toISOString(),
      attachments: reportData.attachments || []
    };
    
    this.reports.push(newReport);
    return { ...newReport };
  }

  async update(id, reportData) {
    await delay(350);
    
    const index = this.reports.findIndex(r => r.Id === id);
    if (index === -1) {
      throw new Error('Case report not found');
    }
    
    this.reports[index] = {
      ...this.reports[index],
      ...reportData,
      Id: id
    };
    
    return { ...this.reports[index] };
  }

  async delete(id) {
    await delay(250);
    
    const index = this.reports.findIndex(r => r.Id === id);
    if (index === -1) {
      throw new Error('Case report not found');
    }
    
    this.reports.splice(index, 1);
    return true;
  }
}

export const caseReportService = new CaseReportService();