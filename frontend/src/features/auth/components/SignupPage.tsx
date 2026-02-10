import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SignupForm } from "./SignupForm";
import { Logo } from "../../../components/Logo";

export const SignupPage = () => {
    const [isAnimating, setIsAnimating] = useState(false);
    const navigate = useNavigate();

    const goToLogin = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setIsAnimating(true);

        // Navigate after animation completes
        setTimeout(() => {
            navigate('/login');
        }, 600);
    };

    return (
        <div className="bg-[#e8e8e8] min-h-screen flex flex-col">
            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-16 py-12">
                <div className="relative overflow-hidden bg-white rounded-sm shadow-md w-full max-w-[850px] h-[500px] flex">

                    {/* Blue Panel */}
                    <div
                        style={{ transition: 'transform 600ms cubic-bezier(0.4, 0.0, 0.2, 1)' }}
                        className={`absolute top-0 right-0 w-1/2 h-full bg-[#1a2332] z-10 ${isAnimating ? '-translate-x-full' : 'translate-x-0'}`}
                    />

                    {/* Sign Up Form (Right) */}
                    <div
                        className={`w-1/2 ml-auto px-10 py-8 flex flex-col transition-opacity duration-[600ms] ease-in-out ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
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
                        <SignupForm />

                        {/* Log In Link */}
                        <div className="text-center">
                            <span className="text-gray-500 text-xs">Already have an account? </span>
                            <a
                                href="#"
                                onClick={goToLogin}
                                className="text-gray-900 font-medium text-xs hover:underline"
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
