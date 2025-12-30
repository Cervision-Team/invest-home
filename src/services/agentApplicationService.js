import {
  AgentApplicationStatus,
  clearAgentApplication,
  loadAgentApplication,
  saveAgentApplication,
} from "@/lib/mock/agentApplicationStorage";

export { AgentApplicationStatus };

const createLocalRecord = (formData) => {
  const now = new Date().toISOString();
  return {
    id: `AGENT-${Date.now()}`,
    status: AgentApplicationStatus.PENDING,
    submittedAt: now,
    updatedAt: now,
    data: {
      ...formData,
      fullName: `${formData?.name || ""} ${formData?.surname || ""}`.trim(),
      // Keep it simple for now: store only the filename.
      cv: formData?.cv?.name || null,
    },
  };
};


export const agentApplicationService = {
  async getMyApplication() {
    return loadAgentApplication();
  },

  async submitMyApplication(formData) {
    const record = createLocalRecord(formData);
    saveAgentApplication(record);
    return record;
  },

  async clearMyApplication() {
    clearAgentApplication();
  },
};
