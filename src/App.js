//import packages for apollo client
// @apollo/client graphql

//useMustation
//Executing a mutation
//useMutation Return
/*
-A mutate function that you can call at any time to execute the mutation
-An object with fields that represent the current status of the mutation's execution
*/

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import React from 'react';

//importing useQurey and usemutation
import { useMutation, useQuery, gql } from '@apollo/client';

//define apollo client
const apolloclient = new ApolloClient({
  uri: 'https://sxewr.sse.codesandbox.io/',
  cache: new InMemoryCache(),
});

//define GET_TODO query
const GET_TODO = gql`
  {
    todos {
      id
      type
    }
  }
`;
//update mutation
const UPDATE_TODO = gql`
  mutation UpdateTodo($id: String!, $type: String!) {
    updateTodo(id: $id, type: $type) {
      id
      type
    }
  }
`;
//update/Todos function
function Todos() {
  //get-todo useQuery
  const { loading, data, error } = useQuery(GET_TODO);
  // update todo
  const [
    updateTodo,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(UPDATE_TODO);
  if (loading) return <p>Querry loading ..</p>;
  if (error) return <p>Error : not working </p>;
  return data.todos.map(({ id, type }) => {
    let input;

    return (
      <div key={id}>
        <ul>
          <li>{type}</li>
        </ul>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateTodo({ variables: { id, type: input.value } });

            input.value = '';
          }}
        >
          <input
            ref={(node) => {
              input = node;
            }}
          />
          <button type='submit'>Update Todo</button>
        </form>
        {mutationLoading && <p>Mutation Loading...</p>}
        {mutationError && <p>Error :( Please try again</p>}
      </div>
    );
  });
}

//Add todo mutation
const ADD_TODO = gql`
  mutation AddTodo($type: String!) {
    addTodo(type: $type) {
      id
      type
    }
  }
`;
//addtodo function
function Addtodo() {
  let input; // the input variable which will hold reference to the input element

  //addTodo mutate function and object with current mutation state
  const [addTodo] = useMutation(ADD_TODO, {
    update(cache, { data: { addTodo } }) {
      cache.modify({
        fields: {
          todos(existingTodos = []) {
            const newTodoRef = cache.writeFragment({
              data: addTodo,
              fragment: gql`
                fragment NewTodo on Todo {
                  id
                  type
                }
              `,
            });
            return existingTodos.concat(newTodoRef);
          },
        },
      });
    },
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          //call mutate function
          addTodo({ variables: { type: input.value } });
          input.value = '';
        }}
      >
        <input
          ref={(node) => {
            input = node; // assign the node reference to the input variable
          }}
        />
        <button type='submit'>Add todo</button>
      </form>
    </div>
  );
}

function App() {
  return (
    <ApolloProvider client={apolloclient}>
      <p>Learn useMutation</p>
      <Addtodo />
      <Todos />
    </ApolloProvider>
  );
}

export default App;
