import ListIcon from '@mui/icons-material/List';
import { Button } from '@mui/material';

function MvDashBoard(){

    const numStyles = 'pb-2  mr-2 text-lg font-semibold  cursor-pointer hover:underline hover:drop-shadow-[0_0_1rem_black] transition-transform duration-150 active:translate-y-0.5 hover:scale-x-95';
    const boxStyles = 'p-1 flex justify-between h-auto shadow-md shadow-gray rounded-lg border';

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

    return (
        <div className='md:hidden'>
            <div className='flex items-center justify-between px-5 pt-10 pb-3 text-2xl font-semibold tracking-wide border shadow-md border-spacing-1'>
                <h1 className='pl-2 font-sans'>Dashboard</h1>
                <img
                    className='w-10'
                    src='/icons/menu_icons/dashboard.png'
                />
            </div>  

                <div className='grid w-full grid-cols-2 gap-5 px-3 mt-14'>
                    {dashItems.map(item => 
                    <box className={`flex items-end ${boxStyles}`}>
                        <div className='flex flex-col justify-start gap-2 p-2'>
                            <img
                                className='w-5 h-5'
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