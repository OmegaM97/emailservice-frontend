import { motion } from "framer-motion";
import { Twitter, Instagram, Linkedin } from "lucide-react";

interface SocialIconProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const SocialIcon: React.FC<SocialIconProps> = ({ href, icon, label }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 hover:scale-110"
    whileTap={{ scale: 0.95 }}
    aria-label={label}
  >
    {icon}
  </motion.a>
);

interface FooterProps {
  darkMode: boolean;
}

export default function Footer({ darkMode }: FooterProps) {
  return (
    <footer
      className={`px-8 py-8 mt-10 border-t transition-all duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 text-gray-100 border-gray-700"
          : "bg-gradient-to-br from-white via-blue-50 to-white text-gray-900 border-gray-200"
      }`}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Contact Section */}
        <div className="text-sm text-center md:text-left font-semibold">
          Email Service helps you connect with clients. Contact:{" "}
          <a
            href="mailto:client1.emailservice@gmail.com"
            className={`transition-colors ${
              darkMode
                ? "text-blue-400 hover:text-blue-300"
                : "text-blue-700 hover:text-blue-500"
            }`}
          >
            client1.emailservice@gmail.com
          </a>
        </div>

        {/* Social Icons Section */}
        <div className="flex items-center gap-3 justify-center md:justify-end">
          <SocialIcon
            href="https://twitter.com/om3ga_m"
            icon={
              <Twitter
                size={20}
                className={darkMode ? "text-blue-400" : "text-blue-700"}
              />
            }
            label="Twitter"
          />
          <SocialIcon
            href="https://www.instagram.com/om3ga_m/"
            icon={
              <Instagram
                size={20}
                className={darkMode ? "text-pink-400" : "text-pink-600"}
              />
            }
            label="Instagram"
          />
          <SocialIcon
            href="https://www.linkedin.com/in/omega-melese"
            icon={
              <Linkedin
                size={20}
                className={darkMode ? "text-blue-400" : "text-blue-700"}
              />
            }
            label="LinkedIn"
          />
        </div>
      </div>
    </footer>
  );
}
