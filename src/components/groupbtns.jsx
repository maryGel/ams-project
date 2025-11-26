import BorderColorIcon from '@mui/icons-material/BorderColor';

const btnStyles = "py-2 px-4 text-white rounded-md transition suration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50 space-x-2"; 

const variantStyles = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-500 ",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400 focus:ring-gray-300",
  danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500",
  ghost: "bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-300 border border-transparent",

}

const GroupBtns = ({
  children,
  onClick,
  variant="primary",
  disabled=false,
  type = 'button',
  className = ''

}) => {

  const classes = `${btnStyles} ${variantStyles[variant]} ${className} 
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

    return (
      <>
        <button
          className = {classes}
          onClick = {onClick}
          disabled={disabled}
          type= {type}
        >
          <BorderColorIcon sx={{ fontSize: 20 }}></BorderColorIcon>
          <span>{children}</span>
        </button>
      </>
    )
}

export default GroupBtns;