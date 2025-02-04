"use client"
import { User } from "@/app/types/auction";
import { Session } from "next-auth";
import React, { useEffect, useRef } from "react";
import ActionButton from "../actionButton";
import Modal, { ModalContent, ModalRef } from "../ui/modal";
import ConfirmDialog from "../ui/confirmDialog";
import { userDeleteRequest } from "@/lib/actions";
import UsersUpdateForm from "./userUpdateForm";

const UserListItem = ({
  user,
  onSuccess,
  onActionCancel,
  session,
}: {
  user: User;
  onSuccess: () => void;
  onActionCancel?: () => void;
  session?: Session;
}) => {
  const deleteUserModalRef = useRef<ModalRef>(null);
  const updateUserModalRef = useRef<ModalRef>(null);

  const onConfirm = async () => {
    if (session) {
      await userDeleteRequest(
        user._id,
        session.user.accessToken.access_token
      );
      onSuccess();
      deleteUserModalRef.current?.closeModal();
    }
  };

  const onActionSuccess = () => {
    onSuccess();
    updateUserModalRef.current?.closeModal();
  };

  const onCancel = () => {
    updateUserModalRef.current?.closeModal();
    if(onActionCancel)
       onActionCancel();
  }

  useEffect(() => {}, [session]);
  return (
    <div className="w-full flex justify-between items-center rounded-lg shadow-md p-4">
      <div className="w-4/5 flex justify-between items-center text-sm">
        <div className="w-1/2 flex justify-start items-center">
          {user.username}
        </div>
        <div className="w-1/2 flex justify-center items-center">{`${user.role}`}</div>
      </div>
      <div className="w-1/5 flex justify-center items-center gap-4">
        <ActionButton
          type="edit"
          text="Detalles"
          onClick={() => updateUserModalRef.current?.openModal()}
        />
        <ActionButton
          type="delete"
          text="Eliminar"
          onClick={() => deleteUserModalRef.current?.openModal()}
        />
      </div>
      <Modal ref={deleteUserModalRef}>
        <ModalContent>
          <ConfirmDialog
            title="Eliminar Usuario"
            message="Esta operacion es irrevercible y toda la data asociada se perdera.?"
            onCancel={() => deleteUserModalRef.current?.closeModal()}
            onConfirm={onConfirm}
          />
        </ModalContent>
      </Modal>
      <Modal ref={updateUserModalRef} className="">
        <ModalContent className="">
          <UsersUpdateForm user={user} onSuccess={onActionSuccess} onCancel={onCancel} session={session}/>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UserListItem;
