import documentsData from '@/services/mockData/documents.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class DocumentService {
  constructor() {
    this.documents = [...documentsData];
  }

  async getAll() {
    await delay(300);
    return [...this.documents].sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
  }

  async getById(id) {
    await delay(200);
    const document = this.documents.find(d => d.Id === id);
    if (!document) {
      throw new Error('Document not found');
    }
    return { ...document };
  }

  async create(documentData) {
    await delay(400);
    
    const maxId = Math.max(...this.documents.map(d => d.Id), 0);
    
    const newDocument = {
      Id: maxId + 1,
      ...documentData,
      uploadDate: new Date().toISOString()
    };
    
    this.documents.push(newDocument);
    return { ...newDocument };
  }

  async update(id, documentData) {
    await delay(300);
    
    const index = this.documents.findIndex(d => d.Id === id);
    if (index === -1) {
      throw new Error('Document not found');
    }
    
    this.documents[index] = {
      ...this.documents[index],
      ...documentData,
      Id: id
    };
    
    return { ...this.documents[index] };
  }

  async delete(id) {
    await delay(250);
    
    const index = this.documents.findIndex(d => d.Id === id);
    if (index === -1) {
      throw new Error('Document not found');
    }
    
    this.documents.splice(index, 1);
    return true;
  }

  async getByCategory(category) {
    await delay(250);
    return this.documents.filter(d => d.category === category);
  }

  async getRelatedToCaseReport(caseId) {
    await delay(200);
    return this.documents.filter(d => d.relatedCaseId === caseId.toString());
  }
}

export const documentService = new DocumentService();