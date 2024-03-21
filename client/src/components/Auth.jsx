import React, { useState } from 'react'
import { useCookies } from 'react-cookie';

const Auth = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [isLogIn, setIsLogIn] = useState(false);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [error, setError] = useState(null);

  console.log(cookies);
  console.log(email, password, confirmPassword);

  const viewLogIn = (status)=>{
    setError(null);
    setIsLogIn(status);
  }

  const handleSubmit = async(e, endpoint)=>{
    e.preventDefault(); 
    if(!isLogIn && password !== confirmPassword){
      setError("The passwords do not match");
      return;
    }

    const response = await fetch(`${process.env.REACT_APP_SERVERURL}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({email, password})
    });

    const data = await response.json();

    if(data.detail) {
      setError(data.detail);
    } else {
      setCookie('Email' ,data.email);
      setCookie('AuthToken', data.token);

      window.location.reload();
    }
  }

  return (
    <div className='auth-container'>
      <div className='auth-container-box'>
        <form>
          <h2>{isLogIn? 'Please Login':'Please Sign Up'}</h2>
          <input type='email' placeholder='email' onChange={(e)=>{setEmail(e.target.value)}}/>
          <input type='password' placeholder='password' onChange={(e)=>{setPassword(e.target.value)}}/>
          {!isLogIn &&  <input type='password' placeholder='confirm password' onChange={(e)=>{setConfirmPassword(e.target.value)}}/> }
          <input type='submit' className='create' onClick={(e)=>handleSubmit(e, isLogIn?'login':'signup')}/>
          {error && <p></p>}
        </form>
        <div className='auth-options'>
          <button onClick={()=>viewLogIn(false)} style={{backgroundColor: !isLogIn ? 'rgb(255, 255, 255)' : 'rgb(188, 188, 188)'}}>
            SignUp
          </button>
          <button onClick={()=>viewLogIn(true)} style={{backgroundColor: isLogIn ? 'rgb(255, 255, 255)' : 'rgb(188, 188, 188)'}}>
            LogIn
          </button>
        </div>
      </div>
    </div>
  )
}

export default Auth
