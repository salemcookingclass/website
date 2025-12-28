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

  <a
    href={`https://wa.me/917810940789?text=Hi%2C%20I%20want%20to%20enquire%20about%20${encodeURIComponent(
      cls.title
    )}`}
    target="_blank"
    rel="noopener noreferrer"
    className="registerBtn"
  >
    WhatsApp
  </a>
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

  <motion.div
  className="hero-inner"
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
>
  <h1>Bake, learn, create, connect</h1>



</motion.div>





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

const shorts = [
  "kJyQpzrg5tU",
  "fu-UpbwDzbE",
  "qdPtpqWKHok",
  "AIvEMthrgYo"
];


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
      <a href="#offline-workshops" className="book-btn">Register</a>

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
    <a href="#online-workshops" onClick={() => setMenuOpen(false)}>Online Classes</a>
    <a href="#offline-workshops" onClick={() => setMenuOpen(false)}>Hands-on Classes</a>
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
      <a href="#offline-workshops" className="hero-btn primary">Join now</a>
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



  {/* Shorts strip */}
  <div className="shorts-wrapper hero-shorts">
    <div className="shorts-scroll">
      {shorts.map((id) => (
        <div className="short-card" key={id}>
          <iframe
            src={`https://www.youtube.com/embed/${id}`}
            title="YouTube Short"
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ))}
    </div>
  </div>
</header>


<WorkshopCarousel
  title="Hands On Workshops"
  classes={offlineClasses}
  type="offline"
  onEnquire={handleRegisterClick}
/>



<WorkshopCarousel
  title="Online Workshops"
  classes={onlineClasses}
  type="online"
  onEnquire={handleRegisterClick}
/>


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
      )}
<h2 id="testimonials-heading">What Our Students Say</h2>

<section
  className="testimonials-section"
  aria-labelledby="testimonials-heading"
  aria-live="polite"
>
  <div className="testi-columns">

    {[0, 1].map((col) => (
      <div
        key={col}
        className={`testi-col ${col === 1 ? "reverse" : ""}`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {testimonials.map((t, idx) => {
          const isActive = idx === activeIndex;
          const highlight =
            isBest(idx) ? "best" : isRecent(idx) ? "recent" : "";

          return (
            <article
              key={`${col}-${idx}`}
              className={`testi-card ${isActive ? "active" : ""} ${highlight}`}
              tabIndex={0}
              role="button"
              aria-label={`Testimonial from ${t.name}`}
              onClick={() => setPopupIndex(idx)}
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

                  {isBest(idx) && <span className="badge">🌟 Best Review</span>}
                  {isRecent(idx) && <span className="badge recent">🆕 Recent</span>}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    ))}
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
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3914.305310094525!2d78.155972!3d11.653648!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3babf5bd663bbacf%3A0x80f80fbd1e5f2de4!2s46%2F18%2C%20Gun%20Firing%20St%2C%20Fort%2C%20Salem%2C%20Tamil%20Nadu%20636001!5e0!3m2!1sen!2sin!4v1700000000000"
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
