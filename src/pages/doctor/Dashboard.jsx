import React from "react";
import { AuthLayout } from "../../components";
import { Link } from "react-router-dom";

const DoctorDashboard = () => {
    return (
        <AuthLayout>
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
                <h1 className="text-3xl font-bold text-blue-400">Doctor Dashboard</h1>
                <p className="mt-2 text-gray-300">View patients, appointments, and referrals.</p>

                <div className="mt-6 space-y-4 w-full max-w-lg">
                    <Link to="/doctor/patients" className="block text-center bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg">
                        View My Patients
                    </Link>
                    <Link to="/doctor/appointments" className="block text-center bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg">
                        View Appointments
                    </Link>
                    <Link to="/doctor/referrals" className="block text-center bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg">
                        Refer Patients
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
};

export default DoctorDashboard;
