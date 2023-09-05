import React, {useState, useEffect} from 'react';
import { Routes, Route, Navigate, useNavigate, BrowserRouter } from "react-router-dom";
import Register from './components/Register';
import Login from './components/Login';
import Plans from './components/Plan';
import PaymentDetails from './components//PaymentDetail';
import CurrentPlan from './components/CurrentPlan';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import './App.css';


const stripePromise = loadStripe("pk_test_51Nj2QSSHOu8Dft9pwaD7zjM3kKjUHBSfVyGc1ZG8mmQ9iDWsGjXFlotsebHqSZxpDrRhX1FRIIodP72FSMOqEPJG00tG3P5BmN");


function App() {

  const [selectedPlan, setSelectedPlan] = useState({});


  return (
    <BrowserRouter>
    <div className="AppContainer">
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login setSelectedPlan={setSelectedPlan} />}/>
        <Route path="/plan" element={<Plans setSelectedPlan={setSelectedPlan} />} />
        <Route path="/payment" element={<Elements stripe={stripePromise}><PaymentDetails selectedPlan={selectedPlan}/></Elements>}/>
        <Route path="/currentPlan" element={<CurrentPlan plan={selectedPlan}/>}/>
      </Routes>
    </div>
    </BrowserRouter>
  );
}


Date.isLeapYear = function (year) { 
  return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)); 
};

Date.getDaysInMonth = function (year, month) {
  return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
};

Date.prototype.isLeapYear = function () { 
  return Date.isLeapYear(this.getFullYear()); 
};

Date.prototype.getDaysInMonth = function () { 
  return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
};

Date.prototype.addMonths = function (value) {
  var n = this.getDate();
  this.setDate(1);
  this.setMonth(this.getMonth() + value);
  this.setDate(Math.min(n, this.getDaysInMonth()));
  return this;
};

export default App;

