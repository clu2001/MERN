import React, { Component } from "react";
import gql from "graphql-tag"; 
import { graphql } from 'react-apollo'; 
import {flowRight as compose} from 'lodash';
import Paper from '@material-ui/core/Paper'; 
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Form from './form'; 

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


class App extends Component {

  updateTodo = async todo => {
    // update todo
    await this.props.updateTodo({
      variables: {
        id: todo.id, 
        complete: !todo.complete
      }, 
      update: store => {
        // read the data from our cache for this query 
        const data = store.readQuery({ query: TodosQuery }); 
        // add our comment from the mutation to the end
        data.todos = data.todos.map(
          x => 
            x.id === todo.id 
              ? {
                ...todo, 
                complete: !todo.complete
              }
            : x
      ); 
        // write our data back to the cache 
        store.writeQuery({ query: TodosQuery, data }); 
      }
    })
  }; 

  removeTodo = async todo => { 
    // update todo
    await this.props.removeTodo({
      variables: {
        id: todo.id, 
        
      }, 
      update: store => {
        // read the data from our cache for this query 
        const data = store.readQuery({ query: TodosQuery }); 
        // add our comment from the mutation to the end
        data.todos = data.todos.filter(x => x.id !== todo.id); 
        // write our data back to the cache 
        store.writeQuery({ query: TodosQuery, data }); 
      }
    })

  }; 

  render() {
    const 
      {data: {loading, todos}} = this.props; 
    if (loading) {
      return null; 
    }
    // div contains a key that holds a unique string for each todo item
    return (
    
    <div style={{ display: 'flex' }}>
      <div style={{margin: 'auto', width: 400}}>
        <Paper elevation={1}>
          {/*<div>{todos.map(todo => <div key={`${todo.id}-todo-item`}>{todo.text}</div>)}</div>*/}
          {/*<Form />*/}
          <List>
            {todos.map(todo => (
                <ListItem key={todo.id} role={undefined} dense button onClick={() => this.updateTodo(todo)}>
                    <Checkbox
                      edge="start"
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
              ))}; 
          </List>
        </Paper>
      </div>
    </div>
    ); 
  }
  
}


export default compose(graphql(RemoveMutation, {name: 'removeTodo'}), graphql(UpdateMutation, {name: 'updateTodo'}), graphql(TodosQuery))(App);
