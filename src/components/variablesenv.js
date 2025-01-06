
export const fetchConfig = async () => {
    const apiUrl = import.meta.env.VITE_API_URL; 
    try {
      const response = await fetch(`${apiUrl}/store/variablesEnv`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const config = await response.json();
      return config;
    } catch (error) {
      console.error('Error fetching config:', error);
      return null;
    }
  };
  