import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { requestOTP, verifyOTP, register as registerUser } from "../store/authSlice";
import { Button, Input, Logo } from "../components";
import background from "../assets/background.png";

const Signup = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [step, setStep] = useState(1);
    const [userData, setUserData] = useState(null);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // 🔹 Step 1: Register User
    const handleRegister = async (data) => {
        setError("");
        setLoading(true);

        try {
            // Prepare form data (for file upload)
             const formData = {
                // Changed from 'fullname' to 'fullName' to match backend expectation
                fullName: data.fullName,
                email: data.email,
                gender: data.gender,
                age: data.age,
                idProof: data.idProof[0]
             }
        
            // ✅ Register user
            await dispatch(registerUser(formData)).unwrap();

            setUserData(data);
            setEmail(data.email);
            setStep(2);
            reset();
        } catch (err) {
            console.error("Registration error:", err);
            
            // Improved error handling for specific cases
            if (err?.message?.includes("already") || err?.message?.includes("exists")) {
                setError("This email is already registered. Please use a different email or try logging in.");
            } else {
                setError(err?.message || "An error occurred during registration. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Step 2: Verify OTP
    const handleVerifyOTP = async (data) => {
        setError("");
        setLoading(true);
        try {
            // ✅ Verify OTP
            await dispatch(verifyOTP({ email, otp: data.otp })).unwrap();
            
            // ✅ Navigate after verification
            navigate("/");
        } catch (err) {
            console.error("OTP verification error:", err);
            
            // Improved error handling for OTP verification
            if (err?.message?.includes("expired")) {
                setError("OTP has expired. Please request a new one.");
            } else if (err?.message?.includes("invalid")) {
                setError("Invalid OTP. Please check and try again.");
            } else {
                setError(err?.message || "Failed to verify OTP. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Function to resend OTP
    const handleResendOTP = async () => {
        if (!email) {
            setError("Email information is missing. Please start over.");
            setStep(1);
            return;
        }

        setError("");
        setLoading(true);
        
        try {
            // Request new OTP
            await dispatch(requestOTP({ email })).unwrap();
            setError(""); // Clear any previous errors
            // Show success message
            setError("A new OTP has been sent to your email.");
        } catch (err) {
            setError(err?.message || "Failed to resend OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center lg:justify-end lg:pr-6 bg-[#f7f7f7]  text-gray-800"
        style={{
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
            {/* Signup Form Container */}
            <div className="relative z-10 max-w-md w-full bg-white rounded-lg shadow-lg shadow-black animate-glowPulse p-8 lg:m-20 border border-[#2196f3]">
                <div className="flex justify-center mb-4">
                    <Logo width="100px" />
                </div>

                <h2 className="text-center text-3xl font-bold text-[#2196f3]">
                    {step === 1 ? "Create Account" : "Enter OTP"}
                </h2>

                {step === 1 ? (
                    <p className="mt-2 text-center text-gray-600">
                        Enter your details to create an account.
                    </p>
                ) : (
                    <div className="mt-2 text-center text-gray-600">
                        <p>We sent an OTP to <strong>{email}</strong>.</p>
                        <p className="text-sm text-gray-500">Please check your Spam folder if you don’t see it.</p>
                    </div>
                )}


                {error && (
                    <p className={`mt-4 text-center ${error.includes('sent') ? 'text-green-500' : 'text-red-500'}`} aria-live="assertive">
                        {error}
                    </p>
                )}

                {step === 1 ? (
                    /* Step 1: Register */
                    <form className="mt-6 space-y-6" onSubmit={handleSubmit(handleRegister)} encType="multipart/form-data">
                        <div>
                            <Input
                                label="Full Name:"
                                placeholder="Enter your full name"
                                className="border-gray-300 bg-gray-50 text-gray-800"
                                {...register("fullName", { required: "Full name is required." })}
                            />
                            {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
                        </div>

                        <div>
                            <Input
                                label="Email:"
                                placeholder="Enter your email"
                                type="email"
                                className="border-gray-300 bg-gray-50 text-gray-800"
                                {...register("email", {
                                    required: "Email is required.",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Invalid email format.",
                                    },
                                })}
                            />
                            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Gender:</label>
                            <select
                                {...register("gender", { required: "Please select your gender." })}
                                className="w-full mt-1 p-2 bg-gray-50 text-gray-800 rounded-lg border border-gray-300 focus:border-[#2196f3] focus:ring-2 focus:ring-[#2196f3]"
                                defaultValue=""
                            >
                                <option value="" disabled>-- Select Gender --</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender.message}</p>}
                        </div>

                        <div>
                            <Input
                                label="Age:"
                                placeholder="Enter your age"
                                type="number"
                                className="border-gray-300 bg-gray-50 text-gray-800"
                                {...register("age", {
                                    required: "Age is required.",
                                    min: { value: 1, message: "Age must be at least 1." },
                                })}
                            />
                            {errors.age && <p className="text-xs text-red-500 mt-1">{errors.age.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Upload ID Proof:</label>
                            <input
                                type="file"
                                {...register("idProof", { required: "ID Proof is required." })}
                                className="w-full p-2 bg-gray-50 text-gray-800 rounded-lg border border-gray-300"
                            />
                            {errors.idProof && <p className="text-xs text-red-500 mt-1">{errors.idProof.message}</p>}
                        </div>

                        <Button type="submit" isLoading={loading} className="w-full">
                            {loading ? "Sending OTP..." : "Send OTP"}
                        </Button>
                    </form>
                ) : (
                    /* Step 2: Verify OTP */
                    <form className="mt-6 space-y-6" onSubmit={handleSubmit(handleVerifyOTP)}>
                        <div>
                            <Input
                                label="OTP:"
                                placeholder="Enter OTP"
                                type="text"
                                className="border-gray-300 bg-gray-50 text-gray-800"
                                {...register("otp", {
                                    required: "OTP is required",
                                    minLength: { value: 6, message: "OTP must be 6 digits" },
                                    maxLength: { value: 6, message: "OTP must be 6 digits" },
                                })}
                            />
                            {errors.otp && <p className="text-xs text-red-500 mt-1">{errors.otp.message}</p>}
                        </div>

                        <Button type="submit" isLoading={loading} className="w-full">
                            {loading ? "Verifying OTP..." : "Verify OTP"}
                        </Button>

                        <p className="text-center text-gray-500 text-sm mt-4">
                            Didn't receive an OTP?{" "}
                            <button
                                type="button"
                                className="text-[#2196f3] hover:text-blue-700 font-medium"
                                onClick={handleResendOTP}
                            >
                                Resend OTP
                            </button>
                        </p>
                    </form>
                )}

                <p className="mt-4 text-center text-gray-500">
                    Already have an account?{" "}
                    <Link to="/login" className="text-[#2196f3] font-medium hover:text-blue-700">
                        Log In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;