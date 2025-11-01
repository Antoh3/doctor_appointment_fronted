import { useEffect, useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";
import createAxiosInstance from "@/context/axiosInstance";


const PractitionersChart = () => {
    const [assingedDoctors, setAssingedDoctors] = useState(0)
    const [unAssingedDoctors, setUnAssingedDoctors] = useState(0)
    const axiosInstance = createAxiosInstance();

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        const res = await axiosInstance.get('/admin/alldoctors')
        const res1 = await axiosInstance.get('/admin/doctorscount')

        setAssingedDoctors(res1.data.assingedDoctors)
        setUnAssingedDoctors(res1.data.unassingedDoctors)
    }

    const data = [
        { name: "Assigned", value: assingedDoctors },
        { name: "Unassigned", value: unAssingedDoctors },
    ];

    const COLORS = ["#0088FE", "#FFBB28"];

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie data={data} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value">
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    )
}

export default PractitionersChart;
