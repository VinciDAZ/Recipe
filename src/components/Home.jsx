import React from "react";
import { useNavigate } from "react-router-dom";

const Home = ({items}) => {
const navigate = useNavigate();

    function onClicker() {
        console.log("yey")
    }

    function handleSignOut(){
        navigate("/")
    }
  return (
    <div className="home-container">
        <header> Welcome</header>
        <button className="sign-out-btn" onClick={handleSignOut}>Sign Out</button>

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