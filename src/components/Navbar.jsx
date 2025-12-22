import { useState } from "react";
import { navbarStyles, navbarCSS } from "../assets/dummyStyles";
import { Calendar, Clapperboard, Film, Home, Mail, Ticket } from "lucide-react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navItems = [
    { id: "home", label: "Home", icon: Home, path: "/" },
    { id: "movies", label: "Movies", icon: Film, path: "/movies" },
    { id: "releases", label: "Releases", icon: Calendar, path: "/releases" },
    { id: "contact", label: "Contact", icon: Mail, path: "/contact" },
    { id: "bookings", label: "Bookings", icon: Ticket, path: "/bookings" },
  ];

  return (
    <>
      <nav
        className={`${navbarStyles.nav.base} ${
          isScrolled ? navbarStyles.nav.scrolled : navbarStyles.nav.notScrolled
        }`}
      >
        <div className={navbarStyles.container}>
          <div className={navbarStyles.logoContainer}>
            <div className={navbarStyles.logoIconContainer}>
              <Clapperboard className={navbarStyles.logoIcon} />
            </div>
            <div className={navbarStyles.logoText}>CineVerse</div>
          </div>
          <div className={navbarStyles.desktopNav}>
            <div className={navbarStyles.desktopNavItems}>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className={navbarStyles.desktopNavItem}>
                    <NavLink
                      to={item.path}
                      end
                      className={({ isActive }) =>
                        `${navbarStyles.desktopNavLink.base} ${
                          isActive
                            ? navbarStyles.desktopNavLink.active
                            : navbarStyles.desktopNavLink.inactive
                        }`
                      }
                    >
                      <Icon className={navbarStyles.desktopNavIcon} />
                      <span> {item.label} </span>
                      <div className="pill-underline"></div>
                    </NavLink>
                    <span className="pill-border"></span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
