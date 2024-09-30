import React from "react";
import { deleteImage } from "../../api/userApi/userApi";
import { message } from "antd"
interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  id:string
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm,id }) => {
  if (!isOpen) return null;
  const submitDelete = async()=>{
    const response=await deleteImage(id)
    if(response.message=='success'){
      message.success('Image successfully deleted')
    }else{
      message.error('Somthing went wrong please try again later')
    }
    onConfirm()
  }
  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white p-4 rounded-lg w-96">
        <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
        <p>Are you sure you want to delete this image?</p>
        <div className="flex justify-end space-x-2 mt-4">
          <button onClick={onClose} className="bg-gray-300 p-2 rounded">Cancel</button>
          <button onClick={submitDelete} className="bg-red-500 text-white p-2 rounded">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
