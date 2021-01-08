import { AircraftType } from "./AircraftType.model";
import { AircraftModel } from "./aircraft-model.model";

export class AircraftDashNumber {

    constructor(aircraftTypeId?: number, aircraftModelId?: number, dashNumberId?: number, isActive?: boolean, isDelete?: boolean, dashNumber?: number, masterCompanyId?: number, createdBy?: string, createdDate?: Date, updatedDate?: Date, updatedBy?: string, memo?: string) {
        this.aircraftTypeId = aircraftTypeId;
        this.aircraftModelId = aircraftModelId;   
        this.masterCompanyId = masterCompanyId;
        this.dashNumber = dashNumber;
        this.dashNumberId = dashNumberId;
        this.createdBy = createdBy;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
        this.updatedBy = updatedBy;
        this.isActive = isActive;
        this.isDelete = isDelete;
        this.memo = memo;
    }

    public aircraftTypeId: number;
    public aircraftModelId: number; 
    public dashNumberId: number; 
    public dashNumber: number;
    public isActive: boolean;
    public isDelete: boolean;
    public masterCompanyId: number;
    public createdBy: string;
    public updatedBy: string;
    public createdDate: Date;
    public updatedDate: Date;
    public memo: string;
    aircraftType: AircraftType;
    aircraftModel: AircraftModel;
    aircraftDashNumberList: AircraftDashNumber[];
}


