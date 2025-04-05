import React from "react";
import Container from "../../components/container/Container";
import { Signup as SignupComponent } from "../../components"; // ✅ Fixed import path
import { AuthLayout } from "../../components"; // ✅ Wrapped in AuthLayout for protection

const Signup = () => {
    return (
        <AuthLayout> {/* ✅ Ensures signup page logic is handled properly */}
                <SignupComponent />
        </AuthLayout>
    );
};

export default Signup;
