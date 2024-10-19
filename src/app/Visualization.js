// pages/visualization.js
import { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { fetchData } from '../services/api';
import { format } from 'date-fns';

const Visualization = () => {
    const [data, setData] = useState([]);
    const [filters, setFilters] = useState({ age: '', gender: '', startDate: '', endDate: '' });
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        const fetchDataFromAPI = async () => {
            const result = await fetchData(filters);
            setData(result);
        };
        fetchDataFromAPI();
    }, [filters]);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    const barData = {
        labels: ['A', 'B', 'C', 'D', 'E', 'F'], // Replace with actual feature names
        datasets: [
            {
                label: 'Total Time Spent',
                data: data.map(item => item.totalTime), // Adjust based on your data structure
                backgroundColor: 'rgba(75,192,192,1)',
            },
        ],
    };

    const lineData = {
        labels: data.map(item => format(new Date(item.date), 'MM/dd/yyyy')), // Adjust as needed
        datasets: [
            {
                label: selectedCategory,
                data: data.map(item => item[selectedCategory]), // Replace with actual data points
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
            },
        ],
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
            <Bar data={barData} onElementsClick={(elems) => {
                if (elems.length) {
                    const category = elems[0]._index; // Get the category clicked
                    handleCategoryClick(['A', 'B', 'C', 'D', 'E', 'F'][category]); // Update selected category
                }
            }} />
            {selectedCategory && <Line data={lineData} />}
        </div>
    );
};

export default Visualization;
