import React, { useState, useRef } from "react";
import { Modal, Button, Input, message, Spin } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import axios from "axios";

interface IImageUploadProps {
  visible: boolean;
  onClose: () => void;
  onSave: (images: { url: string; title: string; file: File,_id:string }[]) => void;
}

interface IImageFile {
  url: string;
  title: string;
  file: File;
}

const AddImageModal: React.FC<IImageUploadProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [imageFiles, setImageFiles] = useState<IImageFile[]>([]);
  const [loading, setLoading] = useState(false); 
  const fileInputRef = useRef<HTMLInputElement | null>(null); 
  const maxImages = 7;
  const userId = useSelector((config: RootState) => config.user.userInfo?._id);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const files = Array.from(event.target.files);

    if (imageFiles.length + files.length > maxImages) {
      message.error(`You can only upload up to ${maxImages} images.`);
      return;
    }

    const newImages: IImageFile[] = files.map((file) => ({
      url: URL.createObjectURL(file),
      title: "",
      file: file,
    }));

    setImageFiles((prev) => [...prev, ...newImages]);
  };

  const handleTitleChange = (index: number, value: string) => {
    setImageFiles((prev) =>
      prev.map((image, i) => (i === index ? { ...image, title: value } : image))
    );
  };

  const handleRemoveImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (imageFiles.length === 0) {
      message.error("At least one image is required.");
      return;
    }

    if (imageFiles.some((image) => image.title === "")) {
      message.error("Please add titles for all images.");
      return;
    }

    const formData = new FormData();
    imageFiles.forEach((image) => {
      formData.append("images", image.file);
      formData.append("titles", image.title);
    });

    setLoading(true); 

    try {
      const response = await axios.post(
        `http://localhost:3000/user/addimage/${userId}`,
        
        
           formData,
       
      );
      if (response.data.message=='Image uploaded successfully') {
        message.success("Images uploaded successfully!");
        onSave(response.data.imageUrl);
        setImageFiles([]);
      } else {
        throw new Error("Failed to upload images.");
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false); 
      closeModal();
    }
  };

  const closeModal = () => {
    setImageFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      title="Add Images"
      onCancel={closeModal}
      footer={[
        <Button key="back" onClick={closeModal}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSave} loading={loading}>
          Save
        </Button>,
      ]}
    >
      <div className="flex flex-col items-center">
        {loading ? ( // Show loading spinner while uploading
          <Spin tip="Please wait, it will take some time..." />
        ) : (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="my-4"
              disabled={imageFiles.length >= maxImages}
            />

            <div className="grid grid-cols-2 gap-4 w-full">
              {imageFiles.map((image, index) => (
                <div key={index} className="border p-2 relative">
                  <img
                    src={image.url}
                    alt="preview"
                    className="h-32 w-full object-cover mb-2"
                  />
                  <Input
                    placeholder="Enter image title"
                    value={image.title}
                    onChange={(e) => handleTitleChange(index, e.target.value)}
                  />
                  <Button
                    type="primary"
                    danger
                    onClick={() => handleRemoveImage(index)}
                    className="mt-2"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default AddImageModal;
