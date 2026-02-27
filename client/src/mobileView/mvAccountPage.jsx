import PersonIcon from '@mui/icons-material/Person';
import EngineeringIcon from '@mui/icons-material/Engineering';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import LogoutIcon from '@mui/icons-material/Logout';

function MvAccountPage(){

    return (
      <>
        <div className='flex flex-col h-svh'>
          <div className='w-full pt-10 pb-3 pl-8 text-white bg-cyan-950'>
            <PersonIcon fontSize= 'large' sx={{width: 50,}}/>
            <span> gel</span>
          </div>
          <div className='flex flex-col w-full mt-20 text-slate-500 text-md'>

            <span className='p-3 pl-10 border-t border-spacing-1 '>Angel Cagulada</span>
            <span className='p-3 pl-10 border-t border-spacing-1 '><span><WorkIcon/> </span>Position: Engineer</span>
            <span className='p-3 pl-10 border-t border-spacing-1 '><span><BusinessIcon/> </span>Department: IT Office</span>
            <span className='p-3 pl-10 border shadow-md border-spacing-1'><span><EngineeringIcon/> </span>Maintenance: Electrical</span>
            
          </div>
          <div className='flex flex-col w-full mt-10 text-md'>
            <span className='p-3 pl-10 border bg-slate-200 border-spacing-1 '><span><LogoutIcon/> </span>Logout</span>
          </div>
        </div>
      
      </>
    )

}

export default MvAccountPage;