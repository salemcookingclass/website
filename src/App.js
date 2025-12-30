// App.js



import React, { useEffect, useState, useRef } from "react";
import "./App.css";

import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";

import { motion, AnimatePresence, useAnimation } from "framer-motion";

import { FaInstagram, FaYoutube, FaFacebook } from "react-icons/fa";
import WorkshopCarousel from "./components/WorkshopCarousel";


/* ---------------------------
   Dynamic imports
   --------------------------- */

function importClasses() {
  try {
    const req = require.context("./classes", false, /^\.\/class_.*\.js$/);
    return req.keys().map((k) => req(k).default);
  } catch (e) {
    console.warn("No classes found. Using fallback.");
    return [
      {
        id: "demo-1",
        title: "Demo Class — Pastry Basics",
        date: "TBA",
        time: "TBA",
        price: "Rs. 999 /-",
        type: "offline",
        details: "Demo fallback class."
      }
    ];
  }
}

const classes = importClasses();

/*Flow Card Section*/




  
    
  


/* ---------------------------
   FIXED PHOTO IMPORT (THIS WAS THE BUG)
   --------------------------- */

let PHOTO_URLS = [];

try {
  const req = require.context("./assets/photos", false, /\.(png|jpe?g)$/);

  PHOTO_URLS = req.keys().map((key) => req(key));  
  // THIS is the correct method
  // NOT req.keys().map(req) — that returns wrong values

  console.log("Loaded photos:", PHOTO_URLS);
} catch (err) {
  console.warn("Local photos not found, using fallback.");
  PHOTO_URLS = [
    "https://images.unsplash.com/photo-1542826438-9b1d6f5d9f8f",
    "https://images.unsplash.com/photo-1505250469679-203ad9ced0cb",
    "https://images.unsplash.com/photo-1512058564366-c9e3e3b9f5f6",
  ];
}

/* ---------------------------
   Logo loader
   --------------------------- */
let LOGO_URL;
try {
  LOGO_URL = require("./assets/logo.png");
} catch (e) {
  LOGO_URL = "https://via.placeholder.com/140x140.png?text=Logo";
}


/* ---------------------------
   Load testimonials dynamically
   --------------------------- */
function importTestimonials() {
  try {
    const req = require.context("./testimonials", false, /^\.\/testi_.*\.js$/);
    return req.keys().map((k) => req(k).default);
  } catch (e) {
    console.warn("No testimonials found. Using fallback.");
    return [
      { name: "Student A", feedback: "Great learning experience!" },
      { name: "Student B", feedback: "Loved the hands-on approach." },
    ];
  }
}

const testimonials = importTestimonials();




/* ---------------------------
   App Router
   --------------------------- */

export default function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/class/:id" element={<ClassDetails />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

 

const ScrollRow = ({ items, isOffline }) => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      x: ["0%", "-50%"],
      transition: {
        ease: "linear",
        duration: 35,
        repeat: Infinity,
      },
    });
  }, [controls]);

  return (
    <div className="scroll-wrapper" role="region" aria-label="Workshop carousel">
      <motion.div
        className="horizontal-scroll"
        animate={controls}
        onHoverStart={() => controls.stop()}
        onHoverEnd={() => controls.start()}
        drag="x"
        dragConstraints={{ left: -1000, right: 0 }}
        dragElastic={0.08}
      >
        {[...items, ...items].map((cls, index) => (
          <motion.article
            key={`${cls.id}-${index}`}
            className="class-card"
            tabIndex={0}
            aria-label={`Workshop: ${cls.title}`}
            whileHover={{ scale: 1.12 }}
            whileFocus={{ scale: 1.12 }}
            transition={{ type: "spring", stiffness: 220 }}
            style={{
              backgroundImage: cls.image ? `url(${cls.image})` : undefined,
            }}
          >
            <div className="card-overlay" />

            <h3>{cls.title}</h3>

            {isOffline && (
              <>
                <p>{cls.date || "TBA"}</p>
                <p>{cls.time || "TBA"}</p>
              </>
            )}

            <p className="price">{cls.price || "—"}</p>

           <div className="card-actions">
  <Link to={`/class/${cls.id}`} className="learnMoreBtn">
    Details
  </Link>


</div>

          </motion.article>
        ))}
      </motion.div>
    </div>
  );
};

export { ScrollRow};


/* ---------------------------
   Home Page
   --------------------------- */

function HomePage() {

 // const [selectedFilter, setSelectedFilter] = useState("all");
const [activePreview, setActivePreview] = useState(null);


 const [preview, setPreview] = useState(null);

   



/* ---------------------------
   TESTIMONIAL LOGIC
--------------------------- */

const [activeIndex, setActiveIndex] = useState(0);
const [paused, setPaused] = useState(false);
const [popupIndex, setPopupIndex] = useState(null);

// auto-rotate testimonials
useEffect(() => {
  if (paused) return;

  const interval = setInterval(() => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  }, 4000);

  return () => clearInterval(interval);
}, [paused]);


  const [menuOpen, setMenuOpen] = useState(false);
  

  const renderStars = (count = 5) => (
  <div className="testi-stars" aria-label={`${count} star rating`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <span key={i} aria-hidden="true">
        {i < count ? "⭐" : "☆"}
      </span>
    ))}
  </div>
);

const isBest = (i) => i === 0;
const isRecent = (i) => i === testimonials.length - 1;

 /* <motion.div
  className="hero-inner"
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
>
  <h1>Bake, learn, create, connect</h1>



</motion.div>*/

/*flow Card section*/
useEffect(() => {
  const cards = document.querySelectorAll(".flow-card");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const index = [...cards].indexOf(entry.target);

        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = `${index * 0.18}s`;
          entry.target.classList.add("show", "active");
        } else {
          // allow replay when scrolling back up
          entry.target.classList.remove("show", "active");
          entry.target.style.transitionDelay = "0s";
        }
      });
    },
    {
      threshold: 0.35,
      rootMargin: "0px 0px -80px 0px",
    }
  );

  cards.forEach((card) => observer.observe(card));
  return () => observer.disconnect();
}, []);


/*Instagram and Youtube shorts*/

const YT_ID = "kJyQpzrg5tU";
const IG_REEL_ID = "DSw-_AGkjJG"; // reel ID only

 const [active, setActive] = useState(null); // "yt" | "ig"
  const [minimized, setMinimized] = useState(false);
  const playerRef = useRef(null);

  /* ======================
     VIEW TRACKING
  ====================== */
  const trackView = (type) => {
    const views = JSON.parse(sessionStorage.getItem("mediaViews")) || {};
    views[type] = (views[type] || 0) + 1;
    sessionStorage.setItem("mediaViews", JSON.stringify(views));
  };

  /* ======================
     PLAY HISTORY
  ====================== */
  const saveHistory = (type) => {
    const history = JSON.parse(sessionStorage.getItem("playHistory")) || [];
    const updated = [type, ...history.filter(i => i !== type)].slice(0, 5);
    sessionStorage.setItem("playHistory", JSON.stringify(updated));
  };

  const openPlayer = (type) => {
    setMinimized(false);
    setActive(type);
    trackView(type);
    saveHistory(type);
  };

  const minimizePlayer = () => setMinimized(true);
  const closePlayer = () => {
    setActive(null);
    setMinimized(false);
  };

  /* AUTO SCROLL */
  useEffect(() => {
    if (active && !minimized && playerRef.current) {
      playerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [active, minimized]);

    

  /* ************* */


  const [photoIndex, setPhotoIndex] = useState(0);
  
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay || PHOTO_URLS.length === 0) return;

    const t = setInterval(() => {
      setPhotoIndex((i) => (i + 1) % PHOTO_URLS.length);
    }, 3500);

    return () => clearInterval(t);
  }, [autoPlay]);

  const nextPhoto = () => setPhotoIndex((i) => (i + 1) % PHOTO_URLS.length);
  const prevPhoto = () => setPhotoIndex((i) => (i - 1 + PHOTO_URLS.length) % PHOTO_URLS.length);

  // Register form

  const [selectedClass, setSelectedClass] = useState(null);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });

  const handleRegisterClick = (cls) => {
    setSelectedClass(cls);
    setShowRegisterForm(true);
    setTimeout(() => {
      document.querySelector(".register-section")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 80);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.phone.trim()) {
      alert("Phone is mandatory");
      return;
    }
    const body = `Registration for: ${selectedClass.title}\nName: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email}`;
    window.location.href = `mailto:enquire@salemcakecraftstudio.in?subject=Class Registration&body=${encodeURIComponent(
      body
    )}`;
  };

  const onlineClasses = classes.filter((c) => c.type === "online");
  const offlineClasses = classes.filter((c) => c.type === "offline");

  const [selectedFilter, setSelectedFilter] = useState("all");


const [selectedIndex, setSelectedIndex] = useState(null);
  const wrapperRef = useRef(null);

  const handleCardClick = (idx) => {
    setSelectedIndex(idx);
    scrollToCard(idx);
  };

  const scrollToCard = (index) => {
  if (!wrapperRef.current) return;   // ⛔ Prevent crash

  const cards = wrapperRef.current.querySelectorAll(".testi-card");
  if (!cards || !cards[index]) return;  // ⛔ Prevent crash

  const card = cards[index];
  const wrapper = wrapperRef.current;

  wrapper.scrollTo({
    left: card.offsetLeft - wrapper.clientWidth / 2 + card.clientWidth / 2,
    behavior: "smooth",
  });
};



  const closePopup = () => setSelectedIndex(null);

  const selectedTestimonial =
    selectedIndex !== null ? testimonials[selectedIndex] : null;




  return (
    <div className="page-wrapper">
      {/* NAV + HAMBURGER */}
{/* NAV + HAMBURGER (ALL SCREENS) */}
<nav className="menu">
  <div className="nav-inner">

    {/* LOGO */}
    <div className="nav-logo">
      <img src={LOGO_URL} alt="logo" />
      <span>Salem Cake Craft Studio</span>
    </div>

    {/* RIGHT ACTIONS */}
    <div className="nav-actions">
      <a href="#classes" className="book-btn">Register</a>

      <button
        className={`hamburger ${menuOpen ? "active" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>
    </div>
  </div>

  {/* BACKDROP */}
  <div
    className={`menu-backdrop ${menuOpen ? "show" : ""}`}
    onClick={() => setMenuOpen(false)}
  ></div>

  {/* DROPDOWN PANEL */}
  <div className={`menu-panel ${menuOpen ? "open" : ""}`}>
    <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
    <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
    <a href="#classes" onClick={() => setMenuOpen(false)}>Classes</a>
    <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>

    <div className="menu-divider"></div>

    <div className="menu-socials">
      <a href="https://facebook.com/SalemCakeCraftStudio" target="_blank" rel="noreferrer"><FaFacebook /></a>
      <a href="https://youtube.com/@SalemCakeCraftStudio" target="_blank" rel="noreferrer"><FaYoutube /></a>
      <a href="https://instagram.com/salemcakecraftstudio" target="_blank" rel="noreferrer"><FaInstagram /></a>
    </div>
  </div>
</nav>



{/* HEADER */}
<header id="home" className="hero">
  <div className="hero-inner">
    <h1>Discover the art<br />of baking with us</h1>

    <p className="hero-sub">
      Join our vibrant community of baking enthusiasts and elevate your skills
      with <br /> expert-led classes — online & hands-on.
    </p>

    <div className="hero-actions">
      <a href="#classes" className="hero-btn primary">Join now</a>
      <a href="#about" className="hero-btn secondary">See more</a>
    </div>
  </div>

  
     {/* FIXED SLIDER */}
<section className="slider-section" aria-label="Gallery">

  <button className="navBtn" onClick={prevPhoto} aria-label="Previous photo">
    ❮
  </button>

  <div
    className="big-photo-wrap"
    onMouseEnter={() => setAutoPlay(false)}
    onMouseLeave={() => setAutoPlay(true)}
  >
    <AnimatePresence mode="wait">
      <motion.img
        key={photoIndex}
        src={PHOTO_URLS[photoIndex]}
        alt={`slide ${photoIndex}`}
        className="big-photo"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        onDragEnd={(e, info) => {
          if (info.offset.x < -80) nextPhoto();
          if (info.offset.x > 80) prevPhoto();
        }}
      />
    </AnimatePresence>
  </div>

  <button className="navBtn" onClick={nextPhoto} aria-label="Next photo">
    ❯
  </button>
</section>
    
{/* THUMBNAILS */}
<div className="thumb-strip">
  {PHOTO_URLS.map((url, i) => (
    <button
      key={i}
      className={`thumb ${i === photoIndex ? "active" : ""}`}
      onClick={() => setPhotoIndex(i)}
      aria-label={`Go to slide ${i + 1}`}
    >
      <img src={url} alt={`thumbnail ${i}`} />
    </button>
  ))}
</div>

{/* AUTOPLAY PROGRESS */}
<div className="progress-track" aria-hidden="true">
  <motion.div
    key={photoIndex}
    className="progress-bar"
    initial={{ width: "0%" }}
    animate={{ width: "100%" }}
    transition={{
      duration: 5,          // autoplay duration (seconds)
      ease: "linear"
    }}
  />
</div>

{/* Flow Card*/}

    <section className="flow-section">
      <div className="flow-header">
        <span className="eyebrow">WELCOME TO A BAKING ADVENTURE</span>
        <h1>
          Enhance your <br /> baking skills daily
        </h1>
      </div>

      <div className="flow-cards">
        <div className="flow-card tilt-left">
          <span className="icon">🍰</span>
          <p>
            Unlock your creativity with expert-led, hands-on baking classes.
          </p>
        </div>

        <div className="flow-card">
          <span className="icon">💬</span>
          <p>
            Learn advanced pastry skills in a nurturing studio environment.
          </p>
        </div>

        <div className="flow-card tilt-right">
          <span className="icon">📩</span>
          <p>
            Participate in live interactive sessions with instant feedback.
          </p>
        </div>

        <div className="flow-card tilt-left">
          <span className="icon">✅</span>
          <p>
            Step-by-step lessons designed for beginners to professionals.
          </p>
        </div>

        <div className="flow-card tilt-right">
          <span className="icon">❤️</span>
          <p>
            Experiment with bold flavors and creative cake designs.
          </p>
        </div>
      </div>
    </section>

  {/* Shorts strip & reels*/}
 <>
      {/* PLAYER */}
      {active && (
        <div
          ref={playerRef}
          className={`player-wrapper ${minimized ? "minimized" : "open"}`}
        >
          <div className="player-box">
            <button className="btn minimize" onClick={minimizePlayer}>—</button>
            <button className="btn close" onClick={closePlayer}>✕</button>

            {active === "yt" && (
              <iframe
                src={`https://www.youtube.com/embed/${YT_ID}?autoplay=1`}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            )}

            {active === "ig" && (
              <iframe
                src={`https://www.instagram.com/reel/${IG_REEL_ID}/embed`}
                allow="encrypted-media"
              />
            )}
          </div>
        </div>
      )}

      {/* PREVIEWS */}
      <section className="media-section">
        <div className="media-container">

          <div className="media-card" onClick={() => openPlayer("yt")}>
            <img
              src={`https://img.youtube.com/vi/${YT_ID}/hqdefault.jpg`}
              alt="YouTube"
            />
            <div className="overlay yt">▶ YouTube</div>
          </div>

          <div className="media-card" onClick={() => openPlayer("ig")}>
            <img src="/ig-reel-preview.jpg" alt="Instagram" />
            <div className="overlay ig">▶ Instagram</div>
          </div>

        </div>
      </section>
    </>
    </header>

{/* =========================
   CLASSES SECTION
========================= */}

<section className="classes-section" id="classes">
  <motion.h2
    className="classes-title"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    Discover our classes
  </motion.h2>

  {/* FILTERS */}
  <div className="class-filters">
    {["all", "offline", "online"].map((t, index) => (
      <motion.button
        key={t}
        className={`filter-btn ${selectedFilter === t ? "active" : ""}`}
        onClick={() => setSelectedFilter(t)}
        whileTap={{ scale: 0.92 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
      >
        {t.charAt(0).toUpperCase() + t.slice(1)}
      </motion.button>
    ))}
  </div>

  {/* FILTER + RENDER */}
  {(() => {
    const filteredClasses = classes.filter((cls) => {
      const type = cls.type?.toLowerCase();
      return selectedFilter === "all" || type === selectedFilter;
    });

    if (filteredClasses.length === 0) {
      return (
        <motion.p
          className="no-classes"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No classes available
        </motion.p>
      );
    }

    return (
      <div className="classes-grid">
        {filteredClasses.map((cls, idx) => {
          const isOnline = cls.type?.toLowerCase() === "online";

          return (
            <motion.article
              key={cls.id}
              className={`class-item ${cls.isFeatured ? "featured" : ""}`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.03, y: -6 }}
            >
              {cls.isFeatured && (
                <motion.span
                  className="badge"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  Featured
                </motion.span>
              )}

              {/* CALENDAR — OFFLINE ONLY */}
              {!isOnline && cls.date && (
                <motion.div
                  className="calendar-box red"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.1 + 0.2 }}
                >
                  <span className="month">{cls.date.split(" ")[1]}</span>
                  <span className="day">{cls.date.split(" ")[0]}</span>
                  <span className="dot">•</span>
                </motion.div>
              )}

              {/* INFO */}
              <div className="class-info">
                <h3>{cls.title}</h3>

                {cls.rating && (
                  <div className="rating">
                    ⭐ {cls.rating} <span>({cls.reviews})</span>
                  </div>
                )}

                {!isOnline && cls.countdown && (
                  <span className="countdown">
                    ⏳ Starts in {cls.countdown}
                  </span>
                )}

                <div className="class-meta">
                  <span>🕒 {cls.time || "Flexible"}</span>
                  <span>{isOnline ? "🌐 Online" : "📍 Offline"}</span>
                </div>

                {/* FOOTER */}
                <div className="class-footer">
                  <span className="price">{cls.price}</span>

                  <div className="actions">
                    <Link to={`/class/${cls.id}`} className="notify-btn">
                      Details
                    </Link>

                    <button
                      className="preview-btn"
                      onClick={() => handleRegisterClick(cls)}
                    >
                      Enquire
                    </button>

                    {cls.preview && (
                      <button
                        className="preview-btn"
                        onClick={() => setPreview(cls.preview)}
                      >
                        ▶ Preview
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    );
  })()}

  {/* PREVIEW MODAL */}
  <AnimatePresence>
    {preview && (
      <motion.div
        className="preview-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="preview-box"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 120 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="close-preview"
            onClick={() => setPreview(null)}
          >
            ✕
          </button>

          <iframe
            src={`https://www.youtube.com/embed/${preview}?autoplay=1&mute=1`}
            allow="autoplay; encrypted-media"
            allowFullScreen
            title="Class Preview"
          />
        </motion.div>

        <motion.div
          className="preview-overlay"
          onClick={() => setPreview(null)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      </motion.div>
    )}
  </AnimatePresence>
</section>

<h2>About Us</h2>

 {/* About */}
      <section id="about" className="about-section">
        
        <p>
          Salem cake craft studio – Where Passion Meets Perfection in Pastry & Cake Art! At Salem cake craft studio we believe that baking is more than just a skill, it’s an art. Our institute is dedicated to providing world-class training in pastry and cake artistry, blending traditional techniques with modern innovations. Whether you’re a beginner exploring the world of baking or a professional looking to refine your skills, our hands-on courses cater to all levels.
        </p>
        <p>
          Our workshops cover a wide range of topics, including classic pastries, artisanal bread, gourmet cakes, and advanced cake decorating techniques. With state-of-the-art facilities and small batch sizes, we ensure personalized attention and a comprehensive learning experience. Join us and embark on a sweet journey of creativity, precision, and excellence. Let’s bake your dreams into reality!
        </p>
      </section>



      {/* REST OF YOUR CODE REMAINS SAME — omitted for brevity */}




      {/* Register Section (hidden by default) */}
      <div className="register-anchor" />
      {showRegisterForm && selectedClass && (
        <section className="register-section" aria-labelledby="register-heading">
          <h2 id="register-heading">Enquire for: {selectedClass.title} {selectedClass.date ? `on ${selectedClass.date}` : ""}</h2>
          <form onSubmit={handleSubmit} className="register-form">
            <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
            <input name="phone" placeholder="Phone (Required)" value={formData.phone} onChange={handleChange} required />
            <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
            <div className="form-actions">
              <button type="submit">Submit</button>
              <button type="button" onClick={() => setShowRegisterForm(false)}>Cancel</button>
            </div>
          </form>
        </section>
      )}<h2 id="testimonials-heading">What Our Students Say</h2>

<section
  className="testimonials-section"
  aria-labelledby="testimonials-heading"
  aria-live="polite"
>
  <div className="testi-scroll">
  <div className="testi-columns">

    {/* COLUMN 1 — Even index testimonials */}
    <div
      className="testi-col"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {testimonials
        .filter((_, idx) => idx % 2 === 0)
        .map((t, idx) => {
          const originalIndex = idx * 2;
          const isActive = originalIndex === activeIndex;
          const highlight =
            isBest(originalIndex)
              ? "best"
              : isRecent(originalIndex)
              ? "recent"
              : "";

          return (
            <article
              key={originalIndex}
              className={`testi-card ${isActive ? "active" : ""} ${highlight}`}
              tabIndex={0}
              role="button"
              aria-label={`Testimonial from ${t.name}`}
              onClick={() => setPopupIndex(originalIndex)}
            >
              <p className="testi-text">“{t.feedback}”</p>

              {renderStars(t.rating || 5)}

              <div className="testi-bottom">
                {t.avatar && (
                  <img
                    src={t.avatar}
                    className="testi-avatar"
                    alt={`Avatar of ${t.name}`}
                    loading="lazy"
                  />
                )}

                <div>
                  <p className="testi-name">{t.name}</p>
                  <p className="testi-role">{t.role || "Student"}</p>

                  {isBest(originalIndex) && (
                    <span className="badge">🌟 Best Review</span>
                  )}
                  {isRecent(originalIndex) && (
                    <span className="badge recent">🆕 Recent</span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
    </div>

    {/* COLUMN 2 — Odd index testimonials */}
    <div
      className="testi-col reverse"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {testimonials
        .filter((_, idx) => idx % 2 !== 0)
        .map((t, idx) => {
          const originalIndex = idx * 2 + 1;
          const isActive = originalIndex === activeIndex;
          const highlight =
            isBest(originalIndex)
              ? "best"
              : isRecent(originalIndex)
              ? "recent"
              : "";

          return (
            <article
              key={originalIndex}
              className={`testi-card ${isActive ? "active" : ""} ${highlight}`}
              tabIndex={0}
              role="button"
              aria-label={`Testimonial from ${t.name}`}
              onClick={() => setPopupIndex(originalIndex)}
            >
              <p className="testi-text">“{t.feedback}”</p>

              {renderStars(t.rating || 5)}

              <div className="testi-bottom">
                {t.avatar && (
                  <img
                    src={t.avatar}
                    className="testi-avatar"
                    alt={`Avatar of ${t.name}`}
                    loading="lazy"
                  />
                )}

                <div>
                  <p className="testi-name">{t.name}</p>
                  <p className="testi-role">{t.role || "Student"}</p>

                  {isBest(originalIndex) && (
                    <span className="badge">🌟 Best Review</span>
                  )}
                  {isRecent(originalIndex) && (
                    <span className="badge recent">🆕 Recent</span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
    </div>
</div>
  </div>
</section>


{popupIndex !== null && (
  <div
    className="popup-overlay"
    role="dialog"
    aria-modal="true"
    onClick={() => setPopupIndex(null)}
  >
    <div className="popup-box" onClick={(e) => e.stopPropagation()}>
      <h3>{testimonials[popupIndex].name}</h3>

      {renderStars(testimonials[popupIndex].rating || 5)}

      <p>{testimonials[popupIndex].feedback}</p>

      <button onClick={() => setPopupIndex(null)}>Close</button>
    </div>
  </div>
)}


      {/* Contact & Map */}
       
      <section id="contact" className="contact-section">
       <h2>Contact Us</h2>
        <p>Email: <a href="mailto:enquire@salemcakecraftstudio.in">enquire@salemcakecraftstudio.in</a></p>
        <p>Phone: +91-7810940789</p>
        <h3>Location</h3>
        <p>46/18, Gun Firing Street, Fort, Salem - 636001</p>
        <div className="map-wrap">
          <iframe
            title="salem-map"
           src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d244.22518738386935!2d78.155741!3d11.651613!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3babf02d280b565f%3A0xde26aff35f19a2ea!2sSalem%20Cake%20Craft%20Studio!5e0!3m2!1sen!2sus!4v1767095301493!5m2!1sen!2sus" 
            
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </section>

      

      {/* Social */}
      <section id="social" className="social-section">
        <h2>Follow Us</h2>
        <div className="social-links">
          <a href="https://www.instagram.com/salemcakecraftstudio" target="_blank" rel="noreferrer" className="social-icon insta">Instagram</a>
          <a href="https://www.youtube.com/@SalemCakeCraftStudio" target="_blank" rel="noreferrer" className="social-icon yt">YouTube</a>
          <a href="https://www.facebook.com/SalemCakeCraftStudio/" target="_blank" rel="noreferrer" className="social-icon fb">Facebook</a>
        </div>
      </section>

      <footer className="footer">© 2025 Salem Cake Craft Studio</footer>
    </div>
  );
}

/* ---------------------------
   ClassDetails Component (route /class/:id)
   --------------------------- */

function ClassDetails() {
  // Register form

  const [selectedClass, setSelectedClass] = useState(null);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });

  const handleRegisterClick = (cls) => {
    setSelectedClass(cls);
    setShowRegisterForm(true);
    setTimeout(() => {
      document.querySelector(".register-section")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 80);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.phone.trim()) {
      alert("Phone is mandatory");
      return;
    }
    const body = `Registration for: ${selectedClass.title}\nName: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email}`;
    window.location.href = `mailto:enquire@salemcakecraftstudio.in?subject=Class Registration&body=${encodeURIComponent(
      body
    )}`;
  };

  //const onlineClasses = classes.filter((c) => c.type === "online");
  //const offlineClasses = classes.filter((c) => c.type === "offline");

  const { id } = useParams();
  const navigate = useNavigate();

  const cls = classes.find((c) => String(c.id) === String(id));

  if (!cls) {
    return (
      <div style={{ padding: 30 }}>
        <button onClick={() => navigate(-1)}>← Back</button>
        <h2>Class not found</h2>
        <p>The class you requested does not exist.</p>
      </div>
    );
  }
/*
  // Prepare mailto link for Enquire button
  const mailto = `mailto:salemcookingclass@gmail.com?subject=${encodeURIComponent("Enquiry: " + cls.title)}&body=${encodeURIComponent(
    `I am interested in ${cls.title} on ${cls.date || "TBA"}.\n\nPlease contact me.\n\nThanks.`
  )}`;*/

  return (

    <div style={{ padding: 20 }}>
      <button onClick={() => navigate(-1)} className="backBtn">← Back</button>

      <h1 style={{ textAlign: "left" }}>{cls.title}</h1>
    
      <p style={{ textAlign: "left" }}><strong>Date:</strong> {cls.date || "TBA"}</p>
      <p style={{ textAlign: "left" }}><strong>Time:</strong> {cls.time || "TBA"}</p>
      <p style={{ textAlign: "left" }}><strong>Fees:</strong> {cls.price || "—"}</p>

      <h3 style={{ textAlign: "left" }}>Details</h3>
      <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6, marginBottom: 20, textAlign: "left" }}>{cls.details}</div>

   
    
       {/* Register Section (hidden by default) */}
      <div className="register-anchor" />
      {showRegisterForm && selectedClass && (
        <section className="register-section" aria-labelledby="register-heading">
          <h2 id="register-heading">Enquire for: {selectedClass.title} {selectedClass.date ? `on ${selectedClass.date}` : ""}</h2>
          <form onSubmit={handleSubmit} className="register-form">
            <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
            <input name="phone" placeholder="Phone (Required)" value={formData.phone} onChange={handleChange} required />
            <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
            <div className="form-actions">
              <button type="submit">Submit</button>
              <button type="button" onClick={() => setShowRegisterForm(false)}>Cancel</button>
            </div>
          </form>
        </section>
      )}
       
  {/* New styled buttons */}
  <div className="page-actions">
    <button onClick={() => handleRegisterClick(cls)} className="enquireBtn">Enquire</button>
    <button onClick={() => navigate(-1)} className="backBtn">← Back</button>
  </div>
    </div>
    
  );
}
