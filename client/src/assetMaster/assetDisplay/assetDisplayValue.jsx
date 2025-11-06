import AssetDisplayDepTabs from './assetDisplayDepTabs'

export default function AssetDisplayValue(){
  return(
    <div className='p-5'>
      <div className='pt-5 pb-5 text-base shadow-sm shadow-slate-200 bg-gray-50'>
        {/* General Information Fields */}
        <p className='pl-5 mb-2 text-blue-800'>Costing Information</p>

        <div className='grid grid-cols-[15rem_1fr] mt-5 ml-0 text-base bg-gray-50'>
          <p className='p-2 pl-5 text-base tracking-wider text-gray-500'>Capitalization Type</p>
          <p className='p-2 text-base'>1. Acquisition - by Purchase</p>
          <p className='p-2 pl-5 text-base tracking-wider text-gray-500'>Currency:</p>
          <p className='p-2 text-base'>Php</p>
          <p className='p-2 pl-5 text-base tracking-wider text-gray-500'>Unit Cost:</p>
          <p className='p-2 text-base'>85,000.00</p>
          <p className='p-2 pl-5 text-base tracking-wider text-gray-500'>Capitalized on:</p>
          <p className='p-2 text-base'>01/31/2024</p>
          <p className='p-2 pl-5 text-base tracking-wider text-gray-500'>First Acquisition Date:</p>
          <p className='p-2 text-base'>01/31/2024</p>
          <p className='p-2 pl-5 text-base tracking-wider text-gray-500'>Capitalized year:</p>
          <p className='p-2 text-base'>2024</p>
          <p className='p-2 pl-5 text-base tracking-wider text-gray-500'>Period:</p>
          <p className='p-2 text-base'>01</p>
          <p className='p-2 pl-5 text-base tracking-wider text-gray-500'>Deactivation on:</p>
          <p className='p-2 text-base'>01/24/2025</p>
          <p className='p-2 pl-5 text-base tracking-wider text-gray-500'>Book Value:</p>
          <p className='p-2 text-base'>25,000.00</p>
          <p className='p-2 pl-5 text-base tracking-wider text-gray-500'>Depreciation Type:</p>
          <p className='p-2 text-base'>Straight Line</p>
        </div>      
      </div>
      <AssetDisplayDepTabs/>
    </div>
  )
}