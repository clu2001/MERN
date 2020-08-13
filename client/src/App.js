import React, { Component } from "react"; 
import gql from "graphql-tag"; 
import { graphql } from "react-apollo"; 
import Paper from '@material-ui/core/Paper'; 

import List from '@material-ui/core/List'; 
import ListItem from '@material-ui/core/ListItem'; 
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'; 
import ListItemText from '@material-ui/core/ListItemText'; 
import Checkbox from '@material-ui/core/Checkbox'; 
import IconButton from '@material-ui/core/IconButton'; 
import CloseIcon from '@material-ui/icons/Close'; 

import Form from './form'; 
//import compose from 'lodash.flowright';

const TodosQuery = gql`
  {
    todos {
      id 
      text
      complete
    }
  }
`; 


const UpdateMutation = gql`
  mutation($id: ID!, $complete: Boolean!) {
    updateTodo(id: $id, complete: $complete)
  }
`; 

const RemoveMutation = gql`
  mutation($id: ID!) {
    removeTodo(id: $id)
  }
`;

const CreateTodoMutation = gql`
  mutation($text: String!) {
    createTodo(text: $text) {
      id
      text
      complete
    }
  }
`;

class App extends Component {
  // these functions automatically bind 


  // update function 
  updateTodo = async todo => {
    // update todo
    await this.props.updateTodo({
      variables:  {
        id: todo.id, 
        complete: !todo.complete
      }, 
      update: store => {
        // read data from our cache for this query 
        const data = store.readQuery({ query: TodosQuery });
        
        data.todos = data.todos.filter(x => x.id !== todo.id)
        // write out data back to the cache 
        store.writeQuery({ query: TodosQuery, data }); 
      }

      
    })
  }; 


  // remove function 
  removeTodo = async todo => {
    // remove todo 
    await this.props.removeTodo({
      variables:  {
        id: todo.id, 
      }, 
      update: store => {
        // read data from our cache for this query 
        const data = store.readQuery({ query: TodosQuery }); 

        //data.todos = data.todos.filter(x => x.id !== todo.id)
        // write out data back to the cache 
        store.writeQuery({ query: TodosQuery, data }); 
      }
    }); 
  }; 


  createTodo = async (text) => {
    // create todo 
    await this.props.createTodo({
      variables:  {
        text
      }, 
      update: (store, { data: { createTodo } }) => {
        // read data from our cache for this query 
        const data = store.readQuery({ query: TodosQuery }); 

        data.todos.push(createTodo); 
        // write out data back to the cache 
        store.writeQuery({ query: TodosQuery, data }); 
      }
    }); 
  }

  render() {
    const {
      data: { loading, todos } 
    } = this.props; 
    if (loading) {
      return null; 
    }
    
    return (
      <div style={{ display: 'flex' }}>
        <div style={{ margin: 'auto', width: 400 }}>
          <Paper elevation={1}>
          <Form submit={this.createTodo} />
            <List>
              {todos.map(todo => (
                <ListItem
                  key={todo.id}
                  role={undefined}
                  dense
                  button
                  onClick={() => this.updateTodo(todo)}
                >
                  <Checkbox
                    checked={todo.complete} 
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemText primary={todo.text} />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => this.removeTodo(todo)}>
                      <CloseIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
              </ListItem>  
              ))}
            </List>
            {/* code below shows to do list without boxes
            {todos.map(todo => <div key={`${todo.id}-todo-item`}>{todo.text}</div>)}
            */}
          </Paper>
        </div>
      </div>
    ); 
  }
}

export default graphql(CreateTodoMutation, { name: "createTodo" })(graphql(RemoveMutation, { name: "removeTodo"})(graphql(UpdateMutation, { name: "updateTodo" })(graphql(TodosQuery)(App)))); 

