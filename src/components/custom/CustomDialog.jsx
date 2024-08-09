// CustomDialog.js
import React from "react";

const CustomDialog = ({ open, onClose, title, content }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg w-11/12 max-w-md">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-xl font-bold">
            &times;
          </button>
        </div>
        <div className="mt-2">{content}</div>
      </div>
    </div>
  );
};

export default CustomDialog;
