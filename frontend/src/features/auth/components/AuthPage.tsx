<<<<<<< HEAD
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";
import { Logo } from "../../../components/Logo";

export const AuthPage = () => {
    const location = useLocation();

    // Initialize state based on URL
    const isSignupPath = location.pathname === '/signup';
    const [isSignup, setIsSignup] = useState(isSignupPath);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [loginKey, setLoginKey] = useState(0);
    const [signupKey, setSignupKey] = useState(0);

    // Sync state with URL if URL changes externally (e.g. back button)
    useEffect(() => {
        setIsSignup(location.pathname === '/signup');
    }, [location.pathname]);

    const toggleMode = () => {
        if (isAnimating || isLoading) return;

        setIsAnimating(true);
        const targetPath = isSignup ? '/login' : '/signup';
        const willBeSignup = !isSignup;

        // 1. Reset the TARGET form immediately (so it's fresh when revealed)
        if (willBeSignup) {
            setSignupKey(prev => prev + 1);
        } else {
            setLoginKey(prev => prev + 1);
        }

        // Immediately start transition
        setIsSignup(willBeSignup);
        // Update URL without full page reload
        window.history.pushState({}, '', targetPath);

        // Reset animation state after transition completes
        setTimeout(() => {
            setIsAnimating(false);

            // 2. Reset the SOURCE form after it's fully covered
            if (willBeSignup) {
                setLoginKey(prev => prev + 1); // Reset Login (was source)
            } else {
                setSignupKey(prev => prev + 1); // Reset Signup (was source)
            }
        }, 600);
    };

    return (
        <div className="bg-[#e8e8e8] min-h-screen flex flex-col">
            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-16 py-12">
                <div className="relative overflow-hidden bg-white rounded-sm shadow-md w-full max-w-[850px] h-[500px] flex">

                    {/* Login Form (Left) */}
                    <div
                        className={`w-1/2 px-14 py-10 flex flex-col transition-opacity duration-300 ${isSignup && !isAnimating ? 'opacity-0 pointer-events-none' : 'opacity-100'
                            }`}
                    >
                        {/* Logo */}
                        <div className="flex justify-center mb-8">
                            <Logo />
                        </div>

                        {/* Welcome Text */}
                        <div className="text-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome!</h1>
                            <p className="text-gray-500 text-xs">Your work, your team, your flow — all in one place.</p>
                        </div>


                        {/* Login Form */}
                        <LoginForm key={loginKey} onLoadingChange={setIsLoading} />

                        {/* Sign Up Link */}
                        <div className="text-center">
                            <span className="text-gray-500 text-xs">Don't have an account? </span>
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleMode();
                                }}
                                className={`font-medium text-xs hover:underline ${isLoading ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900'}`}
                            >
                                Sign Up
                            </a>
                        </div>

                        {/* Footer Links */}
                        <div className="flex justify-center items-center space-x-3 text-xs text-gray-400 mt-auto">
                            <a href="#" className="hover:text-gray-600">Help</a>
                            <span>/</span>
                            <a href="#" className="hover:text-gray-600">Terms</a>
                            <span>/</span>
                            <a href="#" className="hover:text-gray-600">Privacy</a>
                        </div>
                    </div>

                    {/* Sign Up Form (Right) */}
                    <div
                        className={`w-1/2 ml-auto px-10 py-8 flex flex-col transition-opacity duration-300 ${isSignup || isAnimating ? 'opacity-100' : 'opacity-0 pointer-events-none'
                            }`}
                    >
                        {/* Logo */}
                        <div className="flex justify-center mb-4">
                            <Logo />
                        </div>

                        {/* Heading */}
                        <div className="text-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-900">Create an account</h1>
                        </div>

                        {/* Sign Up Form */}
                        <SignupForm key={signupKey} onLoadingChange={setIsLoading} />

                        {/* Log In Link */}
                        <div className="text-center">
                            <span className="text-gray-500 text-xs">Already have an account? </span>
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleMode();
                                }}
                                className={`font-medium text-xs hover:underline ${isLoading ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900'}`}
                            >
                                Log in
                            </a>
                        </div>

                        {/* Footer Links */}
                        <div className="flex justify-center items-center space-x-3 text-xs text-gray-400 mt-auto">
                            <a href="#" className="hover:text-gray-600">Help</a>
                            <span>/</span>
                            <a href="#" className="hover:text-gray-600">Terms</a>
                            <span>/</span>
                            <a href="#" className="hover:text-gray-600">Privacy</a>
                        </div>
                    </div>

                    {/* Blue Panel */}
                    <div
                        className={`absolute top-0 left-0 w-1/2 h-full bg-[#1a2332] z-10 transition-transform duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${isSignup ? 'translate-x-0' : 'translate-x-full'
                            }`}
                    />
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-black text-white px-8 py-5 flex justify-between">
                <span className="text-[10px] font-semibold tracking-widest">FOOTER</span>
                <span className="text-[10px] font-semibold tracking-widest">FOOTER</span>
            </footer>
=======
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";

export const AuthPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(location.pathname === "/login");
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const targetIsLogin = location.pathname === "/login";
        if (targetIsLogin !== isLogin) {
            setIsAnimating(true);
            setIsLogin(targetIsLogin);
            setTimeout(() => setIsAnimating(false), 600); // Match transition duration
        }
    }, [location.pathname, isLogin]);

    const toggleMode = (targetLogin: boolean) => {
        if (isAnimating) return;
        navigate(targetLogin ? "/login" : "/signup");
    };

    return (
        <div className="bg-white min-h-screen flex flex-col overflow-hidden transition-colors">
            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 py-12 md:px-16">
                <div className="bg-white border rounded-[3rem] shadow-2xl w-full max-w-[850px] min-h-[500px] flex relative overflow-hidden transition-all">

                    {/* Blue Panel (Absolute) */}
                    <div
                        className={`hidden md:block absolute top-0 left-0 w-1/2 h-full bg-[#1a2332] z-10 transition-transform duration-600 ease-in-out ${isLogin ? "translate-x-full" : "translate-x-0"
                            }`}
                    ></div>

                    {/* Forms Container */}
                    <div className="flex w-full relative">
                        {/* Login Form (Left) */}
                        <div
                            className={`w-full md:w-1/2 px-8 py-10 md:px-14 flex flex-col ${isLogin ? "flex" : "hidden md:flex"
                                }`}
                        >
                            {/* Logo */}
                            <div className="flex justify-center mb-8">
                                <div className="w-12 h-12 relative">
                                    <svg viewBox="0 0 64 64" className="w-full h-full">
                                        <circle cx="32" cy="32" r="30" fill="#1e3a5f" stroke="#c41e3a" strokeWidth="2" />
                                        <path d="M20 32 Q32 20 44 32 Q32 44 20 32" fill="#c41e3a" />
                                        <circle cx="32" cy="32" r="8" fill="white" />
                                        <path d="M28 28 L36 36 M36 28 L28 36" stroke="#1e3a5f" strokeWidth="2" />
                                    </svg>
                                </div>
                            </div>

                            <div className="text-center mb-6">
                                <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome!</h1>
                                <p className="text-gray-500 text-[10px] sm:text-xs">Your work, your team, your flow — all in one place.</p>
                            </div>

                            <LoginForm onToggleSignup={() => toggleMode(false)} />

                            {/* Footer Links */}
                            <div className="flex justify-center items-center space-x-3 text-[10px] text-gray-400 mt-auto pt-6">
                                <a href="#" className="hover:text-gray-600">Help</a>
                                <span>/</span>
                                <a href="#" className="hover:text-gray-600">Terms</a>
                                <span>/</span>
                                <a href="#" className="hover:text-gray-600">Privacy</a>
                            </div>
                        </div>

                        {/* Signup Form (Right) */}
                        <div
                            className={`w-full md:w-1/2 px-8 py-8 md:px-10 flex flex-col ${!isLogin ? "flex" : "hidden md:flex"
                                }`}
                        >
                            {/* Logo */}
                            <div className="flex justify-center mb-4">
                                <div className="w-12 h-12 relative">
                                    <svg viewBox="0 0 64 64" className="w-full h-full">
                                        <circle cx="32" cy="32" r="30" fill="#1e3a5f" stroke="#c41e3a" strokeWidth="2" />
                                        <path d="M20 32 Q32 20 44 32 Q32 44 20 32" fill="#c41e3a" />
                                        <circle cx="32" cy="32" r="8" fill="white" />
                                        <path d="M28 28 L36 36 M36 28 L28 36" stroke="#1e3a5f" strokeWidth="2" />
                                    </svg>
                                </div>
                            </div>

                            <div className="text-center mb-6">
                                <h1 className="text-2xl font-bold text-gray-900">Create an account</h1>
                            </div>

                            <SignupForm onToggleLogin={() => toggleMode(true)} />

                            {/* Footer Links */}
                            <div className="flex justify-center items-center space-x-3 text-[10px] text-gray-400 mt-auto pt-6">
                                <a href="#" className="hover:text-gray-600">Help</a>
                                <span>/</span>
                                <a href="#" className="hover:text-gray-600">Terms</a>
                                <span>/</span>
                                <a href="#" className="hover:text-gray-600">Privacy</a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
>>>>>>> testing
        </div>
    );
};
