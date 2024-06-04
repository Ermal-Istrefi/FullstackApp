import React from 'react';
import Login from './views/Login';
import Register from './views/Register';
import AddEditExpense from './views/AddEditExpense';
import Dashboard from './views/Dashboard';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import Income from './views/Income';
import AddEditIncome from './views/AddEditIncome';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="expense/add" element={<AddEditExpense />} />
          <Route path="/expense/edit/:id" element={<AddEditExpense />} />
          <Route path="/income" element={<Income />} />
          <Route path="income/add" element={<AddEditIncome />} />
          <Route path="/income/edit/:id" element={<AddEditIncome />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
