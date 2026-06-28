import { Outlet } from 'react-router-dom';
import VisitorBottomNav from './VisitorBottomNav';
import { User } from 'lucide-react';

export default function VisitorLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="sticky top-0 z-40 bg-primary-600 text-white px-4 py-3 shadow-md">
        <div className="flex items-center gap-3">
          <User size={24} />
          <h1 className="text-lg font-semibold">纸为你 - 游客</h1>
        </div>
      </header>

      <main className="flex-1 pb-20 overflow-auto">
        <Outlet />
      </main>

      <VisitorBottomNav />
    </div>
  );
}