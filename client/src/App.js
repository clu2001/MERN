import React, { Component } from "react";
import gql from "graphql-tag"; 
import { graphql } from 'react-apollo'; 
import Paper from '@material-ui/core/Paper'; 
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';

const TodosQuery = gql`
  {
    todos {
      id
      text
      complete
    }
  }
  `; 

class App extends Component {
  render() {
    
    const {data: {loading, todos}} = this.props; 
    if (loading) {
      return null; 
    }


    // div contains a key that holds a unique string for each todo item
    return (
    
    <div style={{ display: 'flex' }}>
      <div style={{margin: 'auto', width: 400}}>
        <Paper elevation={1}>
          <div>{todos.map(todo => <div key={`${todo.id}-todo-item`}>{todo.text}</div>)}</div>
        </Paper>
      </div>
    </div>
    ); 
  }
  
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function CheckboxList() {
  const classes = useStyles();
  const [checked, setChecked] = React.useState([0]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <List className={classes.root}>
      {[0, 1, 2, 3].map((value) => {
        const labelId = `checkbox-list-label-${value}`;

        return (
          <ListItem key={value} role={undefined} dense button onClick={handleToggle(value)}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={checked.indexOf(value) !== -1}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': labelId }}
              />
            </ListItemIcon>
            <ListItemText id={labelId} primary={`Line item ${value + 1}`} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="comments">
                <CommentIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
  );
}


export default graphql(TodosQuery)(App);
