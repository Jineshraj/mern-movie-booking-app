import { useEffect, useState } from "react";
import { footerStyles } from "../assets/dummyStyles";
import {
  ArrowUp,
  Clapperboard,
  Facebook,
  Film,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Popcorn,
  Star,
  Ticket,
  Twitter,
  Youtube,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear;

  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const links = [
    { label: "Home", href: "/" },
    { label: "Movies", href: "/movies" },
    { label: "Releases", href: "/releases" },
    { label: "Contact", href: "/contact" },
    { label: "Login", href: "/login" },
  ];

  const genreLinks = [
    { id: 1, label: "Horror", href: "/movies" },
    { id: 2, label: "Thriller", href: "/movies" },
    { id: 3, label: "Action", href: "/movies" },
    { id: 4, label: "Drama", href: "/movies" },
    { id: 5, label: "Comedy", href: "/movies" },
  ];

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Array of icon components for the floating animation
  const floatingIcons = [Clapperboard, Film, Star, Ticket, Popcorn];

  return (
    <>
      <div className={footerStyles.animatedBorder}></div>
      <footer className={footerStyles.footer}>
        <div className={footerStyles.animatedBorder}></div>
        <div className={footerStyles.bgContainer}>
          <div className={footerStyles.bgGlow1}></div>
          <div className={footerStyles.bgGlow1}></div>
        </div>
        {/* Floating icons - hidden on small devices to avoid overlap; still visible on md+ (tablet & desktop) */}
        <div className={footerStyles.floatingIconsContainer}>
          {[...Array(12)].map((_, i) => {
            const IconComponent = floatingIcons[i % floatingIcons.length];
            const left = (i * 23) % 100;
            const top = (i * 17) % 100;
            const dur = 6 + (i % 5);
            const delay = (i % 4) * 0.6;
            return (
              <div
                key={i}
                className={footerStyles.floatingIcon}
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  animation: `float ${dur}s infinite ease-in-out`,
                  animationDelay: `${delay}s`,
                }}
              >
                <IconComponent className="w-8 h-8" />
              </div>
            );
          })}
        </div>
        <div className={footerStyles.mainContainer}>
          <div className={footerStyles.gridContainer}>
            <div className={footerStyles.brandContainer}>
              <div className={footerStyles.brandLogoContainer}>
                <div className="relative">
                  <div className={footerStyles.logoGlow}></div>
                  <div className={footerStyles.logoContainer}>
                    <Clapperboard className={footerStyles.logoIcon} />
                  </div>
                </div>
                <h2
                  className={footerStyles.brandTitle}
                  style={{ fontFamily: "Monoton , cursive" }}
                >
                  Cine
                  <span className={footerStyles.brandTitleWhite}>Verse</span>
                </h2>
              </div>
              <p className={footerStyles.brandDescription}>
                Experience the dark side of cinema with the latest news, reviews
                and exclusive content.
              </p>
              <div className={footerStyles.socialContainer}>
                {[
                  { Icon: Facebook },
                  { Icon: Twitter },
                  { Icon: Instagram },
                  { Icon: Youtube },
                ].map((item, index) => (
                  <a href="#" key={index} className={footerStyles.socialLink}>
                    <item.Icon className={footerStyles.socialIcon} />
                  </a>
                ))}
              </div>
            </div>
            {/*
             QUICK LINKS SECTION
          */}
            <div>
              <h3 className={footerStyles.sectionHeader}>
                <div className={footerStyles.sectionDot} />
                Explore
              </h3>
              <ul className={footerStyles.linksList}>
                {links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className={footerStyles.linkItem}>
                      <span className={footerStyles.linkDot} />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className={footerStyles.sectionHeader}>
                <div className={footerStyles.sectionDot} />
                Genres
              </h3>
              <ul className={footerStyles.linksList}>
                {genreLinks.map((link) => (
                  <li key={link.id}>
                    <a href={link.href} className={footerStyles.linkItem}>
                      <span className={footerStyles.linkDot} />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {/*
              Contact Info 
              */}
            <div>
              <h3 className={footerStyles.sectionHeader}>
                <div className={footerStyles.sectionDot} />
                Contact Us
              </h3>
              <ul className={footerStyles.contactList}>
                <li className={footerStyles.contactItem}>
                  <div className={footerStyles.contactIconContainer}>
                    <Mail className={footerStyles.contactIcon} />
                  </div>
                  <span className={footerStyles.contactText}>
                    jineshr101@gmail.com
                  </span>
                </li>
                <li className={footerStyles.contactItem}>
                  <div className={footerStyles.contactIconContainer}>
                    <Phone className={footerStyles.contactIcon} />
                  </div>
                  <span className={footerStyles.contactText}>
                    +91 9207611706
                  </span>
                </li>
                <li className={footerStyles.contactItem}>
                  <div className={footerStyles.contactIconContainer}>
                    <MapPin className={footerStyles.contactIcon} />
                  </div>
                  <span className={footerStyles.contactText}>
                    Kerala, India
                  </span>
                </li>
              </ul>
            </div>
          </div>
          {/*
                DIVIDERS
            */}
          <div className={footerStyles.bottomBar}>
            <div className={footerStyles.designedBy}>
              <span className={footerStyles.designedByText}>Designed By</span>
              <a
                href="https://github.com/Jineshraj"
                target="_blank"
                className={footerStyles.designedByLink}
                rel="noopener noreferrer"
              >
                Jinesh R
              </a>
            </div>
            {/*
                  POLICYLINKS
              */}

            <div className={footerStyles.policyLinks}>
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                (item, index) => (
                  <a key={index} href="#" className={footerStyles.policyLink}>
                    {item}
                  </a>
                )
              )}
            </div>
          </div>
        </div>
        {isVisible && (
          <button
            onClick={scrollToTop}
            className={footerStyles.scrollTopButton}
          >
            <ArrowUp className={footerStyles.scrollTopIcon} />
          </button>
        )}
        <style>{footerStyles.customCSS}</style>
      </footer>
    </>
  );
};

export default Footer;
