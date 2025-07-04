import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import ResumeBuilder from '../pages/ResumeBuilder';
import Dashboard from '../pages/Dashboard';

export default function AppRouter({ dark }: { dark?: boolean }) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/builder" element={<ResumeBuilder dark={dark} />} />
      </Routes>
    </BrowserRouter>
  );
}
