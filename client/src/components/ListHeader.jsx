import React, { useState } from 'react'
import Modal from './Modal'
import { useCookies } from 'react-cookie';

const ListHeader = ({listName, getData}) => {
    const [cookies, setCookie, removeCookie] = useCookies(null);
    const [showModel, setShowModel] = useState(false);

    const signOut =(e)=>{
      e.preventDefault();
      removeCookie('Email');
      removeCookie('AuthToken');

      window.location.reload();
    }

  return (
    <div className='list-header'>
        <h1>{listName}</h1>
        <div className='button-container'>
            <button className='create' onClick={()=>setShowModel(true)}>ADD NEW</button>
            <button className='signout' onClick={signOut}>SIGN OUT</button>
        </div>
        {showModel&&<Modal mode={'create'} setShowModel={setShowModel} getData={getData}/>}
    </div>
  )
}

export default ListHeader
