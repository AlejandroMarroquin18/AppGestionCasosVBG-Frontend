import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Agenda from './components/Agenda';
import Complaints from './components/Complaints';
import Workshop from './components/Workshop';
import Login from './pages/login';
import SignUp from './pages/signup';
import RestorePassword from './pages/restorepassword';
import Queja from './pages/queja/queja';
import WorkshopRegistrationPage from "./pages/Workshops/WorkshopRegistrationPage";
import useAuthCheck from './helpers/fetchWithAuth';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  const location = useLocation();

  const noSidebarRoutes = ['/login', '/registrarse', '/restorepassword', '/reportarvbg', '/inscripcion'];
  useAuthCheck()
  return (
    <div className="flex flex-col h-screen">
      {/* Mostrar Header solo si la ruta no está en la lista de noSidebarRoutes */}
      {!noSidebarRoutes.some(route => location.pathname.startsWith(route)) && <Header />}
      
      <div className="flex flex-1 overflow-hidden">
        {/* Mostrar Sidebar solo si la ruta no está en la lista de noSidebarRoutes */}
        {!noSidebarRoutes.some(route => location.pathname.startsWith(route)) && <Sidebar />}
        
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route element={<ProtectedRoute/>}>
              <Route path="/" element={<Navigate replace to="/quejas/lista" />} />
              <Route path="/quejas/*" element={<Complaints />} />
              <Route path="/agenda" element={<Agenda />} />
              <Route path="/agenda/*" element={<Agenda />} />
              <Route path="/talleres" element={<Workshop />} />
              <Route path="/talleres/*" element={<Workshop />} />
            </Route> 

            {/* RUTA DE INSCRIPCIÓN */}
            <Route path="/inscripcion/:workshopId" element={<WorkshopRegistrationPage />} />

            <Route path="/reportarvbg" element={<Queja />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registrarse" element={<SignUp />} />
            <Route path="/restorepassword" element={<RestorePassword />} />
            
            <Route path="*" element={<Navigate to="/" />} />
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