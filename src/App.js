import './App.css';
import './components/pages/Home.js';
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/UI/AppRouter";

function App() {
  return (
    <BrowserRouter>
        <AppRouter/>
    </BrowserRouter>
  );
}

export default App;
