// importing the package (importing graph ql yoga )
// uses node
const { GraphQLServer } = require('graphql-yoga'); 
const mongoose = require("mongoose"); 

// connect to database using mongoose 
// test is the name of your database
// running in the background, still need to connect to server
mongoose.connect("mongodb://localhost/test5", { useNewUrlParser: true, useUnifiedTopology: true }); 

const Todo = mongoose.model('Todo', {
    // can pass two fields in, text and whether its complete or not
    text: String, 
    complete: Boolean
}); 

// schema 
// name is the name of the argument, which is data type string 
// after colon is the return string type
// exclamation mark means its mandatory, string must be passed in  
const typeDefs = `
  type Query {
    hello(name: String): String!
    todos: [Todo]
  }
  type Todo {
      id: ID! 
      text: String! 
      complete: Boolean!
  }
  type Mutation {
      createTodo(text: String!): Todo
      updateTodo(id: ID!, complete: Boolean!): Boolean
      removeTodo(id: ID!): Boolean
  }`

    // if name is given, it is passed in as 'Hello (name) World' 
    // if name is not given, simply 'hello world' 
const resolvers = {
    Query: {
        hello: (_, { name }) => `Hello ${name || 'World'}`,
        todos: () => Todo.find()
    },
    Mutation: {
        createTodo: async (_, { text }) => {
            const todo = new Todo({ text, complete: false}); 
            // saves to database as a promise
            await todo.save(); 
            return todo; 
        },
        updateTodo: async (_, {id, complete}) => {
            await Todo.findByIdAndUpdate(id, { complete }); 
            return true; 
        }, 
        removeTodo: async (_, {id}) => {
            await Todo.findByIdAndRemove(id);
            return true; 
        }
    }
}; 

const server = new GraphQLServer({ typeDefs, resolvers })
// connects database to server
mongoose.connection.once("open", function() {
    server.start(() => console.log('Server is running on localhost:4000'))
}); 
