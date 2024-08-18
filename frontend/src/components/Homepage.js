import React from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';

const Homepage = () => {
  return (
    <div className="homepage">
      <header className="hero">
        <h1>Welcome to Kitchen Inventory & Recipe Manager</h1>
        <p>Organize your ingredients and discover delicious recipes!</p>
      </header>
      
      <section className="features">
        <div className="feature">
          <h2>Manage Your Inventory</h2>
          <p>Keep track of all your ingredients in one place.</p>
        </div>
        <div className="feature">
          <h2>Create Recipes</h2>
          <p>Turn your ingredients into delicious meals with easy-to-follow recipes.</p>
        </div>
        <div className="feature">
          <h2>Share and Discover</h2>
          <p>Share your recipes with others and discover new favorites!</p>
        </div>
      </section>
      
      <section className="cta">
        <h2>Get Started Today!</h2>
        <Link to="/register" className="cta-button">Sign Up Now</Link>
      </section>
    </div>
  );
};

export default Homepage;

