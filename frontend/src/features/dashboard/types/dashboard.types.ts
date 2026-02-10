export interface DashboardStats {
    todaysTransactions: number;
    activeImports: number;
    activeExports: number;
    pendingApprovals: number;
}

export interface StatCardData {
    label: string;
    value: string | number;
}
