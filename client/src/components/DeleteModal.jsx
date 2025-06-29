import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle } from "lucide-react";

export default function DeleteModal({
  isOpen,
  onConfirm,
  onCancel,
  habitTitle,
}) {
  if (!isOpen) return null;

  /* lock page scroll while modal is open */
  useEffect(() => {
    const prev = document.body.style.overflow; // save current overflow
    document.body.style.overflow = "hidden"; // disable scrolling
    return () => {
      document.body.style.overflow = prev; // restore on un-mount
    };
  }, []); // run once when modal mounts
  const modal = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
                 bg-black/50 backdrop-blur-sm p-4"
    >
      <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl">
        {/* header */}
        <div className="flex gap-4 mb-6">
          <div className="p-3 bg-red-100 rounded-2xl">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-stone-900">
              Delete habit
            </h3>
            <p className="text-sm text-stone-600">
              This action cannot be undone
            </p>
          </div>
        </div>

        {/* body */}
        <p className="mb-8 text-stone-700">
          Are you sure you want to delete&nbsp;
          <span className="font-medium">&ldquo;{habitTitle}&rdquo;</span>?<br />
          All progress data will be permanently removed.
        </p>

        {/* actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 border border-stone-300
                       rounded-2xl text-stone-700 hover:bg-stone-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-red-600 text-white
                       rounded-2xl hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  // send the whole tree to a top-level node
  return createPortal(modal, document.getElementById("modal-root"));
}
