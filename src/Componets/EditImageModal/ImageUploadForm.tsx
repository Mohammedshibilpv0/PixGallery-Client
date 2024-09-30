import React, { useState, useEffect, useRef } from "react";
import { editImage } from "../../api/userApi/userApi";
import { message } from "antd";

interface EditModalProps {
  id: string;
  title: string;
  src: string; 
  isOpen: boolean;
  action: string; 
  onClose: () => void;
  onSave: (id: string, updatedTitle: string, updatedSrc: string) => void; 
}

const EditImageModal: React.FC<EditModalProps> = ({
  id,
  title,
  src,
  isOpen,
  onClose,
  onSave,
  action,
}) => {
  const [newTitle, setNewTitle] = useState(title);
  const [newSrc, setNewSrc] = useState<string>(src);
  const [previewImage, setPreviewImage] = useState<string>(src); 
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setNewTitle(title);
    setNewSrc(src);
    setPreviewImage(src);
    setError(null);
  }, [id, title, src, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      if (files.length > 1) {
        setError("You can only upload one image at a time.");
        return;
      }
      setError(null);

      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setPreviewImage(reader.result.toString()); 
          setNewSrc(URL.createObjectURL(file)); 
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSave = async() => {
    onSave(id, newTitle, newSrc);
   const response= await  editImage(id,newSrc,newTitle)
   if(response.message=="Image edited successfully"){
    message.success(response.message)
   }else{
    message.success(response.message)
   }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white p-4 rounded-lg w-96">
        <h2 className="text-lg font-bold mb-4">{action === "Add Image" ? "Add New Image" : "Edit Image"}</h2>
        <input
          className="w-full mb-3 p-2 border rounded"
          type="text"
          placeholder="Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />

        <input
          ref={fileInputRef}
          className="hidden"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />

        {action === "Add Image" && (
          <button
            onClick={handleUploadClick}
            className="w-full mb-3 bg-gray-200 hover:bg-gray-300 text-black p-2 rounded"
          >
            Upload Image
          </button>
        )}

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <div className="mb-3">
          <h3 className="font-semibold">{action === "Add Image" ? "New Image Preview:" : "Click the image to edit it:"}</h3>
          <div className="flex flex-wrap gap-2">
            <img
              src={previewImage}
              alt="Preview"
              className="w-24 h-24 object-cover border rounded cursor-pointer"
              onClick={handleUploadClick}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="bg-gray-300 p-2 rounded">
            Cancel
          </button>
          <button onClick={handleSave} className="bg-blue-500 text-white p-2 rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditImageModal;
