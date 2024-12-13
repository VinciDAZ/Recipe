
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import AuthPage from './AuthPage.jsx';
import Register from './Register.jsx';
import homeData from "../Data/homeGallery.jsx";
import Home from "./Home.jsx";
import LineGraph from "./CalorieVisual.jsx";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Home" element={<Home items={homeData} />} />
        <Route path="/Home/Data" element={<LineGraph />} />
      </Routes>
    </Router>
  );
};



export default App;
