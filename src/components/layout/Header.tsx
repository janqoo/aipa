import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#F9F8F6]/90 backdrop-blur-md">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-24">
          
          {/* Editorial Logo */}
          <Link to="/" className="flex-shrink-0">
            <span className="text-2xl font-editorial font-semibold tracking-wide text-[#0A1128]">
              AIPA.
            </span>
          </Link>

          {/* Core Navigation (Sans-Serif, Minimal) */}
          <nav className="hidden lg:flex items-center space-x-10 text-[13px] font-medium uppercase tracking-widest text-[#0A1128]/70">
            <Link to="/perfumes" className="hover:text-[#7C3AED] transition-colors">Explore</Link>
            <Link to="/recommendations" className="hover:text-[#7C3AED] transition-colors">Ask AI</Link>
            <Link to="/photo-ai" className="hover:text-[#7C3AED] transition-colors">Photo AI</Link>
            <Link to="/collections" className="hover:text-[#7C3AED] transition-colors">Collections</Link>
          </nav>

          {/* Auth & Profile */}
          <div className="hidden lg:flex items-center space-x-8 text-[13px] font-medium uppercase tracking-widest flex-shrink-0">
            {isAuthenticated ? (
              <div className="flex items-center space-x-8">
                <Link to="/favorites" className="text-[#0A1128]/70 hover:text-[#7C3AED] transition-colors">Favorites</Link>
                <Link to="/profile" className="text-[#0A1128]/70 hover:text-[#7C3AED] transition-colors">Profile</Link>
                <button onClick={handleSignOut} className="text-[#0A1128]/70 hover:text-[#7C3AED] transition-colors">Logout</button>
              </div>
            ) : (
              <div className="flex items-center space-x-8">
                <Link to="/login" className="text-[#0A1128]/70 hover:text-[#7C3AED] transition-colors">Sign In</Link>
                <Link to="/signup" className="text-[#7C3AED] hover:text-[#0A1128] transition-colors">Begin</Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="lg:hidden text-[#0A1128]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 8h16M4 16h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-24 left-0 w-full bg-[#F9F8F6] border-t border-[#0A1128]/10 px-6 py-8 flex flex-col space-y-6 text-sm uppercase tracking-widest font-medium">
            <Link to="/perfumes" onClick={() => setIsMenuOpen(false)}>Explore</Link>
            <Link to="/recommendations" className="text-[#7C3AED]" onClick={() => setIsMenuOpen(false)}>Ask AI</Link>
            <Link to="/photo-ai" onClick={() => setIsMenuOpen(false)}>Photo AI</Link>
            <Link to="/collections" onClick={() => setIsMenuOpen(false)}>Collections</Link>
            <hr className="border-[#0A1128]/10" />
            {isAuthenticated ? (
              <>
                <Link to="/favorites" onClick={() => setIsMenuOpen(false)}>Favorites</Link>
                <Link to="/profile" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                <button onClick={() => { handleSignOut(); setIsMenuOpen(false); }} className="text-left">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                <Link to="/signup" className="text-[#7C3AED]" onClick={() => setIsMenuOpen(false)}>Begin</Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;