import React, { useEffect, useRef, ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface ModalProps {
  children: ReactNode;
  title?: string;
  cancelBtn?: string;
  confirmBtn?: string;
  onCancel: () => void;
  onConfirm?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  children,
  title,
  cancelBtn,
  confirmBtn,
  onCancel,
  onConfirm,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  const handleClosePopup = (e: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
      onCancel();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClosePopup);
    return () => {
      document.removeEventListener("mousedown", handleClosePopup);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="z-100 w-[100vw] h-screen flex justify-center items-center fixed top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] backdrop-brightness-50">
      <div
        className="min-w-[300px] h-[80vh] overflow-y-auto min-h-[150px] bg-white dark:bg-[#101828] dark:border-gray-800 rounded-lg relative border-2"
        ref={popupRef}
      >
        {title && <h2 className="mb-2 text-lg font-semibold">{title}</h2>}

        <div className="absolute top-0 right-0 m-3 text-lg cursor-pointer">
          <FontAwesomeIcon
            icon={faTimes}
            onClick={onCancel}
            className="dark:text-gray-300"
            height={38}
            width={38}
          />
        </div>
        <div>{children}</div>
        {(confirmBtn || cancelBtn) && (
          <div className="absolute bottom-0 right-0 flex gap-4 mt-4 mr-4 mb-4">
            {cancelBtn && (
              <button onClick={onCancel} className="font-bold">
                {cancelBtn}
              </button>
            )}
            {confirmBtn && (
              <button onClick={onConfirm} className="font-bold">
                {confirmBtn}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
