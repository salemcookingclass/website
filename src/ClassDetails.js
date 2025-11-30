// src/ClassDetails.js
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import classes from "./classesLoader"; // We'll create this next

export default function ClassDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const cls = classes.find((c) => String(c.id) === id);

  if (!cls) {
    return <h2>Class not found</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "15px" }}>
        ⬅ Back
      </button>
      <h1>{cls.title}</h1>
      <p><strong>Date:</strong> {cls.date}</p>
      <p><strong>Time:</strong> {cls.time}</p>
      <p><strong>Fees:</strong> {cls.price || "—"}</p>

      <pre style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
        {cls.details}
      </pre>
     
    </div>
  );
}
