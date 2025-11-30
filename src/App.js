// App.js
import React, { useEffect, useState } from "react";
import "./App.css";
import { FaInstagram, FaYoutube, FaFacebook } from "react-icons/fa";
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";

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
   App Router
   --------------------------- */

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/class/:id" element={<ClassDetails />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

/* ---------------------------
   Home Page
   --------------------------- */

function HomePage() {
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
    window.location.href = `mailto:salemcookingclass@gmail.com?subject=Class Registration&body=${encodeURIComponent(
      body
    )}`;
  };

  const onlineClasses = classes.filter((c) => c.type === "online");
  const offlineClasses = classes.filter((c) => c.type === "offline");

  return (
    <div className="page-wrapper">
      {/* NAV */}
      <nav className="menu">
        <div className="nav-inner">
          <div className="nav-left">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#online-workshops">Online</a>
            <a href="#offline-workshops">Offline</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="nav-right">
            <a href="https://facebook.com/SalemCakeCraftStudio" target="_blank"><FaFacebook /></a>
            <a href="https://youtube.com/@SalemCakeCraftStudio" target="_blank"><FaYoutube /></a>
            <a href="https://instagram.com/salemcakecraftstudio" target="_blank"><FaInstagram /></a>
          </div>
        </div>
      </nav>

      {/* HEADER */}
      <header id="home" className="header">
        <img src={LOGO_URL} alt="Logo" className="logo-img" />
        <h1>Salem Cake Craft Studio</h1>
      </header>

      {/* FIXED SLIDER */}
      <section className="slider-section" aria-label="Gallery">
        <button className="navBtn" onClick={prevPhoto}>❮</button>

        <div
          className="big-photo-wrap"
          onMouseEnter={() => setAutoPlay(false)}
          onMouseLeave={() => setAutoPlay(true)}
        >
          <img
            src={PHOTO_URLS[photoIndex]}
            alt={`slide ${photoIndex}`}
            className="big-photo"
          />
        </div>

        <button className="navBtn" onClick={nextPhoto}>❯</button>
      </section>

      {/* REST OF YOUR CODE REMAINS SAME — omitted for brevity */}



      {/* Caption */}
      <section className="caption">
        <h2>Learn Baking The Right Way</h2>
        <p>Professional online & offline baking courses for all skill levels.</p>
      </section>

      {/* OFFLINE WORKSHOPS */}
      <section id="offline-workshops" className="classes-section">
        <h2>Offline (Group Hands-on at Studio)</h2>
        <div className="horizontal-scroll" role="list">
          {offlineClasses.length === 0 && <div className="class-card">No offline classes available.</div>}
          {offlineClasses.map((cls) => (
            <article key={cls.id} className="class-card" role="listitem">
              <h3>{cls.title}</h3>
              <p><strong>Date:</strong> {cls.date || "TBA"}</p>
              <p><strong>Time:</strong> {cls.time || "TBA"}</p>
              <p><strong>Fees:</strong> {cls.price || "—"}</p>

              <div className="card-actions">
                <Link to={`/class/${cls.id}`} className="learnMoreBtn">More Details</Link>
                <button onClick={() => handleRegisterClick(cls)} className="registerBtn">Enquire</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ONLINE WORKSHOPS */}
      <section id="online-workshops" className="classes-section">
        <h2>Online Workshops</h2>
        <div className="horizontal-scroll" role="list">
          {onlineClasses.length === 0 && <div className="class-card">No online classes available.</div>}
          {onlineClasses.map((cls) => (
            <article key={cls.id} className="class-card" role="listitem">
              <h3>{cls.title}</h3>
              
              <p><strong>Fees:</strong> {cls.price || "—"}</p>

              <div className="card-actions">
                <Link to={`/class/${cls.id}`} className="learnMoreBtn">More Details</Link>
                <button onClick={() => handleRegisterClick(cls)} className="registerBtn">Enquire</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      

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

      {/* About */}
      <section id="about" className="about-section">
        <h2>About Us</h2>
        <p>
          Salem cake craft studio – Where Passion Meets Perfection in Pastry & Cake Art! At Salem cake craft studio we believe that baking is more than just a skill, it’s an art. Our institute is dedicated to providing world-class training in pastry and cake artistry, blending traditional techniques with modern innovations. Whether you’re a beginner exploring the world of baking or a professional looking to refine your skills, our hands-on courses cater to all levels.
        </p>
        <p>
          Our workshops cover a wide range of topics, including classic pastries, artisanal bread, gourmet cakes, and advanced cake decorating techniques. With state-of-the-art facilities and small batch sizes, we ensure personalized attention and a comprehensive learning experience. Join us and embark on a sweet journey of creativity, precision, and excellence. Let’s bake your dreams into reality!
        </p>
      </section>

      {/* Contact & Map */}
      <section id="contact" className="contact-section">
        <h2>Contact Us</h2>
        <p>Email: <a href="mailto:salemcookingclass@gmail.com">salemcookingclass@gmail.com</a></p>
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
    window.location.href = `mailto:salemcookingclass@gmail.com?subject=Class Registration&body=${encodeURIComponent(
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

      <h1>{cls.title}</h1>
    
      <p><strong>Date:</strong> {cls.date || "TBA"}</p>
      <p><strong>Time:</strong> {cls.time || "TBA"}</p>
      <p><strong>Fees:</strong> {cls.price || "—"}</p>

      <h3>Details</h3>
      <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6, marginBottom: 20 }}>{cls.details}</div>

   
    
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
       <button onClick={() => handleRegisterClick(cls)} className="registerBtn">Enquire</button>
       <button onClick={() => navigate(-1)} className="backBtn">← Back</button>
    </div>
    
  );
}
