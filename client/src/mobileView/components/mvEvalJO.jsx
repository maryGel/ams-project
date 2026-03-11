import {useState} from 'react'
// MUI
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
// Custom Utils
import DateDisplay from '../../Utils/formatDateForInput';

function MvEvalJO({
    setOpenJoNo,
    header,
    joDetails

}){

    const [isClosing, setIsClosing] = useState(false);


    // ... Handlers  
    const handleClosePage = () => setIsClosing(true);
    const handleAnimationEnd = (e) => {
        // Only trigger if the animation that ended belongs to THIS div
        if (isClosing && e.target === e.currentTarget) { 
            setOpenJoNo(false);  
        } 
    };

    // Filter joDetails by JO_No & Approval logs by JO_No
    const getItemsByJONo = (JO_No) => {
        return joDetails?.filter(detail => detail.JO_No === JO_No) || [];
    };

    const items = getItemsByJONo(header.JO_No);


      
    return(
      <>
        <div onAnimationEnd={handleAnimationEnd} className={`          
          fixed inset-0 z-50 items-start w-full max-h-screen overflow-y-auto text-base
          bg-white ${isClosing ? 'animate-slide-out-left' : 'animate-slide-left '}`}>
            
          <div className='p-4'>
              <button className='w-5' onClick={handleClosePage}> 
                  <ArrowBackIosIcon fontSize='small'/>
              </button>
          </div>
          <div className='flex justify-between px-5 py-2 font-sans tracking-wide border-b'>
            <span className='font-semibold'>{header.JO_No}</span>
            <span><DateDisplay value={header.xDate} format="short" /></span>
          </div>
          <div className='flex flex-col gap-3 p-5 text-sm border-b'>
            <span>{header.Department_Code}</span>
            <span className='text-base'>Remarks: {header.Remarks}</span>
            <div className='flex flex-col gap-1 mt-1'>
              <span>For inpection by: {header.Sector_name}</span>
              <span>Requestor: {header.requested_by}</span>
            </div>
          </div>
         
        <div className='p-5 '><span className='tracking-wide text-slate-400'>Select the item to evaluate</span></div>
        {items.map((item, index) => (
            <div key={index} className='flex flex-col p-5 text-slate-700'>
              <div className='flex gap-3'>
                <span>{item.qty}</span>
                <span className='font-semibold text-blue-600'>{item.FAC_name}</span>
              </div>
              <span className='py-2 pl-5 italic'>{item.workDet}</span>
            </div>
        ))}
        </div>
      </>
    )
}

export default MvEvalJO;