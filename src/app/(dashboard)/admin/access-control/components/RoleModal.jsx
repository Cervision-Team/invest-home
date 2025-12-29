"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

const RoleModal = ({ open, title, initialValue = "", submitText, onClose, onSubmit, loading }) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (open) setValue(initialValue || "");
  }, [open, initialValue]);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("no-scroll");
    return () => document.body.classList.remove("no-scroll");
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[3px]"
        onClick={loading ? undefined : onClose}
      />

      <div className="relative w-[520px] max-w-[92vw] rounded-2xl bg-white p-6 shadow-[0_4px_30px_0px_#0000000D]">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[#1B1F27] text-xl font-semibold">{title}</h2>
          <button
            type="button"
            className="p-2 rounded-md hover:bg-gray-100"
            onClick={loading ? undefined : onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-[#1B1F27]">Role name</label>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            placeholder="Role name"
            disabled={loading}
            autoFocus
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
            onClick={loading ? undefined : onClose}
          >
            Bağla
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-lg text-white bg-[var(--primary-color)] disabled:opacity-60"
            disabled={loading || !value.trim()}
            onClick={() => onSubmit(value.trim())}
          >
            {loading ? "Gözləyin..." : submitText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleModal;
