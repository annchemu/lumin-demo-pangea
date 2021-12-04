import './App.css';
import { ApolloProvider } from "@apollo/client";
import { client } from "./service/api";
import Products from './pages/Products'

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Products /> 
      </div>
    </ApolloProvider>
  );
}

export default App;
