import { IconQuestionMark } from '@tabler/icons-react';
import React from 'react'
import ActionButton from '../actionButton';

interface DialogProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDialog = ({title, message, onConfirm, onCancel}:DialogProps) => {
  return (
    <div className="w-full p-4 flex flex-col gap-4 justify-start items-center">
        <div className="w-full flex items-center justify-start gap-4">
            <IconQuestionMark width={24} height={24}/>
            <span className="font-bold text-lg">{title}</span>
        </div>
        <div className="w-full flex flex-col items-start justify-start gap-4">
            <p className="">{message}</p>
            <span className="font-bold">Decea continuar</span>
        </div>
        <div className="w-full flex items-center justify-end gap-4">
            <ActionButton text='Cancelar' type="none" onClick={onCancel}/>
            <ActionButton text='Confirmar' type="none" onClick={onConfirm} className='bg-red-400 text-black hover:bg-red-800 hover:text-white'/>
        </div>
    </div>
  )
}

export default ConfirmDialog