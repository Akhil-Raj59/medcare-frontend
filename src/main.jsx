import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.js";
import App from "./App";
import { Home } from "./components/index.js";
import "./index.css";

// Import Pages
import {
    Login,
    Signup,
    AdminDashboard,
    DoctorDashboard,
    HospitalDashboard,
    PatientDashboard,
    FindHospitals,
    NotFound,
    AIChatbox,
} from "./pages";
import AuthLayout from "./components/AuthLayout.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    {/* Public and Protected Routes inside App layout */}
                    <Route path="/" element={<App />}>
                        {/* Public Routes */}
                        <Route index element={<Home />} />
                        <Route path="login" element={<Login />} />
                        <Route path="signup" element={<Signup />} />
                        
                        {/* Protected Routes as children of App */}
                        <Route path="chatbot" element={
                            <AuthLayout>
                                <AIChatbox />
                            </AuthLayout>
                        } />
                        <Route path="hospitals" element={
                            <AuthLayout>
                                <FindHospitals />       
                            </AuthLayout>
                        } />
                        <Route path="patient/dashboard" element={
                            <AuthLayout>
                                <PatientDashboard />
                            </AuthLayout>
                        } />
                        
                        {/* Other protected routes that can be uncommented when needed */}
                        {/* 
                        <Route path="admin/dashboard" element={
                            <AuthLayout>
                                <AdminDashboard />
                            </AuthLayout>
                        } />
                        <Route path="doctor/dashboard" element={
                            <AuthLayout>
                                <DoctorDashboard />
                            </AuthLayout>
                        } />
                        <Route path="hospital/dashboard" element={
                            <AuthLayout>
                                <HospitalDashboard />
                            </AuthLayout>
                        } /> 
                        */}
                    </Route>
                    
                    {/* 404 Page (outside of App layout) */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </Provider>
    </StrictMode>
);