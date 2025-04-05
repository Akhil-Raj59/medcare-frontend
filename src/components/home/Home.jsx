import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Hero from "./Hero";



const Home = () => {
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const user = useSelector((state) => state.auth.user);
    
    // Function to handle feature button clicks
    const handleFeatureClick = (path) => {
        if (isAuthenticated) {
            navigate(path);
        } else {
            navigate("/login");
        }
    };
    
    // Function to navigate to dashboard based on user role
    const navigateToDashboard = () => {
        if (!user) return;
        
        if (user.role === "admin") {
            navigate("/admin/dashboard");
        } else if (user.role === "doctor") {
            navigate("/doctor/dashboard");
        } else if (user.role === "hospital") {
            navigate("/hospital/dashboard");
        } else {
            navigate("/patient/dashboard");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f7f7] text-gray-800 px-6 py-12">
            {/* Header */}
            {/* <Header /> */}
            
            {/* Hero Section */}
            <Hero isAuthenticated={isAuthenticated} navigateToDashboard={navigateToDashboard} />
            
            {/* Features Section */}
            <section className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
                <FeatureCard
                    title="AI Chatbot"
                    description="Get instant AI-driven medical suggestions by uploading an image or asking a question."
                    icon="🤖"
                    onClick={() => handleFeatureClick("/chatbot")}
                />
                <FeatureCard
                    title="Hospital Booking"
                    description="Find nearby hospitals with real-time bed availability and book instantly."
                    icon="🏥"
                    onClick={() => handleFeatureClick("/hospitals")}
                />
                <FeatureCard
                    title="Mood Tracking"
                    description="Track your mood daily and get weekly insights to improve mental health."
                    icon="📊"
                    onClick={() => handleFeatureClick("/patient/mood-tracking")}
                />
            </section>
            
            {/* Footer */}
            {/* <Footer /> */}
        </div>
    );
};

/* Feature Card Component */
const FeatureCard = ({ title, description, icon, onClick }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-[#2196f3] flex flex-col items-center text-center cursor-pointer hover:bg-gray-50 transition-colors" onClick={onClick}>
        <span className="text-4xl">{icon}</span>
        <h3 className="mt-4 text-xl font-semibold text-[#2196f3]">{title}</h3>
        <p className="mt-2 text-gray-600">{description}</p>
        <button className="mt-4 text-[#2196f3] hover:underline">Try Now</button>
    </div>
);

export default Home;