import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export function VerifySuccess() {
    const [params]= useSearchParams();
    const [status, setStatus]= useState(params.get('status'));
    const navigate=useNavigate();
    useEffect(()=>{
        const checkStatus=async()=>{
            const id= sessionStorage.getItem('userId');
            const res=await axios.get(`${import.meta.env.VITE_base_url}/api/users/verifiedStatus/${id}`);
            if(res.data.flag){
                setStatus('success');
                setTimeout(()=>{
                    navigate('/home');
                }, 2000);
            }
        }
        checkStatus();
    }, [])
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {status==='success' ? 
        <div><h2 style={styles.title}>✅ Email Verified</h2>
        <p style={styles.text}>
          Your account has been successfully verified.
        </p> </div> 
            :
        <h2 style={styles.title}>A verification link has been sent to your email. click on that to verify your account</h2>
        }
        
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
    padding: "30px",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  },
  title: {
    color: "#16a34a",
    marginBottom: "10px",
  },
  text: {
    marginBottom: "20px",
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
