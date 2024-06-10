
import React from 'react';
import {Routes,Route} from 'react-router-dom'
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import CriminalDB from './components/CriminalDB';
import AddCriminal from './components/AddCriminal';
import TrafficDepartment from './components/trafficDeparment/TrafficDepartment';
import AddTrafficDetails from './components/trafficDeparment/AddTrafficDetails';
import BrandSetup from './components/Brandcomp';
function App() {
  return (
    <div className="App">
      <Navbar/>
      <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/criminal_dash" element={<CriminalDB/>}/>
      <Route path="/trafficDepartment" element={<TrafficDepartment/>}/>
      <Route path="/criminalAdd" element={<AddCriminal/>}/>
      <Route path="/trafficDetailsAdd" element={<AddTrafficDetails/>}/>
      <Route path="/brandcomp" element={<BrandSetup/>}/>

      </Routes>
    </div>
  );
}

export default App;
