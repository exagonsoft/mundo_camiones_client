/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import ActionButton from "@/app/components/actionButton";
import Modal, { ModalContent, ModalRef } from "@/app/components/ui/modal";
import VehicleItemList from "@/app/components/vehicleItemList";
import VehicleForm from "@/app/components/vehicles/vehicleForm";
import { Vehicle } from "@/app/types/auction";
import { getVehicles } from "@/lib/actions";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";

const AuctioneerVehicles = () => {
  const newVehicleModalRef = useRef<ModalRef>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const { data: session } = useSession();

  const fetchVehicles = async () => {
    try {
      if (session?.user.accessToken) {
        const { data, errors } = await getVehicles(
          session.user.accessToken.access_token
        );
        if (!errors) {
          setVehicles(data!);
        }
      }
    } catch (error) {
      console.warn("Error Getting Vehicles: ", error);
    }
  };

  const onActionSuccess = () => {
    fetchVehicles();
    newVehicleModalRef.current?.closeModal();
  };

  useEffect(() => {
    if (session?.user.accessToken) {
      fetchVehicles();
    }
  }, [session]);

  return (
    <section
      id="vehicle-section"
      className="p-6 space-y-4 flex flex-col gap-4 relative"
    >
      <div className="w-full flex justify-end">
        <ActionButton
          text="Publicar Vehiculo"
          type="add"
          onClick={() => {
            newVehicleModalRef.current?.openModal();
          }}
        />
      </div>
      <div className="w-full  flex flex-col gap-4">
        {vehicles.map((vehicle, indx) => (
          <VehicleItemList key={indx} vehicle={vehicle} onSuccess={onActionSuccess} session={session || undefined}/>
        ))}
      </div>
      <Modal ref={newVehicleModalRef}>
        <ModalContent>
          <VehicleForm session={session} onSuccess={onActionSuccess} />
        </ModalContent>
      </Modal>
    </section>
  );
};

export default AuctioneerVehicles;
