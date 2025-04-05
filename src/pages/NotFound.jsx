import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6 text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-blue-500">Coming Soon 🚧</h1>
            
            <p className="mt-4 text-lg sm:text-xl text-gray-300 max-w-xl">
                We're working hard to bring this feature to life! 🚀<br />
                It's currently under development and will be available very soon. 
                Thanks for your patience and excitement — we promise it’ll be worth the wait.
            </p>

            {/* Illustration */}
            <div className="mt-6">
                <img 
                    src="/404-hospital.svg" 
                    alt="Feature Under Construction" 
                    className="w-64 sm:w-80"
                />
            </div>

            {/* Go Home Button */}
            <Link
                to="/"
                className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-all duration-200"
            >
                Back to Homepage
            </Link>
        </div>
    );
};

export default NotFound;
