import { useEffect, useRef, useState } from "react";
import { navbarStyles, navbarCSS } from "../assets/dummyStyles";
import {
  Calendar,
  Clapperboard,
  Film,
  Home,
  LogOut,
  Mail,
  Menu,
  Ticket,
  User,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [userEmail, setUserEmail] = useState("");

  const menuRef = useRef(null);

  {
    /* to CHECK isScrolled useState*/
  }
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => removeEventListener("scroll", handleScroll);
  }, []);

  {
    /* TO KEEP USERS LOGGINED */
  }

  // This block runs once when the app starts
  useEffect(() => {
    const readAuthFromStorage = () => {
      // 1. Try to read the main data object
      const json = localStorage.getItem("cine_auth");
      if (json) {
        try {
          const parsed = JSON.parse(json);
          setIsLoggedIn(Boolean(parsed?.isLoggedIn));
          setUserEmail(parsed?.email || "");
          return;
        } catch (err) {}
      }

      // 2. Backup: Check for simple login flags or email keys
      const simpleFlag = localStorage.getItem("isLoggedIn");
      const email =
        localStorage.getItem("userEmail") ||
        localStorage.getItem("cine_user_email");
      if (simpleFlag === "true") {
        setIsLoggedIn(true);
        setUserEmail(email || "");
        return;
      }

      // 3. Last resort: If email exists but no flag, still log them in
      if (email) {
        setIsLoggedIn(true);
        setUserEmail(email);
        return;
      }

      // 4. Default: No data found, user is logged out
      setIsLoggedIn(false);
      setUserEmail("");
    };

    readAuthFromStorage();

    // This part listens for login/logout actions in OTHER browser tabs
    const onStorage = (e) => {
      if (
        ["cine_auth", "isLoggedIn", "userEmail", "cine_user_email"].includes(
          e.key
        )
      ) {
        readAuthFromStorage();
      }
    };
    window.addEventListener("storage", onStorage);

    // Clean up the listener when the component is closed
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  {
    /* RESIZING AND ESCAPE KEY CONTROL */
  }
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("cine_auth");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("cine_user_email");
    setIsLoggedIn(false);
    setUserEmail("");
    window.location.href = "/login";
  };

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

          {/* DESKTOP VIEW */}
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

          {/* TABLET VIEW */}
          <div className={navbarStyles.rightSection}>
            <div className={navbarStyles.tabletNav}>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    end
                    className={({ isActive }) =>
                      `${navbarStyles.tabletNavLink.base} ${
                        isActive
                          ? navbarStyles.tabletNavLink.active
                          : navbarStyles.tabletNavLink.inactive
                      }`
                    }
                  >
                    <Icon className={navbarStyles.tabletNavIcon} />
                    <span className={navbarStyles.tabletNavText}>
                      {item.label}
                    </span>
                    {/*<div className="pill-underline"></div>*/}
                  </NavLink>
                );
              })}
            </div>

            {/* AUTH SECTION */}
            <div className={navbarStyles.authSection}>
              <div className={navbarStyles.desktopAuth}>
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className={navbarStyles.logoutButton}
                    title={userEmail || "Logout"}
                  >
                    <LogOut className={navbarStyles.authIcon} />
                    <span>Logout</span>
                  </button>
                ) : (
                  <a href="/login" className={navbarStyles.loginButton}>
                    <User className={navbarStyles.authIcon} />
                    <span>Login</span>
                  </a>
                )}
              </div>

              {/* TOGGLE FUNCTION */}
              <div className={navbarStyles.mobileMenuToggle}>
                <button
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                  className={navbarStyles.mobileMenuButton}
                >
                  {isMenuOpen ? (
                    <X className={navbarStyles.mobileMenuIcon} />
                  ) : (
                    <Menu className={navbarStyles.mobileMenuIcon} />
                  )}
                </button>
              </div>
            </div>
          </div>
          {isMenuOpen && (
            <div ref={menuRef} className={navbarStyles.mobileMenuPanel}>
              <div className={navbarStyles.mobileMenuItems}>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.id}
                      onClick={() => setIsMenuOpen(false)}
                      to={item.path}
                      end
                      className={({ isActive }) => {
                        return `${navbarStyles.mobileNavLink.base} ${
                          isActive
                            ? navbarStyles.mobileNavLink.active
                            : navbarStyles.mobileNavLink.inactive
                        }`;
                      }}
                    >
                      <Icon className={navbarStyles.mobileNavIcon} />
                      <span className={navbarStyles.mobileNavText}>
                        {item.label}
                      </span>
                    </NavLink>
                  );
                })}

                {/* MOBILE AUTH SECTION */}
                <div className={navbarStyles.mobileAuthSection}>
                  {isLoggedIn ? (
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                      }}
                      className={navbarStyles.mobileLogoutButton}
                    >
                      <LogOut className={navbarStyles.mobileAuthIcon} />
                      Logout
                    </button>
                  ) : (
                    <a href="/login" className={navbarStyles.mobileLoginButton}>
                      <User className={navbarStyles.mobileAuthIcon} />
                      Login
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <style>{navbarCSS}</style>
      </nav>
    </>
  );
};

export default Navbar;
