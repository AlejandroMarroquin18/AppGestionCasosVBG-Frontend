import React, { useState, useEffect } from 'react';
import { useParams,useNavigate } from 'react-router-dom';

const ComplaintsDetails = () => {

  const navigate = useNavigate();

  const [quejaDetails, setQuejaDetails] = useState(null);
  const [quejaCopy,setQuejaCopy]=useState(null)
  const [openModal,setOpenModal]=useState(false)

  const { id } = useParams();

  const [editMode,setEditMode]=useState(false)

  const dataTitles=[
          //persona que reporta
          'fecha_recepcion',
          'reporta_nombre' ,
          'reporta_sexo',
          'reporta_edad',
          'reporta_estamento' ,
          'reporta_vicerrectoria_adscrito' ,
          'reporta_dependencia' ,
          'reporta_programa_academico' ,
          'reporta_facultad' ,
          'reporta_sede' ,
          'reporta_celular' ,
          'reporta_correo' ,
          //persona afectada
          'afectado_nombre' ,
          'afectado_sexo' ,
          'afectado_edad' ,
          'afectado_codigo' ,
          'afectado_comuna' ,
          'afectado_estrato_socioeconomico' ,
          'afectado_condicion_etnico_racial' ,
          'afectado_tiene_discapacidad' ,
          'afectado_tipo_discapacidad' ,
          'afectado_identidad_genero' ,
          'afectado_orientacion_sexual' ,
          'afectado_estamento' ,
          'afectado_vicerrectoria_adscrito' ,
          'afectado_dependencia' ,
          'afectado_programa_academico' ,
          'afectado_facultad' ,
          'afectado_sede' ,
          'afectado_celular' ,
          'afectado_correo' ,
          'afectado_tipo_vbg_os' ,
          'afectado_detalles_caso' ,

          //persona agresora
          'agresor_nombre' ,
          'agresor_sexo' ,
          'agresor_edad' ,
          'agresor_condicion_etnico_racial' ,
          'agresor_tiene_discapacidad' ,
          'agresor_tipo_discapacidad' ,
          'agresor_identidad_genero' ,
          'agresor_orientacion_sexual' ,
          'agresor_estamento' ,
          'agresor_vicerrectoria_adscrito' ,
          'agresor_dependencia' ,
          'agresor_programa_academico' ,
          'agresor_facultad' ,
          'agresor_sede' ,
          //detalles generales
          'desea_activar_ruta_atencion_integral' ,
          'recibir_asesoria_orientacion_sociopedagogica' ,
          'orientacion_psicologica' ,
          'asistencia_juridica' ,
          'acompañamiento_solicitud_medidas_proteccion_inicial' ,
          'acompañamiento_ante_instancias_gubernamentales' ,
          'interponer_queja_al_comite_asusntos_internos_disciplinarios' ,
          'observaciones' ,
          //relleno que se debe descartar
          ]
          
          const reportaTitles=[
            //persona que reporta
            'fecha de recepcion',
            'Nombre' ,
            'Sexo',
            'Edad',
            'Estamento' ,
            'Vicerrectoria a la que se encuentra adscrito/a' ,
            'Dependencia' ,
            'Programa academico' ,
            'Facultad' ,
            'Sede' ,
            'Celular' ,
            'Correo electronico' ]
          const afectadaTitles=[   //persona afectada
            'Nombre' ,
            'Sexo' ,
            'Edad' ,
            'Código' ,
            'Comuna' ,
            'Estrato socioeconomico' ,
            'Condicion etnico racial' ,
            '¿Tiene algún tipo de discapacidad?' ,
            'Tipo de discapacidad' ,
            'Identidad de genero' ,
            'Orientación sexual' ,
            'Estamento' ,
            'Vicerrectoria a la que se encuentra adscrito/a' ,
            'Dependencia' ,
            'Programa academico' ,
            'Facultad' ,
            'Sede' ,
            'Celular' ,
            'Correo electronico' ,
            'Tipo de violencia basada en genero u orientacion sexual' ,
            'Detalles del caso' ]
          const agresorTitles=[   //persona agresora
            'Nombre' ,
            'Sexo' ,
            'Edad' ,
            'Condicion etnico racial' ,
            '¿Tiene algún tipo de discapacidad?' ,
            'Tipo de discapacidad' ,
            'Identidad de genero' ,
            'Orientacion sexual' ,
            'Estamento' ,
            'Vicerrectoria a la que se encuentra adscrito/a' ,
            'Dependencia' ,
            'Programa academico' ,
            'Dacultad' ,
            'Sede' ]
          const detallesTitles=[   //detalles generales
            'Desea Activar la Ruta de Atención Integral' ,
            'Requiere recibir asesoría y orientación socio-pedagógica' ,
            'Requiere recibir orientación psicológica' ,
            'Requiere recibir asistencia jurídica' ,
            'Requiere recibir acompañamiento para solicitud de medidas de protección inicial' ,
            'Requiere recibir acompañamiento ante instancias gubernamentales' ,
            'Requiere interponer una queja formal al Comité de Asuntos Internos Disciplinarios' ,
            'observaciones' ,
            //relleno que se debe descartar
            'nombre'  ,
            'sede'  ,
            'codigo'  ,
            'tipo_de_acompanamiento'  ,
            'fecha'  ,
            'estado',
            'detalles',
            'facultad',
            'unidad']

  useEffect(() => {
    const fetchDetails = async () => {
      const response = await fetch(`http://127.0.0.1:8000/api/quejas/${id}`);
      const data = await response.json();
      setQuejaDetails(data);
      setQuejaCopy(data)
    };

    fetchDetails();
  }, [id]);

  const changeDetails = (field,value) =>{
    setQuejaCopy({
        ...quejaCopy,
        [field]: value,
    });
  }


  const sendEdit=async()=>{  
    try {
      const response = await fetch(`http://localhost:8000/api/quejas/${id}/`, {
        method: "PUT", // Puedes usar PATCH si solo vas a actualizar algunos campos
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quejaCopy),
      });
  
      if (!response.ok) {
        throw new Error("Error al actualizar la queja");
      }
  
      const data = await response.json();
      setQuejaDetails(data)
      console.log("Queja actualizada:", data);
      setOpenModal(false)
      setEditMode(false)
      
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al actualizar la queja");
    }
  }

  const sendDelete= async ()=>{
    try {
      const respuesta = await fetch(`http://localhost:8000/api/quejas/${id}/`, {
          method: "DELETE",
          headers: {
              "Content-Type": "application/json"
          }
      });

      if (respuesta.ok) {
          navigate('/quejas/lista')
      } else {
          alert("Error al eliminar la queja");
      }
  } catch (error) {
      console.error("Error:", error);
      alert("Ocurrió un error al eliminar la queja");
  }}
  
  
  if (!quejaDetails) return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );

  const trStyle= { padding: '8px', border: '1px solid #ccc', fontWeight: 'bold' }
  const tdStyle= { padding: '8px', border: '1px solid #ccc' }

  return (
    <div className="details-container" style={{ background: 'white', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', margin: '20px' }}>
      <h1 className="text-3xl font-bold mb-6">Detalles de la queja</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '18px' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th style={{ padding: '10px' }} colSpan="2">Información de la persona que reporta el caso</th>
          </tr>
        </thead>
        <tbody>
        
          {dataTitles.slice( 0,12).map((header, index) => (
            <tr key={index} className="border border-gray-300">
              <td style={trStyle}>{reportaTitles[index]}</td>
              <td style={tdStyle}>{ !editMode ? quejaDetails[`${header}`] : <input value= {quejaCopy[header]} onChange={ (e)=>changeDetails(header,e.target.value) } />  }</td>
            </tr>
          ))}
        </tbody>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th style={{ padding: '10px' }} colSpan="2">Información de la persona afectada</th>
          </tr>
        </thead>
        <tbody>
        
          {dataTitles.slice(12,33).map((header, index) => (
            <tr key={index} className="border border-gray-300">
              <td style={trStyle}>{afectadaTitles[index]}</td>
              <td style={tdStyle}>{ !editMode ? quejaDetails[`${header}`] : <input value= {quejaCopy[header]} onChange={ (e)=>changeDetails(header,e.target.value) } />  }</td>
            </tr>
          ))}
        </tbody>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th style={{ padding: '10px' }} colSpan="2">Información de la persona agresora</th>
          </tr>
        </thead>
        <tbody>
        
          {dataTitles.slice(33,47).map((header, index) => (
            <tr key={index} className="border border-gray-300">
              <td style={trStyle}>{agresorTitles[index]}</td>
              <td style={tdStyle}>{ !editMode ? quejaDetails[`${header}`] : <input value= {quejaCopy[header]} onChange={ (e)=>changeDetails(header,e.target.value) } />  }</td>
            </tr>
          ))}
        </tbody>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th style={{ padding: '10px' }} colSpan="2">Información adicional</th>
          </tr>
        </thead>
        <tbody>
              
          {dataTitles.slice(47).map((header, index) => (
            <tr key={index} className="border border-gray-300">
              <td style={trStyle}>{detallesTitles[index]}</td>
              <td style={tdStyle}>{ !editMode ? quejaDetails[`${header}`] : <input value= {quejaCopy[header]} onChange={ (e)=>changeDetails(header,e.target.value) } />  }</td>
            </tr>
          ))}
        </tbody>

      </table>
      <button onClick={sendDelete}>Borrar</button>
      <button onClick={()=>{setEditMode(!editMode)}}>{editMode ? "Cancelar Edicion" :"Editar"}</button>
      {editMode && <button onClick={()=>setOpenModal(!openModal)}>Guardar</button>}
      
      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md text-center">
            <h2>¿Desea guardar los cambios?</h2>
            <button onClick={sendEdit}>Sí, guardar</button>
            <button onClick={()=>setOpenModal(!openModal)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintsDetails;