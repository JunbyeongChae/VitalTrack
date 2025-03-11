import React from "react";

const Modal = ({ onClose, title, children }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
                <h2 className="text-xl font-semibold mb-4">{title}</h2>
                <div>{children}</div>
                <button
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default Modal;