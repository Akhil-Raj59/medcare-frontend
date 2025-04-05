import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { requestOTP, verifyOTP } from "../store/authSlice";
import { Button, Input, Logo } from "../components";
import { useForm } from "react-hook-form";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset, 
    } = useForm();
    
    const [email, setEmail] = useState("");
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleRequestOTP = async (data) => {
        setError("");
        setLoading(true);
        try {
            await dispatch(requestOTP(data.email)).unwrap();
            setEmail(data.email);
            setStep(2);
            reset(); 
        } catch (err) {
            setError(err?.message || JSON.stringify(err)); 
        } finally {
            setLoading(false);
        }
    };
    
    const handleVerifyOTP = async (data) => {
        setError("");
        setLoading(true);
        try {
            await dispatch(verifyOTP({ email, otp: data.otp })).unwrap();
            navigate("/");
        } catch (err) {
            setError(err?.message || JSON.stringify(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex flex-col lg:flex-row items-center lg:justify-center bg-[#f7f7f7] text-gray-800 p-6 lg:p-0">
            {/* Login Form Container */}
            <div className="relative animate- shadow-black z-10 max-w-md w-full bg-white rounded-lg shadow-lg p-8 border border-[#2196f3]">
                <div className="flex justify-center mb-4">
                    <Logo width="100px" />
                </div>

                <h1 className="text-center text-3xl font-bold text-[#2196f3]">
                    {step === 1 ? "Sign in with OTP" : "Enter OTP"}
                </h1>

                <p className="mt-2 text-center text-gray-600">
                    {step === 1
                        ? "Enter your email to receive an OTP."
                        : `We sent an OTP to ${email}.`}
                </p>

                {error && (
                    <p className="mt-4 text-center text-red-500" aria-live="assertive">
                        {error}
                    </p>
                )}

                {step === 1 ? (
                    <form className="mt-6 space-y-6" onSubmit={handleSubmit(handleRequestOTP)}>
                        <div>
                            <Input
                                label="Email:"
                                placeholder="Enter your email"
                                type="email"
                                className="border-gray-300 bg-white text-gray-800"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                        message: "Invalid email format",
                                    },
                                })}
                            />
                            {errors.email && (
                                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <Button type="submit" isLoading={loading} className="w-full bg-[#2196f3] hover:bg-blue-600 text-white">
                            {loading ? "Sending OTP..." : "Send OTP"}
                        </Button>
                    </form>
                ) : (
                    <form className="mt-6 space-y-6" onSubmit={handleSubmit(handleVerifyOTP)}>
                        <div>
                            <Input
                                label="OTP:"
                                placeholder="Enter OTP"
                                type="text"
                                className="border-gray-300 bg-white text-gray-800"
                                {...register("otp", {
                                    required: "OTP is required",
                                    minLength: {
                                        value: 6,
                                        message: "OTP must be 6 digits",
                                    },
                                    maxLength: {
                                        value: 6,
                                        message: "OTP must be 6 digits",
                                    },
                                })}
                            />
                            {errors.otp && (
                                <p className="text-xs text-red-500 mt-1">{errors.otp.message}</p>
                            )}
                        </div>

                        <Button type="submit" isLoading={loading} className="w-full bg-[#2196f3] hover:bg-blue-600 text-white">
                            {loading ? "Verifying OTP..." : "Verify OTP"}
                        </Button>

                        <p className="text-center text-gray-600 text-sm mt-4">
                            Didn't receive an OTP?{" "}
                            <button
                                type="button"
                                className="text-[#2196f3] hover:text-blue-600 font-medium"
                                onClick={() => setStep(1)}
                            >
                                Resend OTP
                            </button>
                        </p>
                    </form>
                )}

                <p className="mt-4 text-center text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-[#2196f3] font-medium hover:text-blue-600">
                        Sign Up
                    </Link>
                </p>
            </div>
            
            {/* Animation Container */}
            <div className="hidden lg:flex  w-1/2 justify-center items-center">
                <DotLottieReact
                    src="https://lottie.host/ae4a3b73-6e54-4b39-9da3-85ed3649e9a8/TCFgP9seSq.lottie"
                    loop
                    autoplay
                />
            </div>
        </div>
    );
};

export default Login;
