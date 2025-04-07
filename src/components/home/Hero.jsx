import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "../Button";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const text = "AI-Powered 24/7 Medical Assistance";
const typingSpeed = 100; // Speed of typing in ms
const pauseTime = 2000; // Pause time after completion before resetting

const Hero = ({ isAuthenticated, navigateToDashboard }) => {
  const [displayedText, setDisplayedText] = useState("");

  // Typing effect
  useEffect(() => {
    let timer;
    let currentIndex = 0;
    let isTyping = true;

    const typeText = () => {
      if (isTyping) {
        if (currentIndex < text.length) {
          setDisplayedText(text.substring(0, currentIndex + 1));
          currentIndex++;
          timer = setTimeout(typeText, typingSpeed);
        } else {
          isTyping = false;
          timer = setTimeout(typeText, pauseTime);
        }
      } else {
        setDisplayedText("");
        currentIndex = 0;
        isTyping = true;
        timer = setTimeout(typeText, typingSpeed);
      }
    };

    timer = setTimeout(typeText, typingSpeed);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="min-h-screen mt-[-80px] flex flex-col md:flex-row items-center justify-center bg-[#F7F7F7] text-gray-900 px-6 md:px-12">
      {/* Text Content */}
      <div className="w-full md:w-1/2 p-8 text-left flex gap-8 flex-col justify-center space-y-4">
        <h1 className="text-5xl font-bold text-[#2196F3]">
          {displayedText}
          <span className="animate-pulse">|</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl animate-floting">
          Book hospital beds, consult with doctors, track your health, and get
          instant AI-powered medical suggestions.
        </p>
        <div className="mt-6 flex space-x-4">
          {!isAuthenticated ? (
            <>
              <Link to="/signup">
                <Button
                  size="lg"
                  className="shadow-blue-intense animate-pulseGradient"
                  variant="primary"
                >
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">
                  Login
                </Button>
              </Link>
            </>
          ) : (
            <Button
              size="lg"
              variant="primary"
              onClick={() => {
                navigateToDashboard();
              }}
            >
              Go to Dashboard
            </Button>
          )}
        </div>
      </div>

      {/* Lottie Animation */}
      <div className="hidden animate-floating lg:flex w-1/2 justify-center items-center ">
        <DotLottieReact
          src="https://lottie.host/ae4a3b73-6e54-4b39-9da3-85ed3649e9a8/TCFgP9seSq.lottie"
          loop
          autoplay
        />
      </div>
    </section>
  );
};

export default Hero;
