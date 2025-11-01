"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from 'framer-motion'


import React from 'react'

function LoadingAnnimation() {
    const [isVissible, setIsVissible] = useState(true);
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 3500)

        return () => clearTimeout(timer);
    }, [])
    return (

        <div>
            {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white 5-50">
                    <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin">

                    </div>
                </div>
            )}
        </div>
        // isVissible && (
        //     // <motion.div
        //     //     initial={{ opacity:1 }}
        //     //     animate={{ opacity:0 }}
        //     //     transition={{ duration:1.5, ease:'easeOut'}}
        //     //     className="fixed inset-0 flex items-center justify-center bg-black z-50"
        //     // >
        //     //     <motion.div
        //     //     initial={{ scale:0.8,opacity:0}}
        //     //     animate={{ scale:1, opacity:1 }}
        //     //     transition={{ duration:1.5, ease:"easeInOut"}}
        //     //     className="flex items-center justify-center"
        //     //     >

        //     //     </motion.div>
        //     // </motion.div>
        // )
    )
}

export default LoadingAnnimation
