import { AgentApplicationStatus } from "@/lib/mock/agentApplicationStorage";

export { AgentApplicationStatus };

export const agentApplicationService = {
  async getMyApplication() {
    return null;
  },

  async submitMyApplication(formData) {
    void formData;
    throw new Error("agentApplicationService has been removed. Use /agent API endpoints instead.");
  },

  async clearMyApplication() {
    return;
  },
};
