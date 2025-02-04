import React, { FormEvent, useEffect, useState } from "react";
import { LabelInputContainer } from "../ui/labelInputContainer";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { rolesOptions } from "@/lib/constants";
import { Select } from "../ui/select";
import { User } from "@/app/types/auction";
import { Session } from "next-auth";
import { userCreateRequest } from "@/lib/actions";

interface UserFormProps {
  session?: Session | null;
  onSuccess: () => void;
}

const UsersForm = ({ session, onSuccess}: UserFormProps) => {
  const [newUserData, setNewUserData] = useState<User>({
    _id: "",
    username: "",
    password: "",
    role: "",
  });

  // Correctly update vehicleData
  const updateUserData = (target: keyof User, value: string) => {
    setNewUserData((prevData) => ({
      ...prevData,
      [target]: value, // Corrected dynamic key assignment
    }));
  };

  // Handle form submission
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const response = await userCreateRequest(
        newUserData,
        session?.user.accessToken.access_token
      );

      if (!response.errors) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  useEffect(() => {}, [session]);
  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full h-full flex flex-col p-4 gap-4"
    >
      <h2 className="text-center text-xl text-black dark:text-white font-bold uppercase mb-4">
        Registrar nuebo Usuario
      </h2>

      <div className="flex flex-col w-full justify-between items-center md:items-start gap-4">
        {/* Title */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="username">Nombre de Usuario</Label>
          <Input
            id="username"
            placeholder="Ej. lopezramon"
            type="text"
            defaultValue={""}
            onChange={(e) => updateUserData("username", e.target.value)}
            required
          />
        </LabelInputContainer>

        {/* Description */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Contrasena</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Ej. ******"
            defaultValue={""}
            onChange={(e) => updateUserData("password", e.target.value)}
            required
          />
        </LabelInputContainer>

        {/* Country Select */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="country">Rol</Label>
          <Select
            id="country"
            name="country"
            required
            defaultValue={""}
            onChange={(e) => updateUserData("role", e.target.value)}
            options={rolesOptions}
            className="w-full"
          />
        </LabelInputContainer>
      </div>
      <div className="w-full flex justify-end items-center gap-4">
        <button
          disabled={!session}
          type="submit"
          className="w-full p-4 py-2 rounded-lg flex justify-center items-center bg-green-600 hover:bg-green-900 shadow-sm hover:shadow-lg transition-all duration-300 text-black dark:text-white"
        >
          Confirm
        </button>
      </div>
    </form>
  );
};

export default UsersForm;
