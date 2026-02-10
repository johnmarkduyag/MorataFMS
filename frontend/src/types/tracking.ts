export const TrackingStatus = {
    Cleared: 'Cleared',
    Pending: 'Pending',
    Delayed: 'Delayed',
    InTransit: 'In Transit',
} as const;

export type TrackingStatus = typeof TrackingStatus[keyof typeof TrackingStatus];

export interface TrackingItem {
    id: string;
    customerRefNo: string;
    billOfLading: string;
    status: TrackingStatus;
    importer: string;
    annualDate: string;
}

export const getStatusColor = (status: TrackingStatus): string => {
    switch (status) {
        case TrackingStatus.Cleared:
            return 'green';
        case TrackingStatus.Pending:
            return 'yellow';
        case TrackingStatus.Delayed:
            return 'red';
        case TrackingStatus.InTransit:
            return 'blue';
        default:
            return 'gray';
    }
};
