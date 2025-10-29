import getCSRFToken from "./helpers/getCSRF";

//export const baseURL = process.env.REACT_APP_API_URL;
export const baseURL = "http://192.168.20.58:8000/api";

/*------------------ SOLICITUDES DE TALLERES ------------------*/

// Obtener TODOS los talleres
export const getWorkshops = async () => {
  const response = await fetch(`${baseURL}/talleres/`, {
    method: "GET",
    headers: {
      "Authorization": `Token ${localStorage.getItem("userToken")}`,
      "X-CSRFToken": getCSRFToken(),
    },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

// Obtener los detalles de un taller específico (ID)
export const getWorkshopDetails = async (workshopId) => {
  const response = await fetch(`${baseURL}/talleres/${workshopId}/`, {
    method: "GET",
    headers: {
      "Authorization": `Token ${localStorage.getItem("userToken")}`,
      "X-CSRFToken": getCSRFToken(),
    },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`Failed to get with status: ${response.status}`);
  }
  return response.json();
};

//crear un taller
export const createWorkshop = async (workshopData) => {
  try {
    const response = await fetch(`${baseURL}/talleres/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${localStorage.getItem("userToken")}`,
        "X-CSRFToken": getCSRFToken(),
      },
      body: JSON.stringify(workshopData),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error del backend:", errorData); // Log de la respuesta de error
      throw new Error(errorData.message || "Error desconocido");
    }

    return await response.json();  // Si la respuesta es correcta, devolver los datos
  } catch (error) {
    console.error("Error al enviar la solicitud:", error);
    throw error;
  }
};

// Actualizar los detalles de un taller
export const updateWorkshop = async (workshopId, workshopData) => {
  const response = await fetch(`${baseURL}/talleres/${workshopId}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${localStorage.getItem("userToken")}`,
      "X-CSRFToken": getCSRFToken(),
    },
    body: JSON.stringify(workshopData),
    credentials: "include",
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Error al guardar los cambios: ${errorData.message}`);
  }
  return response.json();
};

// Eliminar un taller
// api.js
export const deleteWorkshop = async (workshopId, cancellationReason = "Por motivos organizativos") => {
  const response = await fetch(`${baseURL}/talleres/${workshopId}/`, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Token ${localStorage.getItem("userToken")}`,
      "X-CSRFToken": getCSRFToken(),
    },
    body: JSON.stringify({
      cancellation_reason: cancellationReason
    }),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete the workshop");
  }
  return true;
};

// Función para registrar un participante en un taller
export const registerExternalParticipant = async (workshopId, participantData) => {
  const response = await fetch(`${baseURL}/talleres/inscripcion/${workshopId}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCSRFToken(),
    },
    body: JSON.stringify(participantData),
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Error al inscribirse: ${errorData.message}`);
  }

  return response.json();
};

/*------------------ SOLICITUDES DE QUEJAS ------------------*/

// Obtener TODAS las quejas
// api.js - ACTUALIZAR LA FUNCIÓN getComplaints
export const getComplaints = async () => {
  const response = await fetch(`${baseURL}/quejas/`, {
    method: "GET",
    headers: {
      "Authorization": `Token ${localStorage.getItem("userToken")}`,
      "X-CSRFToken": getCSRFToken(),
    },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Error getting complaints");
  }
  const data = await response.json();

  // Transformar los datos para mantener compatibilidad con el frontend
  return data.map(queja => ({
    ...queja,
    // Mapear campos antiguos a los nuevos
    afectado_nombre: queja.persona_afectada?.nombre || 'No especificado',
    afectado_sede: queja.persona_afectada?.sede || 'No especificado',
    afectado_codigo: queja.persona_afectada?.codigo || 'N/A',
    afectado_facultad: queja.persona_afectada?.facultad || 'No especificado',
    fecha_recepcion: queja.persona_reporta?.fecha_recepcion || 'No especificado',
    // Mantener campos que ya existen en la queja
    id: queja.id,
    estado: queja.estado,
    prioridad: queja.prioridad
  }));
};

// Obtener los detalles de una queja específica (ID)
// api.js - ACTUALIZAR LA FUNCIÓN getComplaintDetails
export const getComplaintDetails = async (id) => {
  const response = await fetch(`${baseURL}/quejas/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${localStorage.getItem("userToken")}`,
      "X-CSRFToken": getCSRFToken(),
    },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Error getting complaint details");
  }
  const data = await response.json();

  // Transformar los datos para mantener compatibilidad
  return {
    ...data,
    // Mapear campos antiguos a los nuevos para mantener compatibilidad
    fecha_recepcion: data.persona_reporta?.fecha_recepcion || '',
    reporta_nombre: data.persona_reporta?.nombre || '',
    reporta_sexo: data.persona_reporta?.sexo || '',
    reporta_edad: data.persona_reporta?.edad || '',
    reporta_estamento: data.persona_reporta?.estamento || '',
    reporta_vicerrectoria_adscrito: data.persona_reporta?.vicerrectoria_adscrito || '',
    reporta_dependencia: data.persona_reporta?.dependencia || '',
    reporta_programa_academico: data.persona_reporta?.programa_academico || '',
    reporta_facultad: data.persona_reporta?.facultad || '',
    reporta_sede: data.persona_reporta?.sede || '',
    reporta_celular: data.persona_reporta?.celular || '',
    reporta_correo: data.persona_reporta?.correo || '',

    // Persona afectada
    afectado_nombre: data.persona_afectada?.nombre || '',
    afectado_sexo: data.persona_afectada?.sexo || '',
    afectado_edad: data.persona_afectada?.edad || '',
    afectado_tipo_documento_identidad: data.persona_afectada?.tipo_documento_identidad || '',
    afectado_documento_identidad: data.persona_afectada?.documento_identidad || '',
    afectado_codigo: data.persona_afectada?.codigo || '',
    afectado_semestre: data.persona_afectada?.semestre || null,
    afectado_direccion: data.persona_afectada?.direccion || '',
    afectado_barrio: data.persona_afectada?.barrio || '',
    afectado_ciudad_origen: data.persona_afectada?.ciudad_origen || '',
    afectado_comuna: data.persona_afectada?.comuna || '',
    afectado_estrato_socioeconomico: data.persona_afectada?.estrato_socioeconomico || '',
    afectado_condicion_etnico_racial: data.persona_afectada?.condicion_etnico_racial || '',
    afectado_tiene_discapacidad: data.persona_afectada?.tiene_discapacidad || '',
    afectado_tipo_discapacidad: data.persona_afectada?.tipo_discapacidad || '',
    afectado_identidad_genero: data.persona_afectada?.identidad_genero || '',
    afectado_orientacion_sexual: data.persona_afectada?.orientacion_sexual || '',
    afectado_estamento: data.persona_afectada?.estamento || '',
    afectado_vicerrectoria_adscrito: data.persona_afectada?.vicerrectoria_adscrito || '',
    afectado_dependencia: data.persona_afectada?.dependencia || '',
    afectado_programa_academico: data.persona_afectada?.programa_academico || '',
    afectado_facultad: data.persona_afectada?.facultad || '',
    afectado_sede: data.persona_afectada?.sede || '',
    afectado_celular: data.persona_afectada?.celular || '',
    afectado_correo: data.persona_afectada?.correo || '',
    afectado_ha_hecho_denuncia: data.persona_afectada?.ha_hecho_denuncia || '',
    afectado_denuncias_previas: data.persona_afectada?.denuncias_previas || '',
    afectado_redes_apoyo: data.persona_afectada?.redes_apoyo || '',
    afectado_tipo_vbg_os: data.persona_afectada?.tipo_vbg_os || '',
    afectado_detalles_caso: data.persona_afectada?.detalles_caso || '',

    // Persona acusada
    agresor_nombre: data.persona_acusada?.nombre || '',
    agresor_sexo: data.persona_acusada?.sexo || '',
    agresor_edad: data.persona_acusada?.edad || '',
    agresor_semestre: data.persona_acusada?.semestre || null,
    agresor_barrio: data.persona_acusada?.barrio || '',
    agresor_ciudad_origen: data.persona_acusada?.ciudad_origen || '',
    agresor_condicion_etnico_racial: data.persona_acusada?.condicion_etnico_racial || '',
    agresor_tiene_discapacidad: data.persona_acusada?.tiene_discapacidad || '',
    agresor_tipo_discapacidad: data.persona_acusada?.tipo_discapacidad || '',
    agresor_identidad_genero: data.persona_acusada?.identidad_genero || '',
    agresor_orientacion_sexual: data.persona_acusada?.orientacion_sexual || '',
    agresor_estamento: data.persona_acusada?.estamento || '',
    agresor_vicerrectoria_adscrito: data.persona_acusada?.vicerrectoria_adscrito || '',
    agresor_dependencia: data.persona_acusada?.dependencia || '',
    agresor_programa_academico: data.persona_acusada?.programa_academico || '',
    agresor_facultad: data.persona_acusada?.facultad || '',
    agresor_sede: data.persona_acusada?.sede || '',
    agresor_factores_riesgo: data.persona_acusada?.factores_riesgo || '',
    agresor_tiene_denuncias: data.persona_acusada?.tiene_denuncias || '',
    agresor_detalles_denuncias: data.persona_acusada?.detalles_denuncias || '',

    // Mantener los campos originales de la queja
    id: data.id,
    estado: data.estado,
    prioridad: data.prioridad,
    tipo_de_acompanamiento: data.tipo_de_acompanamiento,
    unidad: data.unidad,
    desea_activar_ruta_atencion_integral: data.desea_activar_ruta_atencion_integral,
    recibir_asesoria_orientacion_sociopedagogica: data.recibir_asesoria_orientacion_sociopedagogica,
    orientacion_psicologica: data.orientacion_psicologica,
    asistencia_juridica: data.asistencia_juridica,
    acompañamiento_solicitud_medidas_proteccion_inicial: data.acompañamiento_solicitud_medidas_proteccion_inicial,
    acompañamiento_ante_instancias_gubernamentales: data.acompañamiento_ante_instancias_gubernamentales,
    interponer_queja_al_comite_asusntos_internos_disciplinarios: data.interponer_queja_al_comite_asusntos_internos_disciplinarios,
    observaciones: data.observaciones
  };
};

// api.js - ACTUALIZAR LA FUNCIÓN updateComplaint
export const updateComplaint = async (id, complaintData) => {
  // Preparar los datos en el formato que espera el backend
  const formattedData = {
    // Campos de la queja principal
    estado: complaintData.estado,
    prioridad: complaintData.prioridad,
    tipo_de_acompanamiento: complaintData.tipo_de_acompanamiento,
    unidad: complaintData.unidad,
    desea_activar_ruta_atencion_integral: complaintData.desea_activar_ruta_atencion_integral,
    recibir_asesoria_orientacion_sociopedagogica: complaintData.recibir_asesoria_orientacion_sociopedagogica,
    orientacion_psicologica: complaintData.orientacion_psicologica,
    asistencia_juridica: complaintData.asistencia_juridica,
    acompañamiento_solicitud_medidas_proteccion_inicial: complaintData.acompañamiento_solicitud_medidas_proteccion_inicial,
    acompañamiento_ante_instancias_gubernamentales: complaintData.acompañamiento_ante_instancias_gubernamentales,
    interponer_queja_al_comite_asusntos_internos_disciplinarios: complaintData.interponer_queja_al_comite_asusntos_internos_disciplinarios,
    observaciones: complaintData.observaciones,

    // Datos de las personas relacionadas (si se están editando)
    persona_reporta: {
      fecha_recepcion: complaintData.fecha_recepcion,
      nombre: complaintData.reporta_nombre,
      sexo: complaintData.reporta_sexo,
      edad: complaintData.reporta_edad,
      estamento: complaintData.reporta_estamento,
      vicerrectoria_adscrito: complaintData.reporta_vicerrectoria_adscrito,
      dependencia: complaintData.reporta_dependencia,
      programa_academico: complaintData.reporta_programa_academico,
      facultad: complaintData.reporta_facultad,
      sede: complaintData.reporta_sede,
      celular: complaintData.reporta_celular,
      correo: complaintData.reporta_correo
    },
    persona_afectada: {
      nombre: complaintData.afectado_nombre,
      sexo: complaintData.afectado_sexo,
      edad: complaintData.afectado_edad,
      tipo_documento_identidad: complaintData.afectado_tipo_documento_identidad,
      documento_identidad: complaintData.afectado_documento_identidad,
      codigo: complaintData.afectado_codigo,
      semestre: complaintData.afectado_semestre,
      direccion: complaintData.afectado_direccion,
      barrio: complaintData.afectado_barrio,
      ciudad_origen: complaintData.afectado_ciudad_origen,
      comuna: complaintData.afectado_comuna,
      estrato_socioeconomico: complaintData.afectado_estrato_socioeconomico,
      condicion_etnico_racial: complaintData.afectado_condicion_etnico_racial,
      tiene_discapacidad: complaintData.afectado_tiene_discapacidad,
      tipo_discapacidad: complaintData.afectado_tipo_discapacidad,
      identidad_genero: complaintData.afectado_identidad_genero,
      orientacion_sexual: complaintData.afectado_orientacion_sexual,
      estamento: complaintData.afectado_estamento,
      vicerrectoria_adscrito: complaintData.afectado_vicerrectoria_adscrito,
      dependencia: complaintData.afectado_dependencia,
      programa_academico: complaintData.afectado_programa_academico,
      facultad: complaintData.afectado_facultad,
      sede: complaintData.afectado_sede,
      celular: complaintData.afectado_celular,
      correo: complaintData.afectado_correo,
      ha_hecho_denuncia: complaintData.afectado_ha_hecho_denuncia,
      denuncias_previas: complaintData.afectado_denuncias_previas,
      redes_apoyo: complaintData.afectado_redes_apoyo,
      tipo_vbg_os: complaintData.afectado_tipo_vbg_os,
      detalles_caso: complaintData.afectado_detalles_caso
    },
    persona_acusada: {
      nombre: complaintData.agresor_nombre,
      sexo: complaintData.agresor_sexo,
      edad: complaintData.agresor_edad,
      semestre: complaintData.agresor_semestre,
      barrio: complaintData.agresor_barrio,
      ciudad_origen: complaintData.agresor_ciudad_origen,
      condicion_etnico_racial: complaintData.agresor_condicion_etnico_racial,
      tiene_discapacidad: complaintData.agresor_tiene_discapacidad,
      tipo_discapacidad: complaintData.agresor_tipo_discapacidad,
      identidad_genero: complaintData.agresor_identidad_genero,
      orientacion_sexual: complaintData.agresor_orientacion_sexual,
      estamento: complaintData.agresor_estamento,
      vicerrectoria_adscrito: complaintData.agresor_vicerrectoria_adscrito,
      dependencia: complaintData.agresor_dependencia,
      programa_academico: complaintData.agresor_programa_academico,
      facultad: complaintData.agresor_facultad,
      sede: complaintData.agresor_sede,
      factores_riesgo: complaintData.agresor_factores_riesgo,
      tiene_denuncias: complaintData.agresor_tiene_denuncias,
      detalles_denuncias: complaintData.agresor_detalles_denuncias
    }
  };

  const response = await fetch(`${baseURL}/quejas/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${localStorage.getItem("userToken")}`,
      "X-CSRFToken": getCSRFToken(),
    },
    credentials: "include",
    body: JSON.stringify(formattedData),
  });
  if (!response.ok) {
    throw new Error("Error updating complaint");
  }
  return response.json();
};

export const updateComplaintStatus = async (id, status) => {
  const response = await fetch(`${baseURL}/quejas/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${localStorage.getItem("userToken")}`,
      "X-CSRFToken": getCSRFToken(),
    },
    credentials: "include",
    body: JSON.stringify({ estado: status }),
  });
  if (!response.ok) {
    console.log(response);
    throw new Error("Error updating complaint status");
  }
  return response.json();
};

export const deleteComplaint = async (id) => {
  const response = await fetch(`${baseURL}/quejas/${id}/`, {
    method: "DELETE",
    headers: {
      "Authorization": `Token ${localStorage.getItem("userToken")}`,
      "X-CSRFToken": getCSRFToken(),
    },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Error deleting complaint");
  }
  return true;
};



export const getComplaintStats = async () => {
  const response = await fetch(`${baseURL}/quejas/statistics/`, {
    method: "GET",
    headers: {
      "Authorization": `Token ${localStorage.getItem("userToken")}`,
      "X-CSRFToken": getCSRFToken(),
    },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Error getting complaint statistics");
  }
  return response.json();
}



export const saveEvent = async (eventData) => {


  try {
    const response = await fetch(`${baseURL}/events/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error del backend:", errorData); // Log de la respuesta de error
      throw new Error(errorData.message || "Error desconocido");
    }

    return await response.json();  // Si la respuesta es correcta, devolver los datos
  } catch (error) {
    console.error("Error al enviar la solicitud:", error);
    throw error;
  }


}

export const getRegistryList = async (complaintId) => {
  try {
    const response = await fetch(`${baseURL}/quejas/historial-quejas/${complaintId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFToken(), // 
          "Authorization": `Token ${localStorage.getItem("userToken")}`,//solo si es en desarrollo
        },
      }

    );
    if (!response.ok) {
      throw new Error("Error al obtener el historial de quejas");
    }
    return await response.json();
  } catch (error) {
    console.error("Error al obtener el historial de quejas:", error);
    throw error;
  }
}

export const createRegistry = async (registryData) => {
  try {
    const response = await fetch(`${baseURL}/quejas/historial-quejas/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCSRFToken(), // 
        "Authorization": `Token ${localStorage.getItem("userToken")}`,//solo si es en desarrollo
      },
      body: JSON.stringify(registryData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error del backend:", errorData); // Log de la respuesta de error
      throw new Error(errorData.message || "Error desconocido");
    }

    return await response.json();  // Si la respuesta es correcta, devolver los datos
  } catch (error) {
    console.error("Error al enviar la solicitud:", error);
    throw error;
  }
}

export const updateRegistry = async (registryId, registryData) => {
  try {
    const response = await fetch(`${baseURL}/quejas/historial-queja/${registryId}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCSRFToken(), // 
        "Authorization": `Token ${localStorage.getItem("userToken")}`,//solo si es en desarrollo
      },
      body: JSON.stringify(registryData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error del backend:", errorData); // Log de la respuesta de error
      throw new Error(errorData.message || "Error desconocido");
    }

    return await response.json();  // Si la respuesta es correcta, devolver los datos
  } catch (error) {
    console.error("Error al enviar la solicitud:", error);
    throw error;
  }
}

export const deleteRegistry = async (registryId) => {
  try {
    const response = await fetch(`${baseURL}/quejas/historial-queja/${registryId}/`, {
      method: "DELETE",
      headers: {
        "X-CSRFToken": getCSRFToken(), // 
        "Authorization": `Token ${localStorage.getItem("userToken")}`,//solo si es en desarrollo
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error del backend:", errorData); // Log de la respuesta de error
      throw new Error(errorData.message || "Error desconocido");
    }

    return true;  // Si la respuesta es correcta, devolver true
  } catch (error) {
    console.error("Error al enviar la solicitud:", error);
    throw error;
  }
}


export const fetchEventStats = async () => {
  try {
    const response = await fetch(`${baseURL}/events/stats/`, {
      method: "GET",
      headers: {
        "Authorization": `Token ${localStorage.getItem("userToken")}`,
        "X-CSRFToken": getCSRFToken(),
      },
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Error al obtener las estadísticas de eventos");
    }
    return await response.json();
  } catch (error) {
    console.error("Error al obtener las estadísticas de eventos:", error);
    throw error;
  }
}

export async function checkSession() {

  //console.log("Cookies antes de checkSession:", document.cookie);
  try {
    const response = await fetch(`${baseURL}/auth/checkSession/`, {
      method: "GET",
      credentials: "include", //

      headers: {
        "X-CSRFToken": getCSRFToken(), // 
        "Authorization": `Token ${localStorage.getItem("userToken")}`,//solo si es en desarrollo
      }
    });

    console.log("Response headers:", [...response.headers.entries()]);

    if (response.ok) {
      const data = await response.json();
      console.log("Sesión activa:", data);
      return data;
    } else {
      console.log("No hay sesión activa");
      return null;
    }
  } catch (error) {
    console.error("Error verificando sesión:", error);
    return null;
  }
}

export const updateComplaintPriority = async (id, priority) => {
  const response = await fetch(`${baseURL}/quejas/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${localStorage.getItem("userToken")}`,
      "X-CSRFToken": getCSRFToken(),
    },
    credentials: "include",
    body: JSON.stringify({ prioridad: priority }),
  });
  if (!response.ok) {
    console.log(response);
    throw new Error("Error updating complaint priority");
  }
  return response.json();
};


/**
 * las peticiones deben enviar la cookie de sesión y el token CSRF. Por ejemplo:
 *
await fetch(`${baseURL}/protected/`, {
    authorization: `Token ${localStorage.getItem("userToken")}`,//solo si ess en desarrollo
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCSRFToken()
    },
    credentials: "include",
    body: JSON.stringify({ data: "algo" })
});
 */