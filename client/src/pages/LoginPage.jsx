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
  const [debugInfo, setDebugInfo] = useState(""); // Add debug state

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    setHeaderTitle("Asset Management System");

    if (e) e.preventDefault();
    
    if (!localUsername.trim() || !password.trim()) {
      setErrorMsg("Please enter both username and password");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    setDebugInfo("Attempting login...");

    try {
      setDebugInfo(`Sending to: ${api.defaults.baseURL}/login`);
      
      const res = await api.post("/login", {
        user: localUsername.trim(),
        password: password.trim(),
      });

      setDebugInfo(`Response received! Status: ${res.status}`);
      
      if (res.data.success) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('Admin', res.data.Admin === 1 );
        localStorage.setItem('username', localUsername.trim());
        if (setUsername) setUsername(localUsername.trim());
        navigate('/Home');
      } else {
        setErrorMsg(res.data.message || "Login failed");
        setDebugInfo(`Login failed: ${res.data.message}`);
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      
      // Detailed error display
      let errorDetail = "";
      if (err.code === 'ERR_NETWORK') {
        errorDetail = "Network error - cannot reach server";
        setDebugInfo(`Network error: ${err.message}`);
      } else if (err.code === 'ECONNABORTED') {
        errorDetail = "Connection timeout";
        setDebugInfo(`Timeout error`);
      } else if (err.response) {
        errorDetail = err.response.data.message || "Server error";
        setDebugInfo(`Server error (${err.response.status}): ${JSON.stringify(err.response.data)}`);
      } else if (err.request) {
        errorDetail = "No response from server";
        setDebugInfo(`No response: Request was sent but no reply`);
      } else {
        errorDetail = "Unexpected error";
        setDebugInfo(`Error: ${err.message}`);
      }
      
      setErrorMsg(errorDetail);
    } finally {
      setIsLoading(false);
    }
  };

  const testHealth = async () => {
    try {
      setDebugInfo(`Testing health at: ${api.defaults.baseURL}/health`);
      const res = await api.get('/health');
      setDebugInfo(`Health OK: ${JSON.stringify(res.data)}`);
      alert(`Server health: ${res.data.status}`);
    } catch (err) {
      setDebugInfo(`Health failed: ${err.message}`);
      alert('Cannot connect to server');
    }
  };

  return (
    <>
      <div className={`flex h-screen`}>
        <section className={`grid w-full h-screen place-content-center bg-[url('images/loginBg.png')] bg-cover`}>
          <h2 className={`text-gray-700 lg:p-4 lg:text-2xl tracking-wider text-center text-base p-5`}>
            Asset Management System
          </h2>

          {/* Debug info panel - TEMPORARY for testing */}
          {debugInfo && (
            <div className="p-3 mb-4 overflow-auto text-xs text-white bg-gray-800 rounded max-w-96">
              <strong>Debug:</strong> {debugInfo}
            </div>
          )}

          <div className={`flex flex-col w-96 bg-white rounded shadow-md gap-3 lg:p-8 py-8 px-4 m-2 bg-opacity-70`}>
            {errorMsg && (
              <div className="p-3 mb-4 text-sm text-red-600 border border-red-200 rounded bg-red-50">
                {errorMsg}
              </div>
            )}

            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              className="rounded-md"
              value={localUsername}
              onChange={(e) => setLocalUsername(e.target.value)}
              disabled={isLoading}
            />

            <TextField
              type="password"
              label="Password"
              className="rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              onKeyDown={handleLogin}
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
            onClick={testHealth}
          >
            Test Server Connection
          </button>
        </section>
      </div>
    </>
  );
}

export default LoginPage;