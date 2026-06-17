import './App.css' //Maner de llamar al App.css
import { useState } from 'react' //forma correcta de llamar el hook UseState
import Timer from './components/Timer'


function App() {
  return (
    <div className="app">
      <Timer />

    </div>
  );
}

export default App;