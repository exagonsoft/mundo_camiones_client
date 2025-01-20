/* eslint-disable @next/next/no-img-element */

"use client"

import { StaticMedia } from "@/app/types/auction";
import React, { useEffect } from "react";

const MediaComponent = ({ productMedia }: { productMedia: StaticMedia }) => {
  useEffect(() => {}, [productMedia]);
  return (
    <>
      {productMedia ? (
        productMedia.type === "image" ? (
          <img
            src={productMedia.url}
            alt="Product Media"
            className="w-full h-56 object-cover border rounded-lg "
          />
        ) : (
          <video
            src={productMedia.url}
            controls
            className="w-full h-56 object-cover border rounded-lg"
          ></video>
        )
      ) : (
        <p>No media available</p>
      )}
    </>
  );
};

export default MediaComponent;
