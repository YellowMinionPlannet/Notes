# Managing Local and Remote State

## The Rules of Hooks

3 Rules of Hooks

1. Only for function components
2. Start with "use"
3. Only be called at the top level

   - Must be declared in consistent order for each render
   - So, they can't be called inside functions, conditions, or loops

- If you need condition, place them inside the hook

Use `debugger;` in React will set breakpoint when project runs.

## React Developer Tools

State is in order of declaration when using React Developer Tools to debug.

## Implementing Derived State and Exploring When React Renders

React renders page in 4 situations:

| Situation      | How to skip render                             |
| -------------- | ---------------------------------------------- |
| State change   | shouldComponentUpdate/React.Memo               |
| Prop change    | shouldComponentUpdate/React.Memo/PureComponent |
| Parent render  | shouldComponentUpdate/React.Memo/PureComponent |
| Context change | N/A                                            |

## Fetching and Storing Data Via UseEffect

`useEffect` is like a configurable lifecycle method.

`useEffect(() => {}, [])` only run once.

## 4 Ways to Handle API Calls

1. inline, NOT Recommended
2. Centralized Functions
3. Custom hook
4. Library

```js
//Inline
useEffect(() => {
  fetch("users")
    .then((res) => resp.json())
    .then((json) => setUsers(json));
}, []);
```

```js
//Centralized Functions
export async function getUsers() {
  const response = await fetch("users");
  if (response.ok) return response.json();
  throw response;
}

import {getUsers} form "./services/userService";
```

## Handling Errors via Error Boundary

Error Boundary must be a class component.

```js
import React from "react":
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDeriedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

import ErrorBoundary from "./ErrorBoundary";
ReactDOM.render(
    <ErrorBoundary>
        <App />
    </ErrorBoundary>,
    document.getElementById("root");
);
```

Error Boundary does not catch for:

1. Event handlers
2. Asynchronous code
3. Server side rendering
4. Errors boundary itself has rather than its children have

How to catch error with Async code?

```jsx
export default function App() {
  const [error, setError] = useState(null);
  useEffect(() => {
    getProducts("shoes")
      .then((response) => setProducts(response))
      .catch((e) => setError(e));
  }, []);

  if(error) throw error;
  return (
    //...
  );
}
```

## Handling Loading State

```jsx

if(loading) return <Spinner />;
return (
    //...
)

```

## Implementing Async/await in useEffect

```jsx
export default function App() {
  const [error, setError] = useState(null);
  useEffect(() => {
    (async () => {
      try{
        const data = await getProducts("shoes")
      }catch(error){
        setError(error);
      }
  })()
  }, []);

  if(error) throw error;
  return (
    //...
  );
}
```

## Creating Custom Hooks for Handling Remote State

```jsx
export default function useFetch(url) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const json = await response.json();
          setData(json);
        } else {
          throw response;
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [url]);

  return { data, error, loading };
}
```

# Chapter 4 Implementing Routing

## Configuring React Router's Entry Point

```jsx
//index.js
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <ErrorBoundary>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ErrorBoundary>, document.getElementById("root");
);

//App.jsx
import {Routes, Route} from "react-router-dom";
export default function App(){
  return (
    <>
      <div className="content">
        <main>
          <Routes>
            <Route path="/:category" element={<Products />} />
            <Route path="/detail" element={<Detail />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

//Products.jsx
import {useParams} from "react-router-dom";
export default function Products(){
  const {cateogry} = useParams();
  ...
}
```
