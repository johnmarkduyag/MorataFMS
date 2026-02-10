import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SignupFormProps {
    onLoadingChange?: (isLoading: boolean) => void;
}

export const SignupForm = ({ onLoadingChange }: SignupFormProps) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        onLoadingChange?.(true);
        setError(null);

        // Validate passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            onLoadingChange?.(false);
            return;
        }

        try {
            // TODO: Implement actual signup API call
            console.log("Signup data:", { firstName, lastName, email, password });

            // For now, just redirect to login
            setTimeout(() => {
                sessionStorage.setItem('fromSignup', 'true');
                navigate('/login');
            }, 1000);
        } catch (err: unknown) {
            console.error("Signup failed:", err);
            setError("Signup failed. Please try again.");
            // Only reset loading if there's an error and we aren't navigating away
            setIsLoading(false);
            onLoadingChange?.(false);
        }
        // Note: loop transition (setTimeout) handles eventual unmounting/navigation
        // but we keep loading true if successful to prevent toggle
    };

    return (
        <form className="space-y-3 mb-4" onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-red-600 text-xs text-center">{error}</p>
                </div>
            )}

            {/* First Name & Last Name */}
            <div className="flex gap-3">
                <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-1/2 px-4 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs bg-white text-gray-900"
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-1/2 px-4 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs bg-white text-gray-900"
                />
            </div>

            {/* Email */}
            <div>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs bg-white text-gray-900"
                />
            </div>

            {/* Password */}
            <div>
                <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs bg-white text-gray-900"
                />
            </div>

            {/* Confirm Password */}
            <div>
                <input
                    type="password"
                    placeholder="Confirm your Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs bg-white text-gray-900"
                />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1a2332] text-white py-2.5 rounded-full font-medium hover:bg-[#2a3342] transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? "Creating account..." : "Sign up"}
            </button>
        </form>
    );
};
