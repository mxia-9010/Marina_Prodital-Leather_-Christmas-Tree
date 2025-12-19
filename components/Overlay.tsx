
import React, { useState } from 'react';
import { TreeState } from '../types';
import { GREETINGS, COLORS } from '../constants';

interface OverlayProps {
  treeState: TreeState;
  showGreeting: boolean;
  onShowGreeting: () => void;
  onCloseGreeting: () => void;
}

const Overlay: React.FC<OverlayProps> = ({ treeState, showGreeting, onShowGreeting, onCloseGreeting }) => {
  const [currentGreeting, setCurrentGreeting] = useState(GREETINGS[0]);

  const handleGreetingClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const random = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
    setCurrentGreeting(random);
    onShowGreeting();
  };

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 md:p-12 z-10">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="bg-black/60 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-2xl">
          <h1 className="text-white text-2xl md:text-3xl font-playfair font-bold tracking-tight">
            Prodital Leather
          </h1>
          <p className="text-[#E6BE8A] text-[10px] uppercase tracking-[0.3em] mt-1 font-semibold">
            Interactive Christmas Experience
          </p>
        </div>
        
        <button 
          onClick={handleGreetingClick}
          className="pointer-events-auto bg-[#FADADD] text-black hover:bg-white hover:scale-105 active:scale-95 transition-all duration-300 px-8 py-4 rounded-full font-bold shadow-[0_10px_30px_rgba(250,218,221,0.4)] text-xs uppercase tracking-[0.15em] flex items-center gap-3 border border-white/20"
        >
          <span>Receive Your Blessing</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 11-7.6-11.8M10 3a10 10 0 0110 10" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18l3 3m0 0l3-3m-3 3V8" />
          </svg>
        </button>
      </div>

      {/* Center Unleashed Text */}
      <div className="flex-1 flex items-center justify-center">
        {treeState === TreeState.CHAOS && (
          <div className="text-center animate-in fade-in zoom-in duration-1000">
            <h2 className="text-[#FADADD] text-4xl md:text-6xl font-playfair font-bold italic drop-shadow-[0_0_20px_rgba(250,218,221,0.5)]">
              Best wishes from the
            </h2>
            <h2 className="text-white text-5xl md:text-8xl font-playfair font-bold mt-4 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
              Prodital Leather Team
            </h2>
          </div>
        )}
      </div>

      {/* Footer Instructions */}
      <div className="text-center flex flex-col items-center gap-3">
        <div className={`transition-all duration-700 text-xs md:text-sm font-black uppercase tracking-[0.5em] px-10 py-3 rounded-full backdrop-blur-md border border-white/5 ${
          treeState === TreeState.FORMED 
          ? "bg-[#FADADD]/10 text-[#FADADD] shadow-[0_0_20px_rgba(250,218,221,0.2)] opacity-100" 
          : "bg-white/5 text-white/60 opacity-80"
        }`}>
          {treeState === TreeState.FORMED ? "Click Space to Unleash" : "Click Space to Reform"}
        </div>
        <div className="text-[10px] uppercase tracking-[0.25em] text-white/30 italic font-medium">
          Drag to explore • Click anywhere to interact
        </div>
      </div>

      {/* Greeting Modal */}
      {showGreeting && (
        <div 
          onClick={onCloseGreeting}
          className="fixed inset-0 pointer-events-auto flex items-center justify-center bg-black/90 backdrop-blur-md z-[100] p-6 animate-in fade-in duration-300"
        >
          <div 
            onClick={stopPropagation}
            className="bg-[#FADADD] text-black w-full max-w-lg p-12 md:p-16 rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative overflow-hidden border-[6px] border-white/30 flex flex-col items-center text-center animate-in zoom-in-95 slide-in-from-bottom-10 duration-500"
          >
            {/* Close Button - "The X" */}
            <div className="absolute top-0 right-0 p-8">
              <button 
                onClick={(e) => { e.stopPropagation(); onCloseGreeting(); }} 
                className="group flex items-center justify-center w-12 h-12 bg-black/5 hover:bg-black/10 rounded-full transition-all duration-300"
                aria-label="Close"
              >
                <svg className="w-6 h-6 text-black/60 group-hover:text-black group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="w-20 h-20 bg-white/40 rounded-full flex items-center justify-center mb-10 shadow-inner">
              <span className="text-4xl">✨</span>
            </div>

            <h3 className="text-sm font-black tracking-[0.3em] uppercase opacity-40 mb-6">
              Holiday Blessing
            </h3>
            
            <p className="text-3xl md:text-4xl font-playfair font-bold leading-tight mb-12 italic">
              "{currentGreeting}"
            </p>
            
            <div className="w-24 h-1 bg-black/10 rounded-full mb-10" />
            
            <p className="text-xs font-bold tracking-[0.4em] uppercase opacity-60">
              With Love, Prodital Leather
            </p>
            
            {/* Luxury Design Accents */}
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/30 rounded-full blur-[80px]" />
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/30 rounded-full blur-[80px]" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Overlay;
