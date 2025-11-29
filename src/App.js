// App.js
import React, { useEffect, useState } from "react";
import "./App.css";
import { FaInstagram, FaYoutube, FaFacebook } from "react-icons/fa";
function importAll(r) {
  return r.keys().map(r);
}

const classes = importAll(
  require.context("./classes", false, /^\.\/class_.*\.js$/)
).map((mod) => mod.default);

// NOTE: Using external image URLs so the app builds even if local assets are missing.
let LOGO_URL;
try {
LOGO_URL = require("./assets/logo.png");
} catch (e) {
LOGO_URL = "https://via.placeholder.com/140x140.png?text=Logo";
}


let PHOTO_URLS = [];

try {
  function importAll(r) {
    return r.keys().map(r);
  }

  PHOTO_URLS = importAll(
    require.context("./assets/photos", false, /\.(png|jpe?g)$/)
  );
} catch (err) {
  console.warn("Local photos not found, using fallback images.");

  PHOTO_URLS = [
    "https://images.unsplash.com/photo-1542826438-9b1d6f5d9f8f",
    "https://images.unsplash.com/photo-1505250469679-203ad9ced0cb",
    "https://images.unsplash.com/photo-1512058564366-c9e3e3b9f5f6",
  ];
}




export default function App() {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;
    const t = setInterval(() => {
      setPhotoIndex((i) => (i + 1) % PHOTO_URLS.length);
    }, 3500);
    return () => clearInterval(t);
  }, [autoPlay]);

  const nextPhoto = () => setPhotoIndex((i) => (i + 1) % PHOTO_URLS.length);
  const prevPhoto = () => setPhotoIndex((i) => (i - 1 + PHOTO_URLS.length) % PHOTO_URLS.length);




  const [selectedClass, setSelectedClass] = useState(null);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });

  const handleRegisterClick = (cls) => {
    setSelectedClass(cls);
    setShowRegisterForm(true);
    // scroll to the register section (which is right below classes)
    setTimeout(() => {
      const el = document.querySelector(".register-section");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.phone.trim()) {
      alert("Phone is mandatory");
      return;
    }

    const body = `Registration for: ${selectedClass.title} on ${selectedClass.date}\nName: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email}`;
    window.location.href = `mailto:salemcookingclass@gmail.com?subject=${encodeURIComponent("Class Registration")}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="page-wrapper">
      {/* Menu */}
      <nav className="menu" aria-label="Main menu">
        <ul className="nav-links">
        <a href="#home">Home</a>
        <a href="#about">About Us</a>
        <a href="#classes">Classes</a>
        <a href="#contact">Contact</a>
        <a href="#social">Follow Us</a>
        {/* Social Icons in Menu */}
          <li className="social-icons">
            <a href="https://www.facebook.com/SalemCakeCraftStudio/" target="_blank" rel="noreferrer">
              <FaFacebook />
            </a>
            <a href="https://www.youtube.com/@SalemCakeCraftStudio" target="_blank" rel="noreferrer">
              <FaYoutube />
            </a>
            <a href="https://www.instagram.com/salemcakecraftstudio" target="_blank" rel="noreferrer">
              <FaInstagram />
            </a>
          </li>
        </ul>
      </nav>
 
 
      {/* Header */}
      <header id="home" className="header">
        <img src={LOGO_URL} alt="Salem Cake Craft Studio logo" className="logo-img" />
        <h1>Salem Cake Craft Studio</h1>
      </header>

      {/* Slider */}
      <section className="slider-section" aria-label="Gallery">
        <button className="navBtn" onClick={prevPhoto} aria-label="Previous photo">❮</button>
        <div className="big-photo-wrap" onMouseEnter={() => setAutoPlay(false)} onMouseLeave={() => setAutoPlay(true)}>
          <img src={PHOTO_URLS[photoIndex]} alt={`Slide ${photoIndex + 1}`} className="big-photo" />
        </div>
        <button className="navBtn" onClick={nextPhoto} aria-label="Next photo">❯</button>
      </section>

      {/* Caption */}
      <section className="caption">
        <h2>Learn Baking The Right Way</h2>
        <p>Professional online & offline baking courses for all skill levels.</p>
      </section>

{/* OFFLINE WORKSHOPS */}
<section id="classes" className="classes-section"></section>
<section id="offline-workshops" className="classes-section">
  <h2>Offline Workshops</h2>
  <div className="horizontal-scroll" role="list">
    {classes
      .filter((c) => c.type === "offline")
      .map((cls) => (
        <article key={cls.id} className="class-card" role="listitem">
          <h3>{cls.title}</h3>
          <h4>{cls.date}</h4>

          <div style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>
            {cls.details.split("\n").map((line, index) => {
              const trimmed = line.trim();

              // Check if the line is a URL
              const isURL =
                trimmed.startsWith("http://") ||
                trimmed.startsWith("https://");

              if (isURL) {
                return (
                  <p key={index}>
                    <a
                      href={trimmed}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#4a90e2",
                        fontWeight: "bold",
                        textDecoration: "underline",
                      }}
                    >
                      Watch Video
                    </a>
                  </p>
                );
              }

              return <p key={index}>{trimmed}</p>;
            })}
          </div>

          <button
            onClick={() => handleRegisterClick(cls)}
            className="registerBtn"
          >
            Enquire Now
          </button>
        </article>
      ))}
  </div>
</section>

{/* ONLINE WORKSHOPS */}
<section id="online-workshops" className="classes-section">
  <h2>Online Pre Recorded Videos</h2>
  <div className="horizontal-scroll" role="list">
    {classes
      .filter((c) => c.type === "online")
      .map((cls) => (
        <article key={cls.id} className="class-card" role="listitem">
          <h3>{cls.title}</h3>
          <h4>{cls.date}</h4>

          <div style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>
            {cls.details.split("\n").map((line, index) => {
              const trimmed = line.trim();

              const isURL =
                trimmed.startsWith("http://") ||
                trimmed.startsWith("https://");

              if (isURL) {
                return (
                  <p key={index}>
                    <a
                      href={trimmed}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#4a90e2",
                        fontWeight: "bold",
                        textDecoration: "underline",
                      }}
                    >
                      Watch Video
                    </a>
                  </p>
                );
              }

              return <p key={index}>{trimmed}</p>;
            })}
          </div>

          <button
            onClick={() => handleRegisterClick(cls)}
            className="registerBtn"
          >
            Enquire Now
          </button>
        </article>
      ))}
  </div>
</section>


      {/* Register Section (hidden by default) */}
      <div className="register-anchor" />
      {showRegisterForm && selectedClass && (
        <section className="register-section" aria-labelledby="register-heading">
          <h2 id="register-heading">Enquire for: {selectedClass.title } on {selectedClass.date }</h2>
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
