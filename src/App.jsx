
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
import Signup from './authentication/Signup';
import Secretary from './components/Secretariat/Secretary';
import Addvisitor from './components/Secretariat/Addvisitor';
import SignIn from './authentication/Signin';
import Aboutus from './components/About';
function App() {
  return (
    <div className="App">
      <Navbar/>
      <Routes>
      <Route path="/" element={<Signup/>}/>
      <Route path="/home" element={<Home/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/criminal_dash" element={<CriminalDB/>}/>
      <Route path="/trafficDepartment" element={<TrafficDepartment/>}/>
      <Route path="/criminalAdd" element={<AddCriminal/>}/>
      <Route path="/trafficDetailsAdd" element={<AddTrafficDetails/>}/>
      <Route path="/brandcomp" element={<BrandSetup/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/signin" element={<SignIn/>}/>
      <Route path="/secretary" element={<Secretary/>}/>
      <Route path="/secretary/addvisitor" element={<Addvisitor/>}/>
      <Route path="/aboutus" element={<Aboutus/>}/>


      </Routes>
    </div>
  );
}

export default App;
