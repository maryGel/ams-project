import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ProtectedRoute from './api/ProtectedRoute.jsx';

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
import JOFormPage from './a_Movement/pages/jobOrderPage.jsx';


// System Setup Pages
import UserAccessPage from './a_SystemSetup/userProfile/userAccessPage.jsx';

// To initialize the header title based on the current page
  const getInitialTitle = () => {
    const savedTitle = localStorage.getItem('currentHeaderTitle');
    return savedTitle ? savedTitle : 'Asset Management System';
  };


  // To initialize the nav link based on the current page

  const getInitialNavLink = () => {
    const savedLink = localStorage.getItem('navLink');
    return savedLink 
  };


function App() {

  const location = useLocation();
  const [ headerTitle, setHeaderTitle] = useState(getInitialTitle);
  const [ navLink, setNavLink ] = useState(getInitialNavLink);
  const [ username, setUsername] = useState(() => localStorage.getItem('username') || 'User');

 

  // To save the header title to localStorage whenever it changes
  const saveTitleUpdate = (newTitle) => {
    localStorage.setItem('currentHeaderTitle', newTitle);
    setHeaderTitle(newTitle);
  };

  // To save the nav link to localStorage whenever it changes
  const saveNavLinkUpdate = (newLink) => {
    localStorage.setItem('navLink', newLink);
    setNavLink(newLink);
  };


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('isLoggedIn'); 
    window.location.href = '/'; // Redirect to login page
  }

  const tabPaths = [
    '/Home',
    '/Home/AssetMasterPage',
    '/Home/Movement',
    '/Home/Depreciation',
    '/Home/Reports',
    '/Home/PhysicalCount',
    '/Home/SystemSetup'
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
          username={username}
          onLogout={handleLogout}
        />
      )}
      
      <Routes> {/* This container now works because of BrowserRouter in main.jsx */}
        <Route path="/" 
                element={<LoginPage 
                  headerTitle ={headerTitle}
                  setHeaderTitle={saveTitleUpdate}
                  setUsername={setUsername}
                />} 
        />
        <Route  path="/Home/*" element={
          <ProtectedRoute>
                <HomePage
                    headerTitle ={headerTitle}
                    setHeaderTitle={saveTitleUpdate}
                    tabPaths = {tabPaths}
                />
          </ProtectedRoute>
        } 
        /> 
        {/* Asset Master Pages */}
        <Route path="/assetFolder/pages/assetMasterList" element={
            <ProtectedRoute>
                <AssetMasterListPage 
                    setHeaderTitle={saveTitleUpdate}
                    setNavLink={setNavLink}
                />
            </ProtectedRoute>
        } 
        />
        <Route path="/assetFolder/createAsset" element={
            <ProtectedRoute>
                <CreateAssetPage
                    setHeaderTitle={saveTitleUpdate}
                />
            </ProtectedRoute>
        } 
        />
        <Route path="/assetFolder/pages/referentialPage" element={
            <ProtectedRoute>
                <ReferentialPage
                    setHeaderTitle={saveTitleUpdate}
                />
            </ProtectedRoute>
        } 
        />
        <Route path="/assetFolder/assetMasterDisplay" element={
            <ProtectedRoute>
                <AssetMasterDisplay
                    setHeaderTitle={saveTitleUpdate}
                />
            </ProtectedRoute>

        } 
        />

        {/* Asset Movement Pages */}
        <Route path="/assetMovement/pages/JOFormPage" element={
            <ProtectedRoute>
                <JOFormPage
                    setHeaderTitle={saveTitleUpdate}
                />
            </ProtectedRoute>
        } 
        />

        {/* System Setup Pages */}
        <Route path="/systemSetup/user/userProfile" element={
            <ProtectedRoute>
                <UserAccessPage
                    setHeaderTitle={saveTitleUpdate}
                />
            </ProtectedRoute>
        } 
        />

        {/* If you add a register page, define its route here: */}
        {/* <Route path="/registerpage" element={<RegisterPage />} /> */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </div>
  )
}

export default App