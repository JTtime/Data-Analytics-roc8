'use client'
// app/visualization/page.js
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';
import { fetchData } from '../../services/api';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

const Visualization = () => {
    const [data, setData] = useState([]);
    const [filters, setFilters] = useState({ age: '', gender: '', startDate: '', endDate: '' });
    const [selectedFeature, setSelectedFeature] = useState(null);
    const router = useRouter();
    const {token} = useAuth();

    useEffect(() => {
        const fetchDataFromAPI = async () => {
            try {
                const result = await fetchData(filters, token);
                setData(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchDataFromAPI();
    }, [filters]);

    const handleFeatureClick = (feature) => {
        setSelectedFeature(feature);
    };

    const barData = data.map(item => ({
        feature: item.feature, // Adjust according to your data structure
        totalTime: item.totalTime, // Replace with actual data field
    }));

    const handleLogout = async () => {
        await axios.post('http://localhost:3001/api/auth/logout');
        router.push('/auth/Login'); // Redirect to login page
    };

    return (
        <div>
            <h1>Data Visualization</h1>
            <div>
                <h2>Filters</h2>
                <select onChange={(e) => setFilters({ ...filters, age: e.target.value })}>
                    <option value="">Select Age</option>
                    <option value="15-25">15-25</option>
                    <option value=">25">25</option>
                </select>
                <select onChange={(e) => setFilters({ ...filters, gender: e.target.value })}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
                <input type="date" onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} />
                <input type="date" onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} />
            </div>

            <BarChart width={600} height={300} data={barData}>
                <XAxis dataKey="feature" />
                <YAxis />
                <Tooltip />
                <CartesianGrid strokeDasharray="3 3" />
                <Bar dataKey="totalTime" fill="#8884d8" onClick={({ feature }) => handleFeatureClick(feature)} />
            </BarChart>

            {selectedFeature && (
                <LineChart width={600} height={300} data={data}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey={selectedFeature} stroke="#ff7300" />
                </LineChart>
            )}
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Visualization;
