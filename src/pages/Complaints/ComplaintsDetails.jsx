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
  updateComplaintStatus,
  updateComplaintPriority,
} from "../../api";
import DeleteModal from "../../components/DeleteModal";
import DownloadComplaintButton from "../../components/DownloadComplaitButton";
import { FaPencilAlt, FaTrash, FaPlus, FaSave, FaTimes } from "react-icons/fa";
import LoadingSpinner from "../../components/LoadingSpinner";

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
  const [isLoading, setIsLoading] = useState(false);

  const emptyRegistry = {
    fecha: new Date().toLocaleDateString('es-ES'),
    queja_id: id,
    tipo: "",
    descripcion: ""
  };

  const [newRegistry, setNewRegistry] = useState(emptyRegistry);
  const [editingRegistryIndex, setEditingRegistryIndex] = useState(-1);
  const [registryCopy, setRegistryCopy] = useState(null);
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [isChangingPriority, setIsChangingPriority] = useState(false);

  // Arrays de campos - COMPLETOS
  const dataTitles = [
    // Persona que reporta (0-11)
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

    // Persona afectada (12-42)
    "afectado_nombre",
    "afectado_sexo",
    "afectado_edad",
    "afectado_tipo_documento_identidad",
    "afectado_documento_identidad",
    "afectado_codigo",
    "afectado_semestre",
    "afectado_direccion",
    "afectado_barrio",
    "afectado_ciudad_origen",
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
    "afectado_ha_hecho_denuncia",
    "afectado_denuncias_previas",
    "afectado_redes_apoyo",
    "afectado_tipo_vbg_os",
    "afectado_detalles_caso",

    // Persona agresora (43-63)
    "agresor_nombre",
    "agresor_sexo",
    "agresor_edad",
    "agresor_semestre",
    "agresor_barrio",
    "agresor_ciudad_origen",
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
    "agresor_factores_riesgo",
    "agresor_tiene_denuncias",
    "agresor_detalles_denuncias",
        
    // Detalles generales (63-56)
    "desea_activar_ruta_atencion_integral",
    "recibir_asesoria_orientacion_sociopedagogica",
    "orientacion_psicologica",
    "asistencia_juridica",
    "acompañamiento_solicitud_medidas_proteccion_inicial",
    "acompañamiento_ante_instancias_gubernamentales",
    //"interponer_queja_al_comite_asusntos_internos_disciplinarios",
    "interponer_queja_al_cade", 
    "interponer_queja_oficina_control_interno",
    "interponer_queja_a_rectoria",
    "observaciones"
  ];

  const reportaTitles = [
    "Fecha de recepción de la solicitud",
    "Nombre completo",
    "Sexo",
    "Edad",
    "Estamento",
    "Vicerrectoría a la que se encuentra adscrito/a",
    "Dependencia",
    "Programa académico",
    "Facultad",
    "Sede",
    "Número de celular",
    "Correo electrónico"
  ];

  const afectadaTitles = [
    "Nombre completo",
    "Sexo",
    "Edad",
    "Tipo de documento de identidad",
    "Número de documento de identidad",
    "Código estudiantil o identificador",
    "Semestre en el que se encuentra",//numero
    "Dirección",
    "Barrio",
    "Ciudad de origen",
    "Comuna de residencia",
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
    "Número de celular",
    "Correo electrónico",
    "¿Ha hecho denuncias previamente?", //sino
    "Denuncias hechas previamente",
    "Redes de apoyo",
    "Tipo de violencia basada en género u orientación sexual",
    "Detalles específicos del caso"
  ];

  const agresorTitles = [
    "Nombre completo",
    "Sexo",
    "Edad",
    "Semestre en el que se encuentra", //numero
    "Barrio",
    "Ciudad de origen",
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
    "Factores de riesgo",
    "¿Tiene denuncias previas?", //sino
    "Denuncias previas",
  ];

  const detallesTitles = [
    "¿Desea activar la ruta de atención integral?",
    "¿Requiere recibir asesoría y orientación socio-pedagógica?",
    "¿Requiere recibir orientación psicológica?",
    "¿Requiere recibir asistencia jurídica?",
    "¿Requiere recibir acompañamiento para solicitud de medidas de protección inicial?",
    "¿Requiere recibir acompañamiento ante instancias gubernamentales?",
    //"¿Requiere interponer una queja formal al Comité de Asuntos Internos Disciplinarios?",
    "¿Requiere interponer una queja formal al Comité de Asuntos Disciplinarios Estudiantiles (CADE)?",
    "¿Requiere interponer queja ante la oficina de control interno?",
    "¿Requiere interpones queja ante la Rectoría?",
    "Observaciones adicionales"
  ];

  const statusOptions = ["Recepción", "Identificación", "Direccionamiento", "Remisión externa", "Seguimiento", "Cerrado"];
  const prioritysOptions = ["Pendiente", "Baja", "Media", "Alta", "Crítica"];

  // Opciones para selects
  const opcionesSiNo = ["Sí", "No"];
  const opcionesSexo = ["Masculino", "Femenino", "Otro", "Prefiero no decir"];
  const opcionesEstamento = ["Estudiante", "Docente", "Administrativo", "Directivo", "Externo"];
  const opcionesEstrato = ["1", "2", "3", "4", "5", "6"];
  const opcionesEtnia = ["Afrodescendiente", "Indígena", "Mestizo", "Blanco", "Otro", "Prefiero no decir"];
  const opcionesDiscapacidad = ["Física", "Visual", "Auditiva", "Intelectual", "Psicosocial", "Múltiple", "Ninguna"];
  const opcionesGenero = ["Cisgénero", "Transgénero", "No binario", "Otro", "Prefiero no decir"];
  const opcionesOrientacion = ["Heterosexual", "Homosexual", "Bisexual", "Pansexual", "Asexual", "Otro", "Prefiero no decir"];
  const opcionesTipoVBG = [
    "Violencia física",
    "Violencia psicológica",
    "Violencia sexual",
    "Violencia económica",
    "Acoso sexual",
    "Discriminación por orientación sexual",
    "Discriminación por identidad de género",
    "Otra forma de violencia"
  ];
  const opcionesTipoOrientacion = ["Asesoría jurídica", "Apoyo psicológico", "Otro"];

  useEffect(() => {
    const loadDetails = async () => {
      setIsLoading(true);
      try {
        const data = await getComplaintDetails(id);
        setQuejaDetails(data);
        setQuejaCopy(data);

        const dataRegistros = await getRegistryList(id);
        setRegistros(dataRegistros);
      } catch (error) {
        console.error("Error getting details:", error);
      } finally {
        setIsLoading(false);
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
  };

  const onEditRegistry = (field, value) => {
    setRegistryCopy({
      ...registryCopy,
      [field]: value,
    });
  };

  const sendEdit = async () => {
    setIsLoading(true);
    try {
      const data = await updateComplaint(id, quejaCopy);
      setQuejaDetails(data);
      setOpenModal(false);
      setEditMode(false);
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al actualizar la queja");
    } finally {
      setIsLoading(false);
    }
  };

  const sendDelete = async () => {
    setIsLoading(true);
    try {
      await deleteComplaint(id);
      navigate("/quejas/lista");
    } catch (error) {
      console.error("Error:", error);
      alert("Ocurrió un error al eliminar la queja");
    } finally {
      setIsDeleteModalOpen(false);
      setIsLoading(false);
    }
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleAddRegistry = async () => {
    if (!newRegistry.tipo || !newRegistry.descripcion) {
      alert("Por favor completa todos los campos del registro");
      return;
    }

    setIsLoading(true);
    try {
      const data = await createRegistry(newRegistry);
      if (data) {
        setRegistros([...registros, data]);
        setNewRegistry(emptyRegistry);
        setIsCreatingRegistry(false);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditRegistry = async (index) => {
    if (editingRegistryIndex === index) {
      if (!registryCopy.tipo || !registryCopy.descripcion) {
        alert("Por favor completa todos los campos del registro");
        return;
      }

      setIsLoading(true);
      try {
        const data = await updateRegistry(registryCopy.id, registryCopy);
        setRegistros(prev =>
          prev.map((item, i) => i === index ? data : item)
        );
      } catch (error) {
        console.error("Error al editar el registro:", error);
      } finally {
        setRegistryCopy(null);
        setEditingRegistryIndex(-1);
        setIsLoading(false);
      }
    } else {
      setRegistryCopy(registros[index]);
      setEditingRegistryIndex(index);
    }
  };

  const handleDeleteRegistry = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este registro?")) {
      return;
    }

    setIsLoading(true);
    try {
      const data = await deleteRegistry(id);
      if (data) {
        setRegistros(registros.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error("Error al eliminar el registro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateComplaintStatus = async (estado) => {
    setIsLoading(true);
    try {
      const data = await updateComplaintStatus(id, estado);
      setQuejaDetails(data);
      setQuejaCopy(data);
    } catch (error) {
      setQuejaCopy(quejaDetails);
      console.error("Error al actualizar el estado de la queja:", error);
    } finally {
      setIsChangingStatus(false);
      setIsLoading(false);
    }
  };
  const handleUpdateComplaintPriority = async (prioridad) => {
    setIsLoading(true);
    try {
      const data = await updateComplaintPriority(id, prioridad);
      setQuejaDetails(data);
      setQuejaCopy(data);
    } catch (error) {
      setQuejaCopy(quejaDetails);
      console.error("Error al actualizar la prioridad de la queja:", error);
    } finally {
      setIsChangingPriority(false);
      setIsLoading(false);
    }
  };

  // Función para renderizar el campo apropiado según el tipo
  const renderField = (key, value, index, sectionKey) => {
    if (!editMode) {
      return <p className="text-base text-gray-900">{value || "No especificado"}</p>;
    }

    // Determinar qué tipo de input usar basado en el campo
    const getInputType = (key) => {
      if (key.includes('correo')) return 'email';
      if (key.includes('celular') || key.includes('edad') || key.includes('codigo')) return 'tel';
      if (key.includes('fecha')) return 'date';
      return 'text';
    };

    const getSelectOptions = (key) => {
      if (key.includes('sexo')) return opcionesSexo;
      if (key.includes('estamento')) return opcionesEstamento;
      if (key.includes('estrato')) return opcionesEstrato;
      if (key.includes('etnico_racial')) return opcionesEtnia;
      if (key.includes('discapacidad') && !key.includes('tiene')) return opcionesDiscapacidad;
      if (key.includes('identidad_genero')) return opcionesGenero;
      if (key.includes('orientacion_sexual')) return opcionesOrientacion;
      if (key.includes('tipo_vbg')) return opcionesTipoVBG;
      if (key.includes('desea_') || key.includes('recibir_') || key.includes('orientacion_') ||
        key.includes('asistencia_') || key.includes('acompañamiento_') || key.includes('interponer_')) {
        return opcionesSiNo;
      }
      if (key.includes("¿Ha hecho denuncias previamente?")) return opcionesSiNo;
      if (key.includes("¿Tiene denuncias previas?")) return opcionesSiNo;
      return null;
    };

    const options = getSelectOptions(key);

    if (options) {
      return (
        <select
          value={value || ''}
          onChange={(e) => changeDetails(key, e.target.value)}
          className="w-full px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        >
          <option value="">Seleccionar...</option>
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      );
    }

    if (key.includes('detalles_caso') || key.includes('observaciones')) {
      return (
        <textarea
          value={value || ''}
          onChange={(e) => changeDetails(key, e.target.value)}
          rows="4"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
          placeholder={`Ingrese ${sectionTitles[sectionKey][index].toLowerCase()}...`}
        />
      );
    }

    return (
      <input
        type={getInputType(key)}
        value={value || ''}
        onChange={(e) => changeDetails(key, e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        placeholder={`Ingrese ${sectionTitles[sectionKey][index].toLowerCase()}...`}
      />
    );
  };

  if (!quejaDetails || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner
          message={!quejaDetails ? "Cargando detalles de la queja..." : "Procesando..."}
          size="large"
        />
      </div>
    );
  }

  const sectionTitles = {
    reporta: reportaTitles,
    afectado: afectadaTitles,
    agresor: agresorTitles,
    detalles: detallesTitles,
  };

  const renderAccordionSection = (sectionKey, startIndex, endIndex, title) => (
    <Accordion className="mb-4 shadow-lg border-0 rounded-lg overflow-hidden">
      <AccordionSummary
        expandIcon={<ExpandMoreIcon className="text-gray-600" />}
        className="bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 transition-all duration-200"
      >
        <Typography className="text-xl font-bold text-gray-800">
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails className="p-6 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {dataTitles.slice(startIndex, endIndex).map((key, index) => (
            <div key={key} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {sectionTitles[sectionKey][index]}
              </label>
              <div className="text-gray-900">
                {renderField(key, quejaCopy[key], index, sectionKey)}
              </div>
            </div>
          ))}
        </div>
      </AccordionDetails>
    </Accordion>
  );

  const renderHistorial = () => (
    <div className="space-y-6">
      {registros.map((registro, index) => (
        <div
          key={registro.id || index}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
        >
          {/* Tarjeta del registro */}
          <div className="flex-1 min-w-0">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-sm font-semibold text-gray-700 min-w-20">Fecha:</span>
                <span className="text-gray-900 bg-blue-50 px-3 py-1 rounded-full text-sm">
                  {registro.fecha}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-sm font-semibold text-gray-700 min-w-20">Tipo:</span>
                {editingRegistryIndex === index ? (
                  <select
                    value={registryCopy.tipo || ''}
                    onChange={(e) => onEditRegistry("tipo", e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {opcionesTipoOrientacion.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <span className="text-gray-900 bg-red-50 px-3 py-1 rounded-full text-sm font-medium">
                    {registro.tipo}
                  </span>
                )}
              </div>

              <div>
                <span className="text-sm font-semibold text-gray-700 block mb-2">
                  Descripción:
                </span>
                {editingRegistryIndex === index ? (
                  <textarea
                    value={registryCopy.descripcion}
                    onChange={(e) => onEditRegistry("descripcion", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                    rows="3"
                    placeholder="Descripción del registro..."
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 rounded-lg p-3 text-sm leading-relaxed">
                    {registro.descripcion}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex sm:flex-col gap-2 sm:min-w-32">
            <button
              onClick={() => handleEditRegistry(index)}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${editingRegistryIndex === index
                  ? "bg-green-600 hover:bg-green-700 text-white shadow-md"
                  : "bg-orange-500 hover:bg-orange-600 text-white shadow-md"
                }`}
            >
              {editingRegistryIndex === index ? <FaSave size={14} /> : <FaPencilAlt size={14} />}
              <span className="text-sm">{editingRegistryIndex === index ? "Guardar" : "Editar"}</span>
            </button>

            {editingRegistryIndex === index && (
              <button
                onClick={() => { setRegistryCopy(null); setEditingRegistryIndex(-1); }}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 shadow-md"
              >
                <FaTimes size={14} />
                <span className="text-sm">Cancelar</span>
              </button>
            )}

            <button
              onClick={() => handleDeleteRegistry(registro.id)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 shadow-md"
            >
              <FaTrash size={14} />
              <span className="text-sm">Eliminar</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {isLoading && (
        <LoadingSpinner
          message="Procesando..."
          overlay={true}
        />
      )}

      <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
<div className="mb-8">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
    <div className="flex-1">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        📋 Detalles de la queja
      </h1>
      <p className="text-gray-600 text-sm">ID: {id}</p>
    </div>
    
    {/* Botón de descarga a la derecha */}
    <DownloadComplaintButton 
      complaint={quejaDetails} 
      registros={registros} 
    />
  </div>
  <div className="w-20 h-1 bg-red-600 rounded-full"></div>
</div>

          {/* Estado de la queja */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-lg font-semibold text-gray-700">Estado actual:</span>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${quejaCopy.estado === "Pendiente" ? "bg-yellow-100 text-yellow-800 border border-yellow-200" :
                    quejaCopy.estado === "Aprobado" ? "bg-green-100 text-green-800 border border-green-200" :
                      quejaCopy.estado === "En Proceso" ? "bg-blue-100 text-blue-800 border border-blue-200" :
                        quejaCopy.estado === "Finalizado" ? "bg-gray-100 text-gray-800 border border-gray-200" :
                          "bg-purple-100 text-purple-800 border border-purple-200"
                  }`}>
                  {quejaCopy.estado}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <span className="text-sm font-medium text-gray-600 whitespace-nowrap">Cambiar estado:</span>
                <select
                  value={quejaCopy.estado}
                  onChange={(e) => {
                    setQuejaCopy({ ...quejaCopy, estado: e.target.value });
                    setIsChangingStatus(true);
                  }}
                  className="px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>

                {isChangingStatus && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateComplaintStatus(quejaCopy.estado)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 shadow-md"
                    >
                      ✅ Confirmar
                    </button>
                    <button
                      onClick={() => {
                        setIsChangingStatus(false);
                        setQuejaCopy({ ...quejaCopy, estado: quejaDetails.estado });
                      }}
                      className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 shadow-md"
                    >
                      ❌ Cancelar
                    </button>
                  </div>
                )}
              </div>
            </div>
            {/* Prioridad*/}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-lg font-semibold text-gray-700">Prioridad actual:</span>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${quejaCopy.estado === "Pendiente" ? "bg-yellow-100 text-yellow-800 border border-yellow-200" :
                    quejaCopy.estado === "Aprobado" ? "bg-green-100 text-green-800 border border-green-200" :
                      quejaCopy.estado === "En Proceso" ? "bg-blue-100 text-blue-800 border border-blue-200" :
                        quejaCopy.estado === "Finalizado" ? "bg-gray-100 text-gray-800 border border-gray-200" :
                          "bg-purple-100 text-purple-800 border border-purple-200"
                  }`}>
                  {quejaCopy.prioridad}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <span className="text-sm font-medium text-gray-600 whitespace-nowrap">Cambiar prioridad:</span>
                <select
                  value={quejaCopy.prioridad}
                  onChange={(e) => {
                    setQuejaCopy({ ...quejaCopy, prioridad: e.target.value });
                    setIsChangingPriority(true);
                  }}
                  className="px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                >
                  {prioritysOptions.map((priority) => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>

                {isChangingPriority && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateComplaintPriority(quejaCopy.prioridad)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 shadow-md"
                    >
                      ✅ Confirmar
                    </button>
                    <button
                      onClick={() => {
                        setIsChangingPriority(false);
                        setQuejaCopy({ ...quejaCopy, prioridad: quejaDetails.prioridad });
                      }}
                      className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 shadow-md"
                    >
                      ❌ Cancelar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Secciones de información */}
          {renderAccordionSection("reporta", 0, 12, "👤 Persona que Reporta")}
          {renderAccordionSection("afectado", 12, 42, "🎯 Persona Afectada")}
          {renderAccordionSection("agresor", 42, 62, "⚠️ Persona Agresora")}
          {renderAccordionSection("detalles", 62, 73, "📋 Información Adicional y Servicios Solicitados")}
          {/* Historial */}
          {/* Historial */}
          <Accordion className="mb-8 shadow-lg border-0 rounded-lg overflow-hidden">
            <AccordionSummary
              expandIcon={<ExpandMoreIcon className="text-gray-600" />}
              className="bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200"
            >
              <Typography className="text-xl font-bold text-gray-800">
                📝 Historial de atenciones ({registros.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails className="p-6 bg-white">
              <div className="space-y-6">
                {/* Botón para añadir registro */}
                <div className="flex justify-center">
                  <button
                    onClick={() => setIsCreatingRegistry(!isCreatingRegistry)}
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                  >
                    <FaPlus />
                    {isCreatingRegistry ? "❌ Cancelar" : "➕ Añadir Registro"}
                  </button>
                </div>

                {/* Formulario para nuevo registro */}
                {isCreatingRegistry && (
                  <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border-2 border-dashed border-red-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">➕ Nuevo Registro</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          📅 Fecha
                        </label>
                        <input
                          value={newRegistry.fecha}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          🏷️ Tipo de Registro
                        </label>

                        <select
                          value={newRegistry.tipo || ''}
                          onChange={(e) => onChangeNewRegistry("tipo", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <option value="">Seleccionar...</option>
                          {opcionesTipoOrientacion.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>

                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        📄 Descripción
                      </label>
                      <textarea
                        value={newRegistry.descripcion}
                        onChange={(e) => onChangeNewRegistry("descripcion", e.target.value)}
                        placeholder="Describe los detalles del registro, acciones tomadas, observaciones importantes..."
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                      />
                    </div>
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setIsCreatingRegistry(false)}
                        className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleAddRegistry}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2 font-medium"
                      >
                        <FaSave />
                        Crear Registro
                      </button>
                    </div>
                  </div>
                )}

                {/* Lista de registros existentes */}
                {registros.length > 0 ? (
                  renderHistorial()
                ) : (
                  <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                    <div className="text-6xl mb-4">📝</div>
                    <p className="text-lg font-medium text-gray-600">No hay registros de la atención</p>
                    <p className="text-sm text-gray-500 mt-2">Agrega el primer registro usando el botón superior</p>
                  </div>
                )}
              </div>
            </AccordionDetails>
          </Accordion>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 p-6 bg-white rounded-xl shadow-md border border-gray-200">
            <button
              onClick={() => setEditMode(!editMode)}
              className={`px-8 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg font-medium ${editMode
                  ? "bg-gray-600 hover:bg-gray-700 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
                }`}
            >
              {editMode ? "❌ Cancelar Edición" : "✏️ Editar Queja"}
            </button>

            {editMode && (
              <button
                onClick={() => setOpenModal(true)}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg font-medium"
              >
                💾 Guardar Cambios
              </button>
            )}

            <button
              onClick={openDeleteModal}
              className="px-8 py-3 bg-red-800 hover:bg-red-900 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg font-medium"
            >
              🗑️ Eliminar Queja
            </button>
          </div>
        </div>
      </div>

      {/* Modal de confirmación para guardar cambios */}
      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <div className="text-center mb-2">
              <div className="text-4xl mb-4">💾</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Confirmar Cambios</h3>
              <p className="text-gray-600">¿Estás seguro de que deseas guardar los cambios realizados en esta queja?</p>
            </div>
            <div className="flex gap-3 justify-center mt-6">
              <button
                onClick={() => setOpenModal(false)}
                className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={sendEdit}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 font-medium"
              >
                Sí, Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de eliminación */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={sendDelete}
        message="¿Estás seguro de que deseas eliminar esta queja? Esta acción no se puede deshacer y se perderán todos los datos asociados."
        title="Confirmar Eliminación"
      />
    </>
  );
};

export default ComplaintsDetails;