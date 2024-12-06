import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import SignUp from './pages/signup';
import RestorePassword from './pages/restorepassword';
import './App.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registrarse" element = {<SignUp/>} />
        <Route path= "/restorepassword" element = {<RestorePassword/>}/>
        {/* Otrs rutas pueden ir aquí */}
      </Routes>
    </Router>
  );
}

export default App;
