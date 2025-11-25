import {useState} from 'react';
import RefTabs from '../referentials/refTabs';
import RefUom from '../referentials/refUom';
import RefBrand from '../referentials/refBrand';
import RefCategory from '../referentials/refCategory';
import RefItemClass from '../referentials/refItemClass';
import RefLocation from '../referentials/refLocation';
import RefDepartment from '../referentials/refDepartment'

function ReferentialPage() {

  const [openTab, setOpenTab] = useState()

  const handleOpenTab = (tab) => setOpenTab(tab);

  return (
  <div className='flex'>
    
    <RefTabs
      handleOpenTab = {handleOpenTab}
    />
    
    <div className='flex p-5 '>
      <RefUom 
        openTab = {openTab}
      />
      <RefBrand 
        openTab = {openTab}
      />
      <RefCategory
        openTab = {openTab}
      />
      <RefItemClass
        openTab = {openTab}      
      />
      <RefLocation
        openTab = {openTab}      
      />
      <RefDepartment
        openTab = {openTab}      
      />
    </div>
  </div>
  );
}

export default ReferentialPage;