import React from 'react';
import AuthPageInput from './AuthPageInput';
function AuthPage () {

  const [userInfo, setUserInfo] = React.useState({
    fName: "",
    lName: "",
    username: "",
    password: "",
    email:"",
  })

  // const [username, setUsername] = React.useState("");
  // const [password, setPassword] = React.useState("");
  // const [fName, setfName] = React.useState("");
  // const [lName, setlName] = React.useState("");
  // const [email, setEmail] = React.useState("");
   const [register, setRegister] = React.useState(false)
  
  const handleSubmit = (event) => {
    event.preventDefault();
    if (register === false && userInfo.username && userInfo.password) {
      alert(`Welcome, ${userInfo.username}!`);
    } else {
      alert("Please fill in all fields.");
    }
  };

  const handleChange = (event) => {
    const {value, name} = event.target;

    setUserInfo(prevValue => {
        return{
          ...prevValue,
            [name] : value
        };
      
    } )

  }

  const handleRegister = () => {
      setRegister((prevRegister) => !prevRegister)
      console.log({register})
  }
  
    
    if (register === false) {
      return (
       <div className="login-container">
          <div className="login-box">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
              
              <AuthPageInput 
                type="text"
                id="username"
                name="username"
                placeholder="username"
                value={userInfo.username}
                onChange={handleChange}
              />
          
              <AuthPageInput
                  type="password"
                  id="password"
                  name="password"
                  placeholder="password"
                  value={userInfo.password}
                  onChange={handleChange}
              />
              
              <button type="submit" className="login-button">
                Login
              </button>

              <button onClick ={handleRegister} type="register" className="register-button">
                Create new account
                </button>
            </form>
          </div>
        </div>)
    } 
    else {        
      return (
      <div className="login-container">
        <div className="login-box">
          <h2>Create a new account</h2>
          <form onSubmit={handleSubmit}>

          <AuthPageInput 
                type="text"
                id="fName"
                name="fName"
                placeholder="first Name"
                value={userInfo.fName}
                onChange={handleChange}
                />
          <AuthPageInput 
                type="text"
                id="lName"
                name="lName"
                placeholder="last Name"
                value={userInfo.lName}
                onChange={handleChange}
                />
          
          <AuthPageInput  
               type="text"
               id="email"
               name="email"
               placeholder="email"
               value={userInfo.email}
               onChange={handleChange}
               />
         
          
          <AuthPageInput
                type="text"
                id="username"
                name="username"
                placeholder="username"
                value={userInfo.username}
                onChange={handleChange}
                />
          
          <AuthPageInput
                  type="password"
                  id="password"
                  name="password"
                  placeholder="new password"
                  value={userInfo.password}
                  onChange={handleChange}
                />

            <button type="submit" className="login-button">
              Sign Up
            </button>

            <button onClick ={handleRegister} type="register" className="register-button">
              Already have an account?
              </button>
          </form>
        </div>
      </div>)}
      ;
    };
    
    export default AuthPage