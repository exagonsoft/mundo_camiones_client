"use client";

import React, { useEffect, useRef } from "react";
import { Vehicle } from "../types/auction";
import Image from "next/image";
import ActionButton from "./actionButton";
import Modal, { ModalContent, ModalRef } from "./ui/modal";
import ConfirmDialog from "./ui/confirmDialog";
import { vehicleDeleteRequest } from "@/lib/actions";
import { Session } from "next-auth";
import RenderCountry from "./ui/countryRenderer";
import VehicleUpdateForm from "./vehicles/vehicleUpdateForm";

const VehicleItemList = ({
  vehicle,
  onSuccess,
  session,
}: {
  vehicle: Vehicle;
  onSuccess: () => void;
  session?: Session;
}) => {
  const deleteVehicleModalRef = useRef<ModalRef>(null);
  const updateVehicleModalRef = useRef<ModalRef>(null);

  const onConfirm = async () => {
    if (session) {
      await vehicleDeleteRequest(
        vehicle._id,
        session.user.accessToken.access_token
      );
      onSuccess();
      deleteVehicleModalRef.current?.closeModal();
    }
  };

  const onUpdateSuccess = () => {
    onSuccess();
    updateVehicleModalRef.current?.closeModal();
  };

  useEffect(() => {}, [session]);

  return (
    <div className="w-full flex justify-between items-center rounded-lg shadow-md">
      <div className="w-4/5 flex justify-between items-center text-sm">
        <div className="w-1/5">
          <Image
            src={vehicle.media.filter((media) => media.type === "image")[0].url}
            alt="Image"
            width={120}
            height={60}
            className="rounded-l-lg"
          />
        </div>
        <div className="w-1/3 flex justify-start items-center">
          {vehicle.title}
        </div>
        <div className="w-1/4 flex justify-center items-center">
          <RenderCountry country={vehicle.country} />
        </div>
        <div className="w-1/4 flex justify-center items-center">{`$ ${vehicle.price} usd`}</div>
      </div>
      <div className="w-1/5 flex justify-center items-center gap-4">
        <ActionButton type="edit" text="Detalles" onClick={() => updateVehicleModalRef.current?.openModal()}/>
        <ActionButton
          type="delete"
          text="Eliminar"
          onClick={() => deleteVehicleModalRef.current?.openModal()}
        />
      </div>
      <Modal ref={deleteVehicleModalRef}>
        <ModalContent>
          <ConfirmDialog
            title="Eliminar Publicacion"
            message="Esta operacion es irrevercible y toda la data asociada se perdera.?"
            onCancel={() => deleteVehicleModalRef.current?.closeModal()}
            onConfirm={onConfirm}
          />
        </ModalContent>
      </Modal>
      <Modal ref={updateVehicleModalRef} className="md:max-w-[60%]">
        <ModalContent className="">
          <VehicleUpdateForm
            session={session}
            vehicle={vehicle}
            onSuccess={onUpdateSuccess}
            onCancel={() => updateVehicleModalRef.current?.closeModal()}
          />
        </ModalContent>
      </Modal>
    </div>
  );
};

export default VehicleItemList;
