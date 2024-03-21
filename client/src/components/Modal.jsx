import React from 'react'
import { useState } from 'react'
import { useCookies } from 'react-cookie';

const Modal = ({mode, setShowModel, getData, task}) => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const editMode = mode === 'edit'?true:false;
  const [data, setData] = useState({
    user_email: editMode ? task.user_email :  cookies.Email,
    title: editMode ? task.title : "",
    progress: editMode ? task.progress : 50,
    date: editMode?"":new Date()
  });

  const postData = async (e)=>{
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos`, {
        method: "POST",
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(data)
      })
      if(response.status === 200){
        console.log('worked');
        setShowModel(false);
        getData();
      }
    } catch (error) {  
      console.error(error.message);
    }
  }

  const editData=async(e)=>{
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/todos/${task.id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      });
      if(response.status===200){
        setShowModel(false);
        getData();
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  const handleChange=(e)=>{
    const {name, value} = e.target;

    setData(data=>({
      ...data,
      [name]: value
    }))
    console.log(data);
  }


  return (
    <div className='overlay'>
      <div className='modal'>
        <div className='form-title-container'>
          <h3>Let's {mode} your Task</h3>
          <button onClick={()=>setShowModel(false)}>X</button>
        </div>
        <form>
          <input required 
            maxLength={30} 
            placeholder=" Your task goes here" 
            name="title" 
            value={data.title} 
            onChange={handleChange}/>
          <br />
          <label>Drag to select your current progress</label>
          <input required
            type="range"
            id="range"
            min="0"
            max="100"
            name="progress"
            value={data.progress}
            onChange={handleChange}
          />
          <input className={mode} onClick={editMode?editData:postData} type="submit"/>
        </form>
      </div>
    </div>
  )
}

export default Modal
