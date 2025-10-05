'use client';

import React, { useEffect, useState } from 'react';
import HouseCard from '@/components/ui/HouseCard';
import { houseData } from '@/components/core/house'; // ✅ Import your mock data

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /*
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch('/api/favorites', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setFavorites(data);
        setFavoriteIds(data.map(item => item.id));
      } catch (err) {
        console.error('Failed to fetch favorites:', err);
        setError('Could not load favorites.');
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);
  */

  /*
  const removeFavorite = async (houseId) => {
    try {
      await fetch(`/api/favorites/${houseId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      setFavorites(prev => prev.filter(item => item.id !== houseId));
      setFavoriteIds(prev => prev.filter(id => id !== houseId));
    } catch (err) {
      console.error('Failed to remove favorite:', err);
    }
  };
  */

  useEffect(() => {
    setTimeout(() => {
      const mock = houseData.slice(0, 4);
      setFavorites(mock);
      setFavoriteIds(mock.map(h => h.id));
      setLoading(false);
    }, 500);
  }, []);

  const toggleFavoriteHandler = (houseId) => {
    setFavoriteIds(prev => {
      if (prev.includes(houseId)) {
        setFavorites(curr => curr.filter(h => h.id !== houseId));
        return prev.filter(id => id !== houseId);
      } else {
        const newHouse = houseData.find(h => h.id === houseId);
        if (newHouse) setFavorites(curr => [...curr, newHouse]);
        return [...prev, houseId];
      }
    });
  };

  if (loading) return <p className="text-center py-4">Loading favorites...</p>;
  if (error) return <p className="text-center text-red-600 py-4">{error}</p>;
  if (favorites.length === 0) return <p className="text-center py-4">No favorites yet.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {favorites.map((house) => (
        <HouseCard
          key={house.id}
          house={house}
          isFavorite={favoriteIds.includes(house.id)}
          onToggleFavorite={toggleFavoriteHandler}
          // onRemove={() => removeFavorite(house.id)} // Uncomment when backend ready
        />
      ))}
    </div>
  );
};

export default Favorites;
