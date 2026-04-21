import { useLocation } from 'react-router-dom';

const currentPath = location.pathname;

export const headerTitleMap = {
  "/home": "Asset Management System",
  "/Home": "Asset Management System",
  "/Home/AssetMasterPage": "Asset Management System",
  "/Home/Movement": "Asset Management System",
  "/Home/Depreciation": "Asset Management System",
  "/Home/Reports": "Asset Management System",
  "/Home/PhysicalCount": "Asset Management System",
  "/Home/SystemSetup": "Asset Management System",
  '/assetFolder/pages/assetMasterList': 'Asset List',
  "/assetFolder/pages/assetMasterList": "Asset Master List",
  "/assetFolder/assetMasterDisplay": "Display Asset",
  "/assetFolder/createAsset": "Create New Asset",
  "/assetFolder/pages/referentialPage": "Referential Data",

  // Asset Movement Pages
  "/assetMovement/pages/JOFormPage": "Job Order Page",

  // System Setup Pages
  "/systemSetup/user/userProfile": "Roles and Authorizations",
};


export const getBackPath = () => {
  if (currentPath.startsWith('/assetFolder/assetMasterDisplay')) return '/assetFolder/pages/assetMasterList';
  if (currentPath.startsWith('/assetFolder/createAsset')) return '/assetFolder/pages/assetMasterList';
  if (currentPath.startsWith('/assetMovement/pages/JOFormPage')) return '/Home/Movement';
  if (currentPath.startsWith('/systemSetup/user/userProfile')) return '/Home/SystemSetup';
  if (currentPath === '/assetFolder/pages/assetMasterList' || '/assetFolder/pages/referentialPage') return '/Home/AssetMasterPage';
  return null;
};
