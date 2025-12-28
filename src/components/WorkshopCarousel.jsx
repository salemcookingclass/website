import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

/* ---------------------------
   Simple AI-like ranking
   --------------------------- */
function rankClasses(list) {
  return [...list].sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;

    if (a.price) scoreA += 1;
    if (b.price) scoreB += 1;

    if (a.date && a.date !== "TBA") scoreA += 2;
    if (b.date && b.date !== "TBA") scoreB += 2;

    return scoreB - scoreA;
  });
}

export default function WorkshopCarousel({ title, classes, type, onEnquire }) {
  const wrapperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const rankedClasses = rankClasses(classes);

  /* Auto-center active card */
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const card = wrapper.children[activeIndex];
    if (!card) return;

    const left =
      card.offsetLeft -
      wrapper.clientWidth / 2 +
      card.clientWidth / 2;

    wrapper.scrollTo({ left, behavior: "smooth" });
  }, [activeIndex]);

  return (
    <>
      <h2>{title}</h2>

      <section className="classes-section">
        <div className="scroll-wrapper">
          <div
            className="horizontal-scroll"
            ref={wrapperRef}
            role="list"
          >
            {rankedClasses.map((cls, idx) => (
              <motion.article
                key={cls.id}
                role="listitem"
                className={`class-card ${type}`}
                onMouseEnter={() => setActiveIndex(idx)}
                initial={{ opacity: 0.5 }}
                animate={{
                  opacity: idx === activeIndex ? 1 : 0.6,
                  scale: idx === activeIndex ? 1.08 : 0.96
                }}
                transition={{ duration: 0.35 }}
              >
                <div className="card-overlay" />

                <h3>{cls.title}</h3>

                {cls.date && <p>Date: {cls.date}</p>}
                {cls.time && <p>Time: {cls.time}</p>}

                <p className="price">{cls.price || "—"}</p>

                <div className="card-actions">
                  <Link
                    to={`/class/${cls.id}`}
                    className="learnMoreBtn"
                  >
                    Details
                  </Link>
                  <button
                    onClick={() => onEnquire(cls)}
                    className="registerBtn"
                  >
                    Enquire
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
