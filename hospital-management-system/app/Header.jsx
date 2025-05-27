import { UserCircleIcon } from '@heroicons/react/24/outline';

export default function Header() {
  return (
    <header className="bg-primary text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Hospital Management System</h1>
      <div className="flex items-center space-x-4">
        <span className="text-sm">Admin User</span>
        <UserCircleIcon className="h-8 w-8" />
      </div>
    </header>
  );
}