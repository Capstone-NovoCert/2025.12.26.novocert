export type CheckStatus = "pending" | "checking" | "success" | "error";

export interface DockerInstallStatus {
  status: CheckStatus;
  version?: string;
  error?: string;
}

export interface DockerRunningStatus {
  status: CheckStatus;
  info?: string;
  error?: string;
}

