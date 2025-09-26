'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Types and Interfaces
interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BagOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PremiumCardProps {
  className?: string;
}


// Search Overlay Component
const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !isOpen || !inputRef.current) return;
    setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen, mounted]);

  useEffect(() => {
    if (!mounted) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, mounted]);

  return (
    <div className={`search-overlay ${isOpen ? 'active' : ''}`}>
      <div className="search-container">
        <div className="search-input-wrapper">
          <svg className="search-input-icon" viewBox="0 0 15 44" width="15" height="44">
            <path fill="rgba(255,255,255,0.6)" d="M14.298 27.202l-3.87-3.87c0.701-0.929 1.122-2.081 1.122-3.332 0-3.06-2.489-5.55-5.55-5.55s-5.55 2.49-5.55 5.55 2.49 5.55 5.55 5.55c1.251 0 2.403-0.421 3.332-1.122l3.87 3.87c0.151 0.151 0.35 0.228 0.549 0.228s0.398-0.077 0.549-0.228c0.301-0.301 0.301-0.787-0.002-1.096zM1.55 20c0-2.454 1.997-4.45 4.45-4.45s4.45 1.996 4.45 4.45-1.997 4.45-4.45 4.45-4.45-1.996-4.45-4.45z"/>
          </svg>
          <input 
            ref={inputRef}
            type="text" 
            className="search-input" 
            placeholder="Search apple.com"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-close" onClick={onClose}>
            <svg viewBox="0 0 14 44" width="14" height="44">
              <path fill="rgba(255,255,255,0.6)" d="M12.31 12.31l-1.41-1.41L7 14.79l-3.9-3.89-1.41 1.41L5.59 16.2l-3.9 3.9 1.41 1.41L7 17.61l3.9 3.9 1.41-1.41L8.41 16.2z"/>
            </svg>
          </button>
        </div>
        
        <div className="search-content">
          <div className="quick-links">
            <h3 className="quick-links-title">Quick Links</h3>
            <div className="quick-links-list">
              <Link href="#" className="quick-link">
                <svg className="quick-link-icon" viewBox="0 0 16 16">
                  <path fill="currentColor" d="M8 0L0 8l8 8 8-8L8 0zm0 14.5L1.5 8 8 1.5 14.5 8 8 14.5z"/>
                </svg>
                Find a Store
              </Link>
              <Link href="#" className="quick-link">
                <svg className="quick-link-icon" viewBox="0 0 16 16">
                  <path fill="currentColor" d="M8 0L0 8l8 8 8-8L8 0zm0 14.5L1.5 8 8 1.5 14.5 8 8 14.5z"/>
                </svg>
                Linkist Vision Pro
              </Link>
              <Link href="#" className="quick-link">
                <svg className="quick-link-icon" viewBox="0 0 16 16">
                  <path fill="currentColor" d="M8 0L0 8l8 8 8-8L8 0zm0 14.5L1.5 8 8 1.5 14.5 8 8 14.5z"/>
                </svg>
                Card Holders
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .search-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(20px);
          z-index: 10000;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.6, 1);
        }

        .search-overlay.active {
          opacity: 1;
          visibility: visible;
        }

        .search-container {
          max-width: 692px;
          margin: 0 auto;
          padding: 64px 32px 32px;
        }

        .search-input-wrapper {
          position: relative;
          margin-bottom: 40px;
        }

        .search-input-icon {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 24px;
          height: 24px;
          z-index: 1;
        }

        .search-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
          color: rgba(255, 255, 255, 0.92);
          font-size: 40px;
          font-weight: 400;
          padding: 16px 60px 16px 40px;
          outline: none;
          transition: border-color 0.3s ease;
        }

        .search-input:focus {
          border-bottom-color: rgba(255, 255, 255, 0.6);
        }

        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .search-close {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
          transition: opacity 0.3s ease;
        }

        .search-close:hover {
          opacity: 0.7;
        }

        .search-close svg {
          width: 20px;
          height: 20px;
        }

        .search-content {
          margin-top: 60px;
        }

        .quick-links-title {
          color: rgba(255, 255, 255, 0.6);
          font-size: 12px;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 24px;
          margin-top: 0;
        }

        .quick-links-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .quick-link {
          display: flex;
          align-items: center;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          font-size: 14px;
          font-weight: 400;
          padding: 8px 0;
          transition: color 0.3s ease;
        }

        .quick-link:hover {
          color: rgba(255, 255, 255, 1);
        }

        .quick-link-icon {
          width: 6px;
          height: 6px;
          margin-right: 12px;
          color: rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </div>
  );
};

// Bag Overlay Component
const BagOverlay: React.FC<BagOverlayProps> = ({ isOpen, onClose }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, mounted]);

  return (
    <div className={`bag-overlay ${isOpen ? 'active' : ''}`} onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="bag-container">
        <div className="bag-header">
          <h2 className="bag-title">Your Bag is empty.</h2>
          <button className="bag-close" onClick={onClose}>
            <svg viewBox="0 0 14 44" width="14" height="44">
              <path fill="rgba(255,255,255,0.6)" d="M12.31 12.31l-1.41-1.41L7 14.79l-3.9-3.89-1.41 1.41L5.59 16.2l-3.9 3.9 1.41 1.41L7 17.61l3.9 3.9 1.41-1.41L8.41 16.2z"/>
            </svg>
          </button>
        </div>
        
        <div className="bag-content">
          <p className="bag-signin-text">
            <Link href="#" className="bag-signin-link">Sign in</Link> to see if you have any saved items
          </p>
          
          <div className="bag-profile-section">
            <h3 className="bag-profile-title">My Profile</h3>
            <div className="bag-profile-links">
              <Link href="#" className="bag-profile-link">
                <svg className="bag-profile-icon" viewBox="0 0 16 16" width="16" height="16">
                  <path fill="currentColor" d="M8 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM2 13a6 6 0 1 1 12 0v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1z"/>
                </svg>
                Orders
              </Link>
              <Link href="#" className="bag-profile-link">
                <svg className="bag-profile-icon" viewBox="0 0 16 16" width="16" height="16">
                  <path fill="currentColor" d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 6L8 9.5 4.5 6 8 2.5 11.5 6z"/>
                </svg>
                Your Saves
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .bag-overlay {
          position: fixed;
          top: 0;
          right: 0;
          width: 375px;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(20px);
          z-index: 10000;
          transform: translateX(100%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.6, 1);
        }

        .bag-overlay.active {
          transform: translateX(0);
        }

        .bag-container {
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 44px 24px 24px;
        }

        .bag-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
          padding-top: 20px;
        }

        .bag-title {
          color: rgba(255, 255, 255, 0.92);
          font-size: 32px;
          font-weight: 600;
          margin: 0;
          line-height: 1.125;
        }

        .bag-close {
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
          margin-top: -8px;
          margin-right: -8px;
          transition: opacity 0.3s ease;
        }

        .bag-close:hover {
          opacity: 0.7;
        }

        .bag-close svg {
          width: 20px;
          height: 20px;
        }

        .bag-content {
          flex: 1;
        }

        .bag-signin-text {
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
          font-weight: 400;
          margin-bottom: 48px;
          line-height: 1.42857;
        }

        .bag-signin-link {
          color: #0071e3;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .bag-signin-link:hover {
          color: #0077ed;
        }

        .bag-profile-section {
          margin-top: 48px;
        }

        .bag-profile-title {
          color: rgba(255, 255, 255, 0.6);
          font-size: 12px;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 24px;
          margin-top: 0;
        }

        .bag-profile-links {
          display: flex;
          flex-direction: column;
        }

        .bag-profile-link {
          display: flex;
          align-items: center;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          font-size: 14px;
          font-weight: 400;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          transition: color 0.3s ease;
        }

        .bag-profile-link:hover {
          color: rgba(255, 255, 255, 1);
        }

        .bag-profile-link:last-child {
          border-bottom: none;
        }

        .bag-profile-icon {
          width: 16px;
          height: 16px;
          margin-right: 12px;
          color: rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </div>
  );
};

// Navigation Component
const Navigation: React.FC = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);

  return (
    <>
      <nav className="apple-nav">
        <div className="nav-container">
          <ul className="nav-list">
            <li className="nav-item">
              <Link href="#" className="nav-link apple-logo-link">
                Linkist
              </Link>
            </li>
            <li className="nav-item"><Link href="#" className="nav-link">Cards</Link></li>
            <li className="nav-item"><Link href="#" className="nav-link">Banking</Link></li>
            <li className="nav-item"><Link href="#" className="nav-link">Investments</Link></li>
            <li className="nav-item"><Link href="#" className="nav-link">Loans</Link></li>
            <li className="nav-item"><Link href="#" className="nav-link">Business</Link></li>
            <li className="nav-item"><Link href="#" className="nav-link">Security</Link></li>
            <li className="nav-item"><Link href="#" className="nav-link">Rewards</Link></li>
            <li className="nav-item"><Link href="#" className="nav-link">Support</Link></li>
            <li className="nav-item"><Link href="#" className="nav-link">About</Link></li>
            <li className="nav-item"><Link href="#" className="nav-link">Contact</Link></li>
            <li className="nav-item nav-search">
              <button className="nav-link" onClick={() => setSearchOpen(true)}>
                <svg className="search-icon" viewBox="0 0 15 44" width="15" height="44">
                  <path fill="rgba(255,255,255,0.8)" d="M14.298 27.202l-3.87-3.87c0.701-0.929 1.122-2.081 1.122-3.332 0-3.06-2.489-5.55-5.55-5.55s-5.55 2.49-5.55 5.55 2.49 5.55 5.55 5.55c1.251 0 2.403-0.421 3.332-1.122l3.87 3.87c0.151 0.151 0.35 0.228 0.549 0.228s0.398-0.077 0.549-0.228c0.301-0.301 0.301-0.787-0.002-1.096zM1.55 20c0-2.454 1.997-4.45 4.45-4.45s4.45 1.996 4.45 4.45-1.997 4.45-4.45 4.45-4.45-1.996-4.45-4.45z"/>
                </svg>
              </button>
            </li>
            <li className="nav-item nav-bag">
              <button className="nav-link" onClick={() => setBagOpen(true)}>
                <svg className="bag-icon" viewBox="0 0 14 44" width="14" height="44">
                  <path fill="rgba(255,255,255,0.8)" d="m11.3535 16.0283h-1.0205v-5.05c0-1.6577-1.3428-3-3-3s-3 1.3423-3 3v5.05h-1.0205c-.5563 0-1.0072.4512-1.0072 1.0075v9.9519c0 .5563.4509 1.0123 1.0072 1.0123h8.0205c.5563 0 1.0072-.456 1.0072-1.0123v-9.9519c0-.5563-.4509-1.0075-1.0072-1.0075zm-6.0205-5.05c0-1.1040.8972-2 2-2s2 .8960 2 2v5.05h-4z"/>
                </svg>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <BagOverlay isOpen={bagOpen} onClose={() => setBagOpen(false)} />

      <style jsx>{`
        .apple-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.72);
          backdrop-filter: saturate(180%) blur(20px);
          z-index: 9999;
          height: 44px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.18);
        }

        .nav-container {
          max-width: 1024px;
          margin: 0 auto;
          height: 100%;
        }
        
        .nav-list {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 100%;
          margin: 0;
          padding: 0 22px;
          list-style: none;
        }
        
        .nav-item {
          flex: 0 1 auto;
        }
        
        .nav-link {
          display: block;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          font-size: 12px;
          font-weight: 400;
          letter-spacing: -0.01em;
          line-height: 1.33337;
          padding: 0 8px;
          transition: color 0.3s cubic-bezier(0.4, 0, 0.6, 1);
          background: none;
          border: none;
          cursor: pointer;
        }
        
        .nav-link:hover {
          color: rgba(255, 255, 255, 1);
        }
        
        .apple-logo-link {
          padding: 0 8px 0 0;
        }
        
        .search-icon, .bag-icon {
          width: 15px;
          height: 44px;
        }
        
        .nav-search, .nav-bag {
          padding: 0 4px;
        }

        .bag-icon {
          width: 16px;
          height: 44px;
        }
      `}</style>
    </>
  );
};

// Premium Card Component
const PremiumCard: React.FC<PremiumCardProps> = ({ className = '' }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateY = mouseX / 10;
    const rotateX = -mouseY / 10;
    
    cardRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
  }, []);

  const handleClick = useCallback(() => {
    if (!cardRef.current) return;
    
    // Trigger premium card animation
    cardRef.current.style.animation = 'none';
    cardRef.current.offsetHeight; // Trigger reflow
    cardRef.current.style.animation = 'cardActivation 1.5s ease-out';
    
    setTimeout(() => {
      if (cardRef.current) {
        cardRef.current.style.animation = '';
      }
    }, 1500);
  }, []);

  return (
    <div className={`premium-card ${className}`}>
      <div 
        ref={cardRef}
        className="premium-card-inner"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => {}}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <div className="card-layer card-layer-1"></div>
        <div className="card-layer card-layer-2"></div>
        <div className="card-layer card-layer-3"></div>
        <div className="card-chip"></div>
        <div className="card-bank">DOSH</div>
        <div className="card-number">0000 0000 0000 0000</div>
        <div className="card-expiry">Expiry: 01/22</div>
        <div className="card-cvv">CVV: 000</div>
        <div className="card-name">Mr Luke Bailey</div>
      </div>

      <style jsx>{`
        .premium-card {
          display: flex;
          position: relative;
          flex-direction: column;
          width: 400px;
          height: 250px;
          border-radius: 15px;
          background: linear-gradient(135deg, 
            #d4af37 0%, 
            #f4d03f 15%, 
            #e8c547 30%,
            #cd853f 50%,
            #b8860b 70%,
            #daa520 85%,
            #cd853f 100%);
          margin: 0;
          padding: 40px;
          transition: all 2s ease;
          transform-style: preserve-3d;
          animation: card-isometric 10s infinite;
          cursor: pointer;
          box-shadow: 
            0 25px 50px rgba(205, 133, 63, 0.3),
            0 15px 25px rgba(212, 175, 55, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .premium-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .card-layer {
          position: absolute;
          border-radius: 15px;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
        }

        .card-layer-1 {
          transform: translateX(0px) translateY(0) translateZ(30px);
          background: rgba(212, 175, 55, 0.6);
          border: 2px solid rgba(218, 165, 32, 0.5);
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
        }

        .card-layer-2 {
          transform: translateX(0px) translateY(0) translateZ(60px);
          background: rgba(205, 133, 63, 0.4);
          border: 2px solid rgba(218, 165, 32, 0.5);
          box-shadow: 0 0 15px rgba(205, 133, 63, 0.2);
        }

        .card-layer-3 {
          transform: translateX(0px) translateY(0) translateZ(90px);
          background: rgba(184, 134, 11, 0.2);
          border: 2px solid rgba(218, 165, 32, 0.5);
          box-shadow: 0 0 10px rgba(184, 134, 11, 0.1);
        }

        .card-bank {
          position: absolute;
          top: 40px;
          right: 40px;
          text-align: right;
          font-size: 3em;
          font-weight: bold;
          line-height: 1em;
          color: #2c1810;
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
          transform: translateX(0px) translateY(0px) translateZ(65px);
        }

        .card-chip {
          position: absolute;
          left: 40px;
          top: 40px;
          width: 60px;
          height: 40px;
          border-radius: 15px;
          border: none;
          background-image: url('data:image/svg+xml,%3Csvg%20id%3D%22Layer_1%22%20data-name%3D%22Layer%201%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2082.6%2054.2%22%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill%3A%23f9e75e%7D%3C%2Fstyle%3E%3C%2Fdefs%3E%3Ctitle%3Ecardchip%3C%2Ftitle%3E%3Cpath%20class%3D%22cls-1%22%20d%3D%22M82.6%2011.7V3.5A3.54%203.54%200%200%200%2079.1%200H56l-4.4%204.4a1.49%201.49%200%200%201-.9.4%201.22%201.22%200%200%201-.9-.4%201.27%201.27%200%200%201%200-1.8L52.4%200H30.2l11.1%2011.2%203.8-3.8a1.27%201.27%200%200%201%201.8%201.8l-4.4%204.4v6.6a1.32%201.32%200%200%201-1.3%201.3H33v11.7h16.4V17.7a1.22%201.22%200%200%201%20.4-.9l4.7-4.7a1.49%201.49%200%200%201%20.9-.4z%22%2F%3E%3Cpath%20class%3D%22cls-1%22%20d%3D%22M82.6%2025.9V14.2H56l-4%204v7.7h30.6zM82.6%2040V28.4H52V36l4%204h26.6z%22%2F%3E%3Cpath%20class%3D%22cls-1%22%20d%3D%22M55.5%2042.5a1.22%201.22%200%200%201-.9-.4l-4.7-4.7a1.49%201.49%200%200%201-.4-.9v-1.1h-6.9v5.3L56%2054.1h23.1a3.54%203.54%200%200%200%203.5-3.5v-8.2H55.5z%22%2F%3E%3Cpath%20class%3D%22cls-1%22%20d%3D%22M30.2%2054.2h22.3L41.3%2043l-3.8%203.8a1.49%201.49%200%200%201-.9.4%201.22%201.22%200%200%201-.9-.4%201.27%201.27%200%200%201%200-1.8l4.4-4.4v-5.3h-6.9v1.1a1.22%201.22%200%200%201-.4.9L28.1%2042a1.49%201.49%200%200%201-.9.4H.1v8.2a3.54%203.54%200%200%200%203.5%203.5h23.1l4.4-4.4a1.27%201.27%200%200%201%201.8%201.8z%22%2F%3E%3Cpath%20class%3D%22cls-1%22%20d%3D%22M.1%2028.4V40h26.5l4-4v-7.6H.1zM26.6%2014.2H.1v11.7h30.5v-7.7l-4-4z%22%2F%3E%3Cpath%20class%3D%22cls-1%22%20d%3D%22M26.6%200H3.5A3.54%203.54%200%200%200%200%203.5v8.2h27.1a1.22%201.22%200%200%201%20.9.4l4.7%204.7a1.49%201.49%200%200%201%20.4.9v1.1H40v-5.3z%22%2F%3E%3C%2Fsvg%3E');
          transform: translateX(0px) translateY(0px) translateZ(65px);
        }

        .card-number {
          color: #2c1810;
          width: 100%;
          text-align: left;
          font-size: 2.19em;
          margin: auto;
          font-family: 'Courier New', monospace;
          font-weight: 500;
          letter-spacing: 2px;
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
          transform: translateX(0px) translateY(0px) translateZ(95px);
        }

        .card-name {
          position: absolute;
          bottom: 40px;
          left: 40px;
          text-transform: uppercase;
          font-size: 1.5em;
          margin-top: 20px;
          color: #2c1810;
          font-family: 'Courier New', monospace;
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
          transform: translateX(0px) translateY(0px) translateZ(35px);
        }

        .card-expiry {
          position: absolute;
          bottom: 90px;
          left: 40px;
          text-transform: uppercase;
          color: #2c1810;
          font-family: 'Courier New', monospace;
          font-size: 14px;
          font-weight: 500;
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
          transform: translateX(0px) translateY(0px) translateZ(35px);
        }

        .card-cvv {
          position: absolute;
          bottom: 90px;
          left: 240px;
          text-transform: uppercase;
          color: #2c1810;
          font-family: 'Courier New', monospace;
          font-size: 14px;
          font-weight: 500;
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
          transform: translateX(0px) translateY(0px) translateZ(35px);
        }

        @keyframes card-isometric {
          0% {
            transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
          }
          50% {
            transform: rotateX(60deg) rotateY(0deg) rotateZ(-45deg);
          }
          100% {
            transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
          }
        }

        @keyframes cardActivation {
          0% { 
            transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1); 
            filter: brightness(1);
          }
          25% { 
            transform: rotateX(30deg) rotateY(15deg) rotateZ(-10deg) scale(1.1); 
            filter: brightness(1.3);
          }
          50% { 
            transform: rotateX(60deg) rotateY(0deg) rotateZ(-45deg) scale(1.05); 
            filter: brightness(1.5);
          }
          75% { 
            transform: rotateX(30deg) rotateY(-15deg) rotateZ(-10deg) scale(1.1); 
            filter: brightness(1.3);
          }
          100% { 
            transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1); 
            filter: brightness(1);
          }
        }

        @media (max-width: 768px) {
          .premium-card {
            width: 350px;
            height: 220px;
            padding: 30px;
          }

          .card-bank {
            font-size: 2.5em;
          }

          .card-number {
            font-size: 1.8em;
          }
        }

        @media (max-width: 480px) {
          .premium-card {
            width: 300px;
            height: 190px;
            padding: 25px;
          }

          .card-bank {
            font-size: 2em;
          }

          .card-number {
            font-size: 1.5em;
          }
        }
      `}</style>
    </div>
  );
};

// Highlights Section Component
const HighlightsSection: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Matrix Rain Effect
    const matrixRain = document.getElementById('matrixRain');
    if (matrixRain) {
      const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
      
      for (let i = 0; i < 50; i++) {
        const drop = document.createElement('div');
        drop.className = 'matrix-drop';
        drop.style.left = Math.random() * 100 + '%';
        drop.style.animationDelay = Math.random() * 2 + 's';
        drop.style.animationDuration = (Math.random() * 3 + 2) + 's';
        drop.textContent = characters[Math.floor(Math.random() * characters.length)];
        matrixRain.appendChild(drop);
      }
    }

    // Particle Constellation
    const constellation = document.getElementById('particleConstellation');
    if (constellation) {
      for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 4 + 's';
        constellation.appendChild(particle);
      }
    }
  }, [mounted]);

  return (
    <section className="highlights-section reveal">
      {/* Matrix Rain Background */}
      <div className="matrix-rain" id="matrixRain"></div>
      
      {/* Electromagnetic Field Lines */}
      <div className="electromagnetic-field">
        <svg className="field-lines" viewBox="0 0 1200 800">
          <path className="field-line field-line-1" d="M100,400 Q300,200 500,400 T900,400" />
          <path className="field-line field-line-2" d="M200,500 Q400,300 600,500 T1000,500" />
          <path className="field-line field-line-3" d="M150,300 Q350,100 550,300 T950,300" />
        </svg>
      </div>
      
      {/* Particle Constellation */}
      <div className="particle-constellation" id="particleConstellation"></div>
      
      <div className="section-header">
        <h2 className="section-title">Get the benefits.</h2>
        <p className="section-subtitle floating-subtitle">Premium aluminum construction for exceptional banking capability.</p>
      </div>
      
      {/* Hero Image Section */}
      <div className="hero-image-container">
        <img src="/linkist.png" alt="Linkist Card" className="hero-image" />
      </div>

      <style jsx>{`
        .highlights-section {
          min-height: 100vh;
          background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%);
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 100px 20px 50px;
          overflow: hidden;
        }

        .matrix-rain {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .matrix-rain :global(.matrix-drop) {
          position: absolute;
          color: #00ff41;
          font-family: 'Courier New', monospace;
          font-size: 14px;
          animation: matrixFall linear infinite;
          opacity: 0.7;
        }

        @keyframes matrixFall {
          0% {
            transform: translateY(-100vh);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }

        .electromagnetic-field {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
        }

        .field-lines {
          width: 100%;
          height: 100%;
        }

        .field-line {
          fill: none;
          stroke: #007aff;
          stroke-width: 1;
          opacity: 0.3;
          animation: fieldPulse 3s ease-in-out infinite;
        }

        .field-line-1 {
          animation-delay: 0s;
        }

        .field-line-2 {
          animation-delay: 1s;
        }

        .field-line-3 {
          animation-delay: 2s;
        }

        @keyframes fieldPulse {
          0%, 100% {
            opacity: 0.3;
            stroke-width: 1;
          }
          50% {
            opacity: 0.8;
            stroke-width: 2;
          }
        }

        .particle-constellation {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 3;
        }

        .particle-constellation :global(.particle) {
          position: absolute;
          width: 3px;
          height: 3px;
          background: #ffffff;
          border-radius: 50%;
          animation: particleFloat 4s ease-in-out infinite;
        }

        @keyframes particleFloat {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-20px) scale(1.2);
            opacity: 1;
          }
        }

        .section-header {
          text-align: center;
          z-index: 10;
          position: relative;
          margin-bottom: 60px;
        }

        .section-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 20px;
          background: linear-gradient(135deg, #ffffff 0%, #007aff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .section-subtitle {
          font-size: clamp(1.1rem, 2vw, 1.4rem);
          color: #a1a1aa;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .floating-subtitle {
          animation: floatAnimation 3s ease-in-out infinite;
        }

        @keyframes floatAnimation {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .hero-image-container {
          position: relative;
          z-index: 10;
          max-width: 800px;
          width: 100%;
        }

        .hero-image {
          width: 100%;
          height: auto;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 122, 255, 0.3);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .hero-image:hover {
          transform: scale(1.05);
          box-shadow: 0 30px 60px rgba(0, 122, 255, 0.5);
        }

        @media (max-width: 768px) {
          .highlights-section {
            padding: 80px 15px 30px;
          }
          
          .section-header {
            margin-bottom: 40px;
          }
        }
      `}</style>
    </section>
  );
};

// Simple Design Section Component
const SimpleDesignSection: React.FC = () => {
  return (
    <section className="design-section reveal">
      <div className="design-content">
        <div className="design-header">
          <p className="design-label">Design</p>
          <h2 className="design-title">Linkist Card.<br />Makes a strong case for itself.</h2>
          <p className="design-description">
            Introducing Linkist Card, designed from the inside out to be the most powerful payment card ever made. 
            At the core of the new design is a premium aluminum construction that maximizes security, durability, and style.
          </p>
        </div>
        
        <div className="linkist-card-3d">
          <div className="linkist-glow"></div>
          <div className="linkist-card-inner">
            <div className="linkist-card-front">
              <div className="linkist-chip"></div>
              <div className="linkist-logo">
                <div className="logo-icon">
                  <div className="link-circle"></div>
                  <div className="link-circle"></div>
                </div>
                <span className="logo-text">Linkist</span>
              </div>
            </div>
            <div className="linkist-card-back">
              <div>Premium Banking Experience</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .design-section {
          min-height: 100vh;
          background: linear-gradient(180deg, #000000 0%, #1a1a1a 50%, #000000 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 100px 20px;
          position: relative;
        }

        .design-content {
          max-width: 1200px;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .design-header {
          color: #ffffff;
        }

        .design-label {
          font-size: 1rem;
          color: #007aff;
          font-weight: 500;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .design-title {
          font-size: clamp(2.5rem, 4vw, 3.5rem);
          font-weight: 700;
          margin-bottom: 30px;
          line-height: 1.2;
          background: linear-gradient(135deg, #ffffff 0%, #007aff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .design-description {
          font-size: 1.2rem;
          line-height: 1.7;
          color: #a1a1aa;
          max-width: 500px;
        }

        .linkist-card-3d {
          position: relative;
          width: 400px;
          height: 250px;
          perspective: 1000px;
          margin: 0 auto;
        }

        .linkist-glow {
          position: absolute;
          top: -20px;
          left: -20px;
          right: -20px;
          bottom: -20px;
          background: radial-gradient(circle, rgba(0, 122, 255, 0.3) 0%, transparent 70%);
          border-radius: 30px;
          animation: glowPulse 3s ease-in-out infinite;
        }

        @keyframes glowPulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.05);
          }
        }

        .linkist-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s;
          transform-style: preserve-3d;
          animation: cardFloat 4s ease-in-out infinite;
        }

        @keyframes cardFloat {
          0%, 100% {
            transform: rotateY(5deg) rotateX(5deg) translateY(0px);
          }
          50% {
            transform: rotateY(-5deg) rotateX(-5deg) translateY(-10px);
          }
        }

        .linkist-card-front,
        .linkist-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 15px;
          background: linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 25px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .linkist-card-back {
          transform: rotateY(180deg);
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          color: #ffffff;
          font-weight: 500;
        }

        .linkist-chip {
          width: 40px;
          height: 30px;
          background: linear-gradient(145deg, #ffd700, #ffed4e);
          border-radius: 5px;
          position: relative;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .linkist-chip::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 30px;
          height: 20px;
          background: repeating-linear-gradient(
            90deg,
            #daa520 0px,
            #daa520 2px,
            #ffd700 2px,
            #ffd700 4px
          );
          border-radius: 2px;
        }

        .linkist-logo {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-top: auto;
        }

        .logo-icon {
          display: flex;
          gap: 5px;
        }

        .link-circle {
          width: 20px;
          height: 20px;
          border: 2px solid #007aff;
          border-radius: 50%;
          animation: linkPulse 2s ease-in-out infinite;
        }

        .link-circle:nth-child(2) {
          animation-delay: 0.5s;
        }

        @keyframes linkPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.7;
          }
        }

        .logo-text {
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 1px;
        }

        @media (max-width: 768px) {
          .design-content {
            grid-template-columns: 1fr;
            gap: 60px;
            text-align: center;
          }

          .linkist-card-3d {
            width: 300px;
            height: 188px;
          }

          .design-section {
            padding: 80px 15px;
          }
        }
      `}</style>
    </section>
  );
};

// Design Section Component
const DesignSection: React.FC = () => {
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Auto flip card every 5 seconds
    const flipInterval = setInterval(() => {
      setIsCardFlipped(prev => !prev);
    }, 5000);

    // Add particle effects
    const createParticles = () => {
      const particleContainer = document.getElementById('designParticles');
      if (particleContainer) {
        for (let i = 0; i < 20; i++) {
          const particle = document.createElement('div');
          particle.className = 'design-particle';
          particle.style.left = Math.random() * 100 + '%';
          particle.style.top = Math.random() * 100 + '%';
          particle.style.animationDelay = Math.random() * 4 + 's';
          particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
          particleContainer.appendChild(particle);
        }
      }
    };

    createParticles();

    return () => {
      clearInterval(flipInterval);
    };
  }, [mounted]);

  const handleCardClick = () => {
    setIsCardFlipped(!isCardFlipped);
  };

  const handleCardHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateY = (mouseX / rect.width) * 30;
    const rotateX = -(mouseY / rect.height) * 30;
    
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  };

  const handleCardLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    }
  };

  return (
    <section className="design-section reveal">
      {/* Animated Background Particles */}
      <div className="design-particles" id="designParticles"></div>
      
      {/* Geometric Background Elements */}
      <div className="geometric-bg">
        <div className="geo-shape geo-circle"></div>
        <div className="geo-shape geo-triangle"></div>
        <div className="geo-shape geo-square"></div>
      </div>

      <div className="design-content">
        <div className="design-header">
          <p className="design-label">🎨 Revolutionary Design</p>
          <h2 className="design-title">
            Linkist Card.<br />
            <span className="title-highlight">Redefining Premium Banking</span>
          </h2>
          <p className="design-description">
            Experience the future of financial technology with Linkist Card. Crafted with aerospace-grade aluminum and 
            featuring quantum-encrypted security, this isn't just a payment card—it's a statement of innovation and sophistication.
          </p>
          
          {/* New Feature List */}
          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-icon">🔒</div>
              <span>Military-grade encryption</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <span>Lightning-fast transactions</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🌟</div>
              <span>Premium rewards program</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🌍</div>
              <span>Global acceptance</span>
            </div>
          </div>

          {/* Interactive Controls */}
          <div className="card-controls">
            <button 
              className={`control-btn ${!isCardFlipped ? 'active' : ''}`}
              onClick={() => setIsCardFlipped(false)}
            >
              Front View
            </button>
            <button 
              className={`control-btn ${isCardFlipped ? 'active' : ''}`}
              onClick={() => setIsCardFlipped(true)}
            >
              Back View
            </button>
          </div>
        </div>
        
        <div className="linkist-card-3d-container">
          {/* Enhanced 3D Card */}
          <div 
            ref={cardRef}
            className="linkist-card-3d"
            onMouseMove={handleCardHover}
            onMouseLeave={handleCardLeave}
            onClick={handleCardClick}
          >
            {/* Multiple Glow Layers */}
            <div className="linkist-glow primary-glow"></div>
            <div className="linkist-glow secondary-glow"></div>
            <div className="linkist-glow accent-glow"></div>
            
            <div className={`linkist-card-inner ${isCardFlipped ? 'flipped' : ''}`}>
              <div className="linkist-card-front">
                {/* Enhanced Chip */}
                <div className="linkist-chip">
                  <div className="chip-inner"></div>
                  <div className="chip-contacts"></div>
                </div>
                
                {/* NFC Symbol */}
                <div className="nfc-symbol">
                  <div className="nfc-wave"></div>
                  <div className="nfc-wave"></div>
                  <div className="nfc-wave"></div>
                </div>
                
                {/* Enhanced Logo */}
                <div className="linkist-logo">
                  <div className="logo-icon">
                    <div className="link-circle primary"></div>
                    <div className="link-circle secondary"></div>
                    <div className="connecting-line"></div>
                  </div>
                  <span className="logo-text">Linkist</span>
                  <span className="logo-tagline">Premium</span>
                </div>
                
                {/* Card Number */}
                <div className="card-number">
                  <span className="number-group">4829</span>
                  <span className="number-group">****</span>
                  <span className="number-group">****</span>
                  <span className="number-group">2025</span>
                </div>
                
                {/* Holographic Pattern */}
                <div className="holographic-pattern"></div>
              </div>
              
              <div className="linkist-card-back">
                <div className="magnetic-stripe"></div>
                <div className="signature-panel">
                  <span>Authorized Signature</span>
                </div>
                <div className="security-features">
                  <div className="cvv-section">
                    <span className="cvv-label">CVV</span>
                    <span className="cvv-number">***</span>
                  </div>
                  <div className="bank-info">
                    <span>Linkist Bank</span>
                    <span>Member FDIC</span>
                  </div>
                </div>
                <div className="back-pattern"></div>
              </div>
            </div>
            
            {/* Card Reflection */}
            <div className="card-reflection"></div>
          </div>
          
          {/* Floating Elements */}
          <div className="floating-elements">
            <div className="floating-icon icon-security">🛡️</div>
            <div className="floating-icon icon-speed">⚡</div>
            <div className="floating-icon icon-global">🌍</div>
            <div className="floating-icon icon-premium">💎</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .design-section {
          min-height: 100vh;
          background: linear-gradient(135deg, #000000 0%, #0f0f23 25%, #1a1a2e 50%, #16213e 75%, #000000 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 100px 20px;
          position: relative;
          overflow: hidden;
        }

        .design-particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .design-particles :global(.design-particle) {
          position: absolute;
          width: 4px;
          height: 4px;
          background: linear-gradient(45deg, #007aff, #00ff87);
          border-radius: 50%;
          animation: particleDrift linear infinite;
        }

        @keyframes particleDrift {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }

        .geometric-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
        }

        .geo-shape {
          position: absolute;
          opacity: 0.1;
          animation: geometricFloat 8s ease-in-out infinite;
        }

        .geo-circle {
          width: 200px;
          height: 200px;
          border: 2px solid #007aff;
          border-radius: 50%;
          top: 20%;
          right: 10%;
        }

        .geo-triangle {
          width: 0;
          height: 0;
          border-left: 75px solid transparent;
          border-right: 75px solid transparent;
          border-bottom: 130px solid #00ff87;
          top: 60%;
          left: 5%;
          animation-delay: 2s;
        }

        .geo-square {
          width: 100px;
          height: 100px;
          background: linear-gradient(45deg, #ff0080, #ff8c00);
          transform: rotate(45deg);
          bottom: 20%;
          right: 20%;
          animation-delay: 4s;
        }

        @keyframes geometricFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(180deg);
          }
        }

        .design-content {
          max-width: 1400px;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 100px;
          align-items: center;
          z-index: 10;
          position: relative;
        }

        .design-header {
          color: #ffffff;
        }

        .design-label {
          font-size: 1.1rem;
          color: #007aff;
          font-weight: 600;
          margin-bottom: 25px;
          text-transform: uppercase;
          letter-spacing: 3px;
          animation: labelGlow 2s ease-in-out infinite alternate;
        }

        @keyframes labelGlow {
          0% {
            text-shadow: 0 0 10px rgba(0, 122, 255, 0.5);
          }
          100% {
            text-shadow: 0 0 20px rgba(0, 122, 255, 0.8);
          }
        }

        .design-title {
          font-size: clamp(2.8rem, 5vw, 4.2rem);
          font-weight: 800;
          margin-bottom: 40px;
          line-height: 1.1;
          background: linear-gradient(135deg, #ffffff 0%, #007aff 50%, #00ff87 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: titleShimmer 3s ease-in-out infinite;
        }

        .title-highlight {
          display: block;
          background: linear-gradient(135deg, #ff0080 0%, #ff8c00 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: 0.8em;
          margin-top: 10px;
        }

        @keyframes titleShimmer {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .design-description {
          font-size: 1.25rem;
          line-height: 1.8;
          color: #b8b8b8;
          max-width: 550px;
          margin-bottom: 40px;
        }

        .feature-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 40px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(0, 122, 255, 0.2);
          transition: all 0.3s ease;
        }

        .feature-item:hover {
          background: rgba(0, 122, 255, 0.1);
          border-color: rgba(0, 122, 255, 0.5);
          transform: translateY(-2px);
        }

        .feature-icon {
          font-size: 1.5rem;
          animation: iconBounce 2s ease-in-out infinite;
        }

        .feature-item:nth-child(2) .feature-icon {
          animation-delay: 0.5s;
        }

        .feature-item:nth-child(3) .feature-icon {
          animation-delay: 1s;
        }

        .feature-item:nth-child(4) .feature-icon {
          animation-delay: 1.5s;
        }

        @keyframes iconBounce {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }

        .card-controls {
          display: flex;
          gap: 15px;
          margin-top: 30px;
        }

        .control-btn {
          padding: 12px 24px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(0, 122, 255, 0.3);
          border-radius: 25px;
          color: #ffffff;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .control-btn:hover {
          background: rgba(0, 122, 255, 0.2);
          border-color: rgba(0, 122, 255, 0.6);
          transform: translateY(-2px);
        }

        .control-btn.active {
          background: linear-gradient(135deg, #007aff, #00ff87);
          border-color: transparent;
          box-shadow: 0 5px 15px rgba(0, 122, 255, 0.4);
        }

        .linkist-card-3d-container {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .linkist-card-3d {
          position: relative;
          width: 450px;
          height: 280px;
          perspective: 1200px;
          margin: 0 auto;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .primary-glow {
          position: absolute;
          top: -30px;
          left: -30px;
          right: -30px;
          bottom: -30px;
          background: radial-gradient(circle, rgba(0, 122, 255, 0.4) 0%, transparent 70%);
          border-radius: 35px;
          animation: primaryGlow 3s ease-in-out infinite;
        }

        .secondary-glow {
          position: absolute;
          top: -20px;
          left: -20px;
          right: -20px;
          bottom: -20px;
          background: radial-gradient(circle, rgba(0, 255, 135, 0.3) 0%, transparent 60%);
          border-radius: 30px;
          animation: secondaryGlow 2s ease-in-out infinite reverse;
        }

        .accent-glow {
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          background: radial-gradient(circle, rgba(255, 0, 128, 0.2) 0%, transparent 50%);
          border-radius: 25px;
          animation: accentGlow 4s ease-in-out infinite;
        }

        @keyframes primaryGlow {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1) rotate(0deg);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1) rotate(180deg);
          }
        }

        @keyframes secondaryGlow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1.05) rotate(0deg);
          }
          50% {
            opacity: 0.6;
            transform: scale(0.95) rotate(-180deg);
          }
        }

        @keyframes accentGlow {
          0%, 100% {
            opacity: 0.2;
            transform: scale(0.9) rotate(0deg);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.15) rotate(360deg);
          }
        }

        .linkist-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.8s cubic-bezier(0.23, 1, 0.320, 1);
          transform-style: preserve-3d;
        }

        .linkist-card-inner.flipped {
          transform: rotateY(180deg);
        }

        .linkist-card-front,
        .linkist-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 20px;
          background: linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 50%, #1a1a2e 100%);
          border: 2px solid rgba(0, 122, 255, 0.3);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 30px;
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          overflow: hidden;
        }

        .linkist-card-back {
          transform: rotateY(180deg);
          background: linear-gradient(135deg, #2a2a3e 0%, #1e1e2e 50%, #2a2a3e 100%);
        }

        .linkist-chip {
          width: 50px;
          height: 38px;
          background: linear-gradient(145deg, #ffd700, #ffed4e, #daa520);
          border-radius: 8px;
          position: relative;
          box-shadow: 
            inset 0 2px 4px rgba(0, 0, 0, 0.3),
            0 4px 8px rgba(255, 215, 0, 0.3);
          animation: chipGlow 3s ease-in-out infinite;
        }

        @keyframes chipGlow {
          0%, 100% {
            box-shadow: 
              inset 0 2px 4px rgba(0, 0, 0, 0.3),
              0 4px 8px rgba(255, 215, 0, 0.3);
          }
          50% {
            box-shadow: 
              inset 0 2px 4px rgba(0, 0, 0, 0.3),
              0 4px 15px rgba(255, 215, 0, 0.6);
          }
        }

        .chip-inner {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 35px;
          height: 25px;
          background: repeating-linear-gradient(
            90deg,
            #daa520 0px,
            #daa520 2px,
            #ffd700 2px,
            #ffd700 4px
          );
          border-radius: 3px;
        }

        .chip-contacts {
          position: absolute;
          bottom: 5px;
          left: 50%;
          transform: translateX(-50%);
          width: 30px;
          height: 2px;
          background: #b8860b;
          border-radius: 1px;
        }

        .nfc-symbol {
          position: absolute;
          top: 30px;
          right: 30px;
          width: 40px;
          height: 40px;
        }

        .nfc-wave {
          position: absolute;
          border: 2px solid #007aff;
          border-radius: 50%;
          animation: nfcPulse 2s ease-in-out infinite;
        }

        .nfc-wave:nth-child(1) {
          width: 15px;
          height: 15px;
          top: 12px;
          left: 12px;
        }

        .nfc-wave:nth-child(2) {
          width: 25px;
          height: 25px;
          top: 7px;
          left: 7px;
          animation-delay: 0.3s;
        }

        .nfc-wave:nth-child(3) {
          width: 35px;
          height: 35px;
          top: 2px;
          left: 2px;
          animation-delay: 0.6s;
        }

        @keyframes nfcPulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.2);
          }
        }

        .linkist-logo {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-top: auto;
        }

        .logo-icon {
          display: flex;
          gap: 8px;
          position: relative;
        }

        .link-circle {
          width: 25px;
          height: 25px;
          border: 3px solid #007aff;
          border-radius: 50%;
          animation: linkPulse 2s ease-in-out infinite;
        }

        .link-circle.primary {
          border-color: #007aff;
        }

        .link-circle.secondary {
          border-color: #00ff87;
          animation-delay: 0.5s;
        }

        .connecting-line {
          position: absolute;
          top: 50%;
          left: 15px;
          width: 25px;
          height: 3px;
          background: linear-gradient(90deg, #007aff, #00ff87);
          transform: translateY(-50%);
          animation: lineGlow 2s ease-in-out infinite;
        }

        @keyframes lineGlow {
          0%, 100% {
            opacity: 0.6;
            transform: translateY(-50%) scaleX(1);
          }
          50% {
            opacity: 1;
            transform: translateY(-50%) scaleX(1.2);
          }
        }

        @keyframes linkPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.7;
          }
        }

        .logo-text {
          font-size: 1.8rem;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: 2px;
          text-shadow: 0 0 10px rgba(0, 122, 255, 0.5);
        }

        .logo-tagline {
          font-size: 0.9rem;
          color: #007aff;
          font-weight: 600;
          margin-left: -15px;
          opacity: 0.8;
        }

        .card-number {
          display: flex;
          justify-content: space-between;
          font-family: 'Courier New', monospace;
          font-size: 1.4rem;
          font-weight: 600;
          color: #ffffff;
          margin: 20px 0;
          letter-spacing: 2px;
        }

        .number-group {
          text-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
        }

        .holographic-pattern {
          position: absolute;
          top: 0;
          right: 0;
          width: 100px;
          height: 100%;
          background: linear-gradient(
            45deg,
            transparent 30%,
            rgba(0, 122, 255, 0.1) 50%,
            transparent 70%
          );
          animation: holographicShift 4s ease-in-out infinite;
        }

        @keyframes holographicShift {
          0%, 100% {
            transform: translateX(100px);
            opacity: 0;
          }
          50% {
            transform: translateX(-100px);
            opacity: 1;
          }
        }

        .magnetic-stripe {
          width: 100%;
          height: 40px;
          background: linear-gradient(90deg, #333, #111, #333);
          margin-bottom: 20px;
          border-radius: 3px;
        }

        .signature-panel {
          background: #f5f5f5;
          color: #333;
          padding: 10px;
          border-radius: 5px;
          margin-bottom: 20px;
          font-size: 0.9rem;
          text-align: center;
        }

        .security-features {
          display: flex;
          justify-content: space-between;
          align-items: end;
        }

        .cvv-section {
          text-align: right;
        }

        .cvv-label {
          display: block;
          font-size: 0.8rem;
          color: #999;
          margin-bottom: 5px;
        }

        .cvv-number {
          font-family: 'Courier New', monospace;
          font-size: 1.2rem;
          font-weight: bold;
          color: #fff;
        }

        .bank-info {
          display: flex;
          flex-direction: column;
          gap: 5px;
          font-size: 0.9rem;
          color: #ccc;
        }

        .back-pattern {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 50px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(0, 122, 255, 0.1),
            transparent
          );
        }

        .card-reflection {
          position: absolute;
          bottom: -100%;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to bottom,
            rgba(30, 30, 46, 0.3) 0%,
            transparent 70%
          );
          transform: scaleY(-1);
          border-radius: 20px;
          opacity: 0.6;
        }

        .floating-elements {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .floating-icon {
          position: absolute;
          font-size: 2rem;
          animation: floatIcon 6s ease-in-out infinite;
          opacity: 0.7;
        }

        .icon-security {
          top: 10%;
          left: -10%;
          animation-delay: 0s;
        }

        .icon-speed {
          top: 70%;
          left: -15%;
          animation-delay: 1.5s;
        }

        .icon-global {
          top: 15%;
          right: -10%;
          animation-delay: 3s;
        }

        .icon-premium {
          top: 75%;
          right: -15%;
          animation-delay: 4.5s;
        }

        @keyframes floatIcon {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.8;
          }
        }

        @media (max-width: 768px) {
          .design-content {
            grid-template-columns: 1fr;
            gap: 80px;
            text-align: center;
          }

          .feature-list {
            grid-template-columns: 1fr;
          }

          .linkist-card-3d {
            width: 350px;
            height: 220px;
          }

          .design-section {
            padding: 80px 15px;
          }

          .card-controls {
            justify-content: center;
          }

          .floating-elements {
            display: none;
          }

          .animated-card-container {
            padding: 60px 20px;
            min-height: 350px;
            perspective: 1200px;
          }

          .animated-card {
            width: 320px;
            height: 200px;
          }

          .animated-card .bank {
            font-size: 20px;
            top: 25px;
            right: 25px;
          }

          .animated-card .number {
            font-size: 16px;
            bottom: 25px;
            left: 25px;
            letter-spacing: 2px;
          }

          .animated-card .chip {
            width: 45px;
            height: 35px;
            top: 25px;
            left: 25px;
          }

          .animated-card .chip::before {
            width: 32px;
            height: 22px;
          }

          @keyframes card-isometric {
            0% {
              transform: rotateX(-8deg) rotateY(-12deg) rotateZ(0deg);
            }
            25% {
              transform: rotateX(-12deg) rotateY(20deg) rotateZ(-2deg);
            }
            50% {
              transform: rotateX(12deg) rotateY(-8deg) rotateZ(2deg);
            }
            75% {
              transform: rotateX(-8deg) rotateY(-20deg) rotateZ(-1deg);
            }
            100% {
              transform: rotateX(-8deg) rotateY(-12deg) rotateZ(0deg);
            }
          }
        }

        /* 3D Animated Credit Card Styles */
        .animated-card-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 500px;
          perspective: 1500px;
          perspective-origin: center center;
          margin: 80px 0;
        }

        .animated-card {
          position: relative;
          width: 400px;
          height: 250px;
          transform-style: preserve-3d;
          animation: card-isometric 8s ease-in-out infinite;
          cursor: pointer;
          transition: all 0.4s ease;
          transform-origin: center center;
        }

        .animated-card:hover {
          animation-play-state: paused;
          transform: rotateX(-15deg) rotateY(25deg) rotateZ(5deg) scale(1.1);
        }

        .animated-card .card-layer {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 25px;
          box-sizing: border-box;
          backdrop-filter: blur(10px);
          transition: all 0.4s ease;
        }

        .animated-card .card-layer-1 {
          transform: translateZ(5px);
          background: linear-gradient(135deg, 
            #ffd700 0%, 
            #ffed4e 15%, 
            #f4d03f 30%,
            #e8c547 50%,
            #cd853f 70%,
            #b8860b 85%,
            #daa520 100%);
          border: 3px solid rgba(218, 165, 32, 0.8);
          box-shadow: 
            0 30px 60px rgba(205, 133, 63, 0.5),
            0 20px 35px rgba(212, 175, 55, 0.4),
            0 10px 20px rgba(184, 134, 11, 0.3),
            inset 0 3px 6px rgba(255, 255, 255, 0.5),
            inset 0 -3px 6px rgba(0, 0, 0, 0.3);
        }

        .animated-card .card-layer-2 {
          transform: translateZ(25px);
          background: linear-gradient(135deg, 
            #ffd700 0%, 
            #ffed4e 20%, 
            #f4d03f 40%,
            #cd853f 60%,
            #b8860b 80%,
            #daa520 100%);
          border: 3px solid rgba(218, 165, 32, 0.7);
          box-shadow: 
            0 25px 50px rgba(205, 133, 63, 0.4),
            0 15px 30px rgba(212, 175, 55, 0.3),
            0 8px 15px rgba(184, 134, 11, 0.2),
            inset 0 3px 6px rgba(255, 255, 255, 0.4),
            inset 0 -3px 6px rgba(0, 0, 0, 0.2);
        }

        .animated-card .card-layer-3 {
          transform: translateZ(45px);
          background: linear-gradient(135deg, 
            #ffd700 0%, 
            #ffed4e 25%, 
            #f4d03f 50%,
            #cd853f 75%,
            #daa520 100%);
          border: 3px solid rgba(218, 165, 32, 0.6);
          box-shadow: 
            0 20px 40px rgba(205, 133, 63, 0.3),
            0 12px 25px rgba(212, 175, 55, 0.25),
            0 6px 12px rgba(184, 134, 11, 0.15),
            inset 0 3px 6px rgba(255, 255, 255, 0.3),
            inset 0 -3px 6px rgba(0, 0, 0, 0.1);
        }

        .animated-card .chip {
          position: absolute;
          top: 35px;
          left: 35px;
          width: 55px;
          height: 42px;
          background: linear-gradient(145deg, 
            #ffd700 0%, 
            #ffed4e 20%, 
            #f4d03f 40%,
            #daa520 60%,
            #b8860b 80%,
            #cd853f 100%);
          border-radius: 10px;
          z-index: 50;
          box-shadow: 
            0 8px 16px rgba(255, 215, 0, 0.4),
            0 4px 8px rgba(218, 165, 32, 0.3),
            inset 0 3px 6px rgba(255, 255, 255, 0.4),
            inset 0 -3px 6px rgba(0, 0, 0, 0.3);
          transform: translateZ(60px);
        }

        .animated-card .chip::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 28px;
          background: repeating-linear-gradient(
            90deg,
            #b8860b 0px,
            #b8860b 3px,
            #daa520 3px,
            #daa520 6px,
            #ffd700 6px,
            #ffd700 9px
          );
          border-radius: 4px;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .animated-card .bank {
          position: absolute;
          top: 35px;
          right: 35px;
          color: #2c1810;
          font-size: 28px;
          font-weight: 900;
          letter-spacing: 3px;
          text-shadow: 
            0 2px 4px rgba(255, 255, 255, 0.3),
            0 1px 2px rgba(0, 0, 0, 0.5);
          z-index: 50;
          transform: translateZ(60px);
          background: linear-gradient(45deg, 
            #8b4513 0%,
            #a0522d 25%,
            #cd853f 50%,
            #d2691e 75%,
            #8b4513 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .animated-card .number {
          position: absolute;
          bottom: 35px;
          left: 35px;
          color: #2c1810;
          font-family: 'Courier New', monospace;
          font-size: 20px;
          font-weight: 700;
          letter-spacing: 4px;
          text-shadow: 
            0 2px 4px rgba(255, 255, 255, 0.3),
            0 1px 2px rgba(0, 0, 0, 0.4);
          z-index: 50;
          transform: translateZ(60px);
        }

        /* Add metallic shine overlay */
        .animated-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.3) 0%,
            rgba(255, 255, 255, 0.1) 25%,
            rgba(255, 255, 255, 0) 50%,
            rgba(255, 255, 255, 0.1) 75%,
            rgba(255, 255, 255, 0.2) 100%
          );
          border-radius: 20px;
          pointer-events: none;
          z-index: 100;
          transform: translateZ(70px);
          animation: metallic-shine 3s ease-in-out infinite;
        }

        @keyframes metallic-shine {
          0%, 100% {
            opacity: 0.6;
            transform: translateZ(70px) translateX(0%) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: translateZ(70px) translateX(10%) rotate(2deg);
          }
        }

        @keyframes card-isometric {
          0% {
            transform: rotateX(-10deg) rotateY(-15deg) rotateZ(0deg);
          }
          12.5% {
            transform: rotateX(-15deg) rotateY(10deg) rotateZ(3deg);
          }
          25% {
            transform: rotateX(-5deg) rotateY(25deg) rotateZ(-2deg);
          }
          37.5% {
            transform: rotateX(10deg) rotateY(20deg) rotateZ(1deg);
          }
          50% {
            transform: rotateX(15deg) rotateY(-5deg) rotateZ(-3deg);
          }
          62.5% {
            transform: rotateX(5deg) rotateY(-20deg) rotateZ(2deg);
          }
          75% {
            transform: rotateX(-10deg) rotateY(-25deg) rotateZ(-1deg);
          }
          87.5% {
            transform: rotateX(-20deg) rotateY(-10deg) rotateZ(3deg);
          }
          100% {
            transform: rotateX(-10deg) rotateY(-15deg) rotateZ(0deg);
          }
        }
      `}</style>
    </section>
  );
};

// Pro Camera Results Section Component
const ProResultsSection: React.FC = () => {
  return (
    <section className="pro-results-section reveal">
      <div className="pro-results-content">
        <h2 className="pro-results-title">Pro results down to the pixel.</h2>
        
        <div className="results-showcase">
          <div className="result-card low-light">
            <div className="result-image purple-gradient">
              <div className="demo-scene">
                <div className="staircase"></div>
                <div className="person"></div>
              </div>
            </div>
            <div className="result-description">
              <h4>Low-light photography and Night mode.</h4>
              <p>Capture sharp, detailed, bright images with natural colors, even when it's dark.</p>
            </div>
          </div>
          
          <div className="result-card high-res">
            <div className="result-image">
              <div className="portrait-demo">
                <div className="model-silhouette"></div>
                <div className="hair-detail"></div>
              </div>
            </div>
            <div className="result-description">
              <h4>All 48MP rear cameras.</h4>
              <p>Pro Fusion cameras capture more detailed images at every zoom range.</p>
            </div>
          </div>
        </div>
        
        <button className="compare-cameras-results">Compare Linkist Cards +</button>
      </div>

      <style jsx>{`
        .pro-results-section {
          min-height: 100vh;
          background: linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #1a1a2e 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 100px 20px;
          position: relative;
        }

        .pro-results-content {
          max-width: 1200px;
          width: 100%;
          text-align: center;
        }

        .pro-results-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 80px;
          background: linear-gradient(135deg, #ffffff 0%, #007aff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .results-showcase {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          margin-bottom: 80px;
        }

        .result-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 30px;
          border: 1px solid rgba(0, 122, 255, 0.2);
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .result-card:hover {
          transform: translateY(-10px);
          border-color: rgba(0, 122, 255, 0.5);
          box-shadow: 0 20px 40px rgba(0, 122, 255, 0.2);
        }

        .result-image {
          width: 100%;
          height: 300px;
          border-radius: 15px;
          margin-bottom: 30px;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .purple-gradient {
          background: linear-gradient(135deg, #6a0dad 0%, #4b0082 50%, #1e1e2e 100%);
        }

        .demo-scene {
          position: relative;
          width: 200px;
          height: 200px;
        }

        .staircase {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: 120px;
          height: 80px;
          background: linear-gradient(135deg, #333 0%, #555 100%);
          clip-path: polygon(0% 100%, 25% 75%, 50% 50%, 75% 25%, 100% 0%, 100% 100%);
          animation: staircaseGlow 3s ease-in-out infinite;
        }

        @keyframes staircaseGlow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(106, 13, 173, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(106, 13, 173, 0.6);
          }
        }

        .person {
          position: absolute;
          top: 30px;
          right: 40px;
          width: 30px;
          height: 60px;
          background: linear-gradient(135deg, #ffffff 0%, #cccccc 100%);
          border-radius: 15px 15px 5px 5px;
          animation: personGlow 2s ease-in-out infinite alternate;
        }

        .person::before {
          content: '';
          position: absolute;
          top: -15px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 20px;
          background: #ffffff;
          border-radius: 50%;
        }

        @keyframes personGlow {
          0% {
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.4);
          }
          100% {
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.8);
          }
        }

        .portrait-demo {
          position: relative;
          width: 150px;
          height: 200px;
        }

        .model-silhouette {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #2a2a3e 0%, #1e1e2e 100%);
          border-radius: 10px;
          position: relative;
          border: 2px solid rgba(0, 122, 255, 0.3);
          animation: silhouetteGlow 3s ease-in-out infinite;
        }

        @keyframes silhouetteGlow {
          0%, 100% {
            border-color: rgba(0, 122, 255, 0.3);
            box-shadow: 0 0 20px rgba(0, 122, 255, 0.2);
          }
          50% {
            border-color: rgba(0, 122, 255, 0.6);
            box-shadow: 0 0 40px rgba(0, 122, 255, 0.4);
          }
        }

        .hair-detail {
          position: absolute;
          top: 10px;
          left: 10px;
          right: 10px;
          height: 40px;
          background: linear-gradient(135deg, #007aff 0%, #00ff87 100%);
          border-radius: 20px 20px 0 0;
          animation: hairDetailShine 2s ease-in-out infinite alternate;
        }

        @keyframes hairDetailShine {
          0% {
            opacity: 0.6;
            transform: scale(1);
          }
          100% {
            opacity: 1;
            transform: scale(1.05);
          }
        }

        .result-description {
          text-align: left;
        }

        .result-description h4 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 15px;
          background: linear-gradient(135deg, #ffffff 0%, #007aff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .result-description p {
          font-size: 1.1rem;
          line-height: 1.6;
          color: #a1a1aa;
        }

        .compare-cameras-results {
          background: linear-gradient(135deg, #007aff 0%, #00ff87 100%);
          border: none;
          color: #ffffff;
          padding: 18px 40px;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 30px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(0, 122, 255, 0.3);
        }

        .compare-cameras-results:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(0, 122, 255, 0.5);
          background: linear-gradient(135deg, #0056d6 0%, #00cc6a 100%);
        }

        .compare-cameras-results:active {
          transform: translateY(0px);
        }

        @media (max-width: 768px) {
          .results-showcase {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .result-image {
            height: 250px;
          }

          .demo-scene,
          .portrait-demo {
            transform: scale(0.8);
          }

          .pro-results-section {
            padding: 80px 15px;
          }

          .result-description {
            text-align: center;
          }
        }
      `}</style>
    </section>
  );
};

// Center Stage Section Component
const CenterStageSection: React.FC = () => {
  return (
    <section className="center-stage-section reveal">
      <div className="center-stage-content">
        <div className="center-stage-text">
          <h2 className="center-stage-title">Advanced Security Technology.<br />It's a total game changer.</h2>
          
          <p className="center-stage-description">
            The new Linkist Card gives you flexible ways to manage your finances — and so 
            much more. Tap to expand your spending limits and switch from savings to checking <strong>without 
            changing your card.</strong> And when family joins your account, the benefits expand so you get 
            more rewards in your transactions.
          </p>
        </div>
        
        <div className="center-stage-demo">
          <div className="phone-demo-container">
            <div className="demo-phone">
              <div className="phone-screen">
                <div className="camera-viewfinder">
                  <div className="demo-people">
                    <div className="person person-1"></div>
                    <div className="person person-2"></div>
                  </div>
                  <div className="expand-indicator"></div>
                </div>
              </div>
              <div className="home-indicator"></div>
            </div>
          </div>
          
          <button className="compare-cameras-front">Compare Linkist Cards +</button>
        </div>
      </div>

      <style jsx>{`
        .center-stage-section {
          min-height: 100vh;
          background: linear-gradient(135deg, #000000 0%, #1a1a2e 50%, #000000 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 100px 20px;
          position: relative;
        }

        .center-stage-content {
          max-width: 1400px;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 100px;
          align-items: center;
        }

        .center-stage-text {
          color: #ffffff;
        }

        .center-stage-title {
          font-size: clamp(2.5rem, 4vw, 3.8rem);
          font-weight: 700;
          margin-bottom: 40px;
          line-height: 1.2;
          background: linear-gradient(135deg, #ffffff 0%, #007aff 50%, #00ff87 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .center-stage-description {
          font-size: 1.25rem;
          line-height: 1.7;
          color: #b8b8b8;
          max-width: 600px;
        }

        .center-stage-description strong {
          color: #ffffff;
          font-weight: 600;
        }

        .center-stage-demo {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 40px;
        }

        .phone-demo-container {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .demo-phone {
          width: 280px;
          height: 570px;
          background: linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%);
          border-radius: 45px;
          padding: 12px;
          box-shadow: 
            0 0 0 8px rgba(0, 122, 255, 0.1),
            0 25px 50px rgba(0, 0, 0, 0.4);
          position: relative;
          animation: phoneFloat 4s ease-in-out infinite;
        }

        @keyframes phoneFloat {
          0%, 100% {
            transform: translateY(0px) rotateY(5deg);
          }
          50% {
            transform: translateY(-15px) rotateY(-5deg);
          }
        }

        .phone-screen {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #000000 0%, #0a0a0a 100%);
          border-radius: 35px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .camera-viewfinder {
          width: 90%;
          height: 70%;
          background: linear-gradient(135deg, #1a1a2e 0%, #2a2a3e 100%);
          border-radius: 20px;
          border: 2px solid rgba(0, 122, 255, 0.3);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: viewfinderGlow 3s ease-in-out infinite;
        }

        @keyframes viewfinderGlow {
          0%, 100% {
            border-color: rgba(0, 122, 255, 0.3);
            box-shadow: 0 0 20px rgba(0, 122, 255, 0.2);
          }
          50% {
            border-color: rgba(0, 122, 255, 0.6);
            box-shadow: 0 0 40px rgba(0, 122, 255, 0.4);
          }
        }

        .demo-people {
          position: relative;
          width: 200px;
          height: 150px;
        }

        .person {
          position: absolute;
          width: 60px;
          height: 100px;
          background: linear-gradient(135deg, #007aff 0%, #00ff87 100%);
          border-radius: 30px 30px 10px 10px;
          animation: personPulse 2s ease-in-out infinite;
        }

        .person::before {
          content: '';
          position: absolute;
          top: -25px;
          left: 50%;
          transform: translateX(-50%);
          width: 35px;
          height: 35px;
          background: linear-gradient(135deg, #007aff 0%, #00ff87 100%);
          border-radius: 50%;
        }

        .person-1 {
          left: 40px;
          animation-delay: 0s;
        }

        .person-2 {
          right: 40px;
          animation-delay: 1s;
        }

        @keyframes personPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
        }

        .expand-indicator {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 40px;
          height: 40px;
          border: 3px solid #00ff87;
          border-radius: 8px;
          animation: expandPulse 3s ease-in-out infinite;
        }

        .expand-indicator::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 20px;
          height: 20px;
          background: #00ff87;
          border-radius: 3px;
          animation: indicatorGlow 2s ease-in-out infinite alternate;
        }

        @keyframes expandPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }

        @keyframes indicatorGlow {
          0% {
            opacity: 0.5;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2);
          }
        }

        .home-indicator {
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          width: 140px;
          height: 4px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
        }

        .demo-phone::before {
          content: '';
          position: absolute;
          top: 25px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
        }

        .demo-phone::after {
          content: '';
          position: absolute;
          top: 40px;
          left: 50%;
          transform: translateX(-50%);
          width: 15px;
          height: 15px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
        }

        .compare-cameras-front {
          background: linear-gradient(135deg, #007aff 0%, #00ff87 100%);
          border: none;
          color: #ffffff;
          padding: 18px 40px;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 30px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(0, 122, 255, 0.3);
        }

        .compare-cameras-front:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(0, 122, 255, 0.5);
          background: linear-gradient(135deg, #0056d6 0%, #00cc6a 100%);
        }

        .compare-cameras-front:active {
          transform: translateY(0px);
        }

        @media (max-width: 768px) {
          .center-stage-content {
            grid-template-columns: 1fr;
            gap: 60px;
            text-align: center;
          }

          .demo-phone {
            width: 240px;
            height: 490px;
          }

          .demo-people {
            width: 160px;
            height: 120px;
          }

          .person {
            width: 45px;
            height: 75px;
          }

          .person::before {
            width: 25px;
            height: 25px;
            top: -20px;
          }

          .center-stage-section {
            padding: 80px 15px;
          }
        }
      `}</style>
    </section>
  );
};

// Camera Section Component
const CameraSection: React.FC = () => {
  return (
    <section className="camera-section reveal">
      <div className="camera-content">
        <div className="camera-info">
          <p className="camera-label">Cameras</p>
          <h2 className="camera-title">A big zoom forward.</h2>
          
          <div className="camera-specs">
            <div className="spec-item">
              <span className="spec-label">Up to</span>
              <span className="spec-value">8x</span>
              <span className="spec-description">optical-quality zoom</span>
            </div>
            
            <div className="spec-item">
              <span className="spec-label">All</span>
              <span className="spec-value">48MP</span>
              <span className="spec-description">rear cameras</span>
            </div>
          </div>
        </div>
        
        <div className="camera-visual">
          <div className="camera-module-large">
            <div className="large-camera-lens"></div>
            <div className="large-camera-lens"></div>
            <div className="large-camera-lens"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .camera-section {
          min-height: 100vh;
          background: linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #000000 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 100px 20px;
          position: relative;
          overflow: hidden;
        }

        .camera-content {
          max-width: 1200px;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 100px;
          align-items: center;
        }

        .camera-info {
          color: #ffffff;
        }

        .camera-label {
          font-size: 1rem;
          color: #007aff;
          font-weight: 500;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .camera-title {
          font-size: clamp(2.5rem, 4vw, 4rem);
          font-weight: 700;
          margin-bottom: 60px;
          line-height: 1.1;
          background: linear-gradient(135deg, #ffffff 0%, #007aff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .camera-specs {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .spec-item {
          display: flex;
          align-items: baseline;
          gap: 15px;
          flex-wrap: wrap;
        }

        .spec-label {
          font-size: 1.2rem;
          color: #a1a1aa;
          font-weight: 400;
        }

        .spec-value {
          font-size: clamp(3rem, 5vw, 4.5rem);
          font-weight: 700;
          color: #ffffff;
          line-height: 1;
          background: linear-gradient(135deg, #ffffff 0%, #007aff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .spec-description {
          font-size: 1.2rem;
          color: #a1a1aa;
          font-weight: 400;
        }

        .camera-visual {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }

        .camera-module-large {
          position: relative;
          width: 350px;
          height: 350px;
          background: linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%);
          border-radius: 50px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 20px;
          padding: 40px;
          box-shadow: 
            0 0 0 1px rgba(255, 255, 255, 0.1),
            0 20px 40px rgba(0, 0, 0, 0.4),
            0 0 50px rgba(0, 122, 255, 0.2);
          animation: cameraFloat 4s ease-in-out infinite;
        }

        @keyframes cameraFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(2deg);
          }
        }

        .camera-module-large::before {
          content: '';
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          background: linear-gradient(45deg, transparent, rgba(0, 122, 255, 0.3), transparent);
          border-radius: 60px;
          z-index: -1;
          animation: cameraGlow 3s ease-in-out infinite;
        }

        @keyframes cameraGlow {
          0%, 100% {
            opacity: 0.3;
            transform: rotate(0deg);
          }
          50% {
            opacity: 0.8;
            transform: rotate(180deg);
          }
        }

        .large-camera-lens {
          width: 80px;
          height: 80px;
          background: radial-gradient(circle at 30% 30%, #4a4a4a, #1a1a1a);
          border-radius: 50%;
          position: relative;
          border: 3px solid #333333;
          animation: lensRotate 6s linear infinite;
        }

        .large-camera-lens:nth-child(1) {
          animation-delay: 0s;
          width: 100px;
          height: 100px;
        }

        .large-camera-lens:nth-child(2) {
          animation-delay: 2s;
        }

        .large-camera-lens:nth-child(3) {
          animation-delay: 4s;
        }

        @keyframes lensRotate {
          0% {
            transform: rotate(0deg);
            box-shadow: 0 0 20px rgba(0, 122, 255, 0.3);
          }
          50% {
            transform: rotate(180deg);
            box-shadow: 0 0 30px rgba(0, 122, 255, 0.6);
          }
          100% {
            transform: rotate(360deg);
            box-shadow: 0 0 20px rgba(0, 122, 255, 0.3);
          }
        }

        .large-camera-lens::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40%;
          height: 40%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.1), transparent);
          border-radius: 50%;
        }

        .large-camera-lens::after {
          content: '';
          position: absolute;
          top: 20%;
          left: 20%;
          width: 25%;
          height: 25%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.4), transparent);
          border-radius: 50%;
          animation: lensFlare 3s ease-in-out infinite;
        }

        @keyframes lensFlare {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.2);
          }
        }

        @media (max-width: 768px) {
          .camera-content {
            grid-template-columns: 1fr;
            gap: 60px;
            text-align: center;
          }

          .camera-module-large {
            width: 280px;
            height: 280px;
            padding: 30px;
          }

          .large-camera-lens {
            width: 60px;
            height: 60px;
          }

          .large-camera-lens:nth-child(1) {
            width: 80px;
            height: 80px;
          }

          .camera-section {
            padding: 80px 15px;
          }

          .spec-item {
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};

// Hero Section Component
const HeroSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !videoRef.current) return;
    
    const video = videoRef.current;
    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    
    const handleLoadedData = () => {
      video.play().catch(console.error);
    };
    
    video.addEventListener('loadeddata', handleLoadedData);
    
    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [mounted]);

  const handleOrderNow = () => {
    router.push('/nfc/configure');
  };

  return (
    <section className="hero-section">
      <div className="hero-content">
        <video 
          ref={videoRef}
          autoPlay
          muted 
          loop 
          playsInline
          preload="auto"
          className="full-hero-video"
        >
          <source src="/linkist.mp4" type="video/mp4" />
        </video>
        
        <div className="hero-overlay">
          <div className="hero-text">
            <h1 className="hero-title">Linkist NFC Card</h1>
            <p className="hero-subtitle">Smart networking at your fingertips</p>
            <button className="order-now-btn" onClick={handleOrderNow}>
              Order Now
            </button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .hero-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding-top: 80px;
          background: radial-gradient(ellipse at center, rgba(20, 20, 20, 0.8) 0%, rgba(0, 0, 0, 0.95) 70%);
        }

        .hero-content {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 20;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .full-hero-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 30;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.3);
        }

        .hero-text {
          text-align: center;
          color: white;
          max-width: 600px;
          padding: 0 20px;
        }

        .hero-title {
          font-size: 4rem;
          font-weight: 700;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #007aff 0%, #00ff87 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 0 30px rgba(0, 122, 255, 0.5);
        }

        .hero-subtitle {
          font-size: 1.5rem;
          font-weight: 300;
          margin-bottom: 2.5rem;
          opacity: 0.9;
          line-height: 1.4;
        }

        .order-now-btn {
          background: linear-gradient(135deg, #007aff 0%, #0056b3 100%);
          color: white;
          border: none;
          padding: 16px 48px;
          font-size: 1.2rem;
          font-weight: 600;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
          box-shadow: 0 8px 32px rgba(0, 122, 255, 0.4);
          position: relative;
          overflow: hidden;
        }

        .order-now-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 48px rgba(0, 122, 255, 0.6);
          background: linear-gradient(135deg, #0084ff 0%, #0066cc 100%);
        }

        .order-now-btn:active {
          transform: translateY(0px);
          box-shadow: 0 6px 24px rgba(0, 122, 255, 0.4);
        }

        .order-now-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .order-now-btn:hover::before {
          left: 100%;
        }

        @media (max-width: 768px) {
          .full-hero-video {
            object-position: center center;
          }
          
          .hero-title {
            font-size: 2.5rem;
          }
          
          .hero-subtitle {
            font-size: 1.2rem;
            margin-bottom: 2rem;
          }
          
          .order-now-btn {
            padding: 14px 36px;
            font-size: 1.1rem;
          }
          
          .hero-text {
            padding: 0 16px;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 2rem;
          }
          
          .hero-subtitle {
            font-size: 1rem;
          }
          
          .order-now-btn {
            padding: 12px 28px;
            font-size: 1rem;
          }
        }
      `}</style>
    </section>
  );
};

// Main HomePage Component
export default function HomePage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / documentHeight) * 100;
      setScrollProgress(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mounted]);

  if (!mounted) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Scroll Progress */}
      <div 
        className="scroll-progress" 
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <HeroSection />

      {/* Highlights Section */}
      <HighlightsSection />

      {/* Design Section */}
      <DesignSection />

      {/* Simple Design Section */}
      <SimpleDesignSection />

      {/* Camera Section */}
      <CameraSection />

      {/* Pro Camera Results Section */}
      <ProResultsSection />

      {/* Center Stage Section */}
      <CenterStageSection />

      {/* Premium 3D Card Section */}
      <section className="premium-card-section">
        <div className="card-container">
          <PremiumCard />
          <div className="card-content">
            <h2 className="card-title">Premium aluminum card construction</h2>
            <p className="card-subtitle">for exceptional banking capability</p>
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">🔥</div>
                <span>Thermal Management</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">💎</div>
                <span>Premium Materials</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">⚡</div>
                <span>Lightning Performance</span>
              </div>
            </div>
          </div>
          
          {/* 3D Animated Credit Card */}
          <div className="animated-card-container">
            <div className="animated-card">
              <div className="card-layer card-layer-1"></div>
              <div className="card-layer card-layer-2"></div>
              <div className="card-layer card-layer-3"></div>
              <div className="chip"></div>
              <div className="bank">Linkist</div>
              <div className="number">4829 2024 0000 2025</div>
              <div className="expiry">Expiry: 12/27</div>
              <div className="cvv">CVV: 829</div>
              <div className="name">Premium Member</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-grid">
            <div className="footer-section">
              <h3>Products</h3>
              <ul>
                <li><Link href="#">Linkist Card</Link></li>
                <li><Link href="#">Premium Card</Link></li>
                <li><Link href="#">Business Card</Link></li>
                <li><Link href="#">Student Card</Link></li>
                <li><Link href="#">Family Cards</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h3>Services</h3>
              <ul>
                <li><Link href="#">Banking</Link></li>
                <li><Link href="#">Investments</Link></li>
                <li><Link href="#">Loans</Link></li>
                <li><Link href="#">Insurance</Link></li>
                <li><Link href="#">Rewards Program</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h3>Support</h3>
              <ul>
                <li><Link href="#">Help Center</Link></li>
                <li><Link href="#">Contact Us</Link></li>
                <li><Link href="#">Security</Link></li>
                <li><Link href="#">Card Activation</Link></li>
                <li><Link href="#">Report Fraud</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h3>Company</h3>
              <ul>
                <li><Link href="#">About Linkist</Link></li>
                <li><Link href="#">Careers</Link></li>
                <li><Link href="#">Press</Link></li>
                <li><Link href="#">Investors</Link></li>
                <li><Link href="#">Sustainability</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <div className="footer-logo">Linkist</div>
            <div className="footer-legal">
              <Link href="#">Privacy Policy</Link>
              <Link href="#">Terms of Service</Link>
              <Link href="#">Security</Link>
              <Link href="#">Accessibility</Link>
            </div>
            <div className="footer-copyright">
              © 2025 Linkist Inc. All rights reserved. FDIC Insured.
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        /* Linkist Design System Variables */
        :root {
          --apple-orange: #FF8B00;
          --apple-orange-dark: #E67700;
          --apple-blue: #007AFF;
          --apple-purple: #5856D6;
          --apple-green: #34C759;
          --apple-red: #FF3B30;
          --apple-yellow: #FFCC00;
          --apple-pink: #FF2D92;
          --apple-gray: #8E8E93;
          --apple-gray-light: #F2F2F7;
          --apple-gray-dark: #1C1C1E;
          --apple-black: #000000;
          --apple-white: #FFFFFF;
          
          /* Typography */
          --font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif;
          --font-weight-regular: 400;
          --font-weight-medium: 500;
          --font-weight-semibold: 600;
          --font-weight-bold: 700;
          --font-weight-heavy: 800;
          --font-weight-black: 900;
          
          /* Spacing */
          --spacing-xs: 4px;
          --spacing-sm: 8px;
          --spacing-md: 16px;
          --spacing-lg: 24px;
          --spacing-xl: 32px;
          --spacing-xxl: 48px;
          --spacing-xxxl: 64px;
          --spacing-huge: 96px;
          --spacing-massive: 128px;
          
          /* Border Radius */
          --radius-sm: 6px;
          --radius-md: 12px;
          --radius-lg: 18px;
          --radius-xl: 24px;
          --radius-xxl: 32px;
          
          /* Shadows */
          --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
          --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
          --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
          --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);
          --shadow-2xl: 0 40px 80px rgba(0, 0, 0, 0.2);
          
          /* Animation */
          --transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
          --transition-normal: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          --transition-slow: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          --transition-slower: 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Reset and Base Styles */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
          overflow-x: hidden;
        }

        body {
          font-family: var(--font-family);
          background: var(--apple-black);
          color: var(--apple-white);
          line-height: 1.6;
          overflow-x: hidden;
        }

        /* Scroll Progress */
        .scroll-progress {
          position: fixed;
          top: 0;
          left: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--apple-orange), var(--apple-blue));
          z-index: 10000;
          transition: width var(--transition-fast);
        }

        /* Premium Card Section */
        .premium-card-section {
          padding: var(--spacing-massive) 0;
          background: linear-gradient(to bottom, #414345, #232526);
          position: relative;
          overflow: hidden;
          font-family: 'Roboto Mono', monospace;
        }

        .card-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 var(--spacing-xl);
          display: flex;
          align-items: center;
          gap: var(--spacing-massive);
          position: relative;
        }

        .card-content {
          flex: 1;
          max-width: 600px;
        }

        .card-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: var(--font-weight-heavy);
          color: var(--apple-white);
          line-height: 1.1;
          margin-bottom: var(--spacing-md);
          background: linear-gradient(135deg, 
            var(--apple-white) 0%, 
            var(--apple-orange) 50%, 
            var(--apple-white) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          position: relative;
        }

        .card-subtitle {
          font-size: clamp(1.2rem, 2.5vw, 1.8rem);
          color: var(--apple-gray);
          margin-bottom: var(--spacing-xl);
          font-weight: var(--font-weight-medium);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-lg);
          margin-top: var(--spacing-xl);
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-lg);
          background: rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-md);
          border: 1px solid rgba(255, 139, 0, 0.2);
          transition: all var(--transition-normal);
          backdrop-filter: blur(10px);
        }

        .feature-item:hover {
          background: rgba(255, 139, 0, 0.1);
          border-color: rgba(255, 139, 0, 0.4);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 139, 0, 0.2);
        }

        .feature-icon {
          font-size: 24px;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--apple-orange) 0%, var(--apple-orange-dark) 100%);
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(255, 139, 0, 0.3);
        }

        .feature-item span {
          font-weight: var(--font-weight-medium);
          color: var(--apple-white);
        }

        /* Footer */
        .footer {
          background: var(--apple-black);
          padding: 60px 0 40px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          margin-top: 100px;
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 var(--spacing-lg);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 40px;
          margin-bottom: 40px;
        }

        .footer-section h3 {
          color: var(--apple-white);
          font-size: 1.1rem;
          font-weight: var(--font-weight-semibold);
          margin-bottom: 20px;
        }

        .footer-section ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-section ul li {
          margin-bottom: 12px;
        }

        .footer-section ul li a {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          font-size: 0.95rem;
          transition: color 0.3s ease;
        }

        .footer-section ul li a:hover {
          color: var(--apple-orange);
        }

        .footer-bottom {
          padding-top: 40px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .footer-logo {
          color: var(--apple-white);
          font-size: 1.5rem;
          font-weight: bold;
        }

        .footer-legal {
          display: flex;
          gap: 30px;
          flex-wrap: wrap;
        }

        .footer-legal a {
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.3s ease;
        }

        .footer-legal a:hover {
          color: var(--apple-orange);
        }

        .footer-copyright {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.9rem;
          text-align: center;
          width: 100%;
          margin-top: 20px;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .card-container {
            flex-direction: column;
            gap: var(--spacing-xxxl);
            text-align: center;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .premium-card-section {
            padding: var(--spacing-xxxl) 0;
          }

          .card-container {
            padding: 0 var(--spacing-lg);
          }

          .feature-item {
            padding: var(--spacing-md);
          }

          .footer-bottom {
            flex-direction: column;
            text-align: center;
          }
          
          .footer-legal {
            justify-content: center;
          }
        }

        /* Performance Optimizations */
        .premium-card,
        .premium-card-inner {
          will-change: transform;
          transform: translateZ(0);
        }

        /* High Contrast Mode Support */
        @media (prefers-contrast: high) {
          .feature-icon {
            border: 2px solid currentColor;
          }
        }

        /* Reduced Motion Support */
        @media (prefers-reduced-motion: reduce) {
          .premium-card {
            animation: none !important;
          }
          
          .premium-card-inner {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}