"use client";
import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import addUserIcon from "../../../../../public/icons/profile/user-add-icon.svg";

const baseBtn =
  "relative inline-flex items-center justify-center w-11 h-11 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-(--primary-color) disabled:opacity-50 disabled:cursor-not-allowed";

const deleteBtn =
  "relative inline-flex items-center justify-center gap-2 h-11 rounded-xl px-4 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-(--primary-color) disabled:opacity-50 disabled:cursor-not-allowed";

const EmployeesActions = ({
  onDelete,
  onEdit,
  onAdd,
  selectedCount = 0,
  deleteDisabled = false,
  editDisabled = false,
  showDelete = true,
  showEdit = true,
}) => {
  return (
    <div className="flex items-center gap-3 md:gap-4">
      {showDelete && (
        <button
          type="button"
          onClick={onDelete}
          disabled={deleteDisabled}
          title={deleteDisabled ? "Seçilmiş əməkdaş yoxdur" : "Sil"}
          aria-label="Sil"
          className={`${deleteBtn} bg-[#BFE4DB] text-[#0B3B34] hover:bg-[#A9DBCF]`}
        >
          <Trash2 size={18} />
          <span className="text-[14px] font-medium">{selectedCount} sil</span>
        </button>
      )}

      {showEdit && (
        <button
          type="button"
          onClick={onEdit}
          disabled={editDisabled}
          title={editDisabled ? "Update üçün 1 əməkdaş seç" : "Update"}
          aria-label="Update"
          className={`${baseBtn} bg-white text-[#0B3B34] border border-(--primary-color) hover:bg-[#F5FFFC]`}
        >
          <Pencil size={18} />
        </button>
      )}

      <button
        type="button"
        onClick={onAdd}
        title="Yeni əməkdaş əlavə et"
        aria-label="Yeni əməkdaş əlavə et"
        className={`${baseBtn} bg-(--primary-color) text-white hover:opacity-90`}
      >
        <Image src={addUserIcon} alt="Add user" width={18} height={18} />
      </button>
    </div>
  );
};

export default EmployeesActions;
