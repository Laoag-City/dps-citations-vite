import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Dashboard from './components/Dashboard/Dashboard'
//import NewDPSRecord from './components/NewDPSCitationRecord';
import DPSCitationRecordForm from './components/DPSCitationRecordForm';
import Reporting from './components/Reporting';
import PrivateRoute from './components/PrivateRoute';
import './App.css';
import './assets/bootstrap-darkly-theme.min.css';
//import './assets/bootstrap.min.css';
import PaymentUpdatePage from './components/PaymentUpdatePage';
import CommuteUpdatePage from './components/CommuteUpdatePage';
import ViolationManagerPage from './components/ViolationManagerPage';
import { useSelector } from 'react-redux';

function App() {
  const { token } = useSelector(state => state.auth);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        {/* Uncomment and use the route below when ready */}
        {/* <Route path="/status" element={<CitationStatus />} /> */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        {/*         <Route path="/newdpscitation" element={
          <PrivateRoute>
            <NewDPSRecord />
          </PrivateRoute>
        } />
 */}
        <Route path="/newdpscitation" element={
          <PrivateRoute>
            <DPSCitationRecordForm />
          </PrivateRoute>
        } />

        <Route path="/violations" element={
          <PrivateRoute>
            <ViolationManagerPage />
          </PrivateRoute>
        } />
        <Route path="/payment-update/:citationId" element={
          <PrivateRoute>
            <PaymentUpdatePage token={token} />
          </PrivateRoute>
        } />
        <Route path="/commute-update/:citationId" element={
          <PrivateRoute>
            <CommuteUpdatePage token={token} />
          </PrivateRoute>
        } />
        <Route path="/reporting" element={
          <PrivateRoute>
            <Reporting />
          </PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
