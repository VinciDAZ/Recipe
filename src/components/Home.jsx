import React from "react";
import { useNavigate } from "react-router-dom";

function Home  ({items}) {
const navigate = useNavigate();

    function onClicker() {

        
        navigate("/home/data/");
  };
    

    function handleSignOut(){
        navigate("/")
    }
  return (
    <div className="home-container">
        <header> Welcome</header>
        <button className="sign-out-btn" onClick={handleSignOut}>Sign Out</button>

    <div className="gallery-container">
        {items.map((item) => (
        <div 
        onClick={onClicker} 
        className="gallery-item" 
        key={item.key}
        style={{ cursor: "pointer" }}
        >
          <img src={item.image} alt={item.title} className="gallery-image" />
          <div className="gallery-caption">{item.title}</div>
        </div>))}
    </div>
    </div>
  );
};

export default Home;