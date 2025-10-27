import { useParams } from "react-router-dom";
import WorkshopRegistrationForm from "./WorkshopRegistrationForm";

const WorkshopRegistrationPage = () => {
  const { workshopId } = useParams();

  return (
    <div className="min-h-screen bg-gray-50">
      <WorkshopRegistrationForm workshopId={workshopId} />
    </div>
  );
};

export default WorkshopRegistrationPage;