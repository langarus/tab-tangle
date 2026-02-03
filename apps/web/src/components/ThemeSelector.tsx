import { useState, useRef, useEffect } from "react";
import { useTheme } from "../common/theme";

const SunIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const MoonIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

export function ThemeSelector() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const options = [
    {
      value: "system",
      label: "System",
    },
    {
      value: "light",
      label: "Light",
    },
    {
      value: "dark",
      label: "Dark",
    },
  ];

  const currentOption = options.find((o) => o.value === theme) || options[0];

  // Show icon based on resolved theme (what's actually being displayed)
  const CurrentIcon = resolvedTheme === "dark" ? MoonIcon : SunIcon;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800 transition-colors"
        title={`Theme: ${currentOption.label}`}
      >
        <CurrentIcon className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
          {options.map((option) => {
            // For each option, show what icon it would result in
            const OptionIcon = option.value === "dark" ? MoonIcon :
                              option.value === "light" ? SunIcon :
                              resolvedTheme === "dark" ? MoonIcon : SunIcon;
            return (
              <button
                key={option.value}
                onClick={() => {
                  setTheme(option.value as "system" | "light" | "dark");
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2.5 transition-colors ${
                  theme === option.value
                    ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                <OptionIcon />
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
