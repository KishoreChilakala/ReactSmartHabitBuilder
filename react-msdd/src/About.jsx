

import React from "react";

function About() {
  return (
    <main className="about-page" style={{ padding: "2rem" }}>
      <h1>About Smart Habit Builder</h1>
      <h2>Empowering millions to build better habits and transform their lives</h2>
      
      <section>
        <h3>Our Mission</h3>
        <p>
          At Smart Habit Builder, we believe that small, consistent actions lead to extraordinary results. Our mission is to provide you with the tools, insights, and motivation needed to build lasting habits that transform your life.
        </p>
        <p>
          We understand that building habits isn't just about willpower—it's about creating systems, tracking progress, and celebrating small wins along the way. That's why we've designed a platform that makes habit formation intuitive, engaging, and sustainable.
        </p>
      </section>
      
      <section>
        <h3>Our Core Values</h3>
        <dl>
          <dt>User-Centric</dt>
          <dd>Every feature we build is designed with our users' success in mind. Your goals become our goals.</dd>

          <dt>Innovation</dt>
          <dd>We continuously innovate to provide cutting-edge tools that make habit building more effective.</dd>

          <dt>Privacy First</dt>
          <dd>Your personal data and habit information are secure and private. We never share or sell your data.</dd>

          <dt>Community</dt>
          <dd>We foster a supportive community where users can share experiences and motivate each other.</dd>
        </dl>
      </section>
      
      <section>
        <h3>Ready to Start Your Journey?</h3>
        <p>Join our community and start building better habits today.</p>
        <a href="/signup" className="btn btn-primary">Get Started Free</a>
      </section>
    </main>
  );
}

export default About;
