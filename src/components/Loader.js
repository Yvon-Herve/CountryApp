import React, { useEffect, useState } from "react";

const Loader = ({ setLoading }) => {
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadingOut(true);
      setTimeout(() => {
        setLoading(false);
      }, 400);
    }, 15000);

    return () => clearTimeout(timer);
  }, [setLoading]);

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center bg-slate-900 transition-opacity duration-400 ${
        fadingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex space-x-4 text-white-400 text-6xl font-bold tracking-widest">
        {"CHARGEMENT".split("").map((letter, index) => (
          <span
            key={index}
            className="animate-flash"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Loader;
