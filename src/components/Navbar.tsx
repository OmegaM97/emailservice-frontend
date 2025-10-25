import { useState } from "react";
import { BookOpen, Mail, Menu, Sun, Moon, X } from "lucide-react";

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Navbar({ darkMode, toggleDarkMode }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav
      className={`w-full py-4 px-6 md:px-8 flex justify-between items-center fixed top-0 z-50 transition-all duration-500 ${
        darkMode
          ? "bg-gradient-to-r from-gray-900 via-blue-950 to-gray-900 text-white border-b border-gray-800"
          : "bg-white/90 backdrop-blur-md text-gray-800 border-b border-blue-100"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
          <Mail className="text-white" size={22} />
        </div>
        <h1 className="text-2xl font-bold text-blue-600">EmailService</h1>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-8 items-center">
        <a
          href="#documentation"
          className="font-semibold hover:text-blue-500 transition-all duration-300 relative group"
        >
          <div className="flex items-center gap-1">
            <BookOpen size={18} />
            Documentation
          </div>
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full" />
        </a>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className={`relative w-16 h-8 rounded-full p-1 transition-all duration-500 transform hover:scale-110 ${
            darkMode
              ? "bg-gradient-to-r from-blue-700 to-blue-900"
              : "bg-gradient-to-r from-blue-400 to-blue-600"
          } shadow-md`}
        >
          <div
            className={`w-6 h-6 rounded-full bg-white shadow transform transition-all duration-500 ${
              darkMode ? "translate-x-8" : "translate-x-0"
            } flex items-center justify-center`}
          >
            {darkMode ? (
              <Moon size={14} className="text-blue-700" />
            ) : (
              <Sun size={14} className="text-blue-500" />
            )}
          </div>
        </button>
      </div>

      {/* Mobile Menu Button */}
      <div className="flex md:hidden items-center gap-4">
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-xl transition-all duration-300 ${
            darkMode
              ? "bg-gray-800 hover:bg-gray-700"
              : "bg-blue-100 hover:bg-blue-200"
          }`}
        >
          {darkMode ? (
            <Moon size={18} />
          ) : (
            <Sun size={18} className="text-blue-600" />
          )}
        </button>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`p-2 rounded-xl transition-all duration-300 ${
            darkMode
              ? "bg-gray-800 hover:bg-gray-700"
              : "bg-blue-100 hover:bg-blue-200"
          }`}
        >
          {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className={`absolute top-full left-0 right-0 md:hidden transition-all duration-500 ${
            darkMode
              ? "bg-gradient-to-r from-gray-900 via-blue-950 to-gray-900 border-b border-gray-800"
              : "bg-white/95 backdrop-blur-md border-b border-blue-100"
          }`}
        >
          <div className="px-6 py-4 space-y-4">
            <a
              href="#documentation"
              className="block py-3 font-semibold hover:text-blue-500 transition-all duration-300 border-b border-gray-700 dark:border-gray-600"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center gap-2">
                <BookOpen size={18} /> Documentation
              </div>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
