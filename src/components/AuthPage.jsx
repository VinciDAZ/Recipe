import React from 'react';
import AuthPageInput
 from './Login';
function AuthPage () {

    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [fName, setfName] = React.useState("");
    const [lName, setlName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [register, setRegister] = React.useState(false)
  
    const handleSubmit = (event) => {
      event.preventDefault();
      if (register === false && username && password) {
        alert(`Welcome, ${username}!`);
      } else {
        alert("Please fill in all fields.");
      }
    };

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
                placeholder="Enter your username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                />
          
                <AuthPageInput
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                
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
    } else {        
      return (
      <div className="login-container">
        <div className="login-box">
          <h2>Create a new account</h2>
          <form onSubmit={handleSubmit}>

          <AuthPageInput 
                type="text"
                id="fName"
                name="fName"
                placeholder="Enter your First Name"
                value={fName}
                onChange={(event) => setfName(event.target.value)}
                />
          <AuthPageInput 
                type="text"
                id="lName"
                name="lName"
                placeholder="Enter your Last Name"
                value={lName}
                onChange={(event) => setlName(event.target.value)}
                />
          
          <AuthPageInput  
               type="text"
               id="email"
               name="email"
               placeholder="Enter your email"
               value={email}
               onChange={(event) => setEmail(event.target.value)}
               />
         
          
          <AuthPageInput
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                />
          
          <AuthPageInput
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
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