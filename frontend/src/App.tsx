import React from 'react';
import './App.css';
import Header from "./component/Header";
import CarPages from "./pages/cars";
export default function App() {
  return (
    <div className="App">
      <Header />
      <CarPages />
    </div>
  );
}