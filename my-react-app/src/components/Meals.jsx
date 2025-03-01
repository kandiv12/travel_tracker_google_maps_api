import React from "react";

const Meals = () => {
  return (
    <section className="section-meals" id="meals">
      <div className="container">
        <h2 className="heading-secondary">
          Omnifood AI chooses from 5,000+ recipes
        </h2>
        <div className="grid grid-3-cols">
          <div className="meals">
            <img src="img/meals/meal-1.jpg" alt="Japanese Gyozas" />
            <p className="meal-title">Japanese Gyozas</p>
          </div>
          <div className="meals">
            <img src="img/meals/meal-2.jpg" alt="Avocado Salad" />
            <p className="meal-title">Avocado Salad</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Meals;
