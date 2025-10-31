import React from "react";

function Home() {
  return (
    <div className="home-hero">
      <div className="home-hero__content">
        <h1>
          Build Better Habits, <br />
          <span className="text-accent">One Day at a Time</span>
        </h1>
        <p>
          Transform your life with our smart habit tracking system.
          <br />
          Set goals, track progress, and build lasting habits that stick.
        </p>
        <div className="cta-row">
          <a href="/signup" className="btn-primary">Get Started Free</a>
          <a href="/about" className="btn-outline">Learn More</a>
        </div>
      </div>
      <div className="home-card">
        <div className="feature-card">
          <p style={{fontWeight: 600, fontSize: '1.18rem'}}>Drink 8 glasses of water <span className="feature-days">🍊 7 days</span></p>
          <div className="progress-info">
            <span style={{ fontSize: "1.05rem" }}>85% completion rate</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar" style={{ width: "85%" }}></div>
          </div>
          <button className="btn-complete">Mark Complete</button>
        </div>
      </div>
      <section className="why-section">
        <h2>Why Choose Smart Habit Builder?</h2>
        <p>Everything you need to build and maintain healthy habits</p>
        <ul>
          <li><strong>Track Progress:</strong> Visualize your habit completion rates and streaks with beautiful charts and statistics.</li>
          <li><strong>Build Streaks:</strong> Stay motivated with streak counters that celebrate your consistency and dedication.</li>
          <li><strong>Mobile Friendly:</strong> Access your habits anywhere with our responsive design that works on all devices.</li>
          <li><strong>Smart Reminders:</strong> Never miss a habit with intelligent notifications and gentle reminders.</li>
          <li><strong>Community Support:</strong> Connect with like-minded individuals and share your habit-building journey.</li>
          <li><strong>Secure & Private:</strong> Your data is encrypted and secure. We respect your privacy and never share your information.</li>
        </ul>
      </section>
    </div>
  );
}

export default Home;
