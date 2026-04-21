import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Cell, 
  LabelList, 
  Legend 
} from 'recharts';

const numStyles = 'p-3 text-2xl font-semibold text-white cursor-pointer hover:underline hover:text-gray-100 hover:drop-shadow-[0_0_1rem_black] transition-transform duration-150 active:translate-y-0.5 hover:scale-x-95';
const boxStyles = 'flex justify-between  w-60 h-20 gap-3 px-3 shadow-md shadow-black';

const data = [
  { 
    month: 'Jan', 
    it_supplies: 160, 
    furniture: 190, 
    gadget: 200, 
    machine: 150, 
    electrical: 100, 
    computer: 250 
  },
  { 
    month: 'Feb', 
    it_supplies: 190, 
    furniture: 230, 
    gadget: 150, 
    machine: 200, 
    electrical: 150, 
    computer: 300 
  },
    { 
    month: 'Mar', 
    it_supplies: 350, 
    furniture: 200, 
    gadget: 160, 
    machine: 200, 
    electrical: 150, 
    computer: 200
  },
    { 
    month: 'Apr', 
    it_supplies: 230, 
    furniture: 300, 
    gadget: 110, 
    machine: 200, 
    electrical: 150, 
    computer: 100
  },
    { 
    month: 'May', 
    it_supplies: 280, 
    furniture: 250, 
    gadget: 90, 
    machine: 200, 
    electrical: 150, 
    computer: 150
  },
    { 
    month: 'Jun', 
    it_supplies: 290, 
    furniture: 200, 
    gadget: 70, 
    machine: 200, 
    electrical: 150, 
    computer: 150
  },
    { 
    month: 'Jul', 
    it_supplies: 250, 
    furniture: 190, 
    gadget: 80, 
    machine: 200, 
    electrical: 150, 
    computer: 180
  },
    { 
    month: 'Aug', 
    it_supplies: 210, 
    furniture: 160, 
    gadget: 50, 
    machine: 200, 
    electrical: 150, 
    computer: 210
  },
    { 
    month: 'Sep', 
    it_supplies: 220, 
    furniture: 120, 
    gadget: 150, 
    machine: 200, 
    electrical: 150, 
    computer: 220
  },
    { 
    month: 'Oct', 
    it_supplies: 200, 
    furniture: 100, 
    gadget: 45, 
    machine: 200, 
    electrical: 150, 
    computer: 290
  },
    { 
    month: 'Nov', 
    it_supplies: 350, 
    furniture: 50, 
    gadget: 55, 
    machine: 200, 
    electrical: 150, 
    computer: 120
  },
  { 
    month: 'Dec', 
    it_supplies: 300, 
    furniture: 45, 
    gadget: 40, 
    machine: 200, 
    electrical: 150, 
    computer: 90
  },
];

function DashboardPage() {



  return (
    <div className='gap-4'>
      <div className='flex w-auto gap-10 p-5 border rounded-lg bg-slate-50 border-spacing-1'>
          <box className={`${boxStyles} bg-blue-800`}>
            <span className='p-3 text-lg font-bold text-white'>Total Requests</span>
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
    </div>    
  );
}

export default DashboardPage;