import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css"
import { useState } from "react";
import axios from 'axios'
export function CreateAccount() {
    const [fullName, setname]= useState("");
    const [email, setEmail]= useState("");
    const [password, setPassword]= useState("");
    const [show, setShow]=useState(false);
    const [isloading, setloading]=useState(false);
    const navigate= useNavigate();
    const handleSubmit=async()=>{
      try{
          setloading(true);
          const res= await axios.post(`${import.meta.env.VITE_base_url}/api/users/create`, {name:fullName, email, password});
          if(res.status===201){
            sessionStorage.setItem("userId",res.data.id)
            navigate('/verified');
          }
      }
      catch(err){
          if(err.response?.status===401){
            setShow(true);
            setloading(false);
          }
           else{
            console.log("api failed", err);
          }
      }   
    }
  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Create Account</h2>
        {show ? <p style={{color:'red'}}>User already exists with that email</p> : <p></p>}
        <form className="login-form">
          <input type="text" value={fullName} placeholder="Full Name" required onChange={(e)=>{setname(e.target.value)}}  />
          <input type="email" value={email} placeholder="Email" required onChange={(e)=>{setEmail(e.target.value)}}/>
          <input type="password" value={password}  placeholder="Password" required onChange={(e)=>{setPassword(e.target.value)}}/>
          {isloading?<button type="button" disabled>Signing Up...</button>  :<button type="button" onClick={handleSubmit}>Sign Up</button>}
        </form>

        <div className="login-links">
          <Link to="/">Already have an account? Login</Link>
        </div>
      </div>
    </div>
  );
}
