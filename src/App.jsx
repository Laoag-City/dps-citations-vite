//import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import NewOSCPRecord from './components/NewOSCPRecord'
//import NewOSCPRecord2 from './components/NewOSCPRecord2'
import PrivateRoute from './components/PrivateRoute';

//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'
//import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/bootstrap-darkly-theme.min.css'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/newoscpapplication" element={
          <PrivateRoute>
            <NewOSCPRecord />
          </PrivateRoute>
        } />
        {/*
        <Route path="/newoscpapplication2" element={
          <PrivateRoute>
            <NewOSCPRecord2 />
          </PrivateRoute>
        } />
        */}
      </Routes>
    </BrowserRouter>
  );

}

export default App
