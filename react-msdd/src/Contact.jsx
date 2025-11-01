// src/pages/Contact.jsx
import React, { useState } from "react";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name && form.email && form.message) {
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
      // Here, add your backend integration for sending message
    }
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Get in Touch</h1>
      <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>

      {submitted && <p style={{ color: "green" }}>Message sent! We'll get back to you soon.</p>}

      <form onSubmit={handleSubmit} style={{ maxWidth: "400px", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <label>
          Name
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Message
          <textarea name="message" value={form.message} onChange={handleChange} rows="4" required />
        </label>
        <button type="submit">Send Message</button>
      </form>

      <section style={{ marginTop: "2rem" }}>
        <h2>Contact Information</h2>
        <ul>
          <li>Email: smarthabitbuilder@gmail.com (Respond within 24 hours)</li>
          <li>Phone: +91 9222135877 (Mon-Fri, 9AM-6PM IST)</li>
          <li>Office: 123 Innovation Drive, San Francisco, CA 94105</li>
          <li>Live Chat: Available on our website (Mon-Fri, 9AM-6PM IST)</li>
        </ul>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>Frequently Asked Questions</h2>
        <ul>
          <li>Reset password via the "Forgot Password" link on login page.</li>
          <li>We use industry-standard data encryption and respect your privacy.</li>
          <li>Export your habit data from dashboard settings (CSV, JSON supported).</li>
        </ul>
      </section>
    </main>
  );
}

export default Contact;
