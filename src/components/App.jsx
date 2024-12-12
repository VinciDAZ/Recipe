
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import AuthPage from './AuthPage';
import Register from './Register';
import homeData from "../Data/homeGallery";
import Home from "./Home";
import LineGraph from "./CalorieVisual";

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
