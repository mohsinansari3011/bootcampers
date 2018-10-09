import React, { Component } from 'react';
import logo from './logo.svg';
import Todo from './todo/todo';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header-a">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome BootCampers to ToDo App </h1>
        </header>
      
        <div className="container">

        <Todo />
        </div>
      </div>
    );
  }
}

export default App;
