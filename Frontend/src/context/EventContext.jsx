import { createContext, useContext, useEffect, useState } from "react";
import API from "../api";

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all events from backend
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await API.get('/event/events');
      console.log('Fetched events response:', res);

      if (!res.ok) {
        const errData = await res.data.json();
        throw new Error(errData.message || "Failed to fetch events");
      }

      const data = await res.data.json();
      setEvents(data.events || []);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <EventContext.Provider value={{ events, loading, error, fetchEvents }}>
      {children}
    </EventContext.Provider>
  );
};

// Custom hook for easy usage
export const useEvents = () => useContext(EventContext);
