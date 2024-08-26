import { render } from "preact";

import Calculator from "./components/Calculator";
import "./style.css";

export function App() {
  return <Calculator />;
}

render(<App />, document.getElementById("app"));
