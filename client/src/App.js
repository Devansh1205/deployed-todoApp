import React, { useEffect, useState } from "react";
import ListHeader from "./components/ListHeader";
import ListItem from "./components/ListItem";
import Auth from "./components/Auth";
import { useCookies } from "react-cookie";

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [ tasks, setTasks ] = useState(null);
  const userEmail = cookies.Email;
  const authToken = cookies.AuthToken;

  async function getData() {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos/${userEmail}`);
      const json = await response.json();
      setTasks(json);
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    if(authToken){
      getData();
    }
  }, [authToken]);

  // console.log(tasks);
  
  // sort by date
  const sortedTasks = tasks?.sort((a, b)=>new Date(a.date) - new Date(b.date));

  return (
    <div className="App">
      {authToken ? 
      <>
      <ListHeader listName={"🏖️ Holiday Tick List"} getData={getData}/>
      <p className="user-email">Welcome Back {userEmail}</p>
      {sortedTasks?.map((task, index)=> <ListItem key={index} task={task} getData={getData}/>)}
      </> : <Auth />
      }
      <p className="copyright">© 2024 deployed-todo</p>
    </div>
  );
}

export default App;
