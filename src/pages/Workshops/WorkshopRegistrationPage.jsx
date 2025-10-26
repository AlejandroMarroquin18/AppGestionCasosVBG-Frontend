import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import WorkshopRegistrationForm from "./WorkshopRegistrationForm";
import { baseURL } from "../../api";
import LoadingSpinner from "../../components/LoadingSpinner";

const WorkshopRegistrationPage = () => {
  const { workshopId } = useParams();
  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkshopInfo = async () => {
      try {
        const response = await fetch(`${baseURL}/talleres/${workshopId}/`);
        if (response.ok) {
          const data = await response.json();
          setWorkshop(data);
        } else {
          setError("No se pudo cargar la información del taller");
        }
      } catch (error) {
        console.error("Error fetching workshop:", error);
        setError("Error al cargar la información del taller");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshopInfo();
  }, [workshopId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner message="Cargando información del taller..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <WorkshopRegistrationForm workshop={workshop} />
    </div>
  );
};

export default WorkshopRegistrationPage;