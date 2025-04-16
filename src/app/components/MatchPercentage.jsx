"use client";

import { useEffect, useRef, useState } from "react";

export default function MatchPercentage({
  percentage,
  title,
  subtitle = null,
  size = "medium",
  animationDuration = 1000,
}) {
  const circleRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [displayPercentage, setDisplayPercentage] = useState(0);

  // Determine sizes based on the size prop
  const dimensions = {
    small: { size: 100, strokeWidth: 6, fontSize: 24, subtitleSize: 10 },
    medium: { size: 150, strokeWidth: 8, fontSize: 32, subtitleSize: 12 },
    large: { size: 200, strokeWidth: 10, fontSize: 40, subtitleSize: 14 },
  }[size] || { size: 150, strokeWidth: 8, fontSize: 32, subtitleSize: 12 };

  const { size: circleSize, strokeWidth, fontSize, subtitleSize } = dimensions;
  const radius = circleSize / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  // Determine color based on percentage
  const getColor = () => {
    if (percentage >= 75) return "var(--success-600, #059669)";
    if (percentage >= 50) return "var(--warning-500, #f59e0b)";
    return "var(--danger-600, #dc2626)";
  };

  // Animation for percentage counter
  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const end = Math.min(percentage, 100);
    const startTime = performance.now();

    const animateValue = (timestamp) => {
      const progress = Math.min((timestamp - startTime) / animationDuration, 1);
      const value = Math.floor(progress * (end - start) + start);

      setDisplayPercentage(value);

      if (progress < 1) {
        requestAnimationFrame(animateValue);
      }
    };

    requestAnimationFrame(animateValue);
  }, [percentage, animationDuration, isVisible]);

  // Animation for circle progress
  useEffect(() => {
    if (!circleRef.current || !isVisible) return;

    const dashoffset = circumference * (1 - Math.min(percentage, 100) / 100);

    // Set initial state
    circleRef.current.style.strokeDasharray = circumference;
    circleRef.current.style.strokeDashoffset = circumference;

    // Trigger animation
    setTimeout(() => {
      circleRef.current.style.transition = `stroke-dashoffset ${animationDuration}ms ease-in-out`;
      circleRef.current.style.strokeDashoffset = dashoffset;
    }, 50);
  }, [percentage, circumference, animationDuration, isVisible]);

  // Intersection Observer to trigger animation when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const element = circleRef.current?.parentElement;
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <svg
        width={circleSize}
        height={circleSize}
        viewBox={`0 0 ${circleSize} ${circleSize}`}
      >
        {/* Background circle */}
        <circle
          cx={circleSize / 2}
          cy={circleSize / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          ref={circleRef}
          cx={circleSize / 2}
          cy={circleSize / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          className="progress-ring-circle"
        />
        {/* Percentage text */}
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize={fontSize}
          fontWeight="bold"
          fill={getColor()}
        >
          {displayPercentage}%
        </text>
      </svg>
      {title && (
        <h3 className="mt-2 text-center font-medium text-gray-900">{title}</h3>
      )}
      {subtitle && (
        <p className="mt-1 text-center text-gray-500 text-sm">{subtitle}</p>
      )}
    </div>
  );
}
