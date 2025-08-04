// src/components/Layout.js
import React from 'react';
import Header from './Header';  // Correct path
import Footer from './Footer';  // Correct path

export default function Layout({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-fill">
        {children}
      </main>
      <Footer />
    </div>
  );
}
