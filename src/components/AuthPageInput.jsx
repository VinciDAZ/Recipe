import React from 'react'

function AuthPageInput (props){

return(

    <div> 
         <div className="input-group">
        
                <input
                  type={props.type}
                  id={props.id}
                  name={props.name}
                  placeholder={props.placeholder}
                  value={props.value}
                  onChange={props.onChange}
                  required
                />
                </div>
                </div>)
               




}

export default AuthPageInput