"use client";
import { FiMapPin } from "react-icons/fi";
import Image from "next/image";
import { Button, DatePicker, Link, TimeInput } from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import { Time, ZonedDateTime } from "@internationalized/date";
import createAxiosInstance from "@/context/axiosInstance";
import { message } from "antd";

type Appointment = {
  ambulance: {
    name: string;
    // type: string; 
    image: string
  };
  //   location: string;
  date: ZonedDateTime;
  //   startTime: Time;
  //   endTime: Time;
};

interface Ambulance {
  id?: string;
  aidCarType: string;
  status: string;
  ambulance: {
    owner: string,
    name: string
  },
  patient: {
    firstName: string,
    lastName: string
  }
}

export const RequestedAmbulanceCard = (props: Appointment) => {
  let [date, setDate] = useState(props.date);
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);

  let dateTime = useMemo(() => {
    return {
      date: date.toString(),
      //   startTime: startTime.toString(),
      //   endTime: endTime.toString(),
    };
  }, [date]);
  const axiosInstance = createAxiosInstance();

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    await axiosInstance
      .get("/ambulance/ambulancerequests")
      .then((response) => {
        setAmbulances(response.data);
      })
      .catch((error) => {
        console.error(error);
      })
  }

  const handleCancelAmbulanceRequest = async (id: string | any) => {
      try {
        const res = await axiosInstance
          .patch(`http://localhost:5001/patient/cancelrequest/${id}`, { status: "canceled" })
        
  
        fetchData();
  
        if (res?.status === 200) {
          message.success("Request canceled");
        }
      } catch (error) {
        console.error("Error in canceling request");
  
      }
    }

  return (
    <div className="flex flex-col flex-wrap justify-between border rounded-lg w-full max-w-xl bg-white">
      <p className="p-4 border-b text-lg font-bold">Booked Ambulance</p>
      <div className="p-4  flex flex-col gap-2 text-gray-600">
        <DatePicker
          className="max-w-md"
          isDisabled
          granularity="day"
          label={date.toDate().toDateString()}
          value={date}
          onChange={async (e) => {
            setDate(e);
            // TODO: Update appointment api call
          }}
        />
        <div className="flex pt-2 gap-4 items-center">
          {/* <TimeInput
            value={date}
            onChange={async (e) => {
              setDate(e);
              // TODO: Update appointment api call
            }}
          /> */}
          {/* -
          <TimeInput
            value={endTime}
            onChange={async (e) => {
              setEndTime(e);
              // TODO: Update appointment api call
            }}
          /> */}
        </div>
        {/* <p className="flex gap-4 items-center">
          <FiMapPin />
          {props?.location}
        </p> */}
      </div>
      <div className="flex gap-4 p-4 pt-0 my-4">
        <Image
          src={props?.ambulance?.image}
          alt={"image"}
          width={200}
          height={200}
          className="w-[60px] h-[60px] rounded object-cover"
        />
        <div>
          <p className="text-xl font-bold">{props?.ambulance?.name}</p>
          {/* <p className="text-gray-600">{props?.patient?.type}</p> */}
        </div>
      </div>
      <div className="p-4 border-t flex gap-4">
        {ambulances.length > 0 && (
          <>
          <Button 
           variant="solid"  
           color="primary"
           className="w-full"
           isDisabled = {ambulances[0].status === "canceled_by_user"}
           >
            <Link href={`/patient/track/${ambulances[0].id}`} className="text-light">Track Ambulance</Link>
          </Button>
          <Button
            variant="bordered"
            color="danger"
            className="md:w-full opacity-80 w-full bg-red-400/20"
            isDisabled = {ambulances[0].status === "canceled_by_user"}
            onPress={() => {
              handleCancelAmbulanceRequest(ambulances[0].id)
            }}
          >
            {ambulances[0].status === "canceled_by_user" ? "Cancelled" : "Cancel Request"}
          </Button>
          </>
        )}
      </div>
    </div>
  );
};
