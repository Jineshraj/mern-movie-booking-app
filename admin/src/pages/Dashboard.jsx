import { useState, useEffect } from "react";
import axios from "axios";

// Dummy dashboard data mapping for quick preview (in production hooks to Promise.all /all bookings)
const Dashboard = () => {
  const [stats, setStats] = useState({ revenue: 0, movies: 0, tickets: 0 });

  useEffect(() => {
    // Math to iterate through global bookings and calculate total platform revenue
    setStats({
      revenue: 145000,
      movies: 12,
      tickets: 540
    });
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Platform Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 font-medium mb-2">Total Revenue</h3>
          <p className="text-4xl font-bold text-green-600">₹{stats.revenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 font-medium mb-2">Active Movies</h3>
          <p className="text-4xl font-bold text-gray-900">{stats.movies}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 font-medium mb-2">Tickets Sold</h3>
          <p className="text-4xl font-bold text-blue-600">{stats.tickets}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
