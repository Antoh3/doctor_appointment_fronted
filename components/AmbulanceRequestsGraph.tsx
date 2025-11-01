import { useEffect, useState } from "react";
import { 
    BarChart, 
    Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import createAxiosInstance from "@/context/axiosInstance";

const data = [
    { month: "Jan", requests: 15 },
    { month: "Feb", requests: 20 },
    { month: "Mar", requests: 12 },
    { month: "Apr", requests: 25 },
    { month: "May", requests: 18 },
];


const AmbulanceRequestsChart = () => {
    const axiosInstance = createAxiosInstance();
    const [data, setData] = useState([]);

    useEffect(() => {
            fetchData();
        }, [])
    
        const fetchData = async () => {
            const res = await axiosInstance.get('/admin/ambulanceRequestCount')

            setData(res.data);
        }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="requests" fill="#82ca9d" />
            </BarChart>
        </ResponsiveContainer>
    )
}

export default AmbulanceRequestsChart;
