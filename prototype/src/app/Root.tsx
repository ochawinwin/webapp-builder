import React, { useState, useEffect } from 'react';
import { Outlet, ScrollRestoration } from 'react-router';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { User } from './types';
import { Toaster } from 'sonner';

const Root: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  // Simulation of auth state management
  useEffect(() => {
    const savedUser = localStorage.getItem('futurecareer_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('futurecareer_user');
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('futurecareer_user', JSON.stringify(userData));
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar user={user} onLogout={handleLogout} />
      <main className="flex-grow">
        <Outlet context={{ user, handleLogin }} />
      </main>
      <Footer />
      <Toaster position="top-right" richColors />
      <ScrollRestoration />
    </div>
  );
};

export default Root;
