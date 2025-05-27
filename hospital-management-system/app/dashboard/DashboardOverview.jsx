export default function DashboardOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Total Patients</h2>
        <p className="text-3xl font-bold">1,234</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Appointments Today</h2>
        <p className="text-3xl font-bold">56</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Revenue</h2>
        <p className="text-3xl font-bold">$12,345</p>
      </div>
    </div>
  );
}