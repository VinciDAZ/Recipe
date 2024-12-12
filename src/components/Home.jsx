import React from "react";


const Home = ({items}) => {

    function onClicker() {
        console.log("yey")
    }
  return (
    <div>
        <header> Welcome</header>
    <div className="gallery-container">
        {items.map((item, index) => (
        <div onClick={onClicker} className="gallery-item" key={index}>
          <img src={item.image} alt={item.title} className="gallery-image" />
          <div className="gallery-caption">{item.title}</div>
        </div>))}
    </div>
    </div>
  );
};

export default Home;