import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";



function LoginPage() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:3000/login", {
        username,
        password,
      });

      if (res.data.success) {
        navigate("/");
      } else {
        setErrorMsg(res.data.message);
      }
    } catch (err) {
      setErrorMsg("Server error. Please try again.");
      console.log(`User denied`, err)
    }
  };

  return (
   <div>
         {/* Logo */}
      <div className='flex' >
        <img  src="/public/images/TELogo.png" 
              alt="Login" 
              className ="w-2/3 h-screen"
        />
          {/* Login Panel */}
          <section className="grid w-full h-screen place-content-center bg-slate-800">
          <h2 className="p-4 text-2xl tracking-wider text-center text-white">Asset Management System</h2>
          <div className="grid w-auto p-8 bg-white rounded shadow-md">

            {errorMsg && (
              <p className="mb-2 text-sm text-red-600">{errorMsg}</p>
            )}

            <input 
                type="text" placeholder="Username" 
                className="p-2 m-2 mb-4 border w-72"
                onChange={(e) => setUsername(e.target.value)}
            /> 
            <input 
                type="password" placeholder="Password" 
                className="p-2 m-2 mb-4 border w-72"
                onChange={(e) => setPassword(e.target.value)}
            /> 
            <button 
              className="p-2 m-2 text-white bg-black rounded hover:bg-blue-700"
              onClick={handleLogin}
            >Login
            </button>    
            
            <h4 className="p-2 m-3 text-sm text-left text-blue-600 cursor-pointer hover:underline"
            >Forgot password?
            </h4> 
          </div>         
          </section>       
      </div>
    </div>
  )
}

export default LoginPage;