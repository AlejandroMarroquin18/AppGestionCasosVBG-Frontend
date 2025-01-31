import {  BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Agenda from './components/Agenda';
import Complaints from './components/Complaints';
import Workshop from './components/Workshop';
import Login from './pages/login';
import SignUp from './pages/signup';
import RestorePassword from './pages/restorepassword';
import Queja from './pages/queja/queja';

function App() {
  const location = useLocation();
  const noSidebarRoutes = ['/login', '/registrarse', '/restorepassword','/reportarvbg'];

  return (
    <div className="flex flex-col h-screen">
      {!noSidebarRoutes.includes(location.pathname) && <Header />}
      <div className="flex flex-1 overflow-hidden">
        {!noSidebarRoutes.includes(location.pathname) && <Sidebar />}
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate replace to="/estadisticas" />} />
            <Route path="/quejas/*" element={<Complaints />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/agenda/*" element={<Agenda />} />
            <Route path="/talleres" element={<Workshop />} />
            <Route path="/talleres/*" element={<Workshop />} />
            

            <Route path ="/reportarvbg" element={<Queja/>}/>
            <Route path="/login" element={<Login />} />
            <Route path="/registrarse" element={<SignUp />} />
            <Route path="/restorepassword" element={<RestorePassword />} />
            {/* Añade otras rutas según sea necesario */}
          </Routes>
        </main>
      </div>
    </div>
  );
}

// Asegúrate de envolver la App en Router en el punto de entrada de tu aplicación (index.js o App.js)
function Root() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default Root;