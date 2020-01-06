import React from "react";
import ReactDOM from "react-dom";
import Component from "./Component";

function App() {
  return (
    <div>
      <Component />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
