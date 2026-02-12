import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Default values if user is not logged in
    const userName = user?.name || 'Admin User';
    const userRole = 'Document In Charge';
    const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <div className="min-h-screen bg-black font-sans overflow-x-hidden text-white">
            {/* Navigation Header */}
            <header className="container mx-auto px-6 py-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10">
                        <svg viewBox="0 0 64 64" className="w-full h-full">
                            <circle cx="32" cy="32" r="30" fill="#000000" stroke="#c41e3a" strokeWidth="2" />
                            <path d="M20 32 Q32 20 44 32 Q32 44 20 32" fill="#c41e3a" />
                            <circle cx="32" cy="32" r="8" fill="white" />
                            <path d="M28 28 L36 36 M36 28 L28 36" stroke="#000000" strokeWidth="2" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold leading-none text-white uppercase">F.M. MORATA</h1>
                        <p className="text-[10px] uppercase tracking-tighter text-gray-500 font-medium whitespace-nowrap">customs tracking and file management website</p>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm font-bold text-white leading-tight">{userName}</p>
                        <p className="text-xs text-gray-400">{userRole}</p>
                    </div>
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-sm">
                        {initials}
                    </div>
                </div>

                <div className="md:hidden">
                    {/* Mobile Menu Icon */}
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </div>
            </header>

            {/* Hero Section */}
            <main className="container mx-auto px-4 pb-12">
                <div className="relative rounded-[2.5rem] overflow-hidden min-h-[92vh] flex items-center">
                    {/* Background Image Overlay */}
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
                        style={{
                            backgroundImage: 'url("/assets/landing-hero.jpg")',
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />

                    {/* Hero Content */}
                    <div className="relative z-10 px-8 md:px-16 max-w-4xl text-white">
                        <h1 className="text-4xl md:text-6xl font-bold leading-[1.05] mb-2 tracking-tight uppercase">
                            Fely M. Morata
                        </h1>
                        <h2 className="text-3xl md:text-5xl font-bold leading-[1.05] mb-8 tracking-tight uppercase text-white/90">
                            Customs Brokerage and Law Firm
                        </h2>
                        <p className="text-xl md:text-2xl font-light text-white/80 mb-12 max-w-xl leading-relaxed italic">
                            Your work, your team, your flow — all in one place.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 items-start">
                            <button
                                onClick={() => navigate('/login')}
                                className="px-10 py-5 bg-white text-gray-900 rounded-full text-lg font-bold hover:bg-gray-100 transition-all transform hover:scale-105 active:scale-95 shadow-xl"
                            >
                                Tracking Now
                            </button>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-10 py-5 bg-black/30 backdrop-blur-md border border-white/30 text-white rounded-full text-lg font-semibold hover:bg-black/40 transition-all"
                            >
                                Dashboard
                            </button>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-12 right-12 hidden lg:flex flex-col items-end gap-2 text-white/40 uppercase tracking-widest text-[10px] font-bold">
                        <span>DAVAO CITY, PH</span>
                        <span>EST. 2002</span>
                    </div>

                    {/* Integrated Footer Content - Inside Hero */}
                    <div className="absolute bottom-12 left-12 right-12 flex flex-col md:flex-row justify-between items-end gap-8 z-20">
                        <div className="text-left">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-black mb-2">website owned by</p>
                            <p className="text-lg font-black uppercase tracking-wider text-white">Fely M. Morata</p>
                        </div>

                        <div className="text-right flex flex-col items-end">
                            <p className="text-xs font-bold uppercase tracking-widest text-white mb-2">© 2026 F.M. Morata — All rights reserved</p>
                            <p className="text-[10px] uppercase tracking-[0.15em] text-white/40 font-black">cargo images are designer impressions.</p>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default LandingPage;
