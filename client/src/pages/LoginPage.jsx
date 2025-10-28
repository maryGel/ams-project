function LoginPage() {
  return (
   <div>
         {/* Logo */}
      <div className='flex' >
        <img  src="/public/images/TELogo.png" 
              alt="Login" 
              className ="w-2/3 h-screen"
        />
          {/* Login Panel */}
          <section className="grid w-full h-screen place-content-center bg-slate-800">
          <h2 className="p-4 text-2xl tracking-wider text-center text-white">Asset Management System</h2>
          <div className="grid w-auto p-8 bg-white rounded shadow-md">
            <input 
                type="text" placeholder="Username" 
                className="p-2 m-2 mb-4 border w-72"
            /> 
            <input 
                type="password" placeholder="Password" 
                className="p-2 m-2 mb-4 border w-72"
            /> 
            <button className="p-2 m-2 text-white bg-black rounded hover:bg-blue-700"
            >Login
            </button>    
            
            <h4 className="p-2 m-3 text-sm text-left text-blue-600 cursor-pointer hover:underline"
            >Forgot password?
            </h4> 
          </div>         
          </section>       
      </div>
    </div>
  )
}

export default LoginPage;