
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { EndpointFactory } from '../services/endpoint-factory.service';
import { ConfigurationService } from '../services/configuration.service';
import { Dir } from '@angular/cdk/bidi';
import { Charge } from '../models/charge.model';

//import { EndpointFactory } from './endpoint-factory.service';
//import { ConfigurationService } from './configuration.service';
import { environment } from 'src/environments/environment';
@Injectable()
export class ActionEndpoint extends EndpointFactory {
    private readonly _actionsUrl: string = environment.baseUrl+"/api/Action/Get";
    private readonly _actionsUrlNew: string =environment.baseUrl+ "/api/Action/actions";
    private readonly _actionsUrlAuditHistory: string =environment.baseUrl+ "/api/Action/auditHistoryById";
    private getActionURL: string =environment.baseUrl+ "/api/Task/Get";
    private getActionAttributesURL: string =environment.baseUrl+ "/api/taskattribute/taskattributelist";

    private getChargesTypeURL: string = environment.baseUrl + '/api/mastertest/ChargesType';
    private getChargesCurrencyURL: string = environment.baseUrl + '/api/mastertest/ChargesCurrency';
    private getEquipmentAssetTypesURL: string = environment.baseUrl + '/api/mastertest/EquipmentAssetType';
    private getExpertiseTypeURL: string = environment.baseUrl + '/api/mastertest/ExpertiseType';
    private getEmployeeExpertiseTypeURL: string = environment.baseUrl + '/api/mastertest/EmployeeExpertiseType';
    private getMaterialConditionURL: string = environment.baseUrl + '/api/mastertest/MaterialCondition';
    private getMaterialUOMURL: string = environment.baseUrl + '/api/mastertest/MaterialUOM';
    private getMaterialMandatoryURL: string = environment.baseUrl + '/api/mastertest/MaterialMandatory';

    private getPublcationTypeURL: string = environment.baseUrl + '/api/mastertest/PublicationType';
    private getPublicationAircraftManufacturerURL: string = environment.baseUrl + '/api/mastertest/PublicationAircraftManufacturer';
    private getPublicationModelURL: string = environment.baseUrl + '/api/mastertest/PublicationModel';
    private getDashNumberByModelIdURL: string = environment.baseUrl + '/api/mastertest/getDashNumberByModelId';

    private getLocationsUrl: string = environment.baseUrl + '/api/Location/Get';
    private getPublicationStatusURL: string = environment.baseUrl + '/api/mastertest/PublicationStatus';
    private getExclusionEstimatedOccuranceURL: string = environment.baseUrl + '/api/mastertest/ExclusionEstimatedOccurance';
    private getAddActionURL: string = environment.baseUrl + "/api/Task/add";
    private AddWorkFlowURL: string = environment.baseUrl + "/api/workflow/addWorkFlow";
    private AddWorkFlowHeaderURL: string = environment.baseUrl + "/api/workflow/addWorkFlowHeader";

    private AddChargesURL: string = environment.baseUrl + "/api/workflow/addCharges";
    private AddDirectionURL: string = environment.baseUrl + "/api/workflow/addDirection";
    private AddEquipmentURL: string = environment.baseUrl + "/api/workflow/addEquipment";
    private AddExclusionURL: string = environment.baseUrl + "/api/workflow/addExclusion";
    private AddExpertiseURL: string = environment.baseUrl + "/api/workflow/addExpertise";
    private AddMaterialListURL: string = environment.baseUrl + "/api/workflow/addMaterial";
    private AddMeasurementURL: string = environment.baseUrl + "/api/workflow/addMeasurement";
    private AddPublicationURL: string = environment.baseUrl + "/api/workflow/addPublication";
    private getWorkFlowURL: string = environment.baseUrl + "/api/workflow/getworkflow";
    private getWorkFlowWithMaterialURL: string = environment.baseUrl + "/api/workflow/getWorkFlowWithMaterialList";
    private toggleStateURL: string = environment.baseUrl + "/api/workflow/toggleState";

    private UpdateChargesURL: string = environment.baseUrl + "/api/workflow/updateCharges";
    private UpdateDirectionURL: string = environment.baseUrl + "/api/workflow/updateDirection";
    private UpdateEquipmentURL: string = environment.baseUrl + "/api/workflow/updateEquipment";
    private UpdateExclusionURL: string = environment.baseUrl + "/api/workflow/updateExclusion";
    private UpdateExpertiseURL: string = environment.baseUrl + "/api/workflow/updateExpertise";
    private UpdateMaterialListURL: string = environment.baseUrl + "/api/workflow/updateMaterial";
    private UpdateMeasurementURL: string = environment.baseUrl + "/api/workflow/updateMeasurement";
    private UpdatePublicationURL: string = environment.baseUrl + "/api/workflow/updatePublication";
    private RemoveWorkFlowURL: string = environment.baseUrl + "/api/workflow/updatedeletedstatus";

    get actionsUrl() { return  this._actionsUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }

    // toggleState<T>(workflowId: number, userName: string): Observable<T> {
    //     let endpointUrl = `${this.toggleStateURL}/${workflowId}`;
    //     return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
    //         .catch(error => {
    //             return this.handleErrorCommon(error, () => this.toggleState(workflowId, userName));
    //         });
    // }
    toggleState<T>(workflowId: number, userName): Observable<T> {
        let endpointUrl = `${this.toggleStateURL}?workflowId=${workflowId}&updatedBy=${userName}`    
        return this.http
            .get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.toggleState(workflowId, userName));
            });
    }

    getWorkFlow<T>(workflowid: any): Observable<T> {
        let endpointUrl = `${this.getWorkFlowURL}/${workflowid}`;
        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getWorkFlow(workflowid));
            });
    }

    getWorkFlowWithMaterialList<T>(workflowid: any): Observable<T> {
        let endpointUrl = `${this.getWorkFlowWithMaterialURL}/${workflowid}`;
        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getWorkFlowWithMaterialList(workflowid));
            });
    }

    // removeWorkFlow<T>(workFlowId: number): Observable<T> {
    //     let endpointUrl = `${this.RemoveWorkFlowURL}/${workFlowId}`;
    //     return this.http.delete(endpointUrl, this.getRequestHeaders())
    //         .catch(
    //             error => {
    //                 return this.handleErrorCommon(error, () => this.removeWorkFlow(workFlowId));
    //             });
    // }

    removeWorkFlow<T>(workflowId: number, userName): Observable<T> {
        let endpointUrl = `${this.RemoveWorkFlowURL}?workflowId=${workflowId}&updatedBy=${userName}`    
        return this.http
            .get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.removeWorkFlow(workflowId, userName));
            });
    }

    addWorkFlowHeader<T>(workflowData: any): Observable<T> {
        let obj = {
            'workflowDescription': workflowData.workflowDescription,
            'version': workflowData.version,
            'flatRate': workflowData.flatRate,
            'itemMasterId': workflowData.itemMasterId,
            'partNumber': workflowData.partNumber,
            'partNumberDescription': workflowData.partNumberDescription,
            'revisedPartNumber':workflowData.revisedPartNumber,
            // 'changedPartNumberId': workflowData.changedPartNumberId,
            'currencyId': workflowData.currencyId,
            'customerId': workflowData.customerId,
            'workflowExpirationDate': workflowData.workflowExpirationDate,
            'isCalculatedBERThreshold': workflowData.isCalculatedBERThreshold,
            'isFixedAmount': workflowData.isFixedAmount,
            'fixedAmount': workflowData.fixedAmount,
            'isPercentageofNew': workflowData.isPercentageofNew,
            'costOfNew': workflowData.costOfNew,
            'percentageOfNew': workflowData.percentageOfNew,
            'isPercentageOfReplacement': workflowData.isPercentageOfReplacement,
            'costOfReplacement': workflowData.costOfReplacement,
            'percentageOfReplacement': workflowData.percentageOfReplacement,
            'berThresholdAmount': workflowData.berThresholdAmount,
            'memo': workflowData.memo,
            // 'customerName': workflowData.customerName,
            'masterCompanyId': workflowData.masterCompanyId,
            'createdBy': workflowData.createdBy,
            'updatedBy': workflowData.updatedBy,
            'percentageOfMaterial': workflowData.percentageOfMaterial,
            'percentageOfExpertise': workflowData.percentageOfExpertise,
            'percentageOfCharges': workflowData.percentageOfCharges,
            'percentageOfOthers': workflowData.percentageOfOthers,
            'percentageOfTotal': workflowData.percentageOfTotal,

            'workflowId': workflowData.workflowId,
            'workScopeId': workflowData.workScopeId,
            'customerCode': workflowData.customerCode,
            'isActive': workflowData.isActive,
            'workflowCreateDate': workflowData.workflowCreateDate,
            'otherCost': workflowData.otherCost,
            'isVersionIncrease': workflowData.isVersionIncrease
        };
        return this.http.post<T>(this.AddWorkFlowHeaderURL, JSON.parse(JSON.stringify(obj)), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getNewWorkFlow(workflowData));
            });

    }

    getNewWorkFlow<T>(workflowData: any): Observable<T> {
        let obj = {
            'charges': workflowData.charges,
            'directions': workflowData.directions,
            'equipments': workflowData.equipments,
            'exclusions': workflowData.exclusions,
            'expertise': workflowData.expertise,
            'materialList': workflowData.materialList,
            'measurements': workflowData.measurements,
            'publication': workflowData.publication,
            'masterCompanyId': workflowData.masterCompanyId,
            'createdBy': workflowData.createdBy,
            'updatedBy': workflowData.updatedBy,
'revisedPartNumber':workflowData.revisedPartNumber,
            'workflowDescription': workflowData.workflowDescription,
            'itemMasterId': workflowData.itemMasterId,
            'partNumber': workflowData.partNumber,
            'partNumberDescription': workflowData.partNumberDescription,
            'changedPartNumberId': workflowData.changedPartNumberId,
            'version': workflowData.version,
            'flatRate': workflowData.flatRate,
            'currencyId': workflowData.currencyId,
            'customerId': workflowData.customerId,
            'workflowExpirationDate': workflowData.workflowExpirationDate,
            'isCalculatedBERThreshold': workflowData.isCalculatedBERThreshold,
            'isFixedAmount': workflowData.isFixedAmount,
            'fixedAmount': workflowData.fixedAmount,
            'isPercentageofNew': workflowData.isPercentageofNew,
            'costOfNew': workflowData.costOfNew,
            'percentageOfNew': workflowData.percentageOfNew,
            'isPercentageOfReplacement': workflowData.isPercentageOfReplacement,
            'costOfReplacement': workflowData.costOfReplacement,
            'percentageOfReplacement': workflowData.percentageOfReplacement,
            'berThresholdAmount': workflowData.berThresholdAmount,
            'memo': workflowData.memo,
            // 'customerName': workflowData.customerName,
            'workflowId': workflowData.workflowId,
            'workScopeId': workflowData.workScopeId,
            'customerCode': workflowData.customerCode,
            'isActive': workflowData.isActive,
            'workflowCreateDate': workflowData.workflowCreateDate,
            'otherCost': workflowData.otherCost,
            'isVersionIncrease': workflowData.isVersionIncrease,
            'percentageOfMaterial': workflowData.percentageOfMaterial,
            'percentageOfExpertise': workflowData.percentageOfExpertise,
            'percentageOfCharges': workflowData.percentageOfCharges,
            'percentageOfOthers': workflowData.percentageOfOthers,
            'percentageOfTotal': workflowData.percentageOfTotal,
        };
        return this.http.post<T>(this.AddWorkFlowURL, JSON.parse(JSON.stringify(obj)), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getNewWorkFlow(workflowData));
            });
    }

    addCharges<T>(charges: any): Observable<T> {
        let obj = {
            'taskId': charges.taskId,
            'workflowId': charges.workflowId,
            //'vendorPriceOrUnit': charges.vendorPriceOrUnit,
            'currencyId': charges.currencyId,
            'description': charges.description,
            'extendedCost': charges.extendedCost,
            'vendorName': charges.vendorName,
            'extendedPrice': charges.extendedPrice,
            'forexRate': charges.forexRate,
            'quantity': charges.quantity,
            'unitCost': charges.unitCost,
            'unitPrice': charges.unitPrice,
            //'vendorId': charges.vendorId,
            'vendorUnitPrice': charges.vendorUnitPrice,
            'workflowChargeTypeId': charges.workflowChargeTypeId,
            //'memo': charges.memo,
            'isDelete': charges.isDelete,

        }

        return this.http.post<T>(this.AddChargesURL, JSON.parse(JSON.stringify(charges)), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.addCharges(charges));
            });
    }

    addDirection<T>(direction: any): Observable<T> {
        let obj = {
            'taskId': direction.taskId,
            'workflowId': direction.workflowId,
            'action': direction.action,
            'description': direction.description,
            'sequence': direction.sequence,
            'memo': direction.memo,
            'isDelete': direction.isDelete,
        }
        return this.http.post<T>(this.AddDirectionURL, JSON.parse(JSON.stringify(direction)), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.addDirection(direction));
            });
    }

    addEquipment<T>(equipment: any): Observable<T> {
        let obj = {
            'taskId': equipment.taskId,
            'workflowId': equipment.workflowId,
            'assetDescription': equipment.assetDescription,
            'assetId': equipment.assetId,
            'assetTypeId': equipment.assetTypeId,
            'quantity': equipment.quantity,
            'memo': equipment.memo,
            'isDelete': equipment.isDelete,
            'partNumber': equipment.partNumber
        }
        return this.http.post<T>(this.AddEquipmentURL, JSON.parse(JSON.stringify(equipment)), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.addEquipment(equipment));
            });
    }

    addExclusion<T>(exclusion: any): Observable<T> {
        let obj = {
            'taskId': exclusion.taskId,
            'workflowId': exclusion.workflowId,
            'partDescription': exclusion.partDescription,
            'estimtPercentOccurrance': exclusion.estimtPercentOccurrance,
            'extendedCost': exclusion.extendedCost,
            'partNumber': exclusion.partNumber,
            'partName': exclusion.partName,
            'itemMasterId': exclusion.itemMasterId,
            'quantity': exclusion.quantity,
            'unitCost': exclusion.unitCost,
            'isDelete': exclusion.isDelete,
            'memo': exclusion.memo,
            'createdBy': exclusion.createdBy,
            'updatedBy': exclusion.updatedBy,
        }
        return this.http.post<T>(this.AddExclusionURL, JSON.parse(JSON.stringify(exclusion)), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.addExclusion(exclusion));
            });
    }

    addExpertise<T>(expertise: any): Observable<T> {
        let obj = {
            'directLaborRate': expertise.directLaborRate,
            'workflowId': expertise.workflowId,
            'estimatedHours': expertise.estimatedHours,
            'expertiseTypeId': expertise.expertiseTypeId,
            'laborDirectRate': expertise.laborDirectRate,
            'laborOverheadCost': expertise.laborOverheadCost,
            'overheadBurden': expertise.overheadBurden,
            'overheadCost': expertise.overheadCost,
            'standardRate': expertise.standardRate,
            'taskId': expertise.taskId,
            'isDelete': expertise.isDelete,

        }
        return this.http.post<T>(this.AddExpertiseURL, JSON.parse(JSON.stringify(expertise)), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.addExpertise(expertise));
            });
    }

    addMaterial<T>(material: any): Observable<T> {
        let obj = {
            'taskId': material.actionId,
            'conditionCodeId': material.conditionCodeId,
            'extendedCost': material.extendedCost,
            'extraCost': material.extraCost,
            'isDeferred': material.isDeferred,
            'itemClassificationId': material.itemClassificationId,
            'itemMasterId': material.itemMasterId,
            'materialMandatoriesName': material.materialMandatoriesName,
            'materialMandatoriesId': material.materialMandatoriesId,
            'partDescription': material.partDescription,
            'memo': material.memo,
            'price': material.price,
            'provisionId': material.provisionId,
            'quantity': material.quantity,
            'unitCost': material.unitCost,
            'unitOfMeasureId': material.unitOfMeasureId,
            'workflowId': material.workflowId,
            'isDelete': material.isDelete,
            'partNumber': material.partNumber,
            'masterCompanyId': material.masterCompanyId,
            'createdBy': material.createdBy,
            'updatedBy': material.updatedBy,
        }
        return this.http.post<T>(this.AddMaterialListURL, JSON.parse(JSON.stringify(obj)), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.addMaterial(material));
            });
    }

    addMeasurement<T>(measurement: any): Observable<T> {
        let obj = {
            'taskId': measurement.actionId,
            'itemMasterId': measurement.itemMasterId,
            'sequence': measurement.sequence,
            'stage': measurement.stage,
            'min': measurement.min,
            'max': measurement.max,
            'expected': measurement.expected,
            'diagramURL': measurement.diagramURL,
            'memo': measurement.memo,
            'isDelete': measurement.isDelete,
            'partNumber': measurement.partNumber,
            'partDescription': measurement.partDescription,
            'workflowId': measurement.workflowId
        }
        return this.http.post<T>(this.AddMeasurementURL, JSON.parse(JSON.stringify(obj)), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.addMeasurement(measurement));
            });
    }

    addPublication<T>(publication: any): Observable<T> {
        return this.http.post<T>(this.AddPublicationURL, JSON.parse(JSON.stringify(publication)), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.addPublication(publication));
            });
    }

    updateCharges<T>(charges: any): Observable<T> {
        return this.http.post<T>(this.UpdateChargesURL, JSON.parse(JSON.stringify(charges)), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.updateCharges(charges));
            });
    }

    updateEquipment<T>(equipment: any): Observable<T> {
        return this.http.post<T>(this.UpdateEquipmentURL, JSON.parse(JSON.stringify(equipment)), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.updateEquipment(equipment));
            });
    }

    updateDirection<T>(direction: any): Observable<T> {
        return this.http.post<T>(this.UpdateDirectionURL, JSON.parse(JSON.stringify(direction)), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.updateEquipment(direction));
            });
    }

    updateExclusion<T>(exclusion: any): Observable<T> {
        return this.http.post<T>(this.UpdateExclusionURL, JSON.parse(JSON.stringify(exclusion)), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.updateExclusion(exclusion));
            });
    }

    updateExpertise<T>(expertise: any): Observable<T> {
        return this.http.post<T>(this.UpdateExpertiseURL, JSON.parse(JSON.stringify(expertise)), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.updateExclusion(expertise));
            });
    }

    updateMeasurement<T>(measurement: any): Observable<T> {
        return this.http.post<T>(this.UpdateMeasurementURL, JSON.parse(JSON.stringify(measurement)), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.updateMeasurement(measurement));
            });
    }

    updateMaterial<T>(material: any): Observable<T> {
        return this.http.post<T>(this.UpdateMaterialListURL, JSON.parse(JSON.stringify(material)), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.updateMeasurement(material));
            });
    }

    updatePublication<T>(publication: any): Observable<T> {
        return this.http.post<T>(this.UpdatePublicationURL, JSON.parse(JSON.stringify(publication)), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.updatePublication(publication));
            });
    }

    addAction<T>(action: any): Observable<T> {
        return this.http.post<T>(this.getAddActionURL, JSON.parse(JSON.stringify(action)), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.addAction(action));
            });
    }

    getActions<T>(): Observable<T> {
        return this.http.get<T>(this.getActionURL, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getActions());
            });
    }

    getActionAttributes<T>(): Observable<T> {
        return this.http.get<T>(this.getActionAttributesURL, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getActionAttributes());
            });
    }

    getChargesCurrency<T>(): Observable<T> {
        return this.http.get<T>(this.getChargesCurrencyURL, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getChargesCurrency());
            });
    }

    GetExpertiseType<T>(): Observable<T> {
        return this.http.get<T>(this.getExpertiseTypeURL, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.GetExpertiseType());
            });
    }

    getEmployeeExpertiseType<T>(): Observable<T> {
        return this.http.get<T>(this.getEmployeeExpertiseTypeURL, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getEmployeeExpertiseType());
            });
    }


    getEquipmentAssetType<T>(): Observable<T> {
        return this.http.get<T>(this.getEquipmentAssetTypesURL, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getEquipmentAssetType());
            });
    }

    GetMaterialMandatory<T>(): Observable<T> {
        return this.http.get<T>(this.getMaterialMandatoryURL, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.GetMaterialMandatory());
            });
    }

    GetMaterialUOM<T>(): Observable<T> {

        return this.http.get<T>(this.getMaterialUOMURL, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.GetMaterialUOM());
            });
    }

    GetExclusionEstimatedOccurance<T>(): Observable<T> {
        return this.http.get<T>(this.getExclusionEstimatedOccuranceURL, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.GetExclusionEstimatedOccurance());
            });
    }

    GetPublicationStatus<T>(): Observable<T> {
        return this.http.get<T>(this.getPublicationStatusURL, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.GetPublicationStatus());
            });
    }

    GetPublicationModel<T>(aircraftTypeId): Observable<T> {
        let endpointUrl = `${this.getPublicationModelURL}/${aircraftTypeId}`;
        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.GetPublicationModel(aircraftTypeId));
            });
    }

    GetDashNumberByModelIdURL<T>(modelId: number): Observable<T> {
        let endpointUrl = `${this.getDashNumberByModelIdURL}/${modelId}`;
        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.GetDashNumberByModelIdURL(modelId));
            });
    }

    getLocations<T>(): Observable<T> {
        return this.http.get<T>(this.getLocationsUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getLocations());
            });
    }

    GetPublicationAircraftManufacturer<T>(): Observable<T> {
        return this.http.get<T>(this.getPublicationAircraftManufacturerURL, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.GetPublicationAircraftManufacturer());
            });
    }

    GetPublicationType<T>(): Observable<T> {
        return this.http.get<T>(this.getPublcationTypeURL, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.GetPublicationType());
            });
    }

    getChargesType<T>(): Observable<T> {
        return this.http.get<T>(this.getChargesTypeURL, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getChargesType());
            });
    }
    getCharges() {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/Charge/GetAllActive`, this.getRequestHeaders());
    }

    GetMaterialCondition<T>(): Observable<T> {
        return this.http.get<T>(this.getMaterialConditionURL, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.GetMaterialCondition());
            });
    }
}