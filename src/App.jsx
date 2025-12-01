import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Laptop, Wrench, Info, Phone } from "lucide-react";

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

  const handleItemClick = (id) => {
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
                  onClick={() => handleItemClick(item.id)}
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
    if (!document.querySelector('script[src="https://elfsightcdn.com/platform.js"]')) {
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

  const handleNavClick = (id) => (e) => {
    e.preventDefault();
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

  return (
    <>
      {/* HEADER */}
      <header className="site-header">
        <div className="container header-inner">
          <a href="#hero" className="logo-wrap" onClick={handleNavClick("hero")}>
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
                  <a href={`#${item.id}`} onClick={handleNavClick(item.id)}>
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
                  onClick={handleNavClick("laptops")}
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
                  onClick={handleNavClick("laptops")}
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
                  onClick={handleNavClick("contact")}
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
                  onClick={handleNavClick("contact")}
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

        {/* LAPTOPS */}
        <section id="laptops" className="section section-soft">
          <div className="container">
            <h2 className="section-title">Today’s Top Deals</h2>
            <div className="products-grid">
              <article className="product-card">
                <img
                  src="/images/HP-R5.jpg"
                  alt="HP 15 – R5 5000 Series"
                  className="product-image"
                />
                <div className="product-body">
                  <h3>HP 15 – R5 5000 Series</h3>
                  <p className="product-specs">
                    8GB RAM · 256GB SSD · 14&quot; FHD
                  </p>
                  <p className="product-price">₹24,900</p>
                  <span className="product-tag">Warranty included</span>
                  <a
                    href="https://wa.me/917736012315?text=I%20am%20interested%20in%20HP%2015%20R5%205000%20Series"
                    className="btn btn-primary btn-full"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Check Availability on WhatsApp
                  </a>
                </div>
              </article>

              <article className="product-card">
                <img
                  src="/images/Dell-Gaming.jpg"
                  alt="Dell G Series – i5 12th Gen"
                  className="product-image"
                />
                <div className="product-body">
                  <h3>Dell G Series – i5 12th Gen</h3>
                  <p className="product-specs">
                    16GB RAM · 512GB SSD · 15.6&quot; FHD · 120Hz
                  </p>
                  <p className="product-price">₹26,900</p>
                  <span className="product-tag">Gamer's Choice</span>
                  <a
                    href="https://wa.me/917736012315?text=I%20am%20interested%20in%20Dell%20G%20Series%20i5%2012th%20Gen"
                    className="btn btn-primary btn-full"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Check Availability on WhatsApp
                  </a>
                </div>
              </article>

              <article className="product-card">
                <img
                  src="/images/Lenovo-yoga.jpg"
                  alt="Lenovo Yoga – i5 11th Gen"
                  className="product-image"
                />
                <div className="product-body">
                  <h3>Lenovo Yoga – i5 11th Gen</h3>
                  <p className="product-specs">
                    8GB RAM · 512GB SSD · 14&quot; 2K
                  </p>
                  <p className="product-price">₹21,500</p>
                  <span className="product-tag">Student choice</span>
                  <a
                    href="https://wa.me/917736012315?text=I%20am%20interested%20in%20Lenovo%20Yoga%20i5%2011th%20Gen"
                    className="btn btn-primary btn-full"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Check Availability on WhatsApp
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
                  onClick={handleNavClick("laptops")}
                  className="btn btn-primary btn-glow"
                >
                  View Available Laptops
                </a>
                <a
                  href="https://wa.me/917736012315"
                  className="btn btn-outline btn-glow-outline"
                  target="_blank"
                  rel="noopener noreferrer"
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