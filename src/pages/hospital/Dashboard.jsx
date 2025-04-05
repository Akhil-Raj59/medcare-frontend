import React from "react";
import { AuthLayout } from "../../components";
import { Link } from "react-router-dom";

const HospitalDashboard = () => {
    return (
        <AuthLayout>
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
                <h1 className="text-3xl font-bold text-blue-400">Hospital Dashboard</h1>
                <p className="mt-2 text-gray-300">Manage beds, doctors, and patient bookings.</p>

                <div className="mt-6 space-y-4 w-full max-w-lg">
                    <Link to="/hospital/beds" className="block text-center bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg">
                        Manage Bed Availability
                    </Link>
                    <Link to="/hospital/doctors" className="block text-center bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg">
                        Manage Doctors
                    </Link>
                    <Link to="/hospital/bookings" className="block text-center bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg">
                        View Patient Bookings
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
};

export default HospitalDashboard;
