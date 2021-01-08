export interface IPublication {
    Id: string;
    PublicationId: string;
    PublicationDescription: string;
    PublicationType: string
    Sequence: string;
    Source: string;
    AircraftManufacturer: string
    Model: string;
    Location: string;
    Revision: string;
    RevisionDate: string;
    VerifiedBy: string;
    VerifiedDate: string;
    Status: string;
    Image: string;
    taskId: string;
    workflowId: string;
    AllowEdit: boolean;
    IsDeleted: boolean;
    Order: number;
    //isDelete: boolean;
    workflowPublicationDashNumbers: IDashNumbers[];

    allDashNumbers: IDashNumbers[];
}

export interface IDashNumbers {
    workflowPublicationDashNumberId: number;
    workflowId: number;
    aircraftDashNumberId: number;
    taskId: number;
    taskAttributeId: number;

    dashNumberId: string;
    dashNumber: string;
}