import { useState, useEffect } from "react";
import axios from "axios";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar
} from "recharts";
import createAxiosInstance from "@/context/axiosInstance";

const PatientCharts = () => {
    const [monthlyData, setMonthlyData] = useState([]);
    const [statusData, setStatusData] = useState([]);
    const axiosInstance = createAxiosInstance();

    useEffect(() => {
        const fetchMonthlyData = async () => {
            try {
                const res = await axiosInstance.get("/admin/monthlyvisits");
                setMonthlyData(res.data);
            } catch (error) {
                console.error("Error fetching patient count by month:", error);
            }
        };

        const fetchStatusData = async () => {
            try {
                const res = await axiosInstance.get("/admin/patientdatacaount");
                setStatusData(res.data);
            } catch (error) {
                console.error("Error fetching patient count by status:", error);
            }
        };

        fetchMonthlyData();
        fetchStatusData();
    }, []);

    return (
        <div>
            {/* Line Chart: Patients by Month */}
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="visits" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>

            {/* Bar Chart: Patients by Status */}
            <div>
                <h3>Patients by Status</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={statusData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="status" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PatientCharts;
