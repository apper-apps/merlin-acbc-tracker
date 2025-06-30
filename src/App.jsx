import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from '@/components/organisms/Layout';
import Dashboard from '@/components/pages/Dashboard';
import CaseReports from '@/components/pages/CaseReports';
import CaseReportForm from '@/components/pages/CaseReportForm';
import CaseReportDetail from '@/components/pages/CaseReportDetail';
import Meetings from '@/components/pages/Meetings';
import Repository from '@/components/pages/Repository';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/case-reports" element={<CaseReports />} />
            <Route path="/case-reports/new" element={<CaseReportForm />} />
            <Route path="/case-reports/:id" element={<CaseReportDetail />} />
            <Route path="/case-reports/:id/edit" element={<CaseReportForm />} />
            <Route path="/meetings" element={<Meetings />} />
            <Route path="/repository" element={<Repository />} />
          </Routes>
        </Layout>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="z-50"
        />
      </div>
    </Router>
  );
}

export default App;