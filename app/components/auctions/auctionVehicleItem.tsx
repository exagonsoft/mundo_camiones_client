"use client";

import React, { useEffect } from "react";
import { Vehicle } from "@/app/types/auction";
import Image from "next/image";
import { Session } from "next-auth";
import RenderCountry from "@/app/components/ui/countryRenderer";

const AuctionVehicleItemList = ({
  vehicle,
  onCheck,
  checked,
  session,
}: {
  vehicle: Vehicle;
  onCheck: (operation: "remove" | "add", vehicleId: string) => void;
  checked: boolean;
  session?: Session;
}) => {

  const handleChange = async () => {
    const _operation = checked ? 'remove' : 'add';
    onCheck(_operation, vehicle._id)
  };


  useEffect(() => {}, [session, checked]);

  return (
    <div className="w-full flex justify-between items-center rounded-lg shadow-md">
      <div className="w-[90%] flex justify-between items-center text-sm">
        <div className="w-1/5">
          <Image
            src={vehicle.media.filter((media) => media.type === "image")[0].url}
            alt="Image"
            width={80}
            height={40}
            className="rounded-l-lg"
          />
        </div>
        <div className="w-2/5 flex justify-start items-center">
          {vehicle.title}
        </div>
        <div className="w-1/5 flex justify-center items-center">
          <RenderCountry country={vehicle.country} />
        </div>
        <div className="w-1/5 flex justify-center items-center">{`$ ${vehicle.price} usd`}</div>
      </div>
      <div className="w-[10%] flex justify-center items-center gap-4">
        <input type="checkbox" className="" checked={checked} onChange={() => console.log("changed")} onClick={handleChange}/>
      </div>
    </div>
  );
};

export default AuctionVehicleItemList;
