import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Meals from "./components/Meals";
import Testimonials from "./components/Testimonials";
import Pricing from "./components/Pricing";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Header />
      <Hero />
      <HowItWorks />
      <Meals />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />
    </>
  );
}

export default App;
