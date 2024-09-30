import React from "react";

interface ContextMenuProps {
  visible: boolean;
  x: number;
  y: number;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ visible, x, y, onEdit, onDelete, onClose }) => {
  if (!visible) return null;

  return (
    <div
      style={{ top: y, left: x }}
      className="absolute bg-white  border border-gray-300 shadow-lg z-50 rounded-md"
      onMouseLeave={onClose}
    >
      <button onClick={onEdit} className="block w-full text-left px-6 py-2  hover:bg-gray-100">Edit</button>
      <button onClick={onDelete} className="block w-full text-left px-6 py-2 hover:bg-gray-100">Delete</button>
    </div>
  );
};

export default ContextMenu;
