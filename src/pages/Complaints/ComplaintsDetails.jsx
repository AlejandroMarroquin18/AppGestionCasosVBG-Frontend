import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  getComplaintDetails,
  updateComplaint,
  deleteComplaint,
  createRegistry,
  getRegistryList,
  deleteRegistry,
  updateRegistry,
} from "../../api";
import DeleteModal from "../../components/DeleteModal";
import { Description } from "@mui/icons-material";
import { FaPencilAlt, FaTrash } from "react-icons/fa";

const ComplaintsDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [quejaDetails, setQuejaDetails] = useState(null);
  const [quejaCopy, setQuejaCopy] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [registros, setRegistros] = useState([]);
  const [isCreatingRegistry, setIsCreatingRegistry] = useState(false);
  const emptyRegistry = {
    fecha: new Date().toLocaleDateString(),
    queja_id: id,
    tipo: "",
    descripcion: ""}
  const [newRegistry, setNewRegistry] = useState(emptyRegistry);
  const [editingRegistryIndex, setEditingRegistryIndex] = useState(-1);
  const [registryCopy, setRegistryCopy] = useState(null);

  const dataTitles = [
    //persona que reporta
    "fecha_recepcion",
    "reporta_nombre",
    "reporta_sexo",
    "reporta_edad",
    "reporta_estamento",
    "reporta_vicerrectoria_adscrito",
    "reporta_dependencia",
    "reporta_programa_academico",
    "reporta_facultad",
    "reporta_sede",
    "reporta_celular",
    "reporta_correo",//11
    //persona afectada
    "afectado_nombre",//12
    "afectado_sexo",
    "afectado_edad",
    "afectado_codigo",
    "afectado_comuna",
    "afectado_estrato_socioeconomico",
    "afectado_condicion_etnico_racial",
    "afectado_tiene_discapacidad",
    "afectado_tipo_discapacidad",
    "afectado_identidad_genero",
    "afectado_orientacion_sexual",
    "afectado_estamento",
    "afectado_vicerrectoria_adscrito",
    "afectado_dependencia",
    "afectado_programa_academico",
    "afectado_facultad",
    "afectado_sede",
    "afectado_celular",
    "afectado_correo",
    "afectado_tipo_vbg_os",
    "afectado_detalles_caso",//32

    //persona agresora
    "agresor_nombre",//33
    "agresor_sexo",
    "agresor_edad",
    "agresor_condicion_etnico_racial",
    "agresor_tiene_discapacidad",
    "agresor_tipo_discapacidad",
    "agresor_identidad_genero",
    "agresor_orientacion_sexual",
    "agresor_estamento",
    "agresor_vicerrectoria_adscrito",
    "agresor_dependencia",
    "agresor_programa_academico",
    "agresor_facultad",
    "agresor_sede",//46
    //detalles generales
    "desea_activar_ruta_atencion_integral",//47
    "recibir_asesoria_orientacion_sociopedagogica",
    "orientacion_psicologica",
    "asistencia_juridica",
    "acompañamiento_solicitud_medidas_proteccion_inicial",
    "acompañamiento_ante_instancias_gubernamentales",
    "interponer_queja_al_comite_asusntos_internos_disciplinarios",
    "observaciones",//54
    //relleno que se debe descartar
  ];

  const reportaTitles = [
    //persona que reporta
    "Fecha de recepcion de la solicitud",
    "Nombre",
    "Sexo",
    "Edad",
    "Estamento",
    "Vicerrectoría a la que se encuentra adscrito/a",
    "Dependencia",
    "Programa académico",
    "Facultad",
    "Sede",
    "Celular",
    "Correo electrónico",
  ];
  const afectadaTitles = [
    //persona afectada
    "Nombre",
    "Sexo",
    "Edad",
    'Código' ,
    "Comuna",
    "Estrato socioeconómico",
    "Condición étnico racial",
    "¿Tiene algún tipo de discapacidad?",
    "Tipo de discapacidad",
    "Identidad de género",
    "Orientación sexual",
    "Estamento",
    "Vicerrectoría a la que se encuentra adscrito/a",
    "Dependencia",
    "Programa académico",
    "Facultad",
    "Sede",
    "Celular",
    "Correo electrónico",
    "Tipo de violencia basada en género u orientación sexual",
    "Detalles del caso",
  ];
  const agresorTitles = [
    //persona agresora
    "Nombre",
    "Sexo",
    "Edad",
    "Condición étnico racial",
    "¿Tiene algún tipo de discapacidad?",
    "Tipo de discapacidad",
    "Identidad de género",
    "Orientación sexual",
    "Estamento",
    "Vicerrectoría a la que se encuentra adscrito/a",
    "Dependencia",
    "Programa académico",
    "Facultad",
    "Sede",
  ];
  const detallesTitles = [
    //detalles generales
    "¿Desea activar la ruta de atención integral?",
    "¿Requiere recibir asesoría y orientación socio-pedagógica?",
    "¿Requiere recibir orientación psicológica?",
    "¿Requiere recibir asistencia jurídica?",
    "¿Requiere recibir acompañamiento para solicitud de medidas de protección inicial?",
    "¿Requiere recibir acompañamiento ante instancias gubernamentales?",
    "¿Requiere interponer una queja formal al Comité de Asuntos Internos Disciplinarios?",
    "Observaciones",
    //relleno que se debe descartar
    "nombre",
    "sede",
    "codigo",
    "tipo_de_acompanamiento",
    "fecha",
    "estado",
    "detalles",
    "facultad",
    "unidad",
  ];

  

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const data = await getComplaintDetails(id);
        setQuejaDetails(data);
        setQuejaCopy(data);
        console.log("Detalles de la queja:", data);

        const dataRegistros = await getRegistryList(id);
        
        setRegistros(dataRegistros);
        console.log("Registros de la queja:", dataRegistros);
      } catch (error) {
        console.error("Error getting details:", error);
      }
    };

    loadDetails();
  }, [id]);

  

  const changeDetails = (field, value) => {
    setQuejaCopy({
      ...quejaCopy,
      [field]: value,
    });
  };
  const onChangeNewRegistry = (field, value) => {
    setNewRegistry({
      ...newRegistry,
      [field]: value,
    });
  }
  const onEditRegistry = ( field, value) => {
    setRegistryCopy({
      ...registryCopy,
      [field]: value,
    });
  }
  

  const sendEdit = async () => {
    try {
      const data = await updateComplaint(id, quejaCopy);
      setQuejaDetails(data);
      setOpenModal(false);
      setEditMode(false);
      console.log("Queja actualizada:", data);
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al actualizar la queja");
    }
  };

  const sendDelete = async () => {
    try {
      await deleteComplaint(id);
      navigate("/quejas/lista");
    } catch (error) {
      console.error("Error:", error);
      alert("Ocurrió un error al eliminar la queja");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  if (!quejaDetails)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );

  const handleAddRegistry = async () => {

    const data = await createRegistry(newRegistry);
    if (data) {
      setRegistros([...registros, newRegistry]);
      console.log("Nuevo registro añadido:", newRegistry);
      setNewRegistry(emptyRegistry);
      setIsCreatingRegistry(false);
    }
    
    
    
  }

  const handleEditRegistry=async (index)=>{
    if (editingRegistryIndex === index) {
      //aquí se hace el update
      try{
        const data = await updateRegistry(registryCopy.id, registryCopy);

        setRegistros(prev =>
          prev.map((item, i) => i === index ? registryCopy : item)
        );
        
      }catch (error) {
        console.error("Error al editar el registro:", error);
      }
      setRegistryCopy(null);
        setEditingRegistryIndex(-1);
    }else{
      setRegistryCopy(registros[index]);
      setEditingRegistryIndex(index);
    }
              

    

  }
  const handleDeleteRegistry = async (id) => {
    try{
      const data = await deleteRegistry(id);
      console.log("Registro eliminado:", data);
      if (data){
        setRegistros(registros.filter((item, i) => item.id !== id));
        console.log("Registro eliminado correctamente");
      }
    }catch (error) {
      console.error("Error al eliminar el registro:", error);
    }
    
  }

  const sectionTitles = {
    reporta: reportaTitles,
    afectado: afectadaTitles,
    agresor: agresorTitles,
    detalles: detallesTitles,
  };

  const renderAccordionSection = (sectionKey, startIndex, endIndex, title) => (
    <Accordion style={{ backgroundColor: "#f5f5f5", marginBottom: "10px" }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        style={{ backgroundColor: "#e0e0e0" }}
      >
        <Typography style={{ fontSize: "20px", fontWeight: "bold" }}>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails style={{ padding: "20px", fontSize: "18px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            {dataTitles
              .slice(startIndex, endIndex)
              .map(( key, index) => (
                <tr key={key} className="border border-gray-300">
                  <td
                    style={{
                      padding: "8px",
                      border: "1px solid #ccc",
                      fontWeight: "bold",
                    }}
                  >
                    {sectionTitles[sectionKey][index]}
                  </td>
                  <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                    {!editMode ? (
                      quejaCopy[key]
                    ) : (
                      <input
                        value={quejaCopy[key]}
                        onChange={(e) => changeDetails(key, e.target.value)}
                      />
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </AccordionDetails>
    </Accordion>
  );

  

const renderHistorial = () => (
  <>
    {registros.map((registro, index) => (
      <div
        key={index}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px", // Espacio entre tarjeta y botones
        }}
      >
        {/* Tarjeta */}
        <div
          style={{
            border: "1px solid black",
            borderRadius: "8px",
            backgroundColor: "white",
            padding: "10px 15px",
            maxWidth: "400px",
            lineHeight: "1.4",
          }}
        >
          <p>
            <strong>Fecha:</strong> {registro.fecha}
          </p>
          <p>
            <strong>Tipo:</strong> {editingRegistryIndex===index?<input value={registryCopy.tipo} onChange={(e)=>onEditRegistry("tipo",e.target.value)}/>:registro.tipo}
          </p>
          <p>
            <strong>Descripción:</strong>
          </p>
          <p>{editingRegistryIndex===index?<input value={registryCopy.descripcion}onChange={(e)=>onEditRegistry("descripcion",e.target.value)}/>:registro.descripcion}</p>
        </div>

        {/* Botones */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "5px",
          }}
        >
          <button
            style={{
              background: "orange",
              color: "white",
              border: "none",
              padding: "6px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={(e)=>{handleEditRegistry(index)}}
            
          >
            {editingRegistryIndex===index?"Guardar":<FaPencilAlt />}
          </button>
          {(editingRegistryIndex===index)&&<button onClick={(e)=>{setRegistryCopy(null);setEditingRegistryIndex(-1)}}>Cancelar</button> }
          <button
            style={{
              background: "red",
              color: "white",
              border: "none",
              padding: "6px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={() => handleDeleteRegistry(registro.id)}
          >
            <FaTrash />
          </button>
        </div>
      </div>
    ))}
  </>
);

  

  return (
    <div
      className="details-container"
      style={{
        background: "white",
        padding: "20px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        margin: "20px",
      }}
    >
      <h1 className="text-3xl font-bold mb-6">Detalles de la queja</h1>
      {renderAccordionSection(
        "reporta",
        0,
        12,
        "Información de la persona que reporta"
      )}
      {renderAccordionSection(
        "afectado",
        12,
        33,
        "Información de la persona afectada"
      )}
      {renderAccordionSection(
        "agresor",
        33,
        47,
        "Información de la persona agresora"
      )}
      {renderAccordionSection("detalles",47 , 54, "Información adicional")}


      <Accordion style={{ backgroundColor: "#f5f5f5", marginBottom: "10px" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          style={{ backgroundColor: "#e0e0e0" }}
        >
          <Typography style={{ fontSize: "20px", fontWeight: "bold" }}>
            Historial
          </Typography>
        </AccordionSummary>
          <AccordionDetails style={{ padding: "20px", fontSize: "18px" }}>
            <div style={{ justifyContent: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
              <button onClick={(e)=>setIsCreatingRegistry(!isCreatingRegistry)} >Añadir Registro</button>
              {isCreatingRegistry && (
                <>
                <div
                  
                  style={{
                    display: "flex",
                    background: "white",
                    padding: "20px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    margin: "20px",
                    gap: "10px",
                    flexDirection: "column",

                    maxWidth: "400px",
                    maxHeight: "300px",
                    minHeight: "200px",
                    minWidth: "300px",
                  }}
                >
                  <input
                    value={newRegistry.fecha} disabled={true}/>

                  <input
                    value={newRegistry.tipo}
                    onChange={( e) => onChangeNewRegistry("tipo", e.target.value)}
                  />
                  <input
                    value={newRegistry.descripcion}
                    onChange={( e) => onChangeNewRegistry("descripcion", e.target.value)}
                  />

                  
                </div>
                <button onClick={handleAddRegistry}>Crear Registro</button>
                </>
              )}
              {renderHistorial()}
            </div>    
          </AccordionDetails>
      </Accordion>



      

      <div className="mt-5 flex justify-center gap-2">
        {/*<button
          onClick={() => setIsDeleteModalOpen(true)}
          className="bg-red-600 text-white px-5 py-2.5 rounded cursor-pointer hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          Borrar
        </button>*/}

        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={sendDelete}
          message="¿Estás seguro de que deseas eliminar esta queja?"
          title="Confirmar eliminación"
        />
        <button
          onClick={() => setEditMode(!editMode)}
          className="bg-red-600 text-white px-5 py-2.5 rounded cursor-pointer hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          {editMode ? "Cancelar Edición" : "Editar"}
        </button>
        {editMode && (
          <button
            onClick={() => setOpenModal(!openModal)}
            className="bg-red-600 text-white px-5 py-2.5 rounded cursor-pointer hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Guardar
          </button>
        )}
      </div>

      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md text-center">
            <h2>¿Desea guardar los cambios?</h2>
            <button
              onClick={sendEdit}
              className="bg-red-500 text-white px-5 py-2.5 rounded cursor-pointer hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Sí, guardar
            </button>
            <button
              onClick={() => setOpenModal(!openModal)}
              className="bg-red-500 text-white px-5 py-2.5 rounded cursor-pointer hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintsDetails;
