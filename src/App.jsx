import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Agenda from './components/Agenda';
import ComplaintsList from './components/complaintsList';
import Statistics from './components/Statistics';

const App = () => {
  return (
    <Router>
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Navigate replace to="/lista" />} />
              <Route path="/lista" element={<ComplaintsList />} />
              <Route path="/estadisticas" element={<Statistics />} />
              <Route path="/agenda" element={<Agenda />} />
              {/* Añade otras rutas según sea necesario */}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;