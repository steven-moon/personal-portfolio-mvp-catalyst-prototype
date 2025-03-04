import React from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import AdminPages from './admin/index';

const Admin = () => {
  return (
    <Routes>
      <Route path="/*" element={<AdminPages />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default Admin;
