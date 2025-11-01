"use client"

import { CardSummary } from "@/components/UI/cards/CardSummary"
import Link from "next/link"
import { useEffect, useState } from "react"
import createAxiosInstance from "@/context/axiosInstance"
import AmbulanceRequestsChart from "@/components/AmbulanceRequestsGraph"
import AppointmentAttendanceChart from "@/components/AppointmentCompletion"
import PractitionersChart from "@/components/DoctorVisits"
import PatientVisitsChart from "@/components/PatientAnalysisGraph"

export default function HospitalPage() {
    const [doctors, setDoctors] = useState(0)
    const [patients, setPatients] = useState(0)
    const [requests, setRequests] = useState(0)
    const [appointments, setAppointments] = useState(0)
    const [ambulances, setAmbulances] = useState(0)
    
    const axiosInstance = createAxiosInstance();

    useEffect(() => {
        fetchData()
    }, [])
    const fetchData = async () => {
        const res = await axiosInstance.get('/admin/alldata')

        setPatients(res.data.patients)
        setDoctors(res.data.doctors)
        setAppointments(res.data.appointments)
        setRequests(res.data.requests)
        setAmbulances(res.data.ambulances)
    }
    return (
        <main className="flex px-11 py-5 flex-col gap-4">
            <h1 className="text-3xl font-bold">Admin dashboard</h1>
            <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-5 w-full">
                <CardSummary title="Total Patients" value={patients ? patients : 0} />
                <CardSummary title="Total Practitioners" value={doctors ? doctors : 0} />
                <CardSummary title="Total appointments" value={appointments ? appointments : 0} />
                <CardSummary title="Total Requests" value={requests ? requests : 0} />
                <CardSummary title="Total Ambulances" value={ambulances ? ambulances : 0} />
            </div>
            <div className="w-full grid grid-cols-2 gap-3">
                <div className="col-span-1 flex flex-col gap-4 ">
                    <div className="rounded-lg bg-white p-4 border">
                        Patients visit analysis
                        <PatientVisitsChart />
                    </div>
                    <div className="rounded-lg bg-white p-4 border">
                        Appointment Attendance
                        <AppointmentAttendanceChart />
                    </div>
                </div>
                <div className="col-span-1 flex flex-col gap-4 ">
                    <div className="rounded-lg bg-white p-4 border">
                        Emergency Ambulance Requests
                        <AmbulanceRequestsChart />
                    </div>
                    <div className="rounded-lg bg-white p-4 border">
                        Active Practitioners
                        <PractitionersChart />
                    </div>
                </div>
            </div>
        </main>
    )
}