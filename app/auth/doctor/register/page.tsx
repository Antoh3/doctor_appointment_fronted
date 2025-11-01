"use client";
// import '@/styles/App.css'
// import '@/styles/index.css'

import { motion } from "framer-motion"
import { useEffect, useState } from "react";
import { message } from "antd";
import Link from "next/link";
import Header from "@/components/Header";
import Image from "next/image";
import createAxiosInstance from "@/context/axiosInstance";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

function Login() {

    // user defined email and password states
    const [inputEmail, setInputEmail] = useState("")
    const [inputPassword, setInputPassword] = useState("")
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phone: "",
        gender: "",
        specialization: "",
        licenseNumber: "",
        registrationNumber: ""
    });
    const axiosInstance = createAxiosInstance();
    const { setAuth } = useAuth();
    const router = useRouter();

    const handleInputChange = (event: any) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    }
    // when user clicks on Login Button
    const loginUser = async () => {
        // setTimeout(() => {
        // input validation 
        if (formData.email === "" && formData.password !== "") {
            message.error("Input correct password")
            return
        }
        if (formData.email !== "" && formData.password === "") {
            message.error("Input correct email")
            return
        }
        if (formData.email === "" && formData.password === "") {
            message.error("Input email and password")
            return
        }
        let flag = true
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) flag = false;

        if (flag) {
            message.error("Invalid email address")
            return
        }
        // }, 2000)

        try {
            const response = await axiosInstance.post("/doctor/register", formData);
            // const response = await axios.post("http://localhost:5000/patient/login",formData);
            console.log(response.data);

            const { accessToken, refreshToken } = response.data;

            // localStorage.setItem("accessToken", accessToken);
            // localStorage.setItem("refreshToken", refreshToken);
            setAuth({ accessToken, refreshToken });

            if (response?.status === 201) {
                message.success("Signup successful.");
                // console.log("Login successful: ", response.data);
                router.push("/auth/doctor/login");
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 400) {
                    message.error("Email already exists!");
                }
            } else {
                message.error("An error occured");
                console.log(error);

            }
        }

    }


    return (
        <>
            <div className="flex items-center justify-center pt-20">
                <div className="">
                    <div className="signup_container">
                        <div className="flex flex-col space-y-2 text-center">
                            <h2 className="text-2xl font-semibold tracking-tight">Welcome Doctor 👋</h2>
                            <Image
                                alt="logo"
                                className="mx-auto mb-2"
                                height={200}
                                src="/images/doctorlogo.jpg"
                                width={50}
                            />
                        </div>
                        <h1>Register</h1>
                        <p>FirstName:</p>
                        <input type="text" name="firstName" value={formData.firstName} placeholder="Enter your firstname" onChange={handleInputChange} />
                        <p>LastName:</p>
                        <input type="text" name="lastName" value={formData.lastName} placeholder="Enter your lastname" onChange={handleInputChange} />
                        <p>Email:</p>
                        <input type="email" name="email" value={formData.email} placeholder="Enter your email address" onChange={handleInputChange} />
                        <p>PhoneNumber:</p>
                        <input type="number" name="phone" value={formData.phone} placeholder="Enter your phonenumber" onChange={handleInputChange} />
                        <p>Specialization:</p>
                        <input type="text" name="specialization" value={formData.specialization} placeholder="Enter specialization" onChange={handleInputChange} />
                        <p>LicenseNumber:</p>
                        <input type="text" name="licenseNumber" value={formData.licenseNumber} placeholder="Enter licenseNumber" onChange={handleInputChange} />
                        <p>RegistrationNumber:</p>
                        <input type="text" name="registrationNumber" value={formData.registrationNumber} placeholder="Enter RegistrationNumber" onChange={handleInputChange} />
                        <p>Gender:</p>
                        <select
                            name="gender"
                            // defaultValue={formData.gender}
                            value={formData.gender}
                            onChange={handleInputChange}>
                            <option>select gender....</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                        <p>Password:</p>
                        <input type="password" name="password" value={formData.password} placeholder="Enter your password" onChange={handleInputChange} />

                        <motion.button
                            whileTap={{ scale: 0.9 }} onClick={loginUser} >
                            SignUp
                            <i className="fa-solid fa-right-to-bracket"></i>
                        </motion.button>
                        <Link href={"/auth/doctor/login"}>Already have an account? Login</Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login;