import {useState, useEffect} from 'react';

export function useFetchPhotos(url) {
  const [photos, setPhotos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await fetch(url);
        if (!response.ok) {
          setLoading(false);
          throw new Error(`Fetching failed: ${response.status}`);
        }

        const data = await response.json();
        setPhotos(data.data || data);
      } catch (error) {
        console.log(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchData();
    }
  }, [url]);

  return [photos, loading, error];
}
