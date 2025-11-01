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
    const [requests, setRequests] = useState<Request[]>([])
    const axiosInstance = createAxiosInstance();
    
    const fetchData = async () => {
        const ambulanceReques = await axiosInstance.get('/admin/allpendingrequests')

        setRequests(ambulanceReques.data);
    }

    useEffect(() => {
        fetchData()
    }, [])



    const handleCancelAmbulanceRequest = async (id: string | any) => {
        try {
            const res = await axiosInstance
                .patch(`/patient/cancelrequestadmin/${id}`, { status: "canceled_by_admin" })
            setRequests((prev) =>
                prev.map((appt) => (appt.id === id ? { ...appt, status: "canceled_by_admin" } : appt))
            );
            
            fetchData()
            // console.log("data", res.data);
            if (res?.status === 200) {
                message.success("Request canceled");
            }

            // setAllRequests(res.data)
        } catch (error) {
            console.error("Error in canceling request");

        }
    }

    const handleAcceptAmbulanceRequest = async (id: string | any) => {
        try {
            const res = await axiosInstance
                .patch(`/ambulance/accepterequestadmin/${id}`, { status: "accepted" })
            setRequests((prev) =>
                prev.map((appt) => (appt.id === id ? { ...appt, status: "accepted" } : appt))
            );
            fetchData()
            if (res?.status === 200) {
                message.success("Request accepted");
            }
        } catch (error) {
            console.error("Error in canceling request");

        }
    }

    const handleCompleteAmbulanceRequest = async (id: string | any) => {
        try {
            const res = await axiosInstance
                .patch(`/ambulance/completerequestadmin/${id}`, { status: "completed" })
            setRequests((prev) =>
                prev.map((appt) => (appt.id === id ? { ...appt, status: "completed" } : appt))
            );

            fetchData()

            if (res?.status === 200) {
                message.success("Request completed");
            }
        } catch (error) {
            console.error("Error in canceling request");

        }
    }
    return (
        <main className="flex px-11 py-5 flex-col gap-4">
            <div className="flex justify-between">
                <h2 className="capitalize text-lg bold">Completed Requets</h2>
                {/* <Button variant="solid" color="primary" className="capitalize" onPress={onOpen}>Send Rquest</Button> */}
            </div>
            {/* <div>
                <Modal size="xl" placement="center" isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Send Request</ModalHeader>
                                <ModalBody>
                                    <Card>
                                        <CardBody>
                                            <Select
                                                isRequired
                                                className="max-w-xs mb-5"
                                                defaultSelectedKeys={["Basic"]}
                                                size='sm'
                                                // color='primary'
                                                label="Aid car type"
                                                placeholder="Select aid car type"
                                            // onSelectionChange={(value:any) => setSlelectedAmbulance(value)}
                                            // onChange={handleAidCarChange}
                                            // onValueChange={(value:any) => setSlelectedAmbulance(value)}
                                            >
                                                {ambulances.map((ambulance) => (
                                                    <SelectItem key={ambulance.key} value={ambulance.key} >{ambulance.label}</SelectItem>
                                                ))}
                                            </Select>

                                            <CheckboxGroup
                                                isRequired
                                                description="Select What the ambulance should have"
                                                // isInvalid={isInvalid}
                                                label="The ambulance Should have: "
                                                className=' border-2 border-transparent'
                                            // onValueChange={(value:any) => {
                                            //     setIsInvalid(value.length < 1);
                                            //     setSelectedFeatures(value)
                                            // }}
                                            >
                                                <Tooltip
                                                    content="Helps oxygen supply to patients with breathing difficulties"
                                                    placement="top-start"
                                                    color="primary"
                                                >
                                                    <Checkbox value="oxygen-cylinder">Oxygen Cylinder</Checkbox>
                                                </Tooltip>
                                                <Checkbox value="blood-presure-machine">Blood Presure Machine</Checkbox>
                                                <Tooltip
                                                    content="Doctor"
                                                    placement="top-start"
                                                    color="primary"
                                                >
                                                    <Checkbox value="paramedic">Paramedic</Checkbox>
                                                </Tooltip>
                                                <Tooltip
                                                    content="used for listening to patient heart beats"
                                                    placement="top-start"
                                                    color="primary"
                                                >
                                                    <Checkbox value="stethoscope">Stethoscope</Checkbox>
                                                </Tooltip>
                                                <Checkbox value="wheelchair">Wheelchair</Checkbox>
                                            </CheckboxGroup>
                                        </CardBody>
                                    </Card>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color='danger' onPress={onClose}>Cancel</Button>
                                    <Button color="primary"  >
                                        Call Now
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </div> */}
            <div>
                <Table aria-label="Bed Table">
                    <TableHeader>
                        <TableColumn>Ambulance Name</TableColumn>
                        <TableColumn>Ambulance Type</TableColumn>
                        <TableColumn>Ambulance Owner</TableColumn>
                        <TableColumn>PatientName</TableColumn>
                        <TableColumn>Status</TableColumn>
                        <TableColumn>Actions</TableColumn>
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
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Tooltip showArrow={true} content="Accept Request" placement="top-end">
                                            <Button
                                                isIconOnly
                                                color="warning"
                                                variant="faded"
                                                aria-label="Accept Request"
                                                isDisabled={request.status === "canceled" || request.status === "canceled_by_user" || request.status === "canceled_by_admin"}
                                                onClick={() => handleAcceptAmbulanceRequest(request.id)}
                                            >
                                                <RiEdit2Line />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip showArrow={true} content="Cancel Request" color="danger" placement="top-start">
                                            <Button
                                                isIconOnly
                                                color="danger"
                                                aria-label="Cancel Request"
                                                isDisabled={request.status === "canceled" || request.status === "canceled_by_user" || request.status === "canceled_by_admin"}
                                                onClick={() => handleCancelAmbulanceRequest(request.id)}
                                            >
                                                <RiDeleteBin6Line />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip showArrow={true} content="Complete Request" color="danger" placement="top-start">
                                            <Button
                                                isIconOnly
                                                color="success"
                                                aria-label="Complete Request"
                                                isDisabled={request.status === "completed" || request.status === "canceled" || request.status === "canceled_by_user" || request.status === "canceled_by_admin"}
                                                onClick={() => handleCompleteAmbulanceRequest(request.id)}
                                            >
                                                <FiChevronsRight />
                                            </Button>
                                        </Tooltip>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

        </main>
    )
}
