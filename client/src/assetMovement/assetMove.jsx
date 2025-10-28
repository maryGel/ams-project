function AssetMovement() {
  return (
    <div className='grid grid-cols-10 items-start gap-1  h-full w-full'>

    <div className='flex flex-col items-center justify-center h-full w-full'>
      <button className='w-32 h-32 p-4 mb-3 border border-solid border-blue-800 rounded-lg shadow-lg hover:shadow-none hover:border-red-800'>
        <img src="/public/icons/menu_icons/acquisition.png" alt="Asset Master" />
      </button>
      <h2 className='text-center tracking-wider text-base'>
        Asset Acquisition
      </h2>
    </div>

    <div className='flex flex-col items-center justify-center h-full w-full'>
      <button className='w-32 h-32 p-4 mb-3 border border-solid border-blue-800 rounded-lg shadow-lg hover:shadow-none hover:border-red-800'>
        <img src="/public/icons/menu_icons/joborder.png" alt="Asset Master" />
      </button>
      <h2 className='text-center tracking-wider text-base'>
        Job Order Form
      </h2>
    </div>

    <div className='flex flex-col items-center justify-center h-full w-full'>
      <button className='w-32 h-32 p-4 mb-3 border border-solid border-blue-800 rounded-lg shadow-lg hover:shadow-none hover:border-red-800'>
        <img src="/public/icons/menu_icons/jobeval.png" alt="Asset Master" />
      </button>
      <h2 className='text-center tracking-wider text-base'>
        Job Order Eval
      </h2>
    </div>

    <div className='flex flex-col items-center justify-center h-full w-full'>
      <button className='w-32 h-32 p-4 mb-3 border border-solid border-blue-800 rounded-lg shadow-lg hover:shadow-none hover:border-red-800'>
        <img src="/public/icons/menu_icons/transfer.png" alt="Asset Master" />
      </button>
      <h2 className='text-center tracking-wider text-base'>
        Asset Transfer
      </h2>
    </div>

    <div className='flex flex-col items-center justify-center h-full w-full'>
      <button className='w-32 h-32 p-4 mb-3 border border-solid border-blue-800 rounded-lg shadow-lg hover:shadow-none hover:border-red-800'>
        <img src="/public/icons/menu_icons/disposal.png" alt="Asset Master" />
      </button>
      <h2 className='text-center tracking-wider text-base'>
        Asset Disposal
      </h2>
    </div>

    <div className='flex flex-col items-center justify-center h-full w-full'>
      <button className='w-32 h-32 p-4 mb-3 border border-solid border-blue-800 rounded-lg shadow-lg hover:shadow-none hover:border-red-800'>
        <img src="/public/icons/menu_icons/retirement.png" alt="Asset Master" />
      </button>
      <h2 className='text-center tracking-wider text-base'>
        Retirement by Sale
      </h2>
    </div>
    </div>
  )
}

export default AssetMovement;