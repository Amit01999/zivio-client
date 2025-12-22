import React from 'react';

export default function CTAHome() {
  return (
    <section className="relative overflow-hidden py-24 bg-gradient-to-br from-[#75577A] dark:from-[#5A4260] via-[#6A4F70] dark:via-[#4A3850] to-[#5A4260] dark:to-[#3A2840]">
      {/* Glow effects */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#E8CDD1]/30 dark:bg-[#E8CDD1]/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#B89BB0]/30 dark:bg-[#B89BB0]/10 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-6 md:px-12 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
          Ready to Find Your{' '}
          <span className="bg-gradient-to-r from-[#E8CDD1] dark:from-[#D8BDC1] to-white dark:to-gray-200 bg-clip-text text-transparent">
            Perfect Property?
          </span>
        </h2>

        <p className="text-lg md:text-xl text-[#E8CDD1] dark:text-[#D8BDC1] max-w-2xl mx-auto mb-10">
          Join thousands of satisfied users who found their dream homes with{' '}
          <span className="text-white dark:text-gray-100 font-semibold">Zivio Living</span>.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          {/* Browse Properties */}
          <a href="/search">
            <button
              className="px-9 py-4 rounded-full font-semibold
                bg-white dark:bg-gray-100 text-[#6A4F70] dark:text-[#5A4260]
                hover:bg-[#E8CDD1] dark:hover:bg-[#D8BDC1] hover:text-[#5A4260] dark:hover:text-[#4A3850]
                transition-all duration-300
                shadow-lg hover:shadow-2xl hover:scale-105"
            >
              Browse Properties
            </button>
          </a>

          {/* List Property */}
          <a href="/listings/new">
            <button
              className="px-9 py-4 rounded-full font-semibold
                border-2 border-white dark:border-gray-200 text-white dark:text-gray-100
                hover:bg-white dark:hover:bg-gray-100 hover:text-[#75577A] dark:hover:text-[#5A4260]
                transition-all duration-300
                shadow-lg hover:shadow-2xl hover:scale-105"
            >
              List Your Property
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}
