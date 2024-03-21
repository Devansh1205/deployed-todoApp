import React, { useState } from 'react'
import ProgressBar from './ProgressBar'
import TickItem from './TickItem'
import Modal from './Modal'

const ListItem = ({task, getData}) => {
  const [showModal, setShowModal] = useState(false);

    const deleteItem=async(e)=>{
      e.preventDefault();
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos/${task.id}`, {
          method: 'DELETE'
        });
        if(response.status===200){
          getData();
        }
      } catch (error) {
        console.error(error.message);
      }
    }

  return (
    <li className='list-item'>
      <div className='info-container'>
        <TickItem />
        <p className='task-title'>{task.title}</p>
        <ProgressBar progress={task.progress}/>
      </div>
      <div className='button-container'>
        <button className='edit' onClick={()=>setShowModal(true)}>EDIT</button>
        <button className='delete' onClick={deleteItem}>DELETE</button>
      </div>
      {showModal&&<Modal mode={'edit'} setShowModel={setShowModal} task={task} getData={getData}/>}
    </li>
  )
}

export default ListItem
