import React, { useState } from "react";
import { Container, Logo, LogoutBtn } from "../index";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu, X } from "lucide-react";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const authStatus = useSelector((state) => state.auth.isAuthenticated);

  // Navigation Items
  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "Find Hospitals", slug: "/hospitals", active: true },
    { name: "AI Chatbot", slug: "/chatbot", active: true },
    { name: "Dashboard", slug: "/patient/dashboard", active: authStatus },
    // { name: "Book Appointment", slug: "/appointments", active: authStatus },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
  ];

  const NavItem = ({ item }) => (
    <NavLink
      to={item.slug}
      className={({ isActive }) =>
        `px-4 py-2 rounded-lg transition-all duration-200  font-medium ${
          isActive ? "text-[#2196f3]" : "text-white hover:bg-[#2196f3] hover:text-white"
        }`
      }
      onClick={() => setIsMenuOpen(false)} // ✅ Closes mobile menu when clicking a link
    >
      {item.name}
    </NavLink>
  );

  return (
    <header className="sticky top-0 z-50 bg-[#58656a] text-gray-700 shadow-md">
      <Container padding>
        <nav className="py-0" aria-label="Main Navigation">
          <div className="flex items-center justify-between">
            {/* Logo Section - Don't wrap Logo in Link since Logo already has a Link */}
            <div className="flex items-center">
              <Logo />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {navItems.filter((item) => item.active).map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
              {authStatus && <LogoutBtn aria-label="Logout" />}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-700 bg-blue-500 rounded-lg hover:bg-[#2196f3] hover:text-white transition"
                aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div
            className={`md:hidden mt-4 pb-4 transition-all duration-300 ease-in-out ${
              isMenuOpen ? "opacity-100 scale-100 block" : "opacity-0 scale-95 sr-only"
            }`}
          >
            <div className="flex flex-col space-y-2">
              {navItems.filter((item) => item.active).map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
              {authStatus && <LogoutBtn aria-label="Logout" />}
            </div>
          </div>
        </nav>
      </Container>
    </header>
  );
}

export default Header;