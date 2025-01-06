export const fetchConfig = async () => {
    try {
      const response = await fetch('http://localhost:3001/store/variablesEnv');
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
  