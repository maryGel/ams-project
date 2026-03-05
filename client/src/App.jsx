import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './api/ProtectedRoute.jsx';

import Layout from './Utils/headerLayout.jsx';
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
import UserAccessPage from './a_SystemSetup/pages/userAccessPage.jsx';

// Mobile Pages
import MvDashBoard from './mobileView/mvDBoardPage.jsx';
import MvJobOrderPage from './mobileView/mvJobOrdersPage.jsx';
import MvTransferPage from './mobileView/mvTransferPage';
import MvDisposalPage from './mobileView/mvDisposalPage';
import MvAssetAccPage from './mobileView/mvAssetAccPage';
import MVAssetLostPage from './mobileView/mvAssetLostPage';
import MvMaintenancePage from './mobileView/mvMaintenancePage';

// To initialize the header title based on the current page
const getInitialTitle = () => {
  const savedTitle = localStorage.getItem('currentHeaderTitle');
  return savedTitle ? savedTitle : 'Asset Management System';
};

// To initialize the nav link based on the current page
const getInitialNavLink = () => {
  const savedLink = localStorage.getItem('navLink');
  return savedLink;
};

function App() {
  const [headerTitle, setHeaderTitle] = useState(getInitialTitle);
  const [navLink, setNavLink] = useState(getInitialNavLink);
  const [username, setUsername] = useState(() => localStorage.getItem('username') || 'User');

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

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className="App">
      <Routes>
        {/* Public route - no header */}
        <Route path="/" element={
          <LoginPage 
            setHeaderTitle={saveTitleUpdate}
            setUsername={setUsername}            
          />
        } />

        {/* All protected routes with header - NESTED under the Layout route */}
        <Route element={
          <ProtectedRoute>
            <Layout 
              headerTitle={headerTitle}
              setHeaderTitle={setHeaderTitle}
              navLink={navLink}
              setNavLink={setNavLink}
              username={username}
              isMobile={isMobile}
            />
          </ProtectedRoute>
        }>
          {/* These routes will render INSIDE the Layout component's Outlet */}
           <Route path="/Home" element={
            isMobile ? <MvDashBoard useProps={{}} /> : <HomePage
              headerTitle={headerTitle}
              setHeaderTitle={saveTitleUpdate}
              username={username}
              navLink={navLink}
              setNavLink={saveNavLinkUpdate}
              isMobile={isMobile}
            />
          } />
          {/* <Route path="/Home/dashboard" element={<MvDashBoard />} /> */}
           {isMobile && (
            <>
              <Route path="/Home/jobOrderPage" element={<MvJobOrderPage />} />
              <Route path="/Home/transfers" element={<MvTransferPage />} />
              <Route path="/Home/disposals" element={<MvDisposalPage />} />
              <Route path="/Home/borrowAndIssue" element={<MvAssetAccPage />} />
              <Route path="/Home/lostAssets" element={<MVAssetLostPage />} />
              <Route path="/Home/maintenance" element={<MvMaintenancePage />} />
            </>
          )}
          
          {/* Asset Master Pages */}
          <Route path="/assetFolder/pages/assetMasterList" element={
            <AssetMasterListPage 
              setHeaderTitle={saveTitleUpdate}
              setNavLink={setNavLink}
            />
          } />
          
          <Route path="/assetFolder/createAsset" element={
            <CreateAssetPage
              setHeaderTitle={saveTitleUpdate}
            />
          } />
          
          <Route path="/assetFolder/pages/referentialPage" element={
            <ReferentialPage
              setHeaderTitle={saveTitleUpdate}
            />
          } />
          
          <Route path="/assetFolder/assetMasterDisplay" element={
            <AssetMasterDisplay
              setHeaderTitle={saveTitleUpdate}
            />
          } />

          {/* Asset Movement Pages */}
          <Route path="/assetMovement/pages/JOFormPage" element={
            <JOFormPage
              setHeaderTitle={saveTitleUpdate}
            />
          } />

          {/* System Setup Pages */}
          <Route path="/systemSetup/user/userProfile" element={
            <UserAccessPage
              setHeaderTitle={saveTitleUpdate}
            />
          } />
        </Route>

        {/* 404 route */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </div>
  );
}

export default App;