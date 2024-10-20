import axios from "axios";

const API_URL = 'https://loginflowbackend.onrender.com/api/data';

export const fetchData = async (filters, token) => {
    try {
        const response = await axios.get(API_URL, {
            params: filters, // Automatically serializes the filters object into query parameters
            withCredentials: true, // Include cookies in the request
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        // console.log('data result', response?.json().status)


       
        if (response.status !== 200) {
            throw new Error('Network response was not ok');
        }
        console.log('response', response)


        if (response?.status === 200) {
            // const data = await response?.json();
            return response?.data


        }



    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Optional: re-throw the error for handling in the calling code
    }
};

// Add other API functions (login, signup) here as needed.
