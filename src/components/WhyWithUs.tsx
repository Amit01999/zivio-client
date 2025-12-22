import React, { useState, useEffect, useRef } from 'react';

const ScrollStickySection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const mockData = [
    {
      id: '01',
      title: 'Why Sell With Us',
      shortMobileText:
        'Expert valuation, premium marketing, and a seamless sale experience.',
      highlightShort: 'Elevate your property with a premium selling strategy.',
      image:
        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=1200&fit=crop&q=80',
      buttonText: 'Sell With Us',
      buttonLink: '/register/',
    },
    {
      id: '02',
      title: 'Why Let With Us',
      shortMobileText:
        'Reliable tenants, 24/7 support, and stress-free property management.',
      highlightShort: 'Enjoy hassle-free rental income with expert care.',
      image:
        'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1200&h=1200&fit=crop&q=80',
      buttonText: 'Let With Us',
      buttonLink: '/register/',
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const { top, height } = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Adjusted math for smoother triggering on mobile
      const progress = -top / (height - windowHeight);

      const newIndex = Math.min(
        Math.max(0, Math.floor(progress * mockData.length + 0.3)),
        mockData.length - 1
      );

      if (newIndex !== activeIndex) setActiveIndex(newIndex);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeIndex]);

  return (
    <div
      ref={containerRef}
      className="relative bg-[#F7F5F6] dark:bg-gray-900 font-sans"
    >
      {/* Increased height slightly to 300vh for smoother scroll control on touch */}
      <div className="min-h-[300vh] relative">
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Decorative Vertical Accent Line */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[2px] h-full bg-gradient-to-b from-[#c9a7b3] dark:from-[#8B6C90] via-[#694E6F] dark:via-[#75577A] to-transparent opacity-40 pointer-events-none" />

          {/* Background Bars (Desktop) */}
          <div className="absolute inset-0 hidden md:block">
            <div className="absolute left-0 top-0 bottom-0 w-[40%] bg-[#694E6F] dark:bg-gray-800" />
            <div className="absolute right-0 top-0 bottom-0 w-[60%] bg-[#F7F5F6] dark:bg-gray-900" />
          </div>

          {/* Mobile Background Gradient */}
          <div className="absolute inset-0 md:hidden bg-gradient-to-b from-white dark:from-gray-900 to-[#f1eaec] dark:to-gray-800" />

          <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 h-full flex items-center">
            {mockData.map((item, index) => {
              const isActive = index === activeIndex;

              return (
                <div
                  key={index}
                  className={`absolute inset-0 flex justify-center items-center transition-all duration-700 ${
                    isActive
                      ? 'opacity-100 z-20 pointer-events-auto'
                      : 'opacity-0 z-10 pointer-events-none'
                  }`}
                >
                  {/* ============= MOBILE CARD ============= */}
                  <div className="w-full h-full flex items-center justify-center md:hidden pb-10">
                    <div
                      className={`w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl rounded-3xl overflow-hidden transform transition-all duration-700 ${
                        isActive
                          ? 'translate-y-0 opacity-100 scale-100'
                          : 'translate-y-12 opacity-0 scale-95'
                      }`}
                    >
                      {/* IMAGE */}
                      <div className="relative">
                        <img
                          src={item.image}
                          className="w-full h-[40vh] min-h-[250px] object-cover rounded-b-none"
                          alt={item.title}
                        />

                        {/* Top Gradient Line */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                      </div>

                      <div className="p-6 relative">
                        {/* Thin Accent Line */}
                        <div className="absolute left-0 top-6 h-10 w-[3px] rounded-full bg-[#694E6F] dark:bg-[#A88AAD]" />

                        <h2 className="text-3xl font-bold mb-4 ml-4 tracking-tight text-[#694E6F] dark:text-[#A88AAD]">
                          {item.title}
                        </h2>

                        <p className="text-gray-700 dark:text-gray-300 text-base mb-3 ml-4">
                          {item.shortMobileText}
                        </p>

                        <p className="font-semibold text-base ml-4 text-[#694E6F] dark:text-[#A88AAD]">
                          {item.highlightShort}
                        </p>

                        <a
                          href={item.buttonLink}
                          className="mt-6 ml-4 inline-flex items-center gap-3 font-semibold text-lg text-[#694E6F] dark:text-[#A88AAD]"
                        >
                          <span className="border-b-2 border-current pb-0.5">
                            {item.buttonText}
                          </span>

                          <span className="w-10 h-10 rounded-full flex items-center justify-center shadow-md bg-[#E8CCD1] dark:bg-[#75577A]">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="black"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                              />
                            </svg>
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* ============= DESKTOP ============= */}
                  <div
                    className={`hidden md:grid lg:grid-cols-2 grid-cols-1 gap-16 items-center w-full transition-all duration-700 ${
                      isActive
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-8'
                    }`}
                  >
                    {/* IMAGE */}
                    <div className="relative">
                      <div
                        className="overflow-hidden rounded-3xl shadow-2xl transition-all duration-700"
                        style={{
                          transform: isActive ? 'scale(1)' : 'scale(0.95)',
                          boxShadow:
                            '0 25px 60px rgba(0,0,0,0.25), inset 0 0 40px rgba(255,255,255,0.15)',
                        }}
                      >
                        <img
                          src={item.image}
                          className="w-full h-[580px] object-cover"
                          alt={item.title}
                        />

                        <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent" />
                      </div>

                      {/* Stylish Underline Accent */}
                      <div className="absolute -bottom-5 left-6 w-[85%] h-[3px] rounded-full bg-gradient-to-r from-[#E8CCD1] dark:from-[#75577A] to-transparent" />
                    </div>

                    {/* TEXT */}
                    <div className="relative">
                      {/* Thin Vertical Line */}
                      <div className="absolute -left-4 top-0 w-[3px] h-20 rounded-full bg-[#E8CCD1] dark:bg-[#75577A]" />

                      <h2 className="text-5xl font-extrabold mb-10 leading-tight text-[#694E6F] dark:text-[#A88AAD]">
                        {item.title}
                      </h2>

                      <p className="text-gray-700 dark:text-gray-300 text-lg mb-6 max-w-lg leading-relaxed">
                        {item.shortMobileText}
                      </p>

                      <p className="font-semibold text-xl mb-6 text-[#694E6F] dark:text-[#A88AAD]">
                        {item.highlightShort}
                      </p>

                      <a
                        href={item.buttonLink}
                        className="inline-flex items-center gap-4 text-xl font-bold group text-[#694E6F] dark:text-[#A88AAD]"
                      >
                        <span className="relative">
                          {item.buttonText}
                          <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-current transition-all duration-300 group-hover:w-full" />
                        </span>

                        <span className="w-12 h-12 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-all bg-[#E8CCD1] dark:bg-[#75577A]">
                          <svg
                            className="w-6 h-6 text-black dark:text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress Dots (Desktop Only) */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3">
            {mockData.map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeIndex === i
                    ? 'bg-[#E8CCD1] dark:bg-[#A88AAD] scale-125 shadow-md'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollStickySection;
