import React, { useState } from "react";
import { AuthLayout } from "../../components";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Calendar, MessageSquare, Activity, Clock, FileText, Hospital, User, MapPin } from "lucide-react";

const PatientDashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Sample mood data - in production you would use real data from user.moodLogs
  const moodData = user.moodLogs

  return (
    <AuthLayout>
      <div className="min-h-screen bg-gray-100 text-gray-800">
        {/* Header */}
        {/* <div className="bg-blue-600 text-white p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold">Welcome, {user?.fullName || "Patient"}</h1>
            <p className="text-blue-100">Patient Dashboard</p>
          </div>
        </div> */}

        <div className="max-w-6xl mx-auto p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-blue-500 text-white p-3 rounded-full">
                    <User size={24} />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg">{user?.fullName || "Patient"}</h2>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Age:</span>
                      <span className="font-medium">{user?.age || "N/A"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Gender:</span>
                      <span className="font-medium">{user?.gender || "N/A"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Account Status:</span>
                      <span className={`font-medium ${user?.isVerified ? "text-green-500" : "text-yellow-500"}`}>
                        {user?.isVerified ? "Verified" : "Unverified"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Member Since:</span>
                      <span className="font-medium">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="bg-white rounded-lg shadow mt-4 overflow-hidden">
                <div className="divide-y divide-gray-200">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`w-full p-3 text-left flex items-center space-x-3 hover:bg-gray-50 transition ${
                      activeTab === "overview" ? "bg-blue-50 text-blue-600" : ""
                    }`}
                  >
                    <Activity size={18} />
                    <span>Overview</span>
                  </button>
                  {/* <Link
                    to="/patient/bookings"
                    className="w-full p-3 text-left flex items-center space-x-3 hover:bg-gray-50 transition"
                  >
                    <Calendar size={18} />
                    <span>Appointments</span>
                  </Link> */}
                  <Link
                    to="/chatbot"
                    className="w-full p-3 text-left flex items-center space-x-3 hover:bg-gray-50 transition"
                  >
                    <MessageSquare size={18} />
                    <span>AI Medical Assistant</span>
                  </Link>
                  <Link
                    to="/patient/mood-tracking"
                    className="w-full p-3 text-left flex items-center space-x-3 hover:bg-gray-50 transition"
                  >
                    <Activity size={18} />
                    <span>Mood Tracking</span>
                  </Link>
                  <Link
                    to="/hospitals"
                    className="w-full p-3 text-left flex items-center space-x-3 hover:bg-gray-50 transition"
                  >
                    <MapPin size={18} />
                    <span>Find Hospital</span>
                  </Link>
                  <Link
                    to="/patient/medical-records"
                    className="w-full p-3 text-left flex items-center space-x-3 hover:bg-gray-50 transition"
                  >
                    <FileText size={18} />
                    <span>Medical Records</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === "overview" && (
                <>
                  {/* Quick Access Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-4">
                      <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                        <Calendar size={24} />
                      </div>
                      <div>
                        <h3 className="font-medium">Upcoming</h3>
                        <p className="text-sm text-gray-500">No appointments</p>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-4">
                      <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                        <Clock size={24} />
                      </div>
                      <div>
                        <h3 className="font-medium">Recent Activity</h3>
                        <p className="text-sm text-gray-500">
                          {user?.updatedAt
                            ? `Last login: ${new Date(user.updatedAt).toLocaleDateString()}`
                            : "No recent activity"}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-4">
                      <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                        <Hospital size={24} />
                      </div>
                      <div>
                        <h3 className="font-medium">Find Help</h3>
                        <p className="text-sm text-blue-600 hover:underline cursor-pointer">
                          <Link to="/hospitals">
                            Find nearby hospitals
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Medical History */}
                  <div className="bg-white rounded-lg shadow mb-6">
                    <div className="p-4 border-b border-gray-200">
                      <h2 className="font-bold text-lg">Medical History</h2>
                    </div>
                    <div className="p-4">
                      {user?.medicalHistory && user.medicalHistory.length > 0 ? (
                        <div className="divide-y divide-gray-200">
                          {user.medicalHistory.map((item, index) => (
                            <div key={index} className="py-3">
                              <h3 className="font-medium">{item.condition}</h3>
                              <p className="text-sm text-gray-500">{item.notes}</p>
                              <p className="text-xs text-gray-400">{new Date(item.date).toLocaleDateString()}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-gray-500">
                          <p>No medical history records found.</p>
                          {/* <button className="mt-2 text-blue-600 hover:underline text-sm">
                            + Add medical history
                          </button> */}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mood Tracking Overview */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                      <h2 className="font-bold text-lg">Recent Mood Logs</h2>
                      <Link to="/patient/mood-tracking" className="text-blue-600 hover:underline text-sm">
                        View All
                      </Link>
                    </div>
                    <div className="p-4">
                      {moodData.length > 0 ? (
                        <div className="divide-y divide-gray-200">
                          {moodData.map((mood, index) => (
                            <div key={index} className="py-3 flex justify-between items-center">
                              <div>
                                <p className="text-sm font-medium">{mood.date}</p>
                                <p className="text-xs text-gray-500">{mood.note}</p>
                              </div>
                              <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((level) => (
                                  <span
                                    key={level}
                                    className={`w-6 h-6 rounded-full mx-1 ${
                                      level <= mood.level
                                        ? "bg-blue-500"
                                        : "bg-gray-200"
                                    }`}
                                  ></span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-gray-500">
                          <p>No mood logs recorded yet.</p>
                          <Link to="/patient/mood-tracking" className="mt-2 text-blue-600 hover:underline text-sm">
                            Start tracking your mood
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default PatientDashboard;