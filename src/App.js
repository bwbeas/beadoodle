import './App.css';
import Handdraw from "./Handdraw";
function App() {
  return (
    <div className="App">
       <h1 style={{ position: "absolute", zIndex: 3, color: "white" }}>
        beas' drawing app
      </h1>
      <Handdraw />
    </div>
  );
}

export default App;
