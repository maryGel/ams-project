import AssetDisplayTabs from './assetDisplayTabs'
import GroupBtns from '../components/groupbtns'

export default function AssetMasterDisplay(){

  return(
    <>
      <div className='flex justify-end m-5 mr-10'>
        {/* Primary Button */}
        <GroupBtns onClick={() => console.log('Clicked Primary')}>
          Edit
        </GroupBtns>

      </div>
      <div className='grid p-10 border rounded-lg border-spacing-x-3 bg-gray-50'>
        <p
          className='p-3 pl-16 text-xl font-medium tracking-wide bg-white border rounded-md shadow-md shadow-slate-300 border-slate-300 text-slate-800'
        >Asset Number: 9120832</p>

        <div className='grid grid-cols-[2fr_1fr] mt-10 shadow-md shadow-slate-300 bg-white border rounded-md border-slate-300 text-slate-800'>
          {/* Column 1: Asset Name and Description */}
          <div className='mt-10'>
            <div className='grid grid-cols-[10rem_2fr] shadow-sm shadow-slate-200 mt-5 ml-16 text-base bg-gray-50'>
              <p className='p-2 pl-5 text-base tracking-wider text-gray-500'>Asset Name:</p>
              <p className='p-2 text-base font-semibold'>Feb2020_Reclass CIP to Bldg</p>
            </div>
            <div className='grid grid-cols-[10rem_2fr] shadow-sm shadow-slate-200 mt-5 ml-16 text-base bg-gray-50'>
              <p className='p-2 pl-5 text-base tracking-wider text-gray-500'>Description:</p>
              <p className='p-2 text-base'>Feb2020_Reclass CIP to  b2020_Reclass CIP to Bldg Surface_Temporary Sotoreroom eb2020_Reclass CIP to Bldg Surface_Temporary Sotoreroom Feb2020_Reclass CIP to Bldg Surface_Temporary Sotoreroom Feb2020_Reclass CIP to Bldg Surface_Temporary Sotoreroom</p>
            </div>  
            <div className='grid grid-cols-[10rem_2fr] shadow-sm shadow-slate-200 mt-5 ml-16 text-base bg-gray-50'>
              <p className='p-2 pl-5 text-base tracking-wider text-gray-500'>Status:</p>
              <p className='p-2 text-base font-semibold tracking-wider text-green-600'>Active</p>
            </div>          
          </div>

          {/* Column 2: Display Photo */}
          <div className='flex justify-center p-5 m-10 ml-20 mr-20 border border-green-900 shadow-md shadow-slate-200'>
            <img 
              className='h-60 w-100'
              src='/public/images/assets/laptop.jpg'/>
          </div>
        </div>

        <AssetDisplayTabs/>
      </div>  
    </>
  )
}