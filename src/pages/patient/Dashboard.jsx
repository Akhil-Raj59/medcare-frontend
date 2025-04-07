import React, { useState, useEffect } from "react";
import { AuthLayout } from "../../components";
import { Link, useOutletContext } from "react-router-dom";
import {
  Calendar,
  MessageSquare,
  Activity,
  Clock,
  FileText,
  Hospital,
  User,
  MapPin,
} from "lucide-react";

const PatientDashboard = () => {
  const { user } = useOutletContext();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  const patient = user?.patient || {};
  const moodData = patient?.moodLogs || [];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading || !user) {
    return (
      <AuthLayout>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-700">Loading your dashboard...</p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="min-h-screen bg-gray-100 text-gray-800">
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
                    <h2 className="font-bold text-lg">{patient.fullName || "N/A"}</h2>
                    <p className="text-sm text-gray-500">{patient.email || "N/A"}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Age:</span>
                    <span className="font-medium">{patient.age || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Gender:</span>
                    <span className="font-medium">{patient.gender || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Account Status:</span>
                    <span className={`font-medium ${patient.isVerified ? "text-green-500" : "text-yellow-500"}`}>
                      {patient.isVerified ? "Verified" : "Unverified"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Member Since:</span>
                    <span className="font-medium">
                      {patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : "N/A"}
                    </span>
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
                  <Link to="/chatbot" className="w-full p-3 flex items-center space-x-3 hover:bg-gray-50">
                    <MessageSquare size={18} />
                    <span>AI Medical Assistant</span>
                  </Link>
                  <Link to="/patient/mood-tracking" className="w-full p-3 flex items-center space-x-3 hover:bg-gray-50">
                    <Activity size={18} />
                    <span>Mood Tracking</span>
                  </Link>
                  <Link to="/hospitals" className="w-full p-3 flex items-center space-x-3 hover:bg-gray-50">
                    <MapPin size={18} />
                    <span>Find Hospital</span>
                  </Link>
                  <Link to="/patient/medical-records" className="w-full p-3 flex items-center space-x-3 hover:bg-gray-50">
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
                    <Card icon={<Calendar />} title="Upcoming" text="No appointments" />
                    <Card
                      icon={<Clock />}
                      title="Recent Activity"
                      text={
                        patient.updatedAt
                          ? `Last login: ${new Date(patient.updatedAt).toLocaleDateString()}`
                          : "No recent activity"
                      }
                    />
                    <Card
                      icon={<Hospital />}
                      title="Find Help"
                      text={
                        <Link to="/hospitals" className="text-blue-600 hover:underline">
                          Find nearby hospitals
                        </Link>
                      }
                    />
                  </div>

                  {/* Medical History */}
                  <Section title="Medical History">
                    {patient.medicalHistory?.length ? (
                      <div className="divide-y divide-gray-200">
                        {patient.medicalHistory.map((item, index) => (
                          <div key={index} className="py-3">
                            <h3 className="font-medium">{item.condition}</h3>
                            <p className="text-sm text-gray-500">{item.notes}</p>
                            <p className="text-xs text-gray-400">{new Date(item.date).toLocaleDateString()}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No medical history records found.</p>
                    )}
                  </Section>

                  {/* Mood Logs */}
                  <Section title="Recent Mood Logs" actionLink="/patient/mood-tracking">
                    {moodData.length ? (
                      <div className="divide-y divide-gray-200">
                        {moodData.map((mood, index) => (
                          <div key={index} className="py-3 flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium">{mood.date}</p>
                              <p className="text-xs text-gray-500">{mood.note || "No notes"}</p>
                            </div>
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((level) => (
                                <span
                                  key={level}
                                  className={`w-6 h-6 rounded-full mx-1 ${
                                    level <= mood.level ? "bg-blue-500" : "bg-gray-200"
                                  }`}
                                ></span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">
                        No mood logs recorded yet.{" "}
                        <Link to="/patient/mood-tracking" className="text-blue-600 hover:underline">
                          Start tracking your mood
                        </Link>
                      </p>
                    )}
                  </Section>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

const Card = ({ icon, title, text }) => (
  <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-4">
    <div className="bg-blue-100 text-blue-600 p-3 rounded-full">{icon}</div>
    <div>
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm text-gray-500">{text}</p>
    </div>
  </div>
);

const Section = ({ title, children, actionLink }) => (
  <div className="bg-white rounded-lg shadow mb-6">
    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
      <h2 className="font-bold text-lg">{title}</h2>
      {actionLink && (
        <Link to={actionLink} className="text-blue-600 hover:underline text-sm">
          View All
        </Link>
      )}
    </div>
    <div className="p-4">{children}</div>
  </div>
);

export default PatientDashboard;
