import React from 'react';
function Login () {

    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [register, setRegister] = React.useState(false)
  
    const handleSubmit = (event) => {
      event.preventDefault();
      if (username && password) {
        alert(`Welcome, ${username}!`);
      } else {
        alert("Please fill in both fields.");
      }
    };

    const handleRegister = () => {
        setRegister((prevRegister) => !prevRegister)
        console.log({register})
    }
  
    
        if (register === false) {
    
        return (<div className="login-container">
          <div className="login-box">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>

              <button type="submit" className="login-button">
                Login
              </button>

              <button onClick ={handleRegister} type="register" className="register-button">
                Create new account
                </button>
            </form>
          </div>
        </div>)
    } else {        return (<div className="login-container">
        <div className="login-box">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-button">
              Login
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