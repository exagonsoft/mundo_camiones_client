"use client";
import { Auction } from "@/app/types/auction";
import { Session } from "next-auth";
import React, { useEffect, useRef } from "react";
import Modal, { ModalContent, ModalRef } from "../ui/modal";
import ConfirmDialog from "../ui/confirmDialog";
import ActionButton from "../actionButton";
import ActiveRenderer from "../ui/activeRenderer";
import { auctionDeleteRequest } from "@/lib/actions";
import AuctionForm from "./auctionForm";
import ActionLink from "../ui/actionLink";

const AuctionListItem = ({
  auction,
  onSuccess,
  onActionCancel,
  session,
}: {
  auction: Auction;
  onSuccess: () => void;
  onActionCancel?: () => void;
  session?: Session;
}) => {
  const deleteAuctionModalRef = useRef<ModalRef>(null);
  const updateAuctionModalRef = useRef<ModalRef>(null);

  const onConfirm = async () => {
    if (session) {
      await auctionDeleteRequest(
        auction._id,
        session.user.accessToken.access_token
      );
      onSuccess();
      deleteAuctionModalRef.current?.closeModal();
    }
  };

  const onActionSuccess = () => {
    onSuccess();
    updateAuctionModalRef.current?.closeModal();
  };

  const onCancel = () => {
    updateAuctionModalRef.current?.closeModal();
    if (onActionCancel) onActionCancel();
  };

  useEffect(() => {}, [session]);
  return (
    <div className="w-full flex justify-between items-center rounded-lg shadow-md p-4">
      <div className="w-3/4 flex justify-between items-center text-sm">
        <div className="w-1/4 flex justify-start items-start flex-col">
          <span className="">{auction._id}</span>
          <span className="text-[.6rem] font-bold">{`Cantidad de Lotes: ${auction.vehicles.length}`}</span>
        </div>
        <div className="w-1/4 flex justify-center items-center">
          {new Date(auction.endDate).toLocaleString("en-US", {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </div>
        <div className="w-1/4 flex justify-center items-center">
          <ActiveRenderer active={auction.active} />
        </div>
        <div className="w-1/4 flex justify-center items-center">
          {new Date(auction.endDate).toLocaleString("en-US", {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </div>
      </div>
      <div className="w-1/4 flex justify-end items-center gap-4">
        <ActionLink
          type="none"
          text="Iniciar"
          href={`/auctioneer/auctions/${auction._id}`}
        />
        <ActionButton
          type="edit"
          text="Detalles"
          onClick={() => updateAuctionModalRef.current?.openModal()}
        />
        <ActionButton
          type="delete"
          hideText={true}
          onClick={() => deleteAuctionModalRef.current?.openModal()}
        />
      </div>
      <Modal ref={deleteAuctionModalRef}>
        <ModalContent>
          <ConfirmDialog
            title="Eliminar Subasta"
            message="Esta operacion es irrevercible y toda la data asociada se perdera.?"
            onCancel={() => deleteAuctionModalRef.current?.closeModal()}
            onConfirm={onConfirm}
          />
        </ModalContent>
      </Modal>
      <Modal ref={updateAuctionModalRef} className="md:max-w-[60%]">
        <ModalContent className="">
          <AuctionForm session={session} auction={auction} onCancel={onCancel} onSuccess={onActionSuccess}/>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AuctionListItem;
