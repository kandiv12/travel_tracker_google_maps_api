import React from "react";

const Hero = () => {
  return (
    <section className="section-hero">
      <div className="hero">
        <div className="hero-text-box">
          <h1 className="heading-primary">
            A healthy meal delivered to your door, every single day
          </h1>
          <p className="hero-description">
            The smart 365-days-per-year food subscription that will make you eat
            healthy again. Tailored to your personal tastes and nutritional
            needs.
          </p>
          <a href="#cta" className="btn btn-full margin-right-sm">
            Start eating well
          </a>
          <a href="#how" className="btn btn-outline">
            Learn more &darr;
          </a>
        </div>
        <div className="hero-img-box">
          <img src="img/hero.png" className="hero-img" alt="Healthy food" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
