"use client"
import { CardSummary } from "@/components/UI/cards/CardSummary"
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Tooltip } from "@nextui-org/react";
import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    Pagination,
    TableCell
} from "@nextui-org/react";
import Link from 'next/link'
import { practitioners } from '../practitioners.js'
import { useEffect, useState, useMemo } from "react";
import { useRouter } from 'next/navigation'
import { BiEdit } from "react-icons/bi";
import { RiDeleteBin6Line, RiDeleteBinLine, RiEdit2Line } from "react-icons/ri";
import { BsViewList } from "react-icons/bs";
import createAxiosInstance from "@/context/axiosInstance";
import DoctorModal from "@/components/DoctorModal";
import PatientModal from "@/components/PatientModal";
import EcommerceMetrics from "@/components/admin/dashboard/EcommerceMetrics";

import { message } from "antd";

interface Patient {
    id?: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    gender: "",
    email: "",
    birthDate: "",
    idNumber: "",
    permanentLocation: ""
}

export default function Practitioner() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [patients, setPatients] = useState<Patient[]>([])
    const [updatePatient, setUpdatePatient] = useState(null)
    const [assignedPatients,setAssingedPatients] = useState(0)
    const [unAssignedPatients,setUnAssingedPatients] = useState(0)
    const [allPatients,setAllPatients] = useState(0)
    const [modalMode, setModalMode] = useState("add");

    // console.log(doctors);

    const router = useRouter();
    const axiosInstance = createAxiosInstance();

    const navigateTpPractitioner = (id: any) => {
        router.push(`/admin/doctor/${id}`)
    }

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        const res = await axiosInstance.get('/admin/allpatients')
        const pat = await axiosInstance.get('/admin/patientscount')

        setAssingedPatients(pat.data.assingedPatients)
        setUnAssingedPatients(pat.data.unAssingedPatients)
        setAllPatients(pat.data.allPatients)
        setPatients(res.data.patients);
    }

    const handleDeletePatient = async (id: any) => {
        const res = await axiosInstance.delete(`/admin/patient/${id}`)

        fetchData();

        if (res?.status === 200) {
            message.success("Patient deleted")
        }
    }

    const handleAddClick = async () => {
        setUpdatePatient(null);
        setModalMode("add");
        fetchData()
        onOpen();
    };

    const handleUpdateClick = async (patient: any) => {
        setUpdatePatient(patient);
        setModalMode("update");
        fetchData();
        onOpen();
    };

    const columns = [
        {
            uid: "1",
            name: "Name"
        },
        {
            uid: "2",
            name: "Email"
        },
        {
            uid: "3",
            name: "PhoneNumber"
        },
        {
            uid: "4",
            name: "Gender"
        },
        {
            uid: "5",
            name: "Actions"
        }
    ]
    const renderCell = (patient: any, columnKey: any) => {
        const cellValue = patient[columnKey];
        switch (columnKey) {
            case "1":
                return `${patient.firstName} ${patient.lastName}`;
            case "2":
                return patient.email;
            case "3":
                return patient.phoneNumber;
            case "4":
                return patient.gender;
            case "5":
                return (
                    <>
                        <Tooltip
                            showArrow={true}
                            color="success"
                            content="Update patient"
                            placement="top-start">
                            <Button
                                isIconOnly
                                color="secondary"
                                variant="faded"
                                aria-label="Edit patient"
                                onClick={() => {
                                    handleUpdateClick(patient)
                                    // console.log("doctor",patient);
                                }}
                            >
                                <RiEdit2Line />
                            </Button>
                        </Tooltip>
                        {/* <Tooltip
                            showArrow={true}
                            color="primary"
                            content="View doctor"
                            placement="top-start">
                            <Button
                                isIconOnly
                                color="primary"
                                variant="faded"
                                aria-label="Approve Appointment"
                                className="m-1 bg-blue-200"
                            // onClick={() => handlefetch(doctor.id)}
                            >
                                <BsViewList />
                            </Button>
                        </Tooltip> */}
                        <Tooltip
                            showArrow={true}
                            color="danger"
                            content="Delete patient"
                            placement="top-start">
                            <Button
                                isIconOnly
                                color="danger"
                                aria-label="Delete patient"
                                // disabled={deleting}
                                onClick={() => handleDeletePatient(patient.id)}
                            >
                                <RiDeleteBin6Line />
                            </Button>
                        </Tooltip>
                    </>
                );
            default:
                return cellValue;
        }
    };

    const [page, setPage] = useState(1);
    const rowsPerPage = 5;

    const pages = Math.ceil(patients.length / rowsPerPage);

    const paginatedPractitioners = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return patients.slice(start, end);
    }, [page, patients]);

    return (
        <main className="flex px-11 py-5 flex-col gap-4">
            <div className="grid sm:grid-cols-3 gap-4 w-full">
                <CardSummary title="Total Patients" value={allPatients} />
                <CardSummary title="Assinged Patients" value={assignedPatients} />
                <CardSummary title="UnAssinged Patients" value={unAssignedPatients} />
                {/* <EcommerceMetrics value="30" /> */}
            </div>
            <div className="flex justify-between">
                <h2 className="capitalize text-lg bold">all Patients</h2>
                <Button variant="solid" color="primary" className="capitalize" onPress={handleAddClick}>add patient</Button>
            </div>
            <div>
                <Table selectionMode="single" aria-label="Example table with custom cells"
                    bottomContent={
                        <div className="flex w-full justify-center">
                            <Pagination
                                isCompact
                                showControls
                                showShadow
                                color="primary"
                                page={page}
                                total={pages}
                                onChange={(page) => setPage(page)}
                            />
                        </div>
                    }
                >
                    <TableHeader columns={columns}>
                        {(column) => (
                            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                                {column.name}
                            </TableColumn>
                        )}
                    </TableHeader>
                    <TableBody items={paginatedPractitioners} emptyContent="No Patients data yet">
                        {(patient) => (
                            <TableRow key={patient.id}
                            // className="cursor-pointer" 
                            // onClick={() => navigateTpPractitioner(doctor.id)}
                            >
                                {(columnKey) => <TableCell>{renderCell(patient, columnKey)}</TableCell>}

                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <PatientModal
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    patient={updatePatient}
                    mode={modalMode} />
            </div>
        </main>
    )
}