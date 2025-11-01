"use client";
import { FiMapPin } from "react-icons/fi";
import Image from "next/image";
import { Button, DatePicker, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, TimeInput, useDisclosure } from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import { Time, ZonedDateTime } from "@internationalized/date";
import { message } from "antd";
import createAxiosInstance from "@/context/axiosInstance";
import { AppointmentStatus } from "@/types";

type Appointment = {
  patient: {
    name: string;
    // type: string; 
    image: string
  };
  //   location: string;
  date: ZonedDateTime;
  startTime: Time;
  endTime: Time;
};

interface Appointment1 {
  id?: string;
  schedule: string;
  reason: string;
  patientName: string;
  status: AppointmentStatus;
  doctor: {
    firstName: string,
    lastName: string,
  }
}

export const CardUpcomingAppointment = (props: Appointment) => {
  let [date, setDate] = useState(props.date);
  let [startTime, setStartTime] = useState(props.startTime);
  let [endTime, setEndTime] = useState(props.endTime);
  const [cancelationReason, setCancelationReason] = useState("");
  const [newSchedule, setNewSchedule] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment1 | null>(null);
  const [appointments, setAppointments] = useState<Appointment1[]>([]);

  const axiosInstance = createAxiosInstance();
  const {
    isOpen: isRescheduleOpen,
    onOpen: onRescheduleOpen,
    onOpenChange: onRescheduleOpenChange,
    onClose: onRescheduleClose
  } = useDisclosure();

  const {
    isOpen: isCancelOpen,
    onOpen: onCancelOpen,
    onOpenChange: onCancelOpenChange,
    onClose: onCancelClose
  } = useDisclosure();



  // To be used in update appointment api call
  let dateTime = useMemo(() => {
    return {
      date: date.toString(),
      startTime: startTime.toString(),
      endTime: endTime.toString(),
    };
  }, [date, startTime, endTime]);

  const fetchData = async () => {
    await axiosInstance
      .get("/appointment/patient")
      .then((response) => {
        setAppointments(response.data);
        // console.log("Data",response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }
  const handleCancelAppointment = async (id: any) => {
    if (!cancelationReason.trim()) return (message.error("Cancelationreson required"))
    try {
      const res = await axiosInstance
        .patch(`http://localhost:5001/patient/cancelappointment/${selectedAppointment?.id}`,
          { cancelationReason });
      fetchData()
      onCancelOpenChange()
      if (res?.status === 200) {
        message.success("Appointment canceled");
      }

    } catch (error) {
      console.error("Error in canceling appointment", error);

    }
  }

  const rescheduleAppointment = async (id: any) => {
    if (!newSchedule.trim()) return (message.error("New appointment time and date required"))
    try {
      const res = await axiosInstance.patch(`/patient/rescheduleappointment/${selectedAppointment?.id}`, {
        schedule: newSchedule,
      });
      fetchData()
      onRescheduleOpenChange()
      if (res?.status === 200) {
        message.success("Appointment Rescheduled")
      }
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
    }
  };

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="flex flex-col flex-wrap justify-between border rounded-lg w-full max-w-xl bg-white">
      <p className="p-4 border-b text-lg font-bold">Upcoming Appointment</p>
      <div className="p-4  flex flex-col gap-2 text-gray-600">
        {/* <DatePicker
          className="max-w-md"
          granularity="day"
          label={date.toDate().toDateString()}
          value={date}
          onChange={async (e) => {
            setDate(e);
            // TODO: Update appointment api call
          }}
        /> */}
        <div className="flex pt-2 gap-4 items-center">
          <TimeInput
            value={startTime}
            onChange={async (e) => {
              setStartTime(e);
              // TODO: Update appointment api call
            }}
          />
          -
          <TimeInput
            value={endTime}
            onChange={async (e) => {
              setEndTime(e);
              // TODO: Update appointment api call
            }}
          />
        </div>
        {/* <p className="flex gap-4 items-center">
          <FiMapPin />
          {props?.location}
        </p> */}
      </div>
      <div className="flex gap-4 p-4 pt-0 my-4">
        <Image
          src={props?.patient?.image}
          alt={"image"}
          width={200}
          height={200}
          className="w-[60px] h-[60px] rounded object-cover"
        />
        <div>
          <p className="text-xl font-bold">{props?.patient?.name}</p>
          {/* <p className="text-gray-600">{props?.patient?.type}</p> */}
        </div>
      </div>
      <div className="p-4 border-t flex gap-4">
        {appointments.length > 0 && (
            <>
            <Button 
            variant="solid" 
            color="primary" 
            className="w-full"
            onPress={() =>{
                onRescheduleOpen()
                setSelectedAppointment(appointments[0])
            }}
          >
            {appointments[0].status === "rescheduled" ? "Rescheduled" : "Reschedule"}
          </Button>
          <Button
            variant="bordered"
            color="danger"
            className="md:w-full opacity-80 w-full bg-red-400/20"
            isDisabled= {appointments[0].status === "canceled_by_user" || appointments[0].status === "canceled" ||
              appointments[0].status === "canceled_by_doctor"}
            onPress={() => {
              onCancelOpen()
              setSelectedAppointment(appointments[0])
            }}
          >
            {
            appointments[0].status === "canceled_by_user" || appointments[0].status === "canceled" ||
            appointments[0].status === "canceled_by_doctor" || appointments[0].status === "canceled_by_admin" 
             ? "Canceled" : "Cancel Appointment"}
          </Button>
          </>
        )}
      </div>
      {/* Cancellation Modal */}
      <Modal isOpen={isCancelOpen} onOpenChange={onCancelOpenChange} onClose={onCancelClose}>
        <ModalContent>
          {(onCancelClose) => (
            <>
              <ModalHeader>Cancel Appointment</ModalHeader>
              <ModalBody>
                <p>Are you sure you want to cancel this appointment?</p>
                <Input
                  required
                  type="text"
                  label="Cancellation Reason"
                  onChange={(e: any) => setCancelationReason(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onClick={handleCancelAppointment}>
                  Confirm
                </Button>
                <Button onPress={onCancelClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Reschedule Modal */}
      <Modal isOpen={isRescheduleOpen} onOpenChange={onRescheduleOpenChange} onClose={onRescheduleClose}>
        <ModalContent>
          {(onRescheduleClose) => (
            <>
              <ModalHeader>Reschedule Appointment</ModalHeader>
              <ModalBody>
                <p>Select a new date and time:</p>
                <Input required type="datetime-local" onChange={(e) => setNewSchedule(e.target.value)} />
              </ModalBody>
              <ModalFooter>
                <Button color="warning" onClick={rescheduleAppointment}>
                  Reschedule
                </Button>
                <Button onPress={onRescheduleClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
