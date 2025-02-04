/* eslint-disable react-hooks/exhaustive-deps */
import React, { FormEvent, useEffect, useState } from "react";
import { LabelInputContainer } from "../ui/labelInputContainer";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Auction, Vehicle } from "@/app/types/auction";
import { Session } from "next-auth";
import { Select } from "../ui/select";
import {
  auctionCreateRequest,
  auctionUpdateRequest,
  getUsers,
  getVehicles,
} from "@/lib/actions";
import AuctionVehicleItemList from "./auctionVehicleItem";

interface UserFormProps {
  session?: Session | null;
  auction?: Auction;
  onSuccess: () => void;
  onCancel?: () => void;
}

const AuctionForm = ({
  session,
  auction,
  onSuccess,
  onCancel,
}: UserFormProps) => {
  const [auctionData, setAuctionData] = useState<Auction>(
    auction || {
      _id: "",
      startDate: new Date(),
      endDate: new Date(),
      auctioneerId: "",
      vehicles: [],
      active: false,
    }
  );
  const [auctioneers, setAuctioneers] =
    useState<{ value: string; label: string }[]>();
  const [vehicles, setVehicles] = useState<Vehicle[] | null>();

  // Correctly update vehicleData
  const updateAuctionData = (target: keyof Auction, value: string) => {
    setAuctionData((prevData) => ({
      ...prevData,
      [target]: value, // Corrected dynamic key assignment
    }));
  };

  const updateAuctionVehicles = (
    operation: "remove" | "add",
    vehicleId: string
  ) => {
    setAuctionData((prevAuctionData) => {
      // Ensure vehicles array exists
      const updatedVehicles = prevAuctionData.vehicles
        ? [...prevAuctionData.vehicles]
        : [];

      switch (operation) {
        case "add":
          if (!updatedVehicles.includes(vehicleId)) {
            updatedVehicles.push(vehicleId);
          }
          break;

        case "remove":
          return {
            ...prevAuctionData,
            vehicles: updatedVehicles.filter(
              (_vehicle) => _vehicle !== vehicleId
            ),
          };

        default:
          return prevAuctionData;
      }

      return {
        ...prevAuctionData,
        vehicles: updatedVehicles,
      };
    });
  };

  const fetchDependencies = async () => {
    try {
      const [_users, _vehicles] = await Promise.all([
        getUsers(session!.user.accessToken.access_token),
        getVehicles(session!.user.accessToken.access_token),
      ]);

      // Ensure _users.data exists before filtering
      const _auctioneers =
        _users?.data?.filter((_user) => _user.role === "auct") || [];

      const _auctioneerOpt = _auctioneers.map((_auctioneer) => ({
        value: _auctioneer._id,
        label: _auctioneer.username,
      }));

      setAuctioneers(_auctioneerOpt);
      setVehicles(_vehicles.data);
    } catch (error) {
      console.error("Error fetching dependencies:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      if (auction) {
        const response = await auctionUpdateRequest(
          auction._id,
          auctionData,
          session?.user.accessToken.access_token
        );
        if (!response.errors) {
          onSuccess();
        }
      } else {
        const response = await auctionCreateRequest(
          auctionData,
          session?.user.accessToken.access_token
        );
        if (!response.errors) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  useEffect(() => {
    if (session) {
      fetchDependencies();
    }
  }, [session]);

  useEffect(() => {}, [vehicles]);

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full h-full flex flex-col gap-4"
    >
      <h2 className="text-center text-xl text-black dark:text-white font-bold uppercase mb-4">
        {`${auction ? `Editar Subasta ${auction._id}` : "Crear nueba Subasta"}`}
      </h2>

      <div className="flex flex-col w-full justify-between items-center md:items-start gap-4">
        <div className="w-full flex justify-between items-center gap-4">
          {/* Title */}
          <LabelInputContainer className="">
            <Label htmlFor="startDate">Fecha de Inicio</Label>
            <Input
              id="startDate"
              type="datetime-local"
              value={
                auctionData.startDate
                  ? new Date(auctionData.startDate).toISOString().slice(0, 16)
                  : ""
              }
              onChange={(e) => updateAuctionData("startDate", e.target.value)}
              required
            />
          </LabelInputContainer>

          {/* Description */}
          <LabelInputContainer className="">
            <Label htmlFor="endDate">Fecha de Terminacion</Label>
            <Input
              id="endDate"
              name="endDate"
              type="datetime-local"
              value={
                auctionData.startDate
                  ? new Date(auctionData.endDate).toISOString().slice(0, 16)
                  : ""
              }
              onChange={(e) => updateAuctionData("endDate", e.target.value)}
              required
            />
          </LabelInputContainer>
        </div>
        {/* Country Select */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="auctioneer">Martillero</Label>
          <Select
            id="auctioneer"
            name="auctioneer"
            required
            value={auctionData?.auctioneerId || ""}
            onChange={(e) => updateAuctionData("auctioneerId", e.target.value)}
            options={[
              { value: "", label: "Seleccione uno" },
              ...(auctioneers || []),
            ]}
            className="w-full"
          />
        </LabelInputContainer>
      </div>

      <div className="w-full flex flex-col justify-start items-start gap-4">
        <h2 className="text-lg font-bold text-blue-800">Asociar Vehiculo</h2>
        {vehicles?.map((_vehicle, indx) => (
          <AuctionVehicleItemList
            key={indx}
            session={session!}
            vehicle={_vehicle}
            checked={auctionData.vehicles.includes(_vehicle._id)}
            onCheck={updateAuctionVehicles}
          />
        ))}
      </div>
      <div className="w-full flex justify-end items-center gap-4">
        {auction && (
          <button
            disabled={!session}
            type="button"
            onClick={onCancel}
            className="w-full p-4 py-2 rounded-lg flex justify-center items-center bg-red-600 hover:bg-red-900 shadow-sm hover:shadow-lg transition-all duration-300 text-black dark:text-white"
          >
            Cancelar
          </button>
        )}
        <button
          disabled={!session}
          type="submit"
          className="w-full p-4 py-2 rounded-lg flex justify-center items-center bg-green-600 hover:bg-green-900 shadow-sm hover:shadow-lg transition-all duration-300 text-black dark:text-white"
        >
          Confirmar
        </button>
      </div>
    </form>
  );
};

export default AuctionForm;
