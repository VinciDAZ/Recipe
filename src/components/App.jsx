
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Login from './Login.jsx';
import Register from './Register.jsx';
import homeData from "../Data/homeGallery.jsx";
import Home from "./Home.jsx";
import LineGraph from "./CalorieVisual.jsx";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home items={homeData} />} />
        <Route path="/home/data" element={<LineGraph />} />
      </Routes>
    </Router>
  );
};



export default App;
