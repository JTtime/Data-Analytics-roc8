// services/api.js

const API_URL = 'http://localhost:3001/api/data';

export const fetchData = async (filters, token) => {
    try {
        const response = await fetch(API_URL + '?' + new URLSearchParams(filters), {
            method: 'GET',
            credentials: 'include', // Include cookies in the request
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        // Check if the response is okay (status in the range 200-299)
        if (response.status!==200) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Optional: re-throw the error for handling in the calling code
    }
};

// Add other API functions (login, signup) here as needed.
