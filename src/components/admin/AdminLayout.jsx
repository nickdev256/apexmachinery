import { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import './AdminLayout.css';

export default function AdminLayout({ children }) {
  const [active, setActive] = useState('dashboard');

  return (
    <div className="admin-dashboard">

      <AdminSidebar
        active={active}
        onChange={setActive}
      />

      <main className="admin-content">
        {children}
      </main>

    </div>
  );
}