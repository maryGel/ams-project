import AssetDisplayDepTabs from './assetDisplayDepTabs';
import formatWithCommas from '../../Utils/formatWithCommas';

export default function AssetDisplayValue({asset, isEditing, setIsEditing, onFieldChange}){
 console.log(`asset date: ${asset.Adate}`)
  return(
    <div className='px-10'>
      <div className='pt-5 pb-5 text-base shadow-sm shadow-slate-200 bg-gray-50'>
        {/* General Information Fields */}
        <span className='pl-5 mb-2 text-blue-800'>Costing Information</span>

        <div className='grid grid-cols-[15rem_1fr] mt-5 ml-0 text-base bg-gray-50'>
          <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Capitalization Type</span>
          <span className='p-2 text-base text-gray-500'>1. Acquisition - by Purchase</span>
          <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Acquisition Date:</span>
          <input type='date' className='p-2 text-base text-gray-500' value={asset.Adate? asset.Adate.slice(0,10): ""} disabled readOnly />
          <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Currency:</span>
          <span className='p-2 text-base text-gray-500'>Php</span>         
          <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Unit Cost:</span>
          <input type='text' className='p-2 text-base text-gray-500' value={formatWithCommas(asset.AAmount)} disabled readOnly />
          <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Residual Value:</span>
          <input type='text' className='p-2 text-base text-gray-500' value={formatWithCommas(asset.Abre)} disabled readOnly />
          <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Depreciated Cost:</span>
          <span className='p-2 text-base text-gray-500'>00.00</span>
          <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Book Value:</span>
          <span className='p-2 text-base text-gray-500'>00.00</span>
          <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Life in Years:</span>
          <input type='text' className='p-2 text-base text-gray-500' value={asset.Percent} disabled readOnly />
          <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Deactivation on:</span>
          <span className='p-2 text-base text-gray-500'>01/24/2025</span>
          <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Depreciation Type:</span>
          <span className='p-2 text-base text-gray-500'>Straight Line</span>
        </div>      
      </div>
      <AssetDisplayDepTabs/>
    </div>
  )
}