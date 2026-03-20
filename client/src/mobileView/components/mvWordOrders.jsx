import { useState, useMemo, useEffect, useRef } from 'react';
// MUI
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
// Custom Utils
import DateDisplay from '../../Utils/formatDateForInput';
// Hooks
import { useJO_woe } from '../../hooks/useJO_woe';

function MvWorkOrders({
    useProps,
    onClose,
    onAnimationEnd,
    header,
    joDetails,
    isClosingJO
}) {
    const { joWorkOrders } = useJO_woe(useProps);
    const [selectedItems, setSelectedItems] = useState([]);
    const [backToTop, setBackToTop] = useState(false);

    const scrollRef = useRef(null);
    useEffect(() => {
        const container = scrollRef.current;

        const handleScroll = () => {
            setBackToTop(container.scrollTop > 200);
        };

        if (container) {
            container.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (container) {
            container.removeEventListener("scroll", handleScroll);
            }
        };
    }, []);


    // Filter joDetails by JO_No
    const getItemsByJONo = (JO_No) => {
        return joDetails?.filter(detail => detail.JO_No === JO_No) || [];
    };

    const items = getItemsByJONo(header.JO_No);

    // Get work orders
    const getWorkOrder = (workNo) => {
        return joWorkOrders?.filter(detail => detail.workNo === workNo) || [];
    };

    const workOrder = getWorkOrder(header.workNo);

    // Group work order details by FAC_NO
    const groupedData = useMemo(() => {
        // Create a map of work order details by FAC_NO
        const workOrderMap = new Map();
        
        workOrder.forEach(wo => {
            if (wo.FAC_NO) {
                if (!workOrderMap.has(wo.FAC_NO)) {
                    workOrderMap.set(wo.FAC_NO, []);
                }
                // Push the expense details to the array for this FAC_NO
                workOrderMap.get(wo.FAC_NO).push({
                    xDate: wo.xDate,
                    Expense_Type: wo.Expense_Type,
                    expense_amount: wo.expense_amount,
                    OR_No: wo.OR_No,
                    workDet: wo.workDet
                });
            }
        });

        // Map items with their work order details
        const grouped = items.map(item => ({
            ...item,
            expenseDetails: workOrderMap.get(item.FAC_NO) || [],
            status: item.Main_Status || 'OPEN'
        }));

        return grouped;
    }, [items, workOrder]);

    // Get status color
    const getStatusColor = (status) => {
        switch(status?.toUpperCase()) {
            case 'DONE':
                return 'text-green-600';
            case 'ONGOING':
                return 'text-yellow-600';
            case 'OPEN':
                return 'text-blue-600';
            case 'CLOSED':
                return 'text-gray-600';
            default:
                return 'text-slate-500';
        }
    };

    // Format currency with safe number parsing
    const formatCurrency = (amount) => {
        // Handle different input types (string, number, null, undefined)
        if (amount === null || amount === undefined || amount === '') {
            return '0.00';
        }
        
        // Convert to number safely
        const numAmount = typeof amount === 'string' 
            ? parseFloat(amount.replace(/[^0-9.-]+/g, '')) || 0 
            : parseFloat(amount) || 0;
            
        return new Intl.NumberFormat('en-PH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(numAmount);
    };

    // Calculate total safely
    const calculateTotal = (expenses) => {
        return expenses.reduce((sum, exp) => {
            // Handle different formats of expense_amount
            let amount = exp.expense_amount;
            
            if (amount === null || amount === undefined || amount === '') {
                return sum;
            }
            
            // If it's a string, clean it and parse
            if (typeof amount === 'string') {
                // Remove currency symbols, commas, and other non-numeric characters except decimal point
                amount = amount.replace(/[^0-9.-]+/g, '');
            }
            
            const numAmount = parseFloat(amount) || 0;
            return sum + numAmount;
        }, 0);
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().slice(2)}`;
    };

    return (
        <>
            <div ref={scrollRef} onAnimationEnd={onAnimationEnd} className={`          
                fixed inset-0 z-50 items-start w-full max-h-screen overflow-y-auto text-sm
                bg-white ${isClosingJO ? 'animate-slide-out-right' : 'animate-slide-in-right'}`}>
                
               <div className='relative min-h-full'>
                    <div className='p-5'>
                        <button className='w-3' onClick={onClose}> 
                            <ArrowBackIosIcon fontSize='small'/>
                        </button>
                    </div>
                
                    <div className='sticky top-0 flex justify-between px-5 py-1 font-sans tracking-wide bg-white border-b'>
                        <div>
                            <span>{header.JO_No}</span>
                            {header.workNo && <span className='text-green-600'> - {header.workNo}</span>}
                        </div>
                        <span><DateDisplay value={header.wo_date} format="short" /></span>
                    </div>
                
                    <div className='flex flex-col gap-3 p-5 text-sm border-b text-slate-500'>
                        <span>{header.Department_Code}</span>
                        <span className='text-base text-black'>Remarks: {header.Remarks}</span>
                        <div className='flex flex-col gap-1 mt-1'>
                            <span>For inspection by: {header.Sector_name}</span>
                            <span>Requestor: {header.requested_by}</span>
                        </div>
                    </div>
                
                    <div className='py-1 mt-2'>
                        {/* Grouped Items with Expense Details */}
                        {groupedData.length > 0 ? (
                            groupedData.map((item, index) => {
                                const total = calculateTotal(item.expenseDetails);
                                
                                return (
                                    <div 
                                        key={index} 
                                        className='flex flex-col mb-4 overflow-hidden border'
                                    >
                                        {/* FAC Header - Only appears once per FAC_NO */}
                                        <div className='flex items-center justify-between p-2 bg-gray-100 border-b'>
                                            <div className='flex flex-col items-start gap-2'>
                                                <div className='flex flex-col px-3'>
                                                    <span className='font-semibold text-blue-900'>
                                                        {item.FAC_name || 'No FAC Name'}
                                                    </span>
                                                    <div>
                                                        {item.FAC_NO && (
                                                            <span className='text-xs text-gray-500'>
                                                                ({item.FAC_NO})
                                                            </span>
                                                        )}
                                                        <span className={`text-xs ml-2 m-auto font-medium ${getStatusColor(item.status)}`}>
                                                            {item.status}
                                                        </span>
                                                    </div>
                                                </div>
                                                {item.Main_Remarks && <span className='pl-3 text-slate-600'>Remarks: {item.Main_Remarks}</span>}
                                            </div>
                                        </div>



                                        {/* Expense Details Table - Multiple rows per FAC */}
                                        {item.expenseDetails.length > 0 ? (
                                            <div>
                                                {/* Scrollable Table Container */}
                                                <div className='overflow-hidden'>
                                                    <table className='w-full text-xs'>
                                                        <thead className='bg-gray-100'>
                                                            <tr>
                                                                <th className='px-3 py-2 text-left'>Date</th>
                                                                <th className='px-3 py-2 text-left'>Expense Type</th>
                                                                <th className='px-3 py-2 text-right'>Amount</th>
                                                                <th className='px-3 py-2 text-left'>OR No.</th>
                                                                <th className='px-3 py-2 text-left'>Work Details</th>
                                                            </tr>
                                                        </thead>
                                                    </table>
                                                    {/* Scrollable tbody container */}
                                                    <div className='overflow-y-auto max-h-48'>
                                                        <table className='w-full text-xs'>
                                                            <tbody>
                                                                {item.expenseDetails.map((expense, expIndex) => (
                                                                    <tr key={expIndex} className='border-b border-gray-100 hover:bg-gray-50'>
                                                                        <td className='px-2 py-2 whitespace-nowrap'>
                                                                            {formatDate(expense.xDate)}
                                                                        </td>
                                                                        <td className='px-3 py-2 whitespace-nowrap'>
                                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                                expense.Expense_Type === 'PARTS' 
                                                                                    ? 'bg-purple-100 text-purple-700' 
                                                                                    : expense.Expense_Type === 'LABOR EXPENSE'
                                                                                    ? 'bg-orange-100 text-orange-700'
                                                                                    : 'bg-gray-100 text-gray-700'
                                                                            }`}>
                                                                                {expense.Expense_Type || 'N/A'}
                                                                            </span>
                                                                        </td>
                                                                        <td className='px-3 py-2 font-medium text-right whitespace-nowrap'>
                                                                            ₱{formatCurrency(expense.expense_amount)}
                                                                        </td>
                                                                        <td className='px-3 py-2 whitespace-nowrap'>
                                                                            {expense.OR_No || '—'}
                                                                        </td>
                                                                        <td className='px-3 py-2 text-gray-600'>
                                                                            {expense.workDet || '—'}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    {/* Table footer for total */}
                                                    {item.expenseDetails.length > 0 && (
                                                    <table className='w-full text-xs'>
                                                        <tfoot className='border-t bg-gray-50'>
                                                            <tr>
                                                                <td colSpan="2" className='px-3 py-2 font-medium text-right'>Total:</td>
                                                                <td className='px-3 py-2 font-bold text-right whitespace-nowrap'>
                                                                    ₱{formatCurrency(total)}
                                                                </td>
                                                                <td colSpan="2"></td>
                                                            </tr>
                                                        </tfoot>
                                                    </table>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className='p-1 italic text-center text-gray-400'>
                                                {item.disposal_reason ? item.disposal_reason : 'No expense details available'}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className='py-8 text-center text-gray-500'>
                                No items found
                            </div>
                        )}

                        {/* Optional: Display selected count */}
                        {selectedItems.length > 0 && (
                            <div className='px-5 py-3 mt-4 text-sm text-blue-600 rounded-lg bg-blue-50'>
                                {selectedItems.length} item(s) selected
                            </div>
                        )}
                        {backToTop && (
                        <div className="sticky bottom-0 flex justify-end p-4">
                            <button
                                onClick={() =>
                                    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
                                }
                                className="px-4 py-2 text-white bg-blue-600 rounded-full shadow-lg hover:bg-blue-700"
                            >
                            ↑ Top
                            </button>
                        </div>
                        )}
                    </div>
               </div>
            </div>     
        </>
    );
}

export default MvWorkOrders;