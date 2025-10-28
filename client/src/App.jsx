import React, {useState }from 'react';
import { Routes, Route } from 'react-router-dom';
import { HeaderTitle } from './Utils/header.js';
import Header from './components/header.jsx';
import HomePage from './pages/HomePage.jsx'; 
import LoginPage from './pages/LoginPage.jsx';
import AssetMasterlist from './assetMaster/assterMasterlist.jsx';




function App() {

  const [ headerTitle, setHeaderTitle] = useState(HeaderTitle.DEFAULT);

  return (
  <div className="App">
    {/* You can add a NavLink/Link component here for navigation */}

      <Header 
        headerTitle={headerTitle}
        setHeaderTitle={setHeaderTitle}
      />
      
      <Routes> {/* This container now works because of BrowserRouter in main.jsx */}
        <Route  path="/" 
                element={<HomePage
                          headerTitle ={headerTitle}
                          setHeaderTitle={setHeaderTitle}
                        
                        />} /> 
        <Route path="/loginpage" element={<LoginPage />} />
        <Route path="/assetFolder/assetMasterData" 
                element={<AssetMasterlist 
                          setHeaderTitle={setHeaderTitle}
                        />} />



        {/* If you add a register page, define its route here: */}
        {/* <Route path="/registerpage" element={<RegisterPage />} /> */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </div>
  )
}

export default App