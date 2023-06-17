import './App.css';
import './components/pages/Home.js';
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/UI/AppRouter";
import {Spinner} from "react-bootstrap";
import React, {useEffect, useState} from "react";


function App() {


  return (
      <div>
          <BrowserRouter>
              <AppRouter/>
          </BrowserRouter>

      </div>

  );
}

export default App;
