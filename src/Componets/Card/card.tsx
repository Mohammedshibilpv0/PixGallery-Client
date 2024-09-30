interface prop {
  id: string;
  src: string;
  title: string;
  onContextMenu: (e: React.MouseEvent) => void;
}

const Card: React.FC<prop> = ({
  src,
  title,
  onContextMenu,
}) => {
  return (
    <div
      onContextMenu={onContextMenu}
      className=" z-10 relative cursor-pointer sm:max-w-sm md:max-w-md lg:max-w-sm xl:max-w-xs justify-start bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 transition-transform transform hover:scale-105"
    >
      <img
        className="rounded-t-lg w-full object-contain h-48 mt-3"
        src={src}
        alt="Gallery Image"
      />

      <div className="p-5">
        <h5 className="mb-2 text-lg sm:text-xl md:text-2xl lg:text-lg xl:text-base font-bold tracking-tight text-gray-900 dark:text-white">
          {title}
        </h5>
      </div>

    </div>
  );
};

export default Card;
