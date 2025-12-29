import React from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

const AccessControlTable = ({
  matrix,
  groupedClaims,
  access,
  onToggleAccess,
  onOpenUpdateRole,
  onDeleteRole,
  onOpenCreateRole,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px]">
        <thead>
          <tr>
            <th className="w-[200px] text-left p-2 py-6">Role & Permission</th>
            {matrix?.roles?.map((role) => (
              <th key={role?.id} className="p-2">
                <div className="flex items-center justify-center gap-2">
                  <span className="font-medium">{role?.name}</span>
                  <button
                    type="button"
                    className="p-1 rounded hover:bg-gray-100"
                    aria-label="Update role"
                    onClick={() => onOpenUpdateRole(role)}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    className="p-1 rounded hover:bg-gray-100"
                    aria-label="Delete role"
                    onClick={() => onDeleteRole(role?.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </th>
            ))}

            <th className="p-2">
              <button
                type="button"
                className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50"
                aria-label="Add role"
                onClick={onOpenCreateRole}
              >
                <Plus size={18} />
              </button>
            </th>
          </tr>
        </thead>

        <tbody>
          {Object.entries(groupedClaims).map(([section, claimsInGroup]) => (
            <React.Fragment key={section}>
              <tr className="">
                <td
                  colSpan={(matrix?.roles?.length || 0) + 2}
                  className="font-semibold p-2  text-white uppercase bg-[#02836f99]  rounded-2xl"
                >
                  {section}
                </td>
              </tr>

              {claimsInGroup.map((claim) => (
                <tr key={claim.id}>
                  <td className="p-2 font-medium ">{claim.displayName}</td>
                  {matrix?.roles?.map((role) => {
                    const currentAccess = access?.find(
                      (a) => a.roleId === role.id && a.claimId === claim.id
                    )?.hasPermission;

                    return (
                      <td key={`${role.id}-${claim.id}`} className="p-2 text-center ">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            className="sr-only peer"
                            type="checkbox"
                            checked={currentAccess || false}
                            onChange={() => onToggleAccess(role.id, claim.id)}
                          />
                          <div
                            className="w-11 h-6 bg-gray-300 peer-focus:outline-none 
                              peer-focus:ring-2 peer-focus:ring-[#02836f] rounded-full peer 
                              peer-checked:after:translate-x-full peer-checked:after:border-white 
                              after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                              after:bg-white after:border-gray-300 after:border after:rounded-full 
                              after:h-5 after:w-5 after:transition-all peer-checked:bg-[#02836f]"
                          ></div>
                        </label>
                      </td>
                    );
                  })}

                  <td className="p-2" />
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccessControlTable;
