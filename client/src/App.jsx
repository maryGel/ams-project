import React, {useState }from 'react';
import { Routes, Route } from 'react-router-dom';
import { HeaderTitle } from './Utils/header.js';
import Header from './components/header.jsx';
import HomePage from './pages/HomePage.jsx'; 
import LoginPage from './pages/LoginPage.jsx';
import AssetMasterlist from './assetMaster/assterMasterlist.jsx';
import AssetGrouplist from './assetMaster/assetGrouplist.jsx';
import CreateAsset from './assetMaster/createAsset.jsx';
import AssetMasterDisplay from './assetMaster/assetDisplay.jsx';
import Practice from './components/practice.jsx';

function App() {

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

      <Header 
        headerTitle={headerTitle}
        setHeaderTitle={saveTitleUpdate}
      />
      
      <Routes> {/* This container now works because of BrowserRouter in main.jsx */}
        <Route  path="/" 
                element={<HomePage
                          headerTitle ={headerTitle}
                          setHeaderTitle={saveTitleUpdate}
                        />} 
        /> 
        <Route path="/loginpage" 
                element={<LoginPage />} 
        />
        
        <Route path="/assetFolder/assetMasterData" 
                element={<AssetMasterlist 
                          setHeaderTitle={saveTitleUpdate}
                        />} 
        />
        <Route path="/assetFolder/createAsset" 
                element={<CreateAsset
                          setHeaderTitle={saveTitleUpdate}
                        />} 
        />
        <Route path="/assetFolder/assetGrouplist" 
                element={<AssetGrouplist
                          setHeaderTitle={saveTitleUpdate}
                        />} 
        />
        <Route path="/assetFolder/assetMasterDisplay" 
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