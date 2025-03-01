import React from "react";

const CTA = () => {
  return (
    <section className="section-cta" id="cta">
      <div className="container">
        <h2 className="heading-secondary">Get your first meal for free!</h2>
        <form className="cta-form">
          <input type="text" placeholder="John Smith" required />
          <input type="email" placeholder="me@example.com" required />
          <button className="btn btn-form">Sign up now</button>
        </form>
      </div>
    </section>
  );
};

export default CTA;
