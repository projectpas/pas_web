import { FormControl, Validators } from "@angular/forms";

export class ItemMasterCapabilitiesModel {

    itemMasterCapesId:any;
    capabilityId: any;
    capabilityTypeId: any;
    companyId:FormControl = new FormControl("", [Validators.required])
    buisinessUnitId: any = NaN;
    departmentId: any = NaN;
    divisionId: any = NaN;
    manufacturerId: any = NaN;
    ataChapterId: any = NaN;
    description: any = "";
    aircraftTypeId: any;
    aircraftTypeName:any;
    aircraftModelId: any;
    aircraftModelName:any;
    aircraftManufacturer: any;
    PartId: any;
    DashNumber: any;
    AircraftDashNumberId: number;
    itemMasterId: any = NaN;
    entryDate: Date = new Date();
    isCMMExist: any;
    isVerified:boolean = false;
    managementStructureId: any = NaN;
    verifiedBy: any = "";
    dateVerified: Date = new Date();
    memo: any = "";
    isActive:boolean = true;
    isDelete:boolean = false;
    componentDescription: any;
    clcfNumber: any;
    assetRecordId: number;
    AssetCapesId: number;
    ataSubChapterId:any;
    cmmId:any;
    integrateWith:any;
    nteHrs:number;
    tat:number;
    manufacturerLabel:any;
    ataChapterLabel:any;
    ataSubchapterLabel:any;
    cmmLabel:any;
    integrateWithLabel:any;
    capabilityTypeName:any;

    public constructor(init?: Partial<ItemMasterCapabilitiesModel>) {
        Object.assign(this, init);
    }



}