import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Syllabus } from './pages/Syllabus';
import { MockTests } from './pages/MockTests';
import { Assistant } from './pages/Assistant';
import { User, UserData } from './types';
import { getUserData } from './services/storage';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('bankprep_current_user');
    if (storedUser) {
      const u = JSON.parse(storedUser);
      setUser(u);
      setUserData(getUserData(u.id));
    }
    setLoading(false);
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('bankprep_current_user', JSON.stringify(u));
    setUserData(getUserData(u.id));
  };

  const handleLogout = () => {
    setUser(null);
    setUserData(null);
    localStorage.removeItem('bankprep_current_user');
  };

  const handleDataUpdate = (newData: UserData) => {
    setUserData(newData);
    // storage is already updated inside component calls usually, 
    // but React state needs to reflect it for re-renders.
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-100">Loading...</div>;

  if (!user || !userData) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard data={userData} />} />
          <Route path="/syllabus" element={<Syllabus data={userData} onUpdate={handleDataUpdate} />} />
          <Route path="/tests" element={<MockTests data={userData} onUpdate={handleDataUpdate} />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;