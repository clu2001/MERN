import React from 'react'; 
import TextField from "@material-ui/core/TextField"; 

export default class Form extends React.Component {

    state = {
        text: ""

    }

    handleOnChange = (e) => {
        const newText = e.target.value; 
        this.setState({
            text: newText
        }); 
    }; 
    
    render() {
        const { text } = this.state; 
        return (<TextField onChange={this.handleOnChange} label="todo..."margin="normal" value={text} fullWidth />); 
    }
}