import type { ReactNode } from 'react';
import AdminSidebar from '../../../components/admin/dashboard/AdminSidebar';
import AdminTopNav from '../../../components/admin/dashboard/AdminTopNav';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-white font-sans text-textBlack">

      <AdminSidebar />

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        
        <AdminTopNav />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  );
}