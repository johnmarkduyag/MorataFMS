import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await login({ email, password, rememberMe });
      // Navigate to dashboard on successful login
      navigate('/dashboard');
    } catch (err: unknown) { // Changed 'any' to 'unknown'
      console.error("Login failed:", err);
      let errorMessage = "An unexpected error occurred. Please try again.";

      // Type guard to check if err is an object and has a 'response' property
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const errorResponse = err as { response?: { data?: { message?: string }, status?: number } }; // Assert to a more specific type
        if (errorResponse.response?.data?.message) {
          errorMessage = errorResponse.response.data.message;
        } else if (errorResponse.response) {
          // Fallback for other response errors if message isn't present
          errorMessage = `Login failed with status: ${errorResponse.response.status || 'unknown'}`;
        }
      } else if (err instanceof Error) {
        // Handle standard JavaScript Error objects
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {/* Email Input */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-white/50 group-focus-within:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
          </svg>
        </div>
        <input
          id="email-address"
          name="email"
          type="email"
          required
          className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     backdrop-blur-sm transition-all duration-300
                     hover:bg-white/10"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Password Input */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-white/50 group-focus-within:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     backdrop-blur-sm transition-all duration-300
                     hover:bg-white/10"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 backdrop-blur-sm">
          <p className="text-red-400 text-sm text-center">{error}</p>
        </div>
      )}

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center cursor-pointer group">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-white/20 bg-white/10 text-red-600 
                       focus:ring-2 focus:ring-blue-500 focus:ring-offset-0
                       transition-all cursor-pointer"
          />
          <span className="ml-2 text-white/70 group-hover:text-white transition-colors">
            Remember me
          </span>
        </label>
        <a 
          href="#" 
          className="text-white/70 hover:text-blue-400 font-medium transition-colors"
        >
          Forgot password?
        </a>
      </div>

      {/* Submit Button - FM Morata Red */}
      <button
        type="submit"
        disabled={isLoading}
        className="relative w-full py-3.5 px-4 rounded-xl font-semibold text-white
                   bg-gradient-to-r from-red-600 via-red-500 to-red-600
                   bg-size-200 bg-pos-0 hover:bg-pos-100
                   shadow-lg shadow-red-500/30
                   transition-all duration-500
                   hover:shadow-xl hover:shadow-red-500/50 hover:scale-[1.02]
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                   overflow-hidden group"
        style={{
          backgroundSize: '200% 100%',
          backgroundPosition: isLoading ? '100% 0' : '0% 0'
        }}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Signing in...
          </span>
        ) : (
          <span className="flex items-center justify-center">
            Sign in
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        )}
        
        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            style={{
              animation: 'shimmer 2s infinite',
              backgroundSize: '200% 100%'
            }}
          />
        </div>
      </button>

      {/* Help Text */}
      <div className="text-center">
        <p className="text-white/50 text-xs">
          For technical support, contact IT administrator
        </p>
      </div>
    </form>
  );
};