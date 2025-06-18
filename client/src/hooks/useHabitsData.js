import { useState, useEffect } from "react";
import api from "../services/api";

export const useHabitsData = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadHabits = async () => {
    try {
      setLoading(true);

      const habitsResponse = await api.get("/habits");
      setHabits(habitsResponse.data);
    } catch (err) {
      setError("Failed to load habits");
      console.error("Error loading habits:", err);
    } finally {
      setLoading(false);
    }
  };

  const addHabit = async (title) => {
    try {
      const res = await api.post("/habits", { title });
      setHabits([res.data, ...habits]);
      return res.data;
    } catch (err) {
      setError("Could not create habit");
      throw err;
    }
  };

  const toggleHabit = async (id) => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const res = await api.patch(`/habits/${id}/toggle`, null, {
        params: { date: today },
      });

      setHabits(
        habits.map((h) => (h._id === id ? { ...h, records: res.data } : h))
      );
    } catch (err) {
      setError("Could not toggle habit");
      throw err;
    }
  };

  const updateHabit = async (id, newTitle) => {
    try {
      const res = await api.put(`/habits/${id}`, { title: newTitle });
      setHabits(habits.map((h) => (h._id === id ? res.data : h)));
    } catch (err) {
      setError("Could not update habit");
      throw err;
    }
  };

  const deleteHabit = async (id) => {
    try {
      await api.delete(`/habits/${id}`);
      setHabits(habits.filter((h) => h._id !== id));
    } catch (err) {
      setError("Could not delete habit");
      throw err;
    }
  };

  useEffect(() => {
    loadHabits();
  }, []);

  return {
    habits,
    loading,
    error,
    addHabit,
    toggleHabit,
    updateHabit,
    deleteHabit,
    refetch: loadHabits,
  };
};
