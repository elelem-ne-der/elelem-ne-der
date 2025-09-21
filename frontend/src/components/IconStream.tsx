"use client";
import React, { useEffect, useRef } from "react";

const ICONS = [
  "fa-solid fa-book-open",
  "fa-solid fa-bookmark",
  "fa-brands fa-react",
  "fa-solid fa-dna",
  "fa-solid fa-microscope",
  "fa-solid fa-superscript",
  "fa-solid fa-square-root-variable",
];

export default function IconStream() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const idRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const activeLefts: number[] = [];

    function spawn() {
      // avoid too-close horizontal positions
      let attempts = 0;
      let left: number;
      do {
        left = Math.floor(Math.random() * 96); // 0..95%
        attempts++;
      } while (activeLefts.some((l) => Math.abs(l - left) < 8) && attempts < 12);

      const icon = ICONS[Math.floor(Math.random() * ICONS.length)];
      const size = 20 + Math.floor(Math.random() * 60); // px
      const duration = 18 + Math.random() * 36; // seconds
      const el = document.createElement("i");
      el.className = `${icon} stream-icon`;
      el.style.left = `${left}%`;
      el.style.fontSize = `${size}px`;
      el.style.animationDuration = `${duration}s`;
      el.style.top = `-30vh`;
      el.style.pointerEvents = "none";
      el.style.opacity = `${0.08 + Math.random() * 0.18}`;

      container.appendChild(el);
      activeLefts.push(left);

      // Remove element after it finishes animation
      const removeAfter = (duration + 1) * 1000;
      const timeout = window.setTimeout(() => {
        if (container.contains(el)) container.removeChild(el);
        const idx = activeLefts.indexOf(left);
        if (idx > -1) activeLefts.splice(idx, 1);
        window.clearTimeout(timeout);
      }, removeAfter);
    }

    // spawn continuously
    const interval = window.setInterval(spawn, 300);
    // initial burst
    for (let i = 0; i < 20; i++) window.setTimeout(spawn, i * 120);

    return () => {
      window.clearInterval(interval);
      if (container) container.innerHTML = "";
    };
  }, []);

  return <div ref={containerRef} className="icon-stream" aria-hidden />;
}
