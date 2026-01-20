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

      {/* Chart Section */}
      <div className='w-full p-2 border rounded-lg bg-slate-50'>
        <div className="w-full h-[500px] p-8 bg-white rounded-lg shadow-sm">
          <h2 className="mb-6 font-bold tracking-wider text-center text-gray-700 uppercase">
            Monthly Purchase Category Breakdown
          </h2>
          <div className='w-[85%] mx-auto h-full'>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 40, right: 30, left: 20, bottom: 20 }}>
                <defs>
                  {/* 1. Deep Navy */}
                  <linearGradient id="color1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e3a8a" /><stop offset="95%" stopColor="#172554" />
                  </linearGradient>
                  {/* 2. Royal Blue */}
                  <linearGradient id="color2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" /><stop offset="95%" stopColor="#1d4ed8" />
                  </linearGradient>
                  {/* 3. Sky Blue */}
                  <linearGradient id="color3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7dd3fc" /><stop offset="95%" stopColor="#0ea5e9" />
                  </linearGradient>
                  {/* 4. Dark Slate Gray */}
                  <linearGradient id="color4" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#475569" /><stop offset="95%" stopColor="#1e293b" />
                  </linearGradient>
                  {/* 5. Medium Gray */}
                  <linearGradient id="color5" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" /><stop offset="95%" stopColor="#64748b" />
                  </linearGradient>
                  {/* 6. Light Silver Gray (Top) */}
                  <linearGradient id="color6" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e2e8f0" /><stop offset="95%" stopColor="#cbd5e1" />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                
                <Legend verticalAlign="bottom" height={36} iconType="square" />
                
                {/* Blue Shades */}
                <Bar name="IT Supplies" dataKey="it_supplies" stackId="a" fill="url(#color1)" barSize={45} />
                <Bar name="Furniture" dataKey="furniture" stackId="a" fill="url(#color2)" />
                <Bar name="Gadget" dataKey="gadget" stackId="a" fill="url(#color3)" />
                
                {/* Gray Shades */}
                <Bar name="Machine" dataKey="machine" stackId="a" fill="url(#color4)" />
                <Bar name="Electrical" dataKey="electrical" stackId="a" fill="url(#color5)" />
                <Bar name="Computer" dataKey="computer" stackId="a" fill="url(#color6)" radius={[6, 6, 0, 0]}>
                  <LabelList 
                      position="top" 
                      content={(props) => {
                        const { x, y, width, index } = props;
                        const d = data[index];
                        // Ensure all categories are summed for the total
                        const total = (d.it_supplies || 0) + (d.furniture || 0) + (d.gadget || 0) + 
                                      (d.machine || 0) + (d.electrical || 0) + (d.computer || 0);
                        return (
                          <text x={x + width / 2} y={y - 12} fill="#1e293b" textAnchor="middle" fontSize={14} fontWeight="700">
                            ${total.toLocaleString()}
                          </text>
                        );
                      }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>    
  );
}

export default DashboardPage;