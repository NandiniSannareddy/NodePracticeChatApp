import { Link, useNavigate } from 'react-router-dom';
import '../styles/login.css'
import { useEffect, useState } from 'react';
import axios from 'axios'
export function Login(){
  const [email, setEmail]=useState("");
  const [password, setPassword]=useState("");
  const [isok, setok]=useState(false);
  const [msg, setMsg]=useState("");
  const navigate=useNavigate();
  useEffect(()=>{
  
  })
  const handleSubmit=async()=>{
    try{ 
      const res= await axios.post(`${import.meta.env.VITE_base_url}/api/users/login`, {email, password});
      if(res.status===200){
        setMsg("");
        setok(true);
        sessionStorage.setItem("userId", res.data.token);
        setTimeout(()=>{
          navigate('/home')
        }, 3000);
      }
    }
    catch(err){
          if(err.response?.status===401){
            setMsg("Invalid credentials");
          }
          else if(err.response?.status===403){
              setMsg(err.response.data.message);
          }
          else{
            setMsg("different error");
          }
    }
  }
    return (

     <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        {<p style={{color:'red'}}>{msg}</p>}
        <form className="login-form">
          <input type="email" placeholder="Email" value={email} required onChange={(e)=>setEmail(e.target.value)}/>
          <input type="password" placeholder="Password" value={password} required onChange={(e)=>setPassword(e.target.value)}/>
          <button type="button" onClick={handleSubmit}>Login</button>
        </form>

        <div className="login-links">
          <Link to="/forgotPassword">Forgot password</Link>
          <Link to="/create">Create account</Link>
        </div>
        {isok?<h2 style={{color:'green'}}>successfull login</h2> : <p></p>}
      </div>
    </div>
  );
}