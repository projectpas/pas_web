export class AircraftType {
  aircraftTypeId: number;
  description: string;
  createdBy: string;
  updatedBy: string;
  createdDate: Date;
  updatedDate: Date;
  isDeleted: boolean;
  isActive: boolean;
  memo: string;
  masterCompanyId: number;
  aircraftTypeList: AircraftType[];

}
