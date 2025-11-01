import { 
    BarChart, 
    Bar, 
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import createAxiosInstance from "@/context/axiosInstance";
import { useEffect, useState } from "react";



const AppointmentAttendanceChart = () => {
    const [appointments,setAppointments] = useState([])

    const axiosInstance = createAxiosInstance()

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        const res1  = await axiosInstance.get('/admin/appointmentcount')

        setAppointments(res1.data);
    }

    const data = appointments.map((app: any) => ({
        status: app.status,   
        count: app._count.id  
    }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    )
}

export default AppointmentAttendanceChart;
