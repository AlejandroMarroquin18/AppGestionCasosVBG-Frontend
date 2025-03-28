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
} from "../../api";
import DeleteModal from "../../components/DeleteModal";

const ComplaintsDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [quejaDetails, setQuejaDetails] = useState(null);
  const [quejaCopy, setQuejaCopy] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
    "reporta_correo",
    //persona afectada
    "afectado_nombre",
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
    "afectado_detalles_caso",

    //persona agresora
    "agresor_nombre",
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
    "agresor_sede",
    //detalles generales
    "desea_activar_ruta_atencion_integral",
    "recibir_asesoria_orientacion_sociopedagogica",
    "orientacion_psicologica",
    "asistencia_juridica",
    "acompañamiento_solicitud_medidas_proteccion_inicial",
    "acompañamiento_ante_instancias_gubernamentales",
    "interponer_queja_al_comite_asusntos_internos_disciplinarios",
    "observaciones",
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
    //'Código' ,
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
            {Object.entries(quejaDetails)
              .slice(startIndex, endIndex)
              .map(([key, value], index) => (
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
                      value
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
        10,
        22,
        "Información de la persona que reporta"
      )}
      {renderAccordionSection(
        "afectado",
        22,
        41,
        "Información de la persona afectada"
      )}
      {renderAccordionSection(
        "agresor",
        42,
        56,
        "Información de la persona agresora"
      )}
      {renderAccordionSection("detalles", 56, 64, "Información adicional")}

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
