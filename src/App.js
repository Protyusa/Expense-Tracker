
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from './components/pages/Signup';
import Dashboard from './components/pages/Dashboard';
import {ToastContainer, Toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
function App() {
  return (
    <div>
      <ToastContainer/>
      <Router>
 <Routes>
   <Route path="/" element={<Signup />} />
   <Route path="/dashboard" element={<Dashboard />} />
 </Routes>
</Router>
    </div>
    
   
  );
}

export default App;