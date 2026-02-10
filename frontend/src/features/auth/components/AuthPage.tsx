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
        </div>
    );
};
