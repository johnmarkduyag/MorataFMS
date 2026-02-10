import { useNavigate } from "react-router-dom";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A1929] flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-9xl font-black text-white/10 select-none">404</h1>
      
      <div className="-mt-12 space-y-6 relative z-10">
        <h2 className="text-3xl font-bold text-white tracking-tight">
          Lost Cargo
        </h2>
        <p className="text-white/60 text-lg max-w-sm mx-auto">
          We couldn't find the page or shipment you're looking for.
        </p>

        <button
          onClick={() => navigate("/dashboard", { replace: true })}
          className="inline-flex items-center px-6 py-2.5 rounded-lg font-medium text-white
                     bg-blue-600 hover:bg-blue-500 transition-colors
                     shadow-lg shadow-blue-900/20"
        >
          Return to Dashboard
        </button>
      </div>

      <div className="absolute bottom-8 text-white/20 text-xs">
        F.M. Morata Customs Brokerage
      </div>
    </div>
  );
}
