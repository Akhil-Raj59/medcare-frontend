import React from "react";
import { Login as LoginComponent } from "../../components"; // ✅ Fixed import path
import { AuthLayout } from "../../components"; // ✅ Wrapped in AuthLayout for protection

const Login = () => {
    return (
        <AuthLayout> {/* ✅ Ensures login page logic is handled properly */}
            <LoginComponent />
        </AuthLayout>
    );
};

export default Login;
