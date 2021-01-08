import { ICharges } from "./Charges";
import { IDirections } from "./Directions";
import { IEquipmentList } from "./EquipmentList";
import { IExpertise } from "./Expertise";
import { IMaterialList } from "./MaterialList";
import { IPublication } from "./Publication";
import { IExclusion } from "./Exclusion";
import { IMeasurement } from "./Measurement";

export interface IWorkFlow {
    workflowId:string;
    taskId:string;
    ActionName:string;
    charges:any[];
    directions:any[];
    equipments:any[];
    expertise:any[];
    materialList:any[];
    publication:any[];
    exclusions:any[];
    measurements:any[];
    selectedItems:any[];

    // DeletedCharges:ICharges[];
    // DeletedDirections:IDirections[];
    // DeletedEquipments:IEquipmentList[];
    // DeletedExpertise:IExpertise[];
    // DeletedMaterialList:IMaterialList[];
    // DeletedPublication:IPublication[];
    // DeletedExclusions:IExclusion[];
    // DeletedMeasurements:IMeasurement[];

    totalExpertiseCost: number;
    totalChargesCost: number;
    totalMaterialCost: number;
    totalMaterialCostValue: number;
   
    qtySummation: number;
    extendedCostSummation: number;

    sumofExtendedCost: number;
    sumofQty: number;

    sumofestimatedhrs: number;
    sumofLabourDirectCost: number;
    sumOfOHCost: number;

    materialQtySummation: number;
    materialExtendedCostSummation: number;
    partNumber: string;
    materialExtendedPriceSummation: number;

}