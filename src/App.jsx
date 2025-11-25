import React, {useState }from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { HeaderTitle } from './Utils/header.js';
import Header from './components/header.jsx';
import HomePage from './pages/HomePage.jsx'; 
import LoginPage from './pages/LoginPage.jsx';

import AssetMasterListPage from './assetMaster/pages/AssetMasterListPage.jsx';
import CreateAssetPage from './assetMaster/pages/CreateAssetPage.jsx';
import AssetMasterDisplay from './assetMaster/pages/AssetDisplayPage.jsx';
import Practice from './components/practice.jsx';
import ReferentialPage from './assetMaster/pages/ReferentialPage.jsx';


// Use environment variable for backend API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';


function App() {

  const location = useLocation();

// To initialize the header title based on the current page
  const getInitialTitle = () => {
    const savedTitle = localStorage.getItem('currentHeaderTitle');
    return savedTitle ? savedTitle : HeaderTitle.DEFAULT;
  }

  const [ headerTitle, setHeaderTitle] = useState(getInitialTitle);

// To save the header title to localStorage whenever it changes
  const saveTitleUpdate = (newTitle) => {
    localStorage.setItem('currentHeaderTitle', newTitle);
    setHeaderTitle(newTitle);
  }

  return (
  <div className="App">
    {/* You can add a NavLink/Link component here for navigation */}

    {/* Hide header on login page */}
      {location.pathname !== '/' && (
        <Header 
        headerTitle={headerTitle}
        setHeaderTitle={saveTitleUpdate}
      />
      )}
      
      <Routes> {/* This container now works because of BrowserRouter in main.jsx */}
        <Route path="/" 
                element={<LoginPage />} 
        />
        <Route  path="/Home" 
                element={<HomePage
                          headerTitle ={headerTitle}
                          setHeaderTitle={saveTitleUpdate}
                        />} 
        /> 
        
        <Route path="/assetFolder/pages/assetMasterList" 
                element={<AssetMasterListPage 
                          setHeaderTitle={saveTitleUpdate}
                        />} 
        />
        <Route path="/assetFolder/createAsset" 
                element={<CreateAssetPage
                          setHeaderTitle={saveTitleUpdate}
                        />} 
        />
        <Route path="/assetFolder/pages/referentialPage" 
                element={<ReferentialPage
                          setHeaderTitle={saveTitleUpdate}
                        />} 
        />
        <Route path="/assetFolder/assetMasterDisplay/:facno" 
                element={<AssetMasterDisplay
                          setHeaderTitle={saveTitleUpdate}
                        />} 
        />

        <Route path="/practiceJsx" 
                element={<Practice
                        />} 
        />

        {/* If you add a register page, define its route here: */}
        {/* <Route path="/registerpage" element={<RegisterPage />} /> */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </div>
  )
}

export default App