/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import ActionButton from "@/app/components/actionButton";
import AuctionForm from "@/app/components/auctions/auctionForm";
import AuctionListItem from "@/app/components/auctions/auctionListItem";
import Modal, { ModalContent, ModalRef } from "@/app/components/ui/modal";
import { Auction } from "@/app/types/auction";
import { getAuctions } from "@/lib/actions";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";

const Auctions = () => {
  const newVehicleModalRef = useRef<ModalRef>(null);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const { data: session } = useSession();

  const fetchAuctions = async () => {
    try {
      if (session?.user.accessToken) {
        const { data, errors } = await getAuctions(
          session.user.accessToken.access_token
        );
        if (!errors) {
          setAuctions(data!);
        }
      }
    } catch (error) {
      console.warn("Error Getting Vehicles: ", error);
    }
  };

  const onActionSuccess = () => {
    fetchAuctions();
    newVehicleModalRef.current?.closeModal();
  };

  useEffect(() => {
    if (session?.user.accessToken) {
      fetchAuctions();
    }
  }, [session]);

  return (
    <section
      id="auctions-section"
      className="p-6 space-y-4 flex flex-col gap-4 relative"
    >
      <div className="w-full flex justify-end">
        <ActionButton
          text="Crear Subasta"
          type="add"
          onClick={() => {
            newVehicleModalRef.current?.openModal();
          }}
        />
      </div>
      <div className="w-full  flex flex-col gap-4">
        {auctions.map((auction, indx) => (
          <AuctionListItem
            key={indx}
            auction={auction}
            onSuccess={onActionSuccess}
            session={session || undefined}
          />
        ))}
      </div>
      <Modal ref={newVehicleModalRef} className="md:max-w-[60%]">
        <ModalContent>
          <AuctionForm onSuccess={onActionSuccess} session={session}/>
        </ModalContent>
      </Modal>
    </section>
  );
};

export default Auctions;
