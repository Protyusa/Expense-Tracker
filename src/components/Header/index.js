import React, { useEffect } from 'react'
import "./styles.css";
import { auth } from '../firebase';
import {useAuthState} from "react-firebase-hooks/auth";
import {useNavigate, navigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';

function Header() {
  const [user, loading] = useAuthState(auth);
const navigate = useNavigate();
  useEffect(() => {
    if(user) {
      navigate("/dashboard");
    }
  }, [user,loading]);

    function logoutfnc() {
      try{
signOut(auth).then(() => {
  // Sign-out successful.
  toast.success("Logged out Successfully!");
  navigate("/");
}).catch((error) => {
  toast.error(error.message)
  // An error happened.
});
      }catch (e) {
        toast.error(e.message);
      }
    }
  return (
    <div className='navbar'>
        <p className='logo'>Expense-Tracker</p>
        
        <p className='logo link' onClick={logoutfnc}>
          Logout
          </p>
    
        
    </div>
  )
}

export default Header;