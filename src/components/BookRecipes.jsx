import React, { useState } from "react";

const BookRecipes = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleBook = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="book-container" onClick={toggleBook}>
      <div className={`book ${isOpen ? "open" : ""}`}>
        <div className="front-cover">Book Title</div>
        <div className="content">
          <h2>Chapter 1</h2>
          <p>This is the content of the book...</p>
        </div>
        <div className="back-cover"></div>
      </div>
    </div>
  );
};

export default BookRecipes;
