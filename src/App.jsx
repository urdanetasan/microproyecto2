import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { auth } from './firebase-config';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ClubList from './components/ClubList';
import ClubDetails from './components/ClubDetails';
import UserProfile from './components/UserProfile';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  if (user === null) {
    return null;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/register" /> : <RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/clubs" element={<ClubList />} />
        <Route path="/club/:id" element={<ClubDetails />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </Router>
  );
}

export default App;