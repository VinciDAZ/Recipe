import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Home  ({items}) {
    const navigate = useNavigate();
    const [foodNameList, setFoodNameList] = useState([]);
    const onClicker =  async () => {

        
        try {
          const response = await axios.get("http://localhost:5000/db/foods");
          setFoodNameList(response.data); // Store the fetched data
          navigate("/recipes/create", { state: { foodNameList: response.data } }); // Navigate to Gallery with data
        } catch (error) {
          console.error("Error fetching food data:", error);
        }
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