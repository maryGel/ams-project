import { assetMovList } from './asstMovList';

function AssetMovement() {
  return (
    <div className='grid items-start w-full h-full grid-cols-10 gap-1'>

      {/* Asset Acquisition Tile */}
      {assetMovList.map((item) => (
        <div key={item.id} className='flex flex-col items-center justify-center w-full h-full'>
          <button className='w-32 h-32 p-4 mb-3 border border-blue-800 border-solid rounded-lg shadow-lg hover:shadow-none hover:border-red-800'>
            <img src={item.imgSrc} alt={item.title} />
          </button>
          <h2 className='text-base tracking-wider text-center'>
            {item.title}
          </h2>
        </div>
      ))}
    
    </div>
  )
}

export default AssetMovement;