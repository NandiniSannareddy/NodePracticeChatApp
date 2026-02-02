import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";
import { useState } from "react";
import axios from 'axios'

export function ForgotPassword() {
  const [email, setEmail]=useState("");
  const [show, setShow]=useState(false);
  const [msg, setMsg]=useState("");
  const [sentOtp, setOtp]=useState(false);
  const [otp, settext]= useState("");
  const [isValid, setValid]= useState(false);
  const [reset, setreset]=useState(false);
  const [pass, setPass]=useState("");
  const navigate= useNavigate();
  const handleSubmit=async()=>{
    try{
      console.log("entered into function");
      const res=await axios.post(`${import.meta.env.VITE_base_url}/api/users/resetPassOtp`, {email});
      if(res.status===200){
        setShow(true);
        setMsg("Enter otp sent to your email")
        setOtp(true);
        console.log("otp sent");
      }
    }
    catch(err){
        if(err.response?.status===404){
            setShow(true);
            setMsg("User doesn't exists with that mail");          
        }
    }
  }
  const handleOTP=async()=>{
    try{
      const res= await axios.post(`${import.meta.env.VITE_base_url}/api/users/verifyOTP`, {otp, email});
      if(res.status===200){
          setreset(true);
          setMsg("Set your new password");
      }

    }
    catch(err){
        if(err.response?.status===404){
            setValid(true);
            setMsg('Invalid OTP');
        }
    }
  }
  const handlePass=async()=>{
      const res= await axios.post(`${import.meta.env.VITE_base_url}/api/users/changePassword`, {password:pass, email});
      if(res.status===200){
          navigate('/passwordChanged');
      }
  }
  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Reset Password</h2>
        { show && <p style={isValid ? {color:'red'} :{color:'orange'}}>{msg}</p>}
        {
          reset ?
            <form className="login-form">
                <input type="text" placeholder="Enter New Password" required value={pass} onChange={(e)=>setPass(e.target.value)}/>
                <button type="button" onClick={handlePass}>Submit</button>
            </form>
          :
          sentOtp ? 
            <form className="login-form">
                <input type="text" placeholder="Enter OTP" required value={otp} onChange={(e)=>settext(e.target.value)}/>
                <button type="button" onClick={handleOTP}>Submit</button>
            </form>
            :
            <form className="login-form">
                <input type="email" placeholder="Enter your email" required value={email} onChange={(e)=>setEmail(e.target.value)}/>
                <button type="button" onClick={handleSubmit}>Submit</button>
            </form>
          
        }
        
       

        <div className="login-links">
          <Link to="/">Remember password?Login</Link>
        </div>
      </div>
    </div>
  );
}


export function PasswordChanged() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🎉 Password Changed Successfully</h2>
        <p style={styles.text}>
          Your password has been updated. You can now log in with your new password.
        </p>

        <Link to="/" style={styles.button}>
          Login Now
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f3f4f6",
  },
  card: {
    background: "white",
    padding: "35px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    width: "330px",
  },
  title: {
    color: "#16a34a",
    marginBottom: "10px",
  },
  text: {
    marginBottom: "25px",
    color: "#555",
  },
  button: {
    display: "inline-block",
    padding: "10px 18px",
    background: "#4f46e5",
    color: "white",
    borderRadius: "6px",
    textDecoration: "none",
  },
};
