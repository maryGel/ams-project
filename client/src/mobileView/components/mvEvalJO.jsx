import {useState} from 'react'
// MUI
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
// Custom Utils
import DateDisplay from '../../Utils/formatDateForInput';

function MvEvalJO({
    setOpenJoNo,
    openJoNo,
    items,
    header

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
      
    console.log(`items: ${items}`)
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
          <div className='flex flex-col gap-3 p-5 text-sm border-b text-slate-500'>
            <span>{header.Department_Code}</span>
            <span className='text-base text-black'>Remarks: {header.Remarks}</span>
            <span>For inpection by: {header.Sector_name}</span>
            <span>Requestor: {header.requested_by}</span>
          </div>


          {items.length > 0 &&   (
            <>
              {items.map((item, index) => (
                  <div key = {item.ID || index} className='p-5'>
                  <div>{items.qty}</div>
                  <div>{items.FAC_name}</div>
                </div>

                ))}
            </>
          )}
          
          
        </div>
      </>
    )
}

export default MvEvalJO;