import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const WorkshopDetails = () => {
  const { workshopId } = useParams();
  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkshop = async () => {
      console.log(`Fetching workshop with ID: ${workshopId}`);
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/talleres/${workshopId}/`);
        console.log('Response:', response);
        if (!response.ok) throw new Error(`Failed to fetch with status: ${response.status}`);
        const data = await response.json();
        console.log('Workshop data:', data);
        setWorkshop(data);
      } catch (err) {
        console.error("Error:", err);
        setError(`Failed to load data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshop();
  }, [workshopId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!workshop) return <p>No workshop details available.</p>;

  return (
    <div>
      <h1>Workshop Details</h1>
      <p><strong>Name:</strong> {workshop.name}</p>
      <p><strong>Date:</strong> {new Date(workshop.date).toLocaleDateString()}</p>
      <p><strong>Location:</strong> {workshop.location}</p>
      <p><strong>Modality:</strong> {workshop.modality}</p>
      <p><strong>Slots:</strong> {workshop.slots}</p>
      <p><strong>Facilitator:</strong> {workshop.facilitator}</p>
      <p><strong>Description:</strong> {workshop.details}</p>
      <p><strong>Status:</strong> {new Date(workshop.date) > new Date() ? "Pending" : "Completed"}</p>
    </div>
  );
};

export default WorkshopDetails;