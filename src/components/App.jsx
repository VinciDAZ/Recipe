
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import AuthPage from './AuthPage';
import Register from './Register';
import homeData from "../Data/homeGallery";
import Home from "./Home";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Home" element={<Home items={homeData} />} />
      </Routes>
    </Router>
  );
};



export default App;
