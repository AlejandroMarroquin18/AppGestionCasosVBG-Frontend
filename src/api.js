const baseURL = "http://127.0.0.1:8000/api";

/*------------------ SOLICITUDES DE TALLERES ------------------*/

// Obtener TODOS los talleres
export const getWorkshops = async () => {
  const response = await fetch(`${baseURL}/talleres/`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

// Obtener los detalles de un taller específico (ID)
export const getWorkshopDetails = async (workshopId) => {
  const response = await fetch(`${baseURL}/talleres/${workshopId}/`);
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
      },
      body: JSON.stringify(workshopData),
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
    },
    body: JSON.stringify(workshopData),
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
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      cancellation_reason: cancellationReason 
    })
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
    },
    body: JSON.stringify(participantData),
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
  const response = await fetch(`${baseURL}/quejas/`);
  if (!response.ok) {
    throw new Error("Error getting complaints");
  }
  return response.json();
};

// Obtener los detalles de una queja específica (ID)
export const getComplaintDetails = async (id) => {
  const response = await fetch(`${baseURL}/quejas/${id}`);
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
    },
    body: JSON.stringify(complaintData),
  });
  if (!response.ok) {
    throw new Error("Error updating complaint");
  }
  return response.json();
};

export const deleteComplaint = async (id) => {
  const response = await fetch(`${baseURL}/quejas/${id}/`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Error deleting complaint");
  }
  return true;
};
