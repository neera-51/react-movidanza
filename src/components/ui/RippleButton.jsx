import React, { useState } from 'react';

const colors = {
  purple: {
    bg: '#7912B0',
    text: 'white',
    ripple: 'rgba(255, 255, 255, 0.4)',
  },
  gray: {
    bg: '#e0e0e0',
    text: '#333',
    ripple: 'rgba(0, 0, 0, 0.2)',
  },
  transparent: {
    bg: 'transparent',
    text: '#7912B0',
    ripple: 'rgba(121, 18, 176, 0.4)',
    border: '#7912B0',
    hover: '#f2e6fa',
  },
  // Puedes agregar más variantes aquí
};

export default function RippleButton({
  children,
  onClick,
  variant = 'purple',
  className = '',
  ...props
}) {
  const [ripples, setRipples] = useState([]);
  const color = colors[variant] || colors.purple;

  const createRipple = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = {
      x,
      y,
      size,
      key: Date.now(),
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.key !== newRipple.key));
    }, 600);
  };

  return (
    <button
      onClick={(e) => {
        createRipple(e);
        onClick?.(e);
      }}
      className={`relative overflow-hidden font-semibold px-4 py-2 rounded-md outline-none transition duration-300 ease-in-out ${className}`}
      style={{ backgroundColor: color.bg, color: color.text }}
      {...props}
    >
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.key}
          className="absolute rounded-full pointer-events-none z-10"
          style={{
            top: ripple.y,
            left: ripple.x,
            width: ripple.size,
            height: ripple.size,
            backgroundColor: color.ripple,
            transform: 'scale(0)',
            animation: 'ripple-effect 600ms linear forwards',
          }}
        />
      ))}

      <style>
        {`
          @keyframes ripple-effect {
            to {
              transform: scale(4);
              opacity: 0;
            }
          }
        `}
      </style>
    </button>
  );
}
