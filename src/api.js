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

// Crear un taller
export const createWorkshop = async (workshopData) => {
  const response = await fetch(`${baseURL}/talleres/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(workshopData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Error al crear taller: ${errorData.message}`);
  }
  return await response.json();
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
export const deleteWorkshop = async (workshopId) => {
  const response = await fetch(`${baseURL}/talleres/${workshopId}/`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete the workshop");
  }
  return true;
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
