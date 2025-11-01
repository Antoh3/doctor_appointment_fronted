"use client";

import { useState, useEffect } from "react";
import { 
    Modal, 
    ModalBody, 
    ModalFooter, 
    ModalHeader, 
    Button, 
    Input, Select, SelectItem, ModalContent } from "@nextui-org/react";
import axios, { AxiosError } from "axios";
import { CiShoppingTag } from "react-icons/ci";
import { message } from "antd";
import createAxiosInstance from "@/context/axiosInstance";

function PatientModal({ isOpen, onOpenChange, patient, mode }: any) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        gender: "",
        email: "",
        permanentLocation:[
            -2.28333,36.81667,
        ],
        idNumber: "",
        birthDate: ""
    })
    const axiosInstance = createAxiosInstance();

    useEffect(() => {
        if (mode === "update" && patient) {
            setFormData({
                firstName: patient.firstName || "",
                lastName: patient.lastName || "",
                phoneNumber: patient.phoneNumber || "",
                gender: patient.gender || "",
                email: patient.email || "",
                permanentLocation: patient.permanentLocation || [-2.28333,36.81667,],
                idNumber: patient.idNumber || "",
                birthDate: patient.registrationNumber || "",

            });
        } else {
            setFormData({
                firstName: "",
                lastName: "",
                phoneNumber: "",
                gender: "",
                email: "",
                permanentLocation:[
                    -2.28333,36.81667,
                ],
                idNumber: "",
                birthDate: "",
            });
        }
    }, [patient, mode]);

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                // location:formData.location
            }
            if (mode === "add") {
                const res = await axiosInstance.post("/admin/addpatient", data);
                // console.log("Ambulance Added:", data);
                if (res?.status === 200) {
                    message.success("Patient added successfully")
                }
            } else {
                const res = await axiosInstance.patch(`/admin/updatepatient/${patient.id}`, formData);
                console.log("clicked",res);
                if (res?.status === 200) {
                    message.success("Patient updated")
                }

                // console.log("Ambulance Updated:", formData);
            }
            onOpenChange();
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 400) {
                    message.error("Email already exsists")
                }
            }
            console.error("Error:", error);
        }
    };

    const patientGender = [
        {key:"male",label:"Male"},
        {key:"female",label:"Female"}
    ]
    return (
        <Modal size="md" placement="center" isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">{mode === "add" ? "Add Patient" : "Update Patient"}</ModalHeader>
                        <ModalBody>
                            <Input
                                label="Firstname"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                fullWidth
                                required

                            />
                            <Input
                                label="Lastname"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                fullWidth
                                required

                            />
                            <Input
                                label="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                fullWidth
                                required

                            />
                            <Input
                                label="PhoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                fullWidth
                                required

                            />
                            
                            <Input
                                // as="input"
                                type="date"
                                label="BirthDate"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleChange}
                                fullWidth
                                required

                            />
                            
                            <Input
                                label="IdNumber"
                                name="idNumber"
                                value={formData.idNumber}
                                onChange={handleChange}
                                fullWidth
                                required

                            />
                            <Select
                                isRequired
                                className="max-w-xs mb-5"
                                // defaultSelectedKeys={["Basic"]}
                                size='sm'
                                color='primary'
                                label="Gender"
                                placeholder="Select gender"
                                name="gender"
                                value={formData.gender}
                                // onSelectionChange={(value:any) => setSlelectedAmbulance(value)}
                                onChange={handleChange}
                            // onValueChange={(value:any) => setSlelectedAmbulance(value)}
                            >
                                {patientGender.map((gender:any) => (
                                    <SelectItem key={gender.key} value={gender.key} >{gender.label}</SelectItem>
                                ))}
                            </Select>
                            
                            {/* <Input
                                label="RegistrationNumber"
                                name="registrationNumber"
                                value={formData.registrationNumber}
                                onChange={handleChange}
                                fullWidth
                                required

                            /> */}


                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={handleSubmit}>
                                {mode === "add" ? "Add" : "Update"}
                            </Button>
                            <Button color="danger"  onClick={onOpenChange}>
                                Cancel
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export default PatientModal