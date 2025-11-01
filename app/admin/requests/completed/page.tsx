"use client"
import { CardSummary } from "@/components/UI/cards/CardSummary";
import { Button, Tooltip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input, Select, SelectItem, Textarea, Checkbox, CardBody, CheckboxGroup, Card } from "@nextui-org/react";
import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    Pagination,
    TableCell
} from "@nextui-org/react";
import { CiShoppingTag } from "react-icons/ci";
import Link from "next/link";
import React, { Key, use, useEffect, useMemo, useState } from "react";
// import { getAllRequests, sendRequest, Request, getLabRequests, aproveRequests } from "../../requests";
import { request } from "http";
import { toast } from 'react-hot-toast'
import axios from "axios";
import AppointmentStatusBadge from "@/components/AppointmentStatusBadge";
import { RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";
import { message } from "antd";
import { FiChevronsRight } from "react-icons/fi";
import createAxiosInstance from "@/context/axiosInstance";

export interface Request {
    id: string,
    aidCarType: string,
    status: string,
    ambulance: {
        name: string,
        owner: string,
    },
    patient: {
        firstName: string,
        lastName: string,
    }

}

export default function page() {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const axiosInstance = createAxiosInstance();

    // console.log(allRequests);

    const [requests, setRequests] = useState<Request[]>([])
    console.log(requests);
    useEffect(() => {
        fetchData()
    }, [])
    
    
    const fetchData = async () => {
        const res = await axiosInstance.get('/admin/allcompletedrequests')

        setRequests(res.data);
    }

    

    const requestType = ['lab', 'patient']
    return (
        <main className="flex px-11 py-5 flex-col gap-4">
            <div className="flex justify-between">
                <h2 className="capitalize text-lg bold">All Completed Requets</h2>
                {/* <Button variant="solid" color="primary" className="capitalize" onPress={onOpen}>Send Rquest</Button> */}
            </div>
            <div>
                <Table aria-label="Bed Table">
                    <TableHeader>
                        <TableColumn>Ambulance Name</TableColumn>
                        <TableColumn>Ambulance Type</TableColumn>
                        <TableColumn>Ambulance Owner</TableColumn>
                        <TableColumn>PatientName</TableColumn>
                        <TableColumn>Status</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {requests.map((request: any) => (
                            <TableRow key={request.id}>
                                <TableCell>{request.ambulance.name}</TableCell>
                                <TableCell>{request.aidCarType}</TableCell>
                                <TableCell>{request.ambulance.owner}</TableCell>
                                <TableCell>{request.patient.firstName} - {request.patient.lastName}</TableCell>
                                <TableCell>
                                    <span
                                        className={
                                            " rounded w-full block text-center"
                                        }
                                    >
                                        <AppointmentStatusBadge status={request.status} />
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

        </main>
    )
}
