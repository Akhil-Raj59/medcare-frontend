import React from "react";
import { AuthLayout } from "../../components";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
    return (
        <AuthLayout>
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
                <h1 className="text-3xl font-bold text-blue-400">Admin Dashboard</h1>
                <p className="mt-2 text-gray-300">Manage hospitals, doctors, and monitor analytics.</p>
                
                <div className="mt-6 space-y-4 w-full max-w-lg">
                    <Link to="/admin/hospitals" className="block text-center bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg">
                        Manage Hospitals
                    </Link>
                    <Link to="/admin/doctors" className="block text-center bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg">
                        Manage Doctors
                    </Link>
                    <Link to="/admin/analytics" className="block text-center bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg">
                        View Analytics
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
};

export default AdminDashboard;
