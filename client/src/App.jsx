import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState(null);

  async function getData() {
    try {
      const response = await fetch("http://localhost:3000/todos");
      const json = await response.json();
      const data = JSON.stringify(json);
      setData(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return <div>{data}</div>;
}

export default App;
