import { useState } from "react";

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
        localStorage.setItem('user', localUsername.trim());
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
    <div>
      <div className='flex'>
        <img 
          src="/images/TELogo.png" 
          alt="Company Logo" 
          className="object-cover w-2/3 h-screen"
        />
        
        {/* Login Panel */}
        <section className="grid w-full h-screen place-content-center bg-slate-800">
          <h2 className="p-4 text-2xl tracking-wider text-center text-white">
            Asset Management System
          </h2>
          
          <div className="grid w-auto p-8 bg-white rounded shadow-md">
            {errorMsg && (
              <div className="p-3 mb-4 text-sm text-red-600 border border-red-200 rounded bg-red-50">
                {errorMsg}
              </div>
            )}

            <input 
              type="text" 
              placeholder="Username" 
              className="p-2 m-2 mb-4 border rounded w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={localUsername}
              onChange={(e) => setLocalUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            /> 
            
            <input 
              type="password" 
              placeholder="Password" 
              className="p-2 m-2 mb-4 border rounded w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
    </div>
  );
}

export default LoginPage;
