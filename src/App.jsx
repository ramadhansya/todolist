import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSquareCheck,
  faTrashCan,
  faCircle,
  faPenToSquare
} from '@fortawesome/free-solid-svg-icons'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css'

function App() {
  
  const [todos, setTodos] = useState(()=>{
    const savedTodos = localStorage.getItem("todos");
    if(savedTodos){
      return JSON.parse(savedTodos);
    }else{
      return [];
    }
  });

  const [newTodo, setNewTodo] = useState('');
  const [updateEditTodo, setUpdateEditTodo] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(0);

  useEffect(()=>{
    localStorage.setItem('todos', JSON.stringify(todos))
    countTodoCompleted()
  },[todos])

  //Add task
  function addTodo(e){
    e.preventDefault();
    if(newTodo){
      let newEntry = {id:Date.now(), title:newTodo, status: false}
      setTodos([...todos, newEntry])
      toast.info("You have added "+newEntry.title,{autoClose: 2000});
      setNewTodo('')
    }
  }

  //Delete task
  function deleteTodo(id){
    let removeItem = todos.filter((todo)=>{
      if(todo.id === id){
        toast.info("You have deleted "+todo.title,{autoClose: 2000});
      }
      return todo.id !== id
    })
    setTodos(removeItem)
  }

  //Mark task as done
  function markTodo(id){
    let mark = todos.map((todo)=>{
      if(todo.id === id){
        return({...todo, status:!todo.status})
      }
      return todo;
    })
    setTodos(mark)
  }

  //Start edit task
  function editTodo(todo){
    setIsEditing(true)
    setUpdateEditTodo({...todo})
  }
  
  //Input change in edit
  function getUpdateTodo(e){
    setUpdateEditTodo({...updateEditTodo, title: e.target.value})
  }

  //Update task
  function updateTodo(id, updated){
    let updatedItem = todos.map((todo)=>{
      if(todo.id === id){
        toast.info("Updated todo from "+todo.title+" to "+updated.title,{autoClose: 2000});
      }
      return todo.id === id ? updated : todo;
    })
    setIsEditing(false);
    setTodos(updatedItem)
  }

  function countTodoCompleted(){
    let count = todos.filter((todo)=>todo.status===true).length
    setIsCompleted(count)
  }

  return (
    <div className="container">
      <h1 className='heading'>Todo List</h1>
      <div className='iconsWrapHeading'>
        <span><FontAwesomeIcon icon={faCircle} size="2xs" className='cred'/></span>
        <span><FontAwesomeIcon icon={faCircle} size="2xs" className='corange'/></span>
        <span><FontAwesomeIcon icon={faCircle} size="2xs" className='cyellow'/></span>
        <span><FontAwesomeIcon icon={faCircle} size="2xs" className='cblue'/></span>
        <span><FontAwesomeIcon icon={faCircle} size="2xs" className='cgreen'/></span>
      </div>

      {isEditing?(
        <form onSubmit={(e)=>{
            e.preventDefault()
            updateTodo(updateEditTodo.id,updateEditTodo)
          }} 
          autoComplete="off"
          className='inputBox'>
          <input 
            type="text" 
            name='editTodo' 
            placeholder='input new todo' 
            value={updateEditTodo.title} 
            onChange={getUpdateTodo}
            required="required"
            />
            <span>Edit Todo</span>
          <button 
            type='submit'
            className='btn update'
            >Update</button>
          <button 
            onClick={()=>(setIsEditing(false))}
            className='btn cancel'
            >Cancel</button>
        </form>
      ):(
        <form onSubmit={addTodo} className='inputBox' autoComplete="off">
          <input 
            type="text" 
            name='newTodo' 
            value={newTodo} 
            onChange={(e)=>setNewTodo(e.target.value)}
            required="required" 
            />
            <span>New Todo</span>
          <button
            type='submit'
            className='btn add'
            >Add</button>
        </form>
      )}
      

      {/* Display Todo */}
      { todos.length ? '' : 'No Todo, Add new todo!' }

      <ul className='list-Container'>
        { todos.map((todo)=>{
          return(
            <div key={todo.id} className='todoBg'>

              <li className={todo.status ? 'completed' : ''}>
                <span className='todoTitle'>{todo.title}</span>
              </li>

              <div className='iconsWrap'>
                <span title='Completed / Uncompleted' onClick={()=>markTodo(todo.id)} className='mark'> 
                  <FontAwesomeIcon icon = {faSquareCheck}/>
                </span>
                {todo.status ? null :(
                  <span title='Edit' onClick={()=>editTodo(todo)} className='edit'> 
                    <FontAwesomeIcon icon = {faPenToSquare}/>
                  </span>
                )}
                <span title='Delete' onClick={()=>deleteTodo(todo.id)} className='delete'> 
                  <FontAwesomeIcon icon = {faTrashCan}/>
                </span>
              </div>

            </div>
          )
        })
        }
      </ul>

      <h2>{'completed '+ isCompleted + '/' + todos.length }</h2>

      {/* for activity notification */}
      <ToastContainer/>

    </div>
  )
}

export default App
