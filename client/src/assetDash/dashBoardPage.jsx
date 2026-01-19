const numStyles = 'p-3 text-2xl font-semibold text-white cursor-pointer hover:underline hover:text-gray-100 hover:drop-shadow-[0_0_1rem_black] transition-transform duration-150 active:translate-y-0.5 hover:scale-x-95';
const boxStyles = 'flex justify-between w-auto gap-16 p-3 shadow-md shadow-black';


function DashboardPage() {



  return (

    <div className='flex gap-2 p-5 mt-10 border rounded-lg bg-slate-50 border-spacing-1'>
      <box className={`${boxStyles} bg-blue-500`}>
        <span className='p-3 text-white'>Total Requests</span>
        <span type='text' className={numStyles}>14</span> 
      </box>
      <box className={`${boxStyles} bg-orange-500`}>
        <span className='p-3 text-white'>Job Order Evaluation</span>
        <span type='text' className={numStyles}>5</span> 
      </box>
      <box className={`${boxStyles} bg-sky-400`}>
        <span className='p-3 text-white'>For Maintenance</span>
        <span type='text' className={numStyles}>9</span> 
      </box>
      <box className={`${boxStyles} bg-yellow-500`}>
        <span className='p-3 text-white'>For Transfer</span>
        <span type='text' className={numStyles}>15</span> 
      </box>
      <box className={`${boxStyles} bg-purple-500`}>
        <span className='p-3 text-white'>For Issuance</span>
        <span type='text' className={numStyles}>21</span> 
      </box>
      <box className={`${boxStyles} bg-slate-600`}>
        <span className='p-3 text-white'>For Disposal</span>
        <span type='text' className={numStyles}>10</span> 
      </box>
      <box className={`${boxStyles} bg-cyan-900`}>
        <span className='p-3 text-white'>Lost Asset</span>
        <span type='text' className={numStyles}>11</span> 
      </box>
    </div>
  );
}

export default DashboardPage;