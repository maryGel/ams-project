


export const dashItems =  (counts) => {

    return [
        { id: 1,
            title: 'Job Orders',
            link: '/systemSetup/user/userProfile',
            imgSrc: '/dashIcons/jo.png',
            num: counts.joCount || 0,
        },
        { id: 2,
            title: 'Maintenance',
            link: '/systemSetup/user/userProfile',
            imgSrc: '/dashIcons/mechanic.png',
            num: 2,
        },
        { id: 3,
            title: 'Transfers',
            link: '/systemSetup/user/userProfile',
            imgSrc: '/dashIcons/transfer.png',
            num: counts.trCount || 0,
        },
        { id: 4,
            title: 'Issuance',
            link: '/systemSetup/user/userProfile',
            imgSrc: '/dashIcons/issuance.png',
            num: 21,
        },
        { id: 5,
            title: 'Disposals',
            link: '/systemSetup/user/userProfile',
            imgSrc: '/dashIcons/garbage.png',
            num: counts.adCount,
        },
        { id: 6,
            title: 'Lost Assets',
            link: '/systemSetup/user/userProfile',
            imgSrc: '/dashIcons/lost.png',
            num: 0,
        },
    ];

}