'use client'
import React, { useEffect, useState } from "react";
import { CheckCircle, X } from "lucide-react";

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, onClose, duration = 5000 }: ToastProps) {
  const [progress, setProgress] = useState(100);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in
    setIsVisible(true);

    // Progress bar animation
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev - (100 / (duration / 100));
        if (newProgress <= 0) {
          clearInterval(progressTimer);
          handleClose();
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(progressTimer);
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  return (
    <div
      className={`fixed top-5 right-5 z-50 max-w-sm transition-all duration-300 transform ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 -translate-y-2 scale-95'
      }`}
    >
      <div className="relative flex items-center p-4 rounded-xl border bg-gradient-to-r from-green-50 to-green-100 border-green-200 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-200">
        {/* Progress bar */}
        <div 
          className="absolute bottom-0 left-0 h-1 bg-green-500 rounded-b-xl transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
        
        <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0 text-green-600" />
        
        <p className="flex-1 text-sm font-medium text-green-800 pr-2">
          {message}
        </p>
        
        <button
          onClick={handleClose}
          className="p-1 rounded-full transition-all duration-200 hover:bg-white/20 text-green-800 hover:scale-110"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
