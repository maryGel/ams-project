import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
// import { HeaderTitle } from './Utils/headerTitleList';
import Header from './Utils/header.jsx';
import HomePage from './pages/HomePage.jsx'; 
import LoginPage from './pages/LoginPage.jsx';

// Asset Master Pages
import AssetMasterListPage from './a_assetMaster/pages/AssetMasterListPage.jsx';
import CreateAssetPage from './a_assetMaster/pages/CreateAssetPage.jsx';
import AssetMasterDisplay from './a_assetMaster/pages/AssetDisplayPage.jsx';
import Practice from './Utils/practice.jsx';
import ReferentialPage from './a_assetMaster/pages/ReferentialPage.jsx';

// Asset Movement Pages
import JOFormPage from './a_Movement/pages/JOFormPage.jsx';

// To initialize the header title based on the current page
  const getInitialTitle = () => {
    const savedTitle = localStorage.getItem('currentHeaderTitle');
    return savedTitle ? savedTitle : 'Asset Management System';
  }


  // To initialize the nav link based on the current page

  const getInitialNavLink = () => {
    const savedLink = localStorage.getItem('navLink');
    return savedLink 
  }


function App() {

  const location = useLocation();
  const [ headerTitle, setHeaderTitle] = useState(getInitialTitle);
  const [ navLink, setNavLink ] = useState(getInitialNavLink);
  

  // To save the header title to localStorage whenever it changes
  const saveTitleUpdate = (newTitle) => {
    localStorage.setItem('currentHeaderTitle', newTitle);
    setHeaderTitle(newTitle);
  }

  // To save the nav link to localStorage whenever it changes
  const saveNavLinkUpdate = (newLink) => {
    localStorage.setItem('navLink', newLink);
    setNavLink(newLink);
  }

  const tabPaths = [
    '/Home',
    '/Home/AssetMasterPage',
    '/Home/Movement',
    '/Home/Depreciation',
    '/Home/Reports',
    '/Home/PhysicalCount',
    '/Home/Utilities'
  ];

  return (
  <div className="App">
    {/* You can add a NavLink/Link component here for navigation */}

    {/* Hide header on login page */}
      {location.pathname !== '/' && (
        <Header 
          headerTitle={headerTitle}
          setHeaderTitle={saveTitleUpdate}
          navLink={navLink}
          setNavLink={saveNavLinkUpdate}
          tabPaths = {tabPaths}
        />
      )}
      
      <Routes> {/* This container now works because of BrowserRouter in main.jsx */}
        <Route path="/" 
                element={<LoginPage 
                  headerTitle ={headerTitle}
                  setHeaderTitle={saveTitleUpdate}
                />} 
        />
        <Route  path="/Home/*" 
                element={<HomePage
                          headerTitle ={headerTitle}
                          setHeaderTitle={saveTitleUpdate}
                          tabPaths = {tabPaths}
                        />} 
        /> 
        {/* Asset Master Pages */}
        <Route path="/assetFolder/pages/assetMasterList" 
                element={<AssetMasterListPage 
                          setHeaderTitle={saveTitleUpdate}
                          setNavLink={setNavLink}
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
        <Route path="/assetFolder/assetMasterDisplay" 
                element={<AssetMasterDisplay
                          setHeaderTitle={saveTitleUpdate}
                        />} 
        />

        {/* Asset Movement Pages */}
        <Route path="/assetMovement/pages/JOFormPage" 
                element={<JOFormPage
                          setHeaderTitle={saveTitleUpdate}
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