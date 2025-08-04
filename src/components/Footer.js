import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-light text-center text-lg-start mt-auto">
      <div className="text-center p-3 text-muted" style={{ backgroundColor: '#f1f1f1' }}>
        © {new Date().getFullYear()} HealSync. All rights reserved.
      </div>
    </footer>
  );
}
