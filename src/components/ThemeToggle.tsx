import { useTheme } from '@/lib/theme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      data-testid="button-theme-toggle"
      aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
      className={`relative h-9 w-[76px] overflow-hidden rounded-full border-2 shadow-[inset_0_2px_5px_rgba(0,0,0,0.16),0_8px_18px_rgba(48,35,53,0.12)] transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#401F48]/35 focus-visible:ring-offset-2 ${
        isLight
          ? 'border-[#E8CDD1] bg-[#F5F0EA]'
          : 'border-[#401F48] bg-[#0B0610]'
      }`}
    >
      <span
        className={`absolute inset-0 transition-opacity duration-500 ${
          isLight ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span className="absolute inset-0 bg-gradient-to-r from-[#F5F0EA] via-[#E8CDD1]/45 to-[#F5F0EA]" />
        <span className="absolute bottom-0 left-9 h-5 w-3 rounded-t-[3px] bg-[#401F48]/22" />
        <span className="absolute bottom-0 left-[50px] h-6 w-4 rounded-t-[3px] bg-[#401F48]/28" />
        <span className="absolute bottom-0 right-1 h-4 w-4 rounded-t-[3px] bg-[#401F48]/18" />
        <span className="absolute left-[53px] top-4 h-0.5 w-0.5 bg-[#F5F0EA]/80" />
        <span className="absolute left-[58px] top-4 h-0.5 w-0.5 bg-[#F5F0EA]/80" />
        <span className="absolute left-[53px] top-6 h-0.5 w-0.5 bg-[#F5F0EA]/70" />
        <span className="absolute left-[58px] top-6 h-0.5 w-0.5 bg-[#F5F0EA]/70" />
        <span className="absolute left-11 top-0 h-full w-4 -skew-x-12 bg-white/24" />
      </span>

      <span
        className={`absolute inset-0 transition-opacity duration-500 ${
          isLight ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <span className="absolute inset-0 bg-gradient-to-r from-[#0B0610] via-[#17091C] to-[#300f38]" />
        <span className="absolute bottom-0 left-2 h-4 w-3 rounded-t-[2px] bg-[#F5F0EA]/16" />
        <span className="absolute bottom-0 left-5 h-6 w-4 rounded-t-[2px] bg-[#F5F0EA]/20" />
        <span className="absolute bottom-0 left-10 h-5 w-3 rounded-t-[2px] bg-[#F5F0EA]/14" />
        <span className="absolute bottom-0 left-[52px] h-7 w-4 rounded-t-[2px] bg-[#F5F0EA]/18" />
        <span className="absolute left-[25px] top-3 h-0.5 w-0.5 bg-[#E8CDD1]" />
        <span className="absolute left-[31px] top-3 h-0.5 w-0.5 bg-[#E8CDD1]" />
        <span className="absolute left-[25px] top-5 h-0.5 w-0.5 bg-[#E8CDD1]/80" />
        <span className="absolute left-[31px] top-5 h-0.5 w-0.5 bg-[#E8CDD1]/80" />
        <span className="absolute left-[56px] top-2.5 h-0.5 w-0.5 bg-[#E8CDD1]" />
        <span className="absolute left-[61px] top-4.5 h-0.5 w-0.5 bg-[#E8CDD1]/80" />
        <span className="absolute left-8 top-0 h-full w-5 -skew-x-12 bg-white/7" />
      </span>

      <span
        className={`absolute top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-500 ${
          isLight
            ? 'left-1 bg-[#401F48] shadow-[inset_-3px_-4px_0_rgba(0,0,0,0.22),0_2px_4px_rgba(0,0,0,0.20)]'
            : 'left-[41px] bg-[#F5F0EA] shadow-[inset_-3px_-4px_0_rgba(64,31,72,0.18),0_2px_4px_rgba(0,0,0,0.28)]'
        }`}
      >
        <span
          className={`absolute bottom-1.5 left-1.5 h-4 w-4 rounded-sm transition-colors duration-500 ${
            isLight ? 'bg-[#F5F0EA]' : 'bg-[#401F48]'
          }`}
        />
        <span
          className={`absolute left-2 top-2 h-1 w-1 transition-colors duration-500 ${
            isLight ? 'bg-[#401F48]' : 'bg-[#F5F0EA]'
          }`}
        />
        <span
          className={`absolute right-2 top-2 h-1 w-1 transition-colors duration-500 ${
            isLight ? 'bg-[#401F48]' : 'bg-[#F5F0EA]'
          }`}
        />
        <span
          className={`absolute bottom-2 left-1/2 h-1.5 w-1 -translate-x-1/2 transition-colors duration-500 ${
            isLight ? 'bg-[#401F48]' : 'bg-[#F5F0EA]'
          }`}
        />
      </span>
    </button>
  );
}
