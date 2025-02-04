/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import ActionButton from "@/app/components/actionButton";
import Modal, { ModalContent, ModalRef } from "@/app/components/ui/modal";
import UserListItem from "@/app/components/users/userListItem";
import UsersForm from "@/app/components/users/usersForm";
import { User } from "@/app/types/auction";
import { getUsers } from "@/lib/actions";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";

const Users = () => {
  const newUserModalRef = useRef<ModalRef>(null);
  const [users, setUsers] = useState<User[]>([]);
  const { data: session } = useSession();

  const fetchUsers = async () => {
    try {
      if (session?.user.accessToken) {
        const { data, errors } = await getUsers(
          session.user.accessToken.access_token
        );
        if (!errors) {
          setUsers(data!);
        }
      }
    } catch (error) {
      console.warn("Error Getting Vehicles: ", error);
    }
  };

  const onActionSuccess = () => {
    fetchUsers();
    newUserModalRef.current?.closeModal();
  };

  useEffect(() => {
    if (session?.user.accessToken) {
      fetchUsers();
    }
  }, [session]);

  return (
    <section
      id="users-section"
      className="p-6 space-y-4 flex flex-col gap-4 relative"
    >
      <div className="w-full flex justify-end">
        <ActionButton
          text="Nuebo Usuario"
          type="add"
          onClick={() => {
            newUserModalRef.current?.openModal();
          }}
        />
      </div>
      <div className="w-full  flex flex-col gap-4">
        {users.map((user, indx) => (
          <UserListItem
            key={indx}
            user={user}
            onSuccess={onActionSuccess}
            session={session || undefined}
          />
        ))}
      </div>
      <Modal ref={newUserModalRef}>
        <ModalContent>
          <UsersForm
            onSuccess={onActionSuccess}
            session={session}
          />
        </ModalContent>
      </Modal>
    </section>
  );
};

export default Users;
