import { useSortable } from "@dnd-kit/sortable";
import { FC } from "react";
import { CSS } from "@dnd-kit/utilities";

interface Prop {
  children: any;
}

const SortableList: FC<Prop> = ({ children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: children.props.id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {children}
    </div>
  );
};

export default SortableList;
