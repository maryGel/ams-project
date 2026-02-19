import { useState } from "react";
// MUI
import { TextField } from '@mui/material';
import { api } from '../api/axios';
import { useNavigate } from "react-router-dom";


function LoginPage({setHeaderTitle, setUsername}) {
  const [localUsername, setLocalUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    setHeaderTitle("Asset Management System");

    // Prevent default form submission if inside a form
    if (e) e.preventDefault();
    
    // Input validation
    if (!localUsername.trim() || !password.trim()) {
      setErrorMsg("Please enter both username and password");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
 

    try {
      const res = await api.post("/login", {
        user: localUsername.trim(),
        password: password.trim(),
      });

      console.log('Full response:', res);
      console.log('Response data:', res.data);
      console.log('Token from response:', res.data.token);
      if (res.data.success) {

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('Admin', res.data.Admin === 1 );
        localStorage.setItem('username', localUsername.trim());
        if (setUsername) setUsername(localUsername.trim());  // Store user data in localStorage 
        navigate('/Home');
      } else {
        setErrorMsg(res.data.message || "Login failed");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      

      if (err.response) {
        setErrorMsg(err.response.data.message || "Server error occurred");
      } else if (err.request) {
        setErrorMsg("Cannot connect to server. Please check your connection.");
      } else {
        setErrorMsg("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }

  };

  // console.log('header', headerTitle)

  // Handle form submission on Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <>
      <div className= {`flex h-screen `}>
        
        {/* Login */}
        <section className={ `grid w-full h-screen place-content-center bg-[url('images/loginBg.png')] bg-cover`}>
          <h2 
            className={` text-gray-700
              LG :   lg:p-4 lg:text-2xl tracking-wider text-center
              SM/MD :   text-base p-5            
          `}>
            Asset Management System
          </h2>  

          {/* Panel */}
          <div className={` flex flex-col w-96 bg-white rounded shadow-md gap-3
              LG / lg:p-8 
              SM / py-8 px-4 m-2 bg-opacity-70
            
            `}>
            {errorMsg && (
              <div className="p-3 mb-4 text-sm text-red-600 border border-red-200 rounded bg-red-50">
                {errorMsg}
              </div>
            )}

            <TextField
              fullWidth 
              label="Username" 
              variant="outlined"
              className="rounded-md "
              value={localUsername}
              onChange={(e) => setLocalUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            /> 
            
            <TextField
              type="password" 
              label="Password" 
              className="rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            /> 
            
            <button 
              type="submit"
              className={`p-2 m-2 text-white rounded transition-colors ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-black hover:bg-blue-700'
              }`}
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>    
            
            <h4 className="p-2 m-3 text-sm text-left text-blue-600 cursor-pointer hover:underline">
              Forgot password?
            </h4> 

          </div>        
          <button 
            className="p-2 m-2 text-white bg-green-600 rounded hover:bg-green-700"
            onClick={async () => {
              try {
                const res = await api.get('/login/health');
                console.log('Health check:', res.data);
                alert(`Server health: ${res.data.status} Message: ${res.data.message}`);
              } catch (err) {
                console.error('Health check failed:', err);
                alert('Cannot connect to server');
              }
            }}
          >
            Test Server Connection
          </button> 
        </section>       
      </div>
    </>
  );
}

export default LoginPage;
