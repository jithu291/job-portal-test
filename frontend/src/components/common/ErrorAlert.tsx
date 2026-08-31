interface Props {
  message: string;
  onClose?: () => void;
}

export default function ErrorAlert({ message, onClose }: Props) {
  return (
    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md flex justify-between">
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="ml-4 text-red-500 hover:text-red-700">
          &times;
        </button>
      )}
    </div>
  );
}
