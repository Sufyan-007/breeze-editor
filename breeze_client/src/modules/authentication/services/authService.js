export const login = async (username, password) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Login failed', error.message);
    throw error;
  }
};
