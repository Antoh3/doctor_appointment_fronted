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

function DoctorModal({ isOpen, onOpenChange, doctor, mode }: any) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        gender: "",
        email: "",
        specialization: "",
        licenseNumber: "",
        registrationNumber: ""
    })
    const axiosInstance = createAxiosInstance();

    useEffect(() => {
        if (mode === "update" && doctor) {
            setFormData({
                firstName: doctor.firstName || "",
                lastName: doctor.lastName || "",
                phone: doctor.phone || "",
                gender: doctor.gender || "",
                email: doctor.email || "",
                specialization: doctor.specialization || "",
                licenseNumber: doctor.licenseNumber || "",
                registrationNumber: doctor.registrationNumber || "",

            });
        } else {
            setFormData({
                firstName: "",
                lastName: "",
                phone: "",
                gender: "",
                email: "",
                specialization: "",
                licenseNumber: "",
                registrationNumber: "",
            });
        }
    }, [doctor, mode]);

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
                const res = await axiosInstance.post("/admin/adddoctor", data);
                // console.log("Ambulance Added:", data);
                if (res?.status === 200) {
                    message.success("Doctor added successfully")
                }
            } else {
                const res = await axiosInstance.patch(`/admin/updatedoctor/${doctor.id}`, formData);
                // console.log("clicked");
                if (res?.status === 200) {
                    message.success("Doctor updated")
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

    const doctorGender = [
        {key:"male",label:"Male"},
        {key:"female",label:"Female"}
    ]
    return (
        <Modal size="md" placement="center" isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">{mode === "add" ? "Add Doctor" : "Update Doctor"}</ModalHeader>
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
                                label="LicenseNumber"
                                name="licenseNumber"
                                value={formData.licenseNumber}
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
                                label="Phonenumber"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                fullWidth
                                required

                            />
                            
                            <Input
                                label="Specialization"
                                name="specialization"
                                value={formData.specialization}
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
                                {doctorGender.map((gender:any) => (
                                    <SelectItem key={gender.key} value={gender.key} >{gender.label}</SelectItem>
                                ))}
                            </Select>
                            
                            <Input
                                label="RegistrationNumber"
                                name="registrationNumber"
                                value={formData.registrationNumber}
                                onChange={handleChange}
                                fullWidth
                                required

                            />


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

export default DoctorModal