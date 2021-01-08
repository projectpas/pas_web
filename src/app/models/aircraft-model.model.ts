import { AircraftType } from "./AircraftType.model";

export class AircraftModel {
  aircraftModelId: number;
  aircraftTypeId: number;
  modelName: string;
  wingType: string;
  createdBy: string;
  updatedBy: string;
  createdDate: Date;
  updatedDate: Date;
  isDeleted: boolean;
  isActive: boolean;
  memo: string;
  aircraftType: AircraftType;

  aircraftModelList: AircraftModel[];
}
