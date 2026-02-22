// Custom Hooks
import {useUsers} from '../hooks/useUsers';



const dashItems =  [
    { id: 1,
        title: 'Total Requests',
        link: '/systemSetup/user/userProfile',
        imgSrc: '/dashIcons/totalRequests.png',
        num: 14,
    },
    { id: 2,
        title: 'Job Orders',
        link: '/systemSetup/user/userProfile',
        imgSrc: '/dashIcons/jo.png',
        num: 5,
    },
    { id: 3,
        title: 'Maintenance',
        link: '/systemSetup/user/userProfile',
        imgSrc: '/dashIcons/mechanic.png',
        num: 9,
    },
    { id: 4,
        title: 'Transfers',
        link: '/systemSetup/user/userProfile',
        imgSrc: '/dashIcons/transfer.png',
        num: 15,
    },
    { id: 5,
        title: 'Issuance',
        link: '/systemSetup/user/userProfile',
        imgSrc: '/dashIcons/issuance.png',
        num: 21,
    },
    { id: 6,
        title: 'Disposals',
        link: '/systemSetup/user/userProfile',
        imgSrc: '/dashIcons/garbage.png',
        num: 10,
    },
    { id: 7,
        title: 'Lost Assets',
        link: '/systemSetup/user/userProfile',
        imgSrc: '/dashIcons/lost.png',
        num: 0,
    },
]


function MvDashBoard(){
    
    const { users } = useUsers();    
    const userName = localStorage.getItem('username') || 'User';

    // Find the user object
    const loginUser = users?.find(item => item.user === userName);

    // Get first name
    const firstName = loginUser?.fname || userName;

    const numStyles = 'pb-2  mr-2 text-xl font-semibold  cursor-pointer hover:underline hover:drop-shadow-[0_0_0.5rem_gray] transition-transform duration-150 active:translate-y-0.5 hover:scale-x-95';
    const boxStyles = 'p-1 flex justify-between h-auto shadow-md shadow-gray rounded-lg border';

    return (
      <div className='flex flex-col md:hidden'>
        <div className='flex items-center w-auto h-auto p-1 pt-5 bg-white border-b '>
          <img
              className='w-12 h-10 pl-2 ml-2'
              src='/tripleeyelogo.png'
          />
          <span className='font-sans tracking-wider text-black '>Asset Mangement</span>
        </div>

        <div className='flex items-center justify-between px-5 pt-3 pb-3 m-4 text-2xl font-semibold tracking-wide bg-blue-100 rounded-md shadow-md'>
          <h1 className='pl-2 font-sans'>Dashboard</h1>
          <img
              className='w-10'
              src='/icons/menu_icons/dashboard.png'
          />
        </div>  
        <h1 className='mt-5 ml-5'>Hi, {firstName}!</h1>
        <div className='grid w-full grid-cols-2 gap-3 px-4 mt-7'>
            
        {dashItems.map(item => 
          <box className={`flex items-end bg-white ${boxStyles}`}>
            <div className='flex flex-col justify-start gap-2 p-2 '>
                <img
                    className='w-8 h-8 bg-white'
                    src={item.imgSrc}
                    />
                <span className='text-sm'>{item.title}</span>
            </div>
            <span className={numStyles}>{item.num}</span> 
          </box>)}
        </div>            
      </div>
    )
}

export default MvDashBoard;