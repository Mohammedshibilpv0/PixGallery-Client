import React, { useEffect, useState } from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { Image } from "lucide-react";
import Card from "../Card/card";
import EditImageModal from "../EditImageModal/ImageUploadForm";
import DeleteModal from "../deleteModal/deleteModal";
import ContextMenu from "../../context/ContextMenu";
import SortableList from "../SortableList";
import AddImageModal from "../addImageModal/AddImage";
import { changePostion, getUserGallery } from "../../api/userApi/userApi";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Empty } from "antd";

export interface IImageData {
  _id: string;
  url: string;
  title: string;
  orderNo: number;
}

const Home: React.FC = () => {
  const [imageData, setImageData] = useState<IImageData[]>([]);
  const [selectedImage, setSelectedImage] = useState<IImageData | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isAddImageModalOpen, setAddImageModalOpen] = useState(false);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [isEmpty,setIsEmpty]=useState<boolean>(false)
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const userId = useSelector((config:RootState)=>config.user.userInfo?._id)


   useEffect(()=>{
   async function fetchGallery(){
    const response = await getUserGallery(userId??'')
    console.log(response)
    if(response==204){
      setIsEmpty(true)
    }else{
      setImageData(response.gallery)
      setIsEmpty(false); 
    }
   }
   fetchGallery()
  },[])


  const reOrderImages = async (e: DragEndEvent) => {
    if (!e.over) return;
  
    const oldIndex = imageData.findIndex((item) => item._id === e.active.id);
    const newIndex = imageData.findIndex((item) => item._id === e.over!.id);
    
    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;
  

  

    setImageData((prevData) => {
     const newData= arrayMove(prevData, oldIndex, newIndex);
     const updatedImages = newData.map((image, index) => ({
      _id: image._id,
      order: index + 1
    }))                                                                                                       
     changePostion(updatedImages);
      return newData.map((item, index) => ({
        ...item,
        orderNo: index + 1,
      }));
    });
    
  
  };
  

  const handleRightClick = (event: React.MouseEvent, image: IImageData) => {
    event.preventDefault();
    setSelectedImage(image);
    setContextMenuPos({ x: event.clientX, y: event.clientY });
    setContextMenuVisible(true);
  };

  const handleClickOutside = () => {
    setContextMenuVisible(false);
  };

  const handleAddImages = async(newImages: { url: string; title: string ,_id:string}[]) => {
    console.log("newImages",newImages)
    const newImageData = newImages.map((image, index) => ({
      _id:image._id,
      url: image.url,
      title: image.title,
      orderNo: imageData.length + index + 1,
    }));
    setImageData(() => {
      const updatedData = [...newImageData];
      if (updatedData.length > 0) {
        setIsEmpty(false); 
      }
      return updatedData;
    });

  };
  

  return (
    <div onClick={handleClickOutside}>
      <div className="flex justify-end mt-2 me-16">
        <button
          onClick={() => setAddImageModalOpen(true)}
          className="flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <Image size={20} className="mr-2" />
          <span>Add Image</span>
        </button>
      </div>

      {isEmpty?(
    
            <div className="flex justify-center me-16">
              <Empty description="No images available." />
            </div>
       
      ):(

      <DndContext onDragEnd={reOrderImages}>
        <main>
          <SortableContext items={imageData.map((item) => item._id)}>
            <div className="flex flex-wrap justify-center gap-3 mt-5">
              {imageData
                .sort((a, b) => a.orderNo - b.orderNo)
                .map((data: IImageData) => (
                  <SortableList key={data._id}>
                    <Card
                      onContextMenu={(e) => handleRightClick(e, data)}
                      id={data._id}
                      src={data.url}
                      title={data.title}
                    />
                  </SortableList>
                ))}
            </div>
          </SortableContext>
        </main>
 
        {contextMenuVisible && (
          <ContextMenu
            visible={contextMenuVisible}
            x={contextMenuPos.x}
            y={contextMenuPos.y}
            onClose={() => setContextMenuVisible(false)}
            onEdit={() => setEditModalOpen(true)}
            onDelete={() => setDeleteModalOpen(true)}
          />
        )}

        {selectedImage && (
          <>
            <EditImageModal
              id={selectedImage._id}
              title={selectedImage.title}
              src={selectedImage.url} 
              action="Edit Image"
              isOpen={isEditModalOpen}
              onClose={() => setEditModalOpen(false)}
              onSave={(id, updatedTitle, updatedSrc) => {
                setImageData((prev) =>
                  prev.map(
                    (img) =>
                      img._id === id
                        ? { ...img, title: updatedTitle, url: updatedSrc }
                        : img 
                  )
                );
              }}
            />

            <DeleteModal
              id={selectedImage._id}
              isOpen={isDeleteModalOpen}
              onClose={() => setDeleteModalOpen(false)}
              onConfirm={() => {
                setImageData((prev) =>
                  prev.filter((img) => img._id !== selectedImage._id)
                );
                setDeleteModalOpen(false);
              }}
            />
          </>
        )}
      </DndContext>
      )}
      <AddImageModal
          visible={isAddImageModalOpen}
          onClose={() => setAddImageModalOpen(false)}
          onSave={handleAddImages}
        />
    </div>
  );
};

export default Home;
