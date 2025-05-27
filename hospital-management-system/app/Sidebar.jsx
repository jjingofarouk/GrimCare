import Link from 'next/link';
import { HomeIcon, UserIcon, CalendarIcon } from '@heroicons/react/24/outline';

export default function Sidebar() {
  return (
    <aside className="bg-secondary text-white w-64 min-h-screen p-4">
      <nav className="space-y-2">
        <Link href="/" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
          <HomeIcon className="h-6 w-6" />
          <span>Dashboard</span>
        </Link>
        <Link href="/patient" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
          <UserIcon className="h-6 w-6" />
          <span>Patients</span>
        </Link>
        <Link href="/appointment" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
          <CalendarIcon className="h-6 w-6" />
          <span>Appointments</span>
        </Link>
      </nav>
    </aside>
  );
}