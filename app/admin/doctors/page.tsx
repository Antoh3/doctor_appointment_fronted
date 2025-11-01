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

import { message } from "antd";

interface Doctor {
    id?: "",
    firstName: "",
    lastName: "",
    phone: "",
    gender: "",
    email: "",
    specialization: "",
    licenseNumber: "",
    registrationNumber: ""
}

export default function Practitioner() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [doctors, setDoctors] = useState<Doctor[]>([])
    const [updateDoctor, setUpdateDoctor] = useState(null)
    const [modalMode, setModalMode] = useState("add");
    const [assingedDoctors,setAssingedDoctors] = useState(0)
    const [unAssingedDoctors,setUnAssingedDoctors] = useState(0)
    const [allDocs,setAllDocs] = useState(0)

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
        const res = await axiosInstance.get('/admin/alldoctors')
        const res1  = await axiosInstance.get('/admin/doctorscount')

        setAssingedDoctors(res1.data.assingedDoctors)
        setUnAssingedDoctors(res1.data.unassingedDoctors)
        setAllDocs(res1.data.allDoctors)

        setDoctors(res.data.doctors);
    }

    const handleDeleteDoctor = async (id: any) => {
        const res = await axiosInstance.delete(`/admin/doctor/${id}`)

        fetchData();

        if (res?.status === 200) {
            message.success("Doctor deleted")
        }
    }

    const handleAddClick = async () => {
        setUpdateDoctor(null);
        setModalMode("add");
        fetchData()
        onOpen();
    };

    const handleUpdateClick = async (doctor: any) => {
        setUpdateDoctor(doctor);
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
            name: "Specialization"
        },
        {
            uid: "4",
            name: "LicenseNumber"
        },
        {
            uid: "5",
            name: "Actions"
        }
    ]
    const renderCell = (doctor: any, columnKey: any) => {
        const cellValue = doctor[columnKey];
        switch (columnKey) {
            case "1":
                return `${doctor.firstName} ${doctor.lastName}`;
            case "2":
                return doctor.email;
            case "3":
                return doctor.specialization;
            case "4":
                return doctor.licenseNumber;
            case "5":
                return (
                    <>
                        <Tooltip
                            showArrow={true}
                            color="success"
                            content="Update doctor"
                            placement="top-start">
                            <Button
                                isIconOnly
                                color="secondary"
                                variant="faded"
                                aria-label="Edit journal"
                                onClick={() => {
                                    handleUpdateClick(doctor)
                                    // console.log("doctor",doctor);
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
                            content="Delete doctor"
                            placement="top-start">
                            <Button
                                isIconOnly
                                color="danger"
                                aria-label="Delete Ambulance"
                                // disabled={deleting}
                                onClick={() => handleDeleteDoctor(doctor.id)}
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

    const pages = Math.ceil(doctors.length / rowsPerPage);

    const paginatedPractitioners = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return doctors.slice(start, end);
    }, [page, doctors]);

    return (
        <main className="flex px-11 py-5 flex-col gap-4">
            <div className="grid sm:grid-cols-3 gap-4 w-full">
                <CardSummary title="Total Doctors" value={allDocs} />
                <CardSummary title="Assinged Doctors" value={assingedDoctors} />
                <CardSummary title="UnAssinged Doctors" value={unAssingedDoctors} />
            </div>
            <div className="flex justify-between">
                <h2 className="capitalize text-lg bold">all doctors</h2>
                <Button variant="solid" color="primary" className="capitalize" onPress={handleAddClick}>add doctor</Button>
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
                    <TableBody items={paginatedPractitioners} emptyContent="No Doctors data yet">
                        {(doctor) => (
                            <TableRow key={doctor.id}
                            // className="cursor-pointer" 
                            // onClick={() => navigateTpPractitioner(doctor.id)}
                            >
                                {(columnKey) => <TableCell>{renderCell(doctor, columnKey)}</TableCell>}

                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <DoctorModal
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    doctor={updateDoctor}
                    mode={modalMode} />
            </div>
        </main>
    )
}