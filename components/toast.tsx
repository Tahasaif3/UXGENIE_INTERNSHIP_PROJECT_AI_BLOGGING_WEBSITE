"use client";

import { useEffect } from "react";
import { gsap } from "gsap";

interface ToastProps {
  message: string;
  onClose: () => void;
}

export function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    // Animate in
    gsap.fromTo(
      ".toast",
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );

    // Auto close after 3 seconds
    const timer = setTimeout(() => {
      gsap.to(".toast", {
        opacity: 0,
        y: -50,
        duration: 0.5,
        ease: "power2.in",
        onComplete: onClose,
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="toast fixed top-5 right-5 bg-secondary/90 text-white px-6 py-3 rounded-lg shadow-lg flex items-center justify-center gap-3 z-50">
      <span className="font-medium">{message}</span>
    </div>
  );
}
