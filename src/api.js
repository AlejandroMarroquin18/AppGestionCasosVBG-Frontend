import getCSRFToken from "./helpers/getCSRF";

export const baseURL = "http://localhost:8000/api";

/*------------------ SOLICITUDES DE TALLERES ------------------*/

// Obtener TODOS los talleres
export const getWorkshops = async () => {
  const response = await fetch(`${baseURL}/talleres/`,{
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
  const response = await fetch(`${baseURL}/talleres/${workshopId}/`,{
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
      "Authorization": `Token ${localStorage.getItem("userToken")}`, 
      "X-CSRFToken": getCSRFToken(),
    },
    body: JSON.stringify(participantData),
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Error al inscribirse: ${errorData.message}`);
  }

  return response.json();  // Retorna la respuesta del backend con los datos del participante
};

/*------------------ SOLICITUDES DE QUEJAS ------------------*/

// Obtener TODAS las quejas
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
  return response.json();
};

// Obtener los detalles de una queja específica (ID)
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
  return response.json();
};

// Actualizar los detalles de una queja
export const updateComplaint = async (id, complaintData) => {
  const response = await fetch(`${baseURL}/quejas/${id}/`, {
    method: "PUT",
    headers: {
    "Content-Type": "application/json",
    "Authorization": `Token ${localStorage.getItem("userToken")}`,   
    "X-CSRFToken": getCSRFToken(),
    },
    credentials: "include",
    body: JSON.stringify(complaintData),
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
    const response = await fetch(`${baseURL}/events/stats/`,{
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