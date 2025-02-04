"use client";
import Image from "next/image";
import React from "react";

const PictureRenderer = ({ images }: { images: string[] }) => {
  if (!images || images.length === 0) return null;

  const displayedImages = images.slice(0, 5); // Show only 5 images (first + 4 small ones)
  const remainingImages = images.length - displayedImages.length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full max-w-2xl">
      {/* First Large Image */}
      <div className="col-span-2 row-span-2 relative">
        <Image
          src={displayedImages[0]}
          alt="Main"
          width={60}
          height={60}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* Small Images */}
      {displayedImages.slice(1).map((img, index) => (
        <div key={index} className="relative">
          <Image
            src={img}
            alt={`Preview ${index + 1}`}
            width={60}
            height={60}
            className="w-full h-full object-cover rounded-lg"
          />

          {/* Show overlay if there are more images */}
          {index === displayedImages.length - 2 && remainingImages > 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-2xl font-bold rounded-lg">
              +{remainingImages}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PictureRenderer;
