import './App.css';
import Handdraw from "./Handdraw";
function App() {
  return (
    <div className="App">
       <h1 style={{ position: "absolute",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 3,
        color: "lightpink" }}>
        beas' drawing app
      </h1>
      <Handdraw />
    </div>
  );
}

export default App;
