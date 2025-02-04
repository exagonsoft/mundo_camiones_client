"use client"

import { Vehicle, VehicleMedia } from "@/app/types/auction";
import { Session } from "next-auth";
import React, { FormEvent, useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { LabelInputContainer } from "../ui/labelInputContainer";
import { Select } from "../ui/select";
import { countryOptions } from "@/lib/constants";
import { FileUpload } from "../ui/file-upload";
import { checkMimeType, uploadToS3 } from "@/lib/utils";
import { vehicleCreateRequest } from "@/lib/actions";

interface VehicleFormProps {
  session?: Session | null;
  vehicle?: Vehicle | undefined;
  onSuccess: () => void;
}

const VehicleForm = ({ session, vehicle, onSuccess }: VehicleFormProps) => {
  const [vehicleData, setVehicleData] = useState<Vehicle>({
    _id: "",
    title: "",
    description: "",
    media: [],
    country: "",
    price: 0,
  });
  const [files, setFiles] = useState<File[]>([]);

  // Handle file selection
  const handleFileUpload = (uploadedFiles: File[]) => {
    setFiles(uploadedFiles);
    console.log(uploadedFiles);
  };

  // Correctly update vehicleData
  const updateVehicleData = (target: keyof Vehicle, value: string | number) => {
    setVehicleData((prevData) => ({
      ...prevData,
      [target]: value, // Corrected dynamic key assignment
    }));
  };

  // Handle form submission
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const media: VehicleMedia[] = await Promise.all(
        files.map(async (file) => {
          const mediaType = checkMimeType(file);
          const url = await uploadToS3(file);

          return {
            type: mediaType,
            url,
          };
        })
      );

      // Save vehicle with media
      const newVehicle = {
        ...vehicleData,
        media,
        userId: session?.user.id
      };

      const response = await vehicleCreateRequest(
        newVehicle,
        session?.user.accessToken.access_token
      );

      if (!response.errors) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  useEffect(() => {}, [session])

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full h-full flex flex-col p-4 gap-4"
    >
      <h2 className="text-center text-xl text-black dark:text-white font-bold uppercase mb-4">
        {vehicle
          ? `Detalles ${vehicle.title} Vehicle`
          : "Publicar nuevo Vehiculo"}
      </h2>

      <div className="flex flex-col w-full justify-between items-center md:items-start gap-4">
        {/* Title */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            name="title"
            placeholder="Ej. Mercedes Benz p34Hfn"
            type="text"
            value={vehicleData?.title || ""}
            onChange={(e) => updateVehicleData("title", e.target.value)}
            required
          />
        </LabelInputContainer>

        {/* Description */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="description">Descripción</Label>
          <textarea
            id="description"
            name="description"
            placeholder="Ej. Descripción del vehículo"
            value={vehicleData?.description || ""}
            onChange={(e) => updateVehicleData("description", e.target.value)}
            required
            className="flex h-28 w-full border-none bg-gray-50 dark:bg-zinc-800 text-black dark:text-white shadow-input rounded-md px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 dark:placeholder-text-neutral-600 focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600 disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-[0px_0px_1px_1px_var(--neutral-700)] group-hover/input:shadow-none transition duration-400"
          />
        </LabelInputContainer>

        {/* Country Select */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="country">País de Origen</Label>
          <Select
            id="country"
            name="country"
            required
            value={vehicleData?.country || ""}
            onChange={(e) => updateVehicleData("country", e.target.value)}
            options={countryOptions}
            className="w-full"
          />
        </LabelInputContainer>

        {/* Price */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="price">Precio</Label>
          <Input
            id="price"
            name="price"
            placeholder="Ej. 550000"
            type="number"
            value={vehicleData?.price || ""}
            onChange={(e) => updateVehicleData("price", Number(e.target.value))}
            required
          />
        </LabelInputContainer>

        {/* File Upload */}
        <FileUpload onChange={handleFileUpload} />
      </div>

      <button
        disabled={!session}
        type="submit"
        className="p-4 py-2 rounded-lg flex justify-center items-center bg-green-600 hover:bg-green-900 shadow-sm hover:shadow-lg transition-all duration-300 text-black dark:text-white"
      >
        Confirm
      </button>
    </form>
  );
};

export default VehicleForm;
