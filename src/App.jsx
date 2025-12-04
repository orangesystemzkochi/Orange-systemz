import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Laptop, Wrench, Info, Phone } from "lucide-react";

/* -------- ANALYTICS HELPER (GA4) -------- */

function trackEvent(name, params = {}) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", name, params);
  }
}

/* -------- NAV ITEMS SHARED BY HEADER + MOBILE -------- */

const NAV_ITEMS = [
  { id: "hero", label: "Home", icon: Home },
  { id: "laptops", label: "Laptops", icon: Laptop },
  { id: "services", label: "Services", icon: Wrench },
  { id: "about", label: "About", icon: Info },
  { id: "contact", label: "Contact", icon: Phone },
];

/* -------- MOBILE CIRCLE NAV (FLOATING 3-LINE MENU) -------- */

function MobileCircleNav({ items, onItemClick }) {
  const [open, setOpen] = useState(false);

  const handleItemClick = (id, label) => {
    trackEvent("nav_click", {
      event_category: "navigation",
      event_label: `mobile_${label}`,
    });
    onItemClick(id);
    setOpen(false);
  };

  return (
    <>
      {/* blur overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* floating menu */}
      <div className="mobile-circle-nav">
        {/* main hamburger button */}
        <button
          className="circle-btn-main"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          <span className="burger" />
        </button>

        {/* menu items */}
        <AnimatePresence>
          {open &&
            items.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  className="circle-btn circle-btn-item"
                  initial={{ y: 0, opacity: 0, scale: 0.9 }}
                  animate={{
                    y: (index + 1) * 44,
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{ y: 0, opacity: 0, scale: 0.9 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: index * 0.05,
                  }}
                  onClick={() => handleItemClick(item.id, item.label)}
                >
                  <span className="circle-label">{item.label}</span>
                  <Icon className="circle-icon" />
                </motion.button>
              );
            })}
        </AnimatePresence>
      </div>
    </>
  );
}

/* -------- GOOGLE REVIEWS SECTION (ELFSIGHT + ANIMATION) -------- */

function GoogleReviewsSection() {
  useEffect(() => {
    if (
      !document.querySelector(
        'script[src="https://elfsightcdn.com/platform.js"]'
      )
    ) {
      const script = document.createElement("script");
      script.src = "https://elfsightcdn.com/platform.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <section className="section section-soft">
      <div className="container">
        <h2 className="section-title">What Our Customers Say</h2>

        <div className="google-reviews-outer">
          <motion.div
            className="google-reviews-inner"
            animate={{ translateY: "-50%" }}
            transition={{
              duration: 45,
              repeat: Infinity,
              ease: "linear",
              repeatType: "loop",
            }}
          >
            <div
              className="elfsight-app-6f0e31d3-07d7-42cb-9a0c-52719d5e180a"
              data-elfsight-app-lazy
            ></div>

            <div
              className="elfsight-app-6f0e31d3-07d7-42cb-9a0c-52719d5e180a"
              data-elfsight-app-lazy
            ></div>
          </motion.div>

          <div className="google-reviews-fade google-reviews-fade-top" />
          <div className="google-reviews-fade google-reviews-fade-bottom" />
        </div>
      </div>
    </section>
  );
}

/* -------- MAIN APP -------- */

export default function App() {
  const [showStickyWhatsApp, setShowStickyWhatsApp] = useState(false);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavClick = (id, sourceLabel) => (e) => {
    e.preventDefault();
    trackEvent("cta_click", {
      event_category: "engagement",
      event_label: sourceLabel || id,
    });
    scrollToSection(id);
  };

  // observe "Today’s Top Deals" section for sticky WhatsApp bar
  useEffect(() => {
    const target = document.getElementById("laptops");
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setShowStickyWhatsApp(entry.isIntersecting);
      },
      { threshold: 0.25 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  // Section view tracking (hero, services, laptops, about, contact)
  useEffect(() => {
    const sections = [
      { id: "hero", label: "section_hero" },
      { id: "services", label: "section_services" },
      { id: "laptops", label: "section_laptops" },
      { id: "about", label: "section_about" },
      { id: "contact", label: "section_contact" },
    ];

    const observers = [];

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry.isIntersecting) {
            trackEvent("section_view", {
              event_category: "engagement",
              event_label: section.label,
            });
            observer.unobserve(el); // only track first view per session
          }
        },
        { threshold: 0.4 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  return (
    <>
      {/* HEADER */}
      <header className="site-header">
        <div className="container header-inner">
          <a
            href="#hero"
            className="logo-wrap"
            onClick={handleNavClick("hero", "nav_logo")}
          >
            <img
              src="/images/Shop-Logo.png"
              alt="Orange Systemz"
              className="logo-img"
            />
          </a>

          <nav className="nav">
            <ul className="nav-links nav-links-desktop">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={handleNavClick(item.id, `nav_${item.id}`)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <a
            href="https://wa.me/917736012315"
            className="btn btn-small btn-primary header-whatsapp"
            target="_blank"
            rel="noopener"
            onClick={() =>
              trackEvent("whatsapp_click", {
                event_category: "conversion",
                event_label: "header_whatsapp",
              })
            }
          >
            WhatsApp Now
          </a>
        </div>
      </header>

      {/* MOBILE FLOATING MENU */}
      <MobileCircleNav items={NAV_ITEMS} onItemClick={scrollToSection} />

      {/* PAGE CONTENT */}
      <main>
        {/* HERO – animated */}
        <section id="hero" className="section hero">
          <div className="container hero-grid">
            <motion.div
              className="hero-text"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <h1>
                Get a Better Laptop for Less
                <span className="hero-highlight">in Kochi</span>
              </h1>
              <p className="hero-subtitle">
                Branded used laptops with warranty, plus expert repairs and
                upgrades — fully tested, cleaned and ready to use.
              </p>

              <motion.div
                className="hero-actions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <motion.a
                  href="#laptops"
                  onClick={handleNavClick("laptops", "hero_view_laptops")}
                  className="btn btn-primary btn-glow"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  View Laptops
                </motion.a>

                <motion.a
                  href="https://wa.me/917736012315"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-glow-outline"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() =>
                    trackEvent("whatsapp_click", {
                      event_category: "conversion",
                      event_label: "hero_whatsapp_best_deal",
                    })
                  }
                >
                  WhatsApp for Best Deal
                </motion.a>
              </motion.div>

              <motion.div
                className="hero-badges"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <span>✔ Warranty on every laptop</span>
                <span>✔ Fully tested hardware</span>
                <span>✔ Local service &amp; support</span>
              </motion.div>
            </motion.div>

            <motion.div
              className="hero-image-wrap"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <img
                src="/images/Shop-pic.jpg"
                alt="Inside Orange Systemz used laptop store in Kochi"
                className="hero-image"
              />
            </motion.div>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className="section">
          <div className="container">
            <h2 className="section-title">What We Offer</h2>
            <div className="cards-3">
              <div className="card">
                <div className="card-accent"></div>
                <h3>Refurbished Laptops</h3>
                <p>
                  Branded used laptops for students, home and office. Fully
                  tested with warranty.
                </p>
                <a
                  href="#laptops"
                  onClick={handleNavClick("laptops", "services_view_laptops")}
                  className="card-link"
                >
                  View laptops →
                </a>
              </div>
              <div className="card">
                <div className="card-accent"></div>
                <h3>Laptop &amp; Desktop Service</h3>
                <p>
                  Repairs, upgrades, OS installation, cleaning and data backup
                  at fair prices.
                </p>
                <a
                  href="#contact"
                  onClick={handleNavClick("contact", "services_book_service")}
                  className="card-link"
                >
                  Book a service →
                </a>
              </div>
              <div className="card">
                <div className="card-accent"></div>
                <h3>Bulk &amp; Office Setup</h3>
                <p>
                  Systems for offices, institutes and shops with ongoing
                  maintenance support.
                </p>
                <a
                  href="#contact"
                  onClick={handleNavClick("contact", "services_contact_sales")}
                  className="card-link"
                >
                  Contact sales →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US */}
        <section className="section section-muted">
          <div className="container">
            <h2 className="section-title">Why Choose Orange Systemz?</h2>
            <div className="features-grid">
              <div className="feature">
                <div className="feature-icon">✓</div>
                <h3>Tested &amp; Certified</h3>
                <p>
                  Each laptop passes full hardware and performance checks before
                  sale.
                </p>
              </div>
              <div className="feature">
                <div className="feature-icon">✓</div>
                <h3>Clear Warranty</h3>
                <p>
                  Warranty on every system sold so you can buy with confidence.
                </p>
              </div>
              <div className="feature">
                <div className="feature-icon">₹</div>
                <h3>Best Value in Kochi</h3>
                <p>
                  Branded laptops at used prices with honest configuration
                  details.
                </p>
              </div>
              <div className="feature">
                <div className="feature-icon">⚙</div>
                <h3>Fast Local Support</h3>
                <p>
                  Service center in Kochi and WhatsApp support for quick help.
                </p>
              </div>
            </div>
          </div>
        </section>

              {/* LAPTOPS – CATEGORY-BASED OFFERS */}
        <section id="laptops" className="section section-soft">
          <div className="container">
            <h2 className="section-title">Today’s Top Deals</h2>
            <div className="products-grid">
              {/* GAMING LAPTOPS */}
              <article className="product-card gaming">
                <img
                  src="/images/Dell-Gaming.jpg"
                  alt="Gaming Laptops – graphics & workstation"
                  className="product-image"
                />
                <div className="product-body">
                  <h3>Gaming Laptops</h3>
                  <p className="product-specs">
                    Graphic Laptops &amp; Workstations · High performance for Gaming,
                    Design &amp; Video Editing.
                  </p>
                  <p className="product-price">From ₹35,000+</p>
                  <span className="product-tag">Best for Gaming &amp; Graphics</span>
                  <a
                    href="https://wa.me/917736012315?text=Hi%2C%20I%27m%20interested%20in%20Gaming%20Laptops%20%28graphics%20laptop%2C%20workstation%29.%20Please%20share%20today%27s%20best%20options."
                    className="btn btn-primary btn-full btn-whatsapp"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackEvent("whatsapp_click", {
                        event_category: "conversion",
                        event_label: "category_gaming_laptops",
                      })
                    }
                  >
                    Check Gaming Stock on WhatsApp
                  </a>
                </div>
              </article>

              {/* HOME / STUDENT LAPTOPS */}
              <article className="product-card student">
                <img
                  src="/images/HP-R5.jpg"
                  alt="Home and Student Laptops – 10K to 20K range"
                  className="product-image"
                />
                <div className="product-body">
                  <h3>Home / Student Laptops</h3>
                  <p className="product-specs">
                    10K–20K Budget Range · Ideal for Online Classes, Coding
                    Practice, Office Work &amp; Beginners.
                  </p>
                  <p className="product-price">From ₹10,000 – ₹20,000</p>
                  <span className="product-tag">Best Value Picks</span>
                  <a
                    href="https://wa.me/917736012315?text=Hi%2C%20I%27m%20looking%20for%20Home%20%2F%20Student%20Laptops%20%2810K%E2%80%9320K%20range%2C%20coding%20%2F%20starter%20laptops%29.%20Please%20share%20what%27s%20available%20today."
                    className="btn btn-primary btn-full btn-whatsapp"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackEvent("whatsapp_click", {
                        event_category: "conversion",
                        event_label: "category_home_student_laptops",
                      })
                    }
                  >
                    Check Student Options on WhatsApp
                  </a>
                </div>
              </article>

              {/* HOME / BUSINESS DESKTOPS */}
              <article className="product-card desktop">
                <img
                  src="/images/Lenovo-yoga.jpg"
                  alt="Home and Business Desktops – heavy work & gaming"
                  className="product-image"
                />
                <div className="product-body">
                  <h3>Home / Business Desktops</h3>
                  <p className="product-specs">
                    Heavy Work Desktops · Coding Desktops · Gaming Desktops.
                    Assembled and Branded Options.
                  </p>
                  <p className="product-price">Custom builds on budget</p>
                  <span className="product-tag">For office &amp; hardcore use</span>
                  <a
                    href="https://wa.me/917736012315?text=Hi%2C%20I%27m%20interested%20in%20Home%20%2F%20Business%20Desktops%20%28heavy%20work%2C%20coding%20or%20gaming%20desktops%29.%20Please%20share%20your%20best%20options."
                    className="btn btn-primary btn-full btn-whatsapp"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackEvent("whatsapp_click", {
                        event_category: "conversion",
                        event_label: "category_home_business_desktops",
                      })
                    }
                  >
                    Check Desktop Options on WhatsApp
                  </a>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* EVERY LAPTOP INCLUDES */}
        <section className="section section-muted">
          <div className="container">
            <h2 className="section-title">Every Laptop Includes</h2>
            <p className="section-subtitle small-center">
              We don’t just sell “as-is” systems. Every laptop is refreshed,
              tested and ready to plug in and start working from day one.
            </p>
            <div className="warranty-grid">
              <div>
                <span className="warranty-icon">✔</span>
                Genuine Windows installed and activated
              </div>
              <div>
                <span className="warranty-icon">✔</span>
                Essential apps pre-loaded (browsers, PDF, office tools)
              </div>
              <div>
                <span className="warranty-icon">✔</span>
                Full internal cleaning &amp; hardware health check
              </div>
              <div>
                <span className="warranty-icon">✔</span>
                Shop warranty and after-sales support
              </div>
              <div>
                <span className="warranty-icon">✔</span>
                Help with setup, data transfer &amp; basic training
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT + MAP */}
        <section id="about" className="section">
          <div className="container about-grid">
            <div className="about-text">
              <p className="section-label">About Us</p>
              <h2 className="section-title">Kochi’s Trusted Used Laptop Store</h2>
              <p>
                Orange Systemz is a Kochi-based store focused on used and
                refurbished laptops and desktops. We help students, home users
                and offices get reliable systems within their budget.
              </p>
              <p>
                Every system is tested, cleaned and backed by warranty. Visit
                our shop or message us on WhatsApp to know today’s stock.
              </p>
              <ul className="about-list">
                <li>Physical store with live demo systems</li>
                <li>Transparent configurations and pricing</li>
                <li>On-site and in-store service support</li>
              </ul>
            </div>
            <div className="about-media">
              <div className="map-embed">
                <iframe
                  title="Orange Systemz Location"
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2778.6437988940356!2d76.3045454386296!3d9.967552250202589!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0873eae09bd73d%3A0xfa7c561bda017285!2sOrange%20Systemz!5e0!3m2!1sen!2sin!4v1764184091202!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        {/* GOOGLE REVIEWS (LIVE + ANIMATED) */}
        <GoogleReviewsSection />

        {/* CONTACT */}
        <section id="contact" className="section">
          <div className="container final-cta">
            <div className="final-cta-text">
              <h2 className="section-title">Ready for Your Next Laptop?</h2>
              <p>
                Tell us your budget and use case. We’ll suggest the best options
                available in stock right now.
              </p>
              <div className="hero-actions">
                <a
                  href="#laptops"
                  onClick={handleNavClick(
                    "laptops",
                    "contact_view_available_laptops"
                  )}
                  className="btn btn-primary btn-glow"
                >
                  View Available Laptops
                </a>
                <a
                  href="https://wa.me/917736012315"
                  className="btn btn-outline btn-glow-outline"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent("whatsapp_click", {
                      event_category: "conversion",
                      event_label: "contact_whatsapp_now",
                    })
                  }
                >
                  WhatsApp Us Now
                </a>
              </div>
            </div>
            <div className="contact-block">
              <h3>Contact &amp; Visit</h3>
              <p>
                <strong>Orange Systemz</strong>
              </p>
              <p>
                Anand arcade, Ground floor, S A Road
                <br />
                Elamkulam Jn, Kochi, Kerala, India
              </p>
              <p>
                <strong>Phone:</strong> +91-7736012315
              </p>
              <p>
                <strong>Email:</strong> orangesystemz.kochi@gmail.com
              </p>
              <p>
                <strong>Hours:</strong> Mon–Sat, 09:00 AM – 8:00 PM
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* MOBILE STICKY WHATSAPP BAR (animated) */}
      <AnimatePresence>
        {showStickyWhatsApp && (
          <motion.a
            href="https://wa.me/917736012315"
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-sticky"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={() =>
              trackEvent("whatsapp_click", {
                event_category: "conversion",
                event_label: "sticky_whatsapp_mobile",
              })
            }
          >
            WhatsApp for Today’s Best Deal
          </motion.a>
        )}
      </AnimatePresence>

      <footer className="site-footer">
        <div className="container footer-inner">
          <p>© {new Date().getFullYear()} Orange Systemz. All rights reserved.</p>
          <p className="footer-credit">Designed by RJ</p>
        </div>
      </footer>
    </>
  );
}