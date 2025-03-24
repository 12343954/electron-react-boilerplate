import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';

class AuthenticatedRoutes extends React.Component {
  render() {
    return (
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    );
  }
}

export default AuthenticatedRoutes;
