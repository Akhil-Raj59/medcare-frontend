import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

export default function AuthLayout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    // List of pages that should NOT be protected
    const publicRoutes = ["/login", "/signup"];

    useEffect(() => {
        if (isAuthenticated === null) {
            // Wait until authentication state is properly determined
            return;
        }

        if (!isAuthenticated && !publicRoutes.includes(location.pathname)) {
            navigate("/login");
        }

        setLoading(false);
    }, [isAuthenticated, navigate, location]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#f7f7f7] text-gray-800">
                <div className="relative">
                    <div className="w-12 h-12 border-4 border-t-4 border-[#2196f3] border-solid rounded-full animate-spin"></div>
                    <p className="absolute text-gray-800 text-lg top-16 left-1/2 transform -translate-x-1/2">Verifying...</p>
                </div>
            </div>
        );
    }

    // Just return children without wrapping in a new layout
    return children;
}