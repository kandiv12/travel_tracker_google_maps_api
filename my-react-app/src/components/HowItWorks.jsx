import React from "react";

const HowItWorks = () => {
  return (
    <section className="section-how" id="how">
      <div className="container">
        <h2 className="heading-secondary">
          Your daily dose of health in 3 simple steps
        </h2>
        <div className="grid grid-2-cols grid-center-v">
          <div className="step-text-box">
            <p className="step-number">01</p>
            <h3 className="heading-tertiary">Tell us what you like</h3>
            <p className="step-description">
              Never again waste time thinking about what to eat! Omnifood AI
              will create a 100% personalized weekly meal plan just for you.
            </p>
          </div>
          <div className="step-img-box">
            <img
              src="img/app/app-screen-1.png"
              className="step-img"
              alt="App Screenshot"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
