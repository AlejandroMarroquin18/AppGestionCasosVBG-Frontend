import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ComplaintsDetails = () => {
  const [quejaDetails, setQuejaDetails] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchDetails = async () => {
      const response = await fetch(`http://127.0.0.1:8000/api/quejas/${id}`);
      const data = await response.json();
      setQuejaDetails(data);
    };

    fetchDetails();
  }, [id]);

  if (!quejaDetails) return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );  

  return (
    <div className="details-container" style={{ background: 'white', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', margin: '20px' }}>
      <h1 className="text-3xl font-bold mb-6">Detalles de la queja</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '18px' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th style={{ padding: '10px' }} colSpan="2">Información Personal</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: '8px', border: '1px solid #ccc', fontWeight: 'bold' }}>Nombre</td>
            <td style={{ padding: '8px', border: '1px solid #ccc' }}>{quejaDetails.nombre}</td>
          </tr>
          <tr>
            <td style={{ padding: '8px', border: '1px solid #ccc', fontWeight: 'bold' }}>Sede</td>
            <td style={{ padding: '8px', border: '1px solid #ccc' }}>{quejaDetails.sede}</td>
          </tr>
          <tr>
            <td style={{ padding: '8px', border: '1px solid #ccc', fontWeight: 'bold' }}>Código</td>
            <td style={{ padding: '8px', border: '1px solid #ccc' }}>{quejaDetails.codigo}</td>
          </tr>
        </tbody>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th style={{ padding: '10px' }} colSpan="2">Información Académica</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: '8px', border: '1px solid #ccc', fontWeight: 'bold' }}>Facultad</td>
            <td style={{ padding: '8px', border: '1px solid #ccc' }}>{quejaDetails.facultad}</td>
          </tr>
          <tr>
            <td style={{ padding: '8px', border: '1px solid #ccc', fontWeight: 'bold' }}>Unidad Académica</td>
            <td style={{ padding: '8px', border: '1px solid #ccc' }}>{quejaDetails.unidad}</td>
          </tr>
          <tr>
            <td style={{ padding: '8px', border: '1px solid #ccc', fontWeight: 'bold' }}>Tipo de Acompañamiento</td>
            <td style={{ padding: '8px', border: '1px solid #ccc' }}>{quejaDetails.tipo_de_acompanamiento}</td>
          </tr>
          <tr>
            <td style={{ padding: '8px', border: '1px solid #ccc', fontWeight: 'bold' }}>Fecha</td>
            <td style={{ padding: '8px', border: '1px solid #ccc' }}>{quejaDetails.fecha}</td>
          </tr>
          <tr>
            <td style={{ padding: '8px', border: '1px solid #ccc', fontWeight: 'bold' }}>Estado</td>
            <td style={{ padding: '8px', border: '1px solid #ccc' }}>{quejaDetails.estado}</td>
          </tr>
          <tr>
            <td style={{ padding: '8px', border: '1px solid #ccc', fontWeight: 'bold' }}>Detalles</td>
            <td style={{ padding: '8px', border: '1px solid #ccc' }}>{quejaDetails.detalles}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ComplaintsDetails;