export default function CategoryNav() {
  const services = [
    {
      title: 'Buy Property',
      description:
        'Browse verified listings of land, plots, and apartments for sale across Bangladesh. Connect directly with trusted sellers and developers for a smooth and secure buying experience.',
      cta: 'Explore Properties',
      link: '/search?listingType=sale',
      illustration: (
        <svg viewBox="0 0 120 120" className="w-20 h-20">
          <path
            d="M 60 25 L 85 45 L 85 80 L 35 80 L 35 45 Z"
            fill="#75577A"
            stroke="#75577A"
            strokeWidth="2"
          />
          <rect x="50" y="60" width="20" height="20" fill="#FFF" rx="1" />
          <ellipse
            cx="60"
            cy="95"
            rx="30"
            ry="8"
            fill="#75577A"
            opacity="0.25"
          />
        </svg>
      ),
    },
    {
      title: 'Rent Property',
      description:
        'Find the perfect rental home, apartment, or commercial space in Bangladesh. Our platform offers hundreds of listings to match your budget and lifestyle needs effortlessly.',
      cta: 'Browse Rentals',
      link: '/search?listingType=rent',
      featured: true,
      illustration: (
        <svg
          viewBox="0 0 120 120"
          className="w-20 h-20"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Building */}
          <rect x="38" y="30" width="44" height="50" rx="4" fill="#75577A" />
          {/* Windows */}
          <rect x="45" y="38" width="8" height="10" fill="#FFF" />
          <rect x="59" y="38" width="8" height="10" fill="#FFF" />
          <rect x="45" y="54" width="8" height="10" fill="#FFF" />
          <rect x="59" y="54" width="8" height="10" fill="#FFF" />

          {/* Door */}
          <rect x="55" y="65" width="10" height="15" fill="#FFF" rx="1" />

          {/* Key (subtle, professional) */}
          <circle cx="76" cy="78" r="4" fill="#75577A" />
          <rect x="78" y="77" width="12" height="2" fill="#75577A" />
          <rect x="86" y="75" width="2" height="4" fill="#75577A" />
        </svg>
      ),
    },
    {
      title: 'Sell Property',
      description:
        'List your land, apartment, or property on LandBangladesh.com and reach thousands of serious buyers nationwide. Post your property quickly and sell confidently with ease.',
      cta: 'List Your Property',
      link: '/listings/new',
      illustration: (
        <svg viewBox="0 0 120 120" className="w-20 h-20">
          <path
            d="M 60 30 L 80 45 L 80 70 L 40 70 L 40 45 Z"
            fill="#75577A"
            stroke="#75577A"
            strokeWidth="2"
          />
          <path
            d="M 30 85 L 90 85 L 90 95 L 30 95 Z"
            fill="#75577A"
            opacity="0.6"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="relative w-full py-20 bg-gradient-to-b from-[#F6F2F7] dark:from-gray-800 to-white dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="inline-block text-sm font-semibold tracking-wider text-[#75577A] dark:text-[#A88AAD] uppercase mb-4">
            Our Services
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
            Our Main Focus
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-base">
            Everything you need to buy, rent, or sell property — in one trusted
            platform
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <div
              key={index}
              className={`
                group relative rounded-3xl p-10
                transition-all duration-500
                bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl
                border
                ${
                  service.featured
                    ? 'border-[#75577A] dark:border-[#A88AAD] shadow-2xl scale-[1.03]'
                    : 'border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-2xl'
                }
                hover:-translate-y-2
              `}
            >
              {/* Glow */}
              <div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500
                bg-gradient-to-br from-[#75577A]/20 dark:from-[#A88AAD]/20 via-transparent to-transparent blur-2xl"
              />

              {/* Icon */}
              <div className="relative z-10 flex justify-center mb-8">
                <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gradient-to-br from-[#F1E6EA] dark:from-[#75577A]/40 to-[#E1CBD4] dark:to-[#A88AAD]/40 shadow-inner">
                  {service.illustration}
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10 text-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {service.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-8">
                  {service.description}
                </p>

                <a
                  href={service.link}
                  className={`
                    inline-flex items-center gap-2 font-semibold text-sm
                    ${
                      service.featured
                        ? 'text-white bg-[#75577A] dark:bg-[#8B6C90] px-6 py-3 rounded-full hover:bg-[#5E4663] dark:hover:bg-[#A88AAD]'
                        : 'text-[#75577A] dark:text-[#A88AAD] hover:gap-3'
                    }
                    transition-all duration-300
                  `}
                >
                  {service.cta}
                  <span>→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
