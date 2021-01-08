
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { EndpointFactory } from '../services/endpoint-factory.service';
import { ConfigurationService } from '../services/configuration.service';
import { Dir } from '@angular/cdk/bidi';
import { Charge } from '../models/charge.model';

//import { EndpointFactory } from './endpoint-factory.service';
//import { ConfigurationService } from './configuration.service';
import {catchError} from 'rxjs/operators';
@Injectable()
export class ActionEndpoint extends EndpointFactory {


    private readonly _actionsUrl: string = "/api/Action/Get";
    private readonly _actionsUrlNew: string = "/api/Action/actions";
    private readonly _actionsUrlAuditHistory: string = "/api/Action/auditHistoryById";
    private getActionURL: string = "/api/Task/Get";
    private getActionAttributesURL: string = "/api/taskattribute/taskattributelist";
    private getChargesTypeURL: string = 'api/mastertest/ChargesType';
    private getChargesCurrencyURL: string = 'api/mastertest/ChargesCurrency';
    private getEquipmentAssetTypesURL: string = 'api/mastertest/EquipmentAssetType';
    private getExpertiseTypeURL: string = 'api/mastertest/ExpertiseType';
    private getEmployeeExpertiseTypeURL: string = 'api/mastertest/EmployeeExpertiseType';
    private getMaterialConditionURL: string = 'api/mastertest/MaterialCondition';
    private getMaterialUOMURL: string = 'api/mastertest/MaterialUOM';
    private getMaterialMandatoryURL: string = 'api/mastertest/MaterialMandatory';

    private getPublcationTypeURL: string = 'api/mastertest/PublicationType';
    private getPublicationAircraftManufacturerURL: string = 'api/mastertest/PublicationAircraftManufacturer';
    private getPublicationModelURL: string = 'api/mastertest/PublicationModel';
    private getDashNumberByModelIdURL: string = 'api/mastertest/getDashNumberByModelId';

    private getLocationsUrl: string = 'api/Location/Get';
    private getPublicationStatusURL: string = 'api/mastertest/PublicationStatus';
    private getExclusionEstimatedOccuranceURL: string = 'api/mastertest/ExclusionEstimatedOccurance';
    private getAddActionURL: string = "api/Task/add";
    private AddWorkFlowURL: string = "api/workflow/addWorkFlow";
    private AddWorkFlowHeaderURL: string = "api/workflow/addWorkFlowHeader";

    private AddChargesURL: string = "api/workflow/addCharges";
    private AddDirectionURL: string = "api/workflow/addDirection";
    private AddEquipmentURL: string = "api/workflow/addEquipment";
    private AddExclusionURL: string = "api/workflow/addExclusion";
    private AddExpertiseURL: string = "api/workflow/addExpertise";
    private AddMaterialListURL: string = "api/workflow/addMaterial";
    private AddMeasurementURL: string = "api/workflow/addMeasurement";
    private AddPublicationURL: string = "api/workflow/addPublication";
    private getWorkFlowURL: string = "api/workflow/getworkflow";
    private getWorkFlowWithMaterialURL: string = "api/workflow/getWorkFlowWithMaterialList";
    private toggleStateURL: string = "api/workflow/toggleState";

    private UpdateChargesURL: string = "api/workflow/updateCharges";
    private UpdateDirectionURL: string = "api/workflow/updateDirection";
    private UpdateEquipmentURL: string = "api/workflow/updateEquipment";
    private UpdateExclusionURL: string = "api/workflow/updateExclusion";
    private UpdateExpertiseURL: string = "api/workflow/updateExpertise";
    private UpdateMaterialListURL: string = "api/workflow/updateMaterial";
    private UpdateMeasurementURL: string = "api/workflow/updateMeasurement";
    private UpdatePublicationURL: string = "api/workflow/updatePublication";
    private RemoveWorkFlowURL: string = "api/workflow/remove";

    get actionsUrl() { return this.configurations.baseUrl + this._actionsUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    toggleState<T>(workflowId: number): Observable<T> {
        let endpointUrl = `${this.toggleStateURL}/${workflowId}`;
        return this.http.delete<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.toggleState(workflowId));
            }));
    }

    getWorkFlow<T>(workflowid: any): Observable<T> {
        let endpointUrl = `${this.getWorkFlowURL}/${workflowid}`;
        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getWorkFlow(workflowid));
            }));
    }

    getWorkFlowWithMaterialList<T>(workflowid: any): Observable<T> {
        let endpointUrl = `${this.getWorkFlowWithMaterialURL}/${workflowid}`;
        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getWorkFlowWithMaterialList(workflowid));
            }));
    }

    removeWorkFlow<T>(workFlowId: number): Observable<T> {
        let endpointUrl = `${this.RemoveWorkFlowURL}/${workFlowId}`;
        return this.http.delete<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(
                error => {
                    return this.handleError(error, () => this.removeWorkFlow(workFlowId));
                }));
    }

    addWorkFlowHeader<T>(workflowData: any): Observable<T> {
        let obj = {
            'workflowDescription': workflowData.workflowDescription,
            'version': workflowData.version,
            'flatRate': workflowData.flatRate,
            'itemMasterId': workflowData.itemMasterId,
            'partNumber': workflowData.partNumber,
            'partNumberDescription': workflowData.partNumberDescription,
            'changedPartNumberId': workflowData.changedPartNumberId,
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
            'customerName': workflowData.customerName,

            'workflowId': workflowData.workflowId,
            'workScopeId': workflowData.workScopeId,
            'customerCode': workflowData.customerCode,
            'isActive': workflowData.isActive,
            'workflowCreateDate': workflowData.workflowCreateDate,
            'otherCost': workflowData.otherCost,
            'isVersionIncrease': workflowData.isVersionIncrease
        };
        return this.http.post<any>(this.AddWorkFlowHeaderURL, JSON.parse(JSON.stringify(obj)), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getNewWorkFlow(workflowData));
            }));

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
            'customerName': workflowData.customerName,
            'workflowId': workflowData.workflowId,
            'workScopeId': workflowData.workScopeId,
            'customerCode': workflowData.customerCode,
            'isActive': workflowData.isActive,
            'workflowCreateDate': workflowData.workflowCreateDate,
            'otherCost': workflowData.otherCost,
            'isVersionIncrease': workflowData.isVersionIncrease

        };
        return this.http.post<any>(this.AddWorkFlowURL, JSON.parse(JSON.stringify(obj)), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getNewWorkFlow(workflowData));
            }));
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

        return this.http.post<any>(this.AddChargesURL, JSON.parse(JSON.stringify(charges)), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.addCharges(charges));
            }));
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
        return this.http.post<any>(this.AddDirectionURL, JSON.parse(JSON.stringify(direction)), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.addDirection(direction));
            }));
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
        return this.http.post<any>(this.AddEquipmentURL, JSON.parse(JSON.stringify(equipment)), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.addEquipment(equipment));
            }));
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
            'memo': exclusion.memo
        }
        return this.http.post<any>(this.AddExclusionURL, JSON.parse(JSON.stringify(exclusion)), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.addExclusion(exclusion));
            }));
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
        return this.http.post<any>(this.AddExpertiseURL, JSON.parse(JSON.stringify(expertise)), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.addExpertise(expertise));
            }));
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
            'mandatoryOrSupplemental': material.mandatoryOrSupplemental,
            'partDescription': material.partDescription,
            'memo': material.memo,
            'price': material.price,
            'provisionId': material.provisionId,
            'quantity': material.quantity,
            'unitCost': material.unitCost,
            'unitOfMeasureId': material.unitOfMeasureId,
            'workflowId': material.workflowId,
            'isDelete': material.isDelete,
            'partNumber': material.partNumber
        }
        return this.http.post<any>(this.AddMaterialListURL, JSON.parse(JSON.stringify(obj)), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.addMaterial(material));
            }));
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
        return this.http.post<any>(this.AddMeasurementURL, JSON.parse(JSON.stringify(obj)), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.addMeasurement(measurement));
            }));
    }

    addPublication<T>(publication: any): Observable<T> {

        return this.http.post<any>(this.AddPublicationURL, JSON.parse(JSON.stringify(publication)), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.addPublication(publication));
            }));
    }

    updateCharges<T>(charges: any): Observable<T> {
        return this.http.post<any>(this.UpdateChargesURL, JSON.parse(JSON.stringify(charges)), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.updateCharges(charges));
            }));
    }

    updateEquipment<T>(equipment: any): Observable<T> {
        return this.http.post<any>(this.UpdateEquipmentURL, JSON.parse(JSON.stringify(equipment)), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.updateEquipment(equipment));
            }));
    }

    updateDirection<T>(direction: any): Observable<T> {

        return this.http.post<any>(this.UpdateDirectionURL, JSON.parse(JSON.stringify(direction)), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.updateEquipment(direction));
            }));
    }

    updateExclusion<T>(exclusion: any): Observable<T> {

        return this.http.post<any>(this.UpdateExclusionURL, JSON.parse(JSON.stringify(exclusion)), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.updateExclusion(exclusion));
            }));
    }

    updateExpertise<T>(expertise: any): Observable<T> {

        return this.http.post<any>(this.UpdateExpertiseURL, JSON.parse(JSON.stringify(expertise)), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.updateExclusion(expertise));
            }));
    }

    updateMeasurement<T>(measurement: any): Observable<T> {
        return this.http.post<any>(this.UpdateMeasurementURL, JSON.parse(JSON.stringify(measurement)), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.updateMeasurement(measurement));
            }));
    }

    updateMaterial<T>(material: any): Observable<T> {

        return this.http.post<any>(this.UpdateMaterialListURL, JSON.parse(JSON.stringify(material)), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.updateMeasurement(material));
            }));
    }

    updatePublication<T>(publication: any): Observable<T> {

        return this.http.post<any>(this.UpdatePublicationURL, JSON.parse(JSON.stringify(publication)), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.updatePublication(publication));
            }));
    }

    addAction<T>(action: any): Observable<T> {

        return this.http.post<any>(this.getAddActionURL, JSON.parse(JSON.stringify(action)), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.addAction(action));
            }));
    }

    getActions<T>(): Observable<T> {

        return this.http.get<any>(this.getActionURL, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getActions());
            }));
    }

    getActionAttributes<T>(): Observable<T> {

        return this.http.get<any>(this.getActionAttributesURL, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getActionAttributes());
            }));
    }

    getChargesCurrency<T>(): Observable<T> {

        return this.http.get<any>(this.getChargesCurrencyURL, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getChargesCurrency());
            }));
    }

    GetExpertiseType<T>(): Observable<T> {

        return this.http.get<any>(this.getExpertiseTypeURL, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.GetExpertiseType());
            }));
    }

    getEmployeeExpertiseType<T>(): Observable<T> {

        return this.http.get<any>(this.getEmployeeExpertiseTypeURL, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getEmployeeExpertiseType());
            }));
    }


    getEquipmentAssetType<T>(): Observable<T> {

        return this.http.get<any>(this.getEquipmentAssetTypesURL, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getEquipmentAssetType());
            }));
    }

    GetMaterialMandatory<T>(): Observable<T> {

        return this.http.get<any>(this.getMaterialMandatoryURL, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.GetMaterialMandatory());
            }));
    }

    GetMaterialUOM<T>(): Observable<T> {

        return this.http.get<any>(this.getMaterialUOMURL, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.GetMaterialUOM());
            }));
    }

    GetExclusionEstimatedOccurance<T>(): Observable<T> {

        return this.http.get<any>(this.getExclusionEstimatedOccuranceURL, this.getRequestHeaders())

            .pipe(catchError(error => {

                return this.handleError(error, () => this.GetExclusionEstimatedOccurance());

            }));
    }

    GetPublicationStatus<T>(): Observable<T> {
        return this.http.get<any>(this.getPublicationStatusURL, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.GetPublicationStatus());
            }));
    }

    GetPublicationModel<T>(aircraftTypeId): Observable<T> {
        let endpointUrl = `${this.getPublicationModelURL}/${aircraftTypeId}`;
        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.GetPublicationModel(aircraftTypeId));
            }));
    }

    GetDashNumberByModelIdURL<T>(modelId: number): Observable<T> {
        let endpointUrl = `${this.getDashNumberByModelIdURL}/${modelId}`;
        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.GetDashNumberByModelIdURL(modelId));
            }));
    }

    getLocations<T>(): Observable<T> {
        return this.http.get<any>(this.getLocationsUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getLocations());
            }));
    }

    GetPublicationAircraftManufacturer<T>(): Observable<T> {
        return this.http.get<any>(this.getPublicationAircraftManufacturerURL, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.GetPublicationAircraftManufacturer());
            }));
    }

    GetPublicationType<T>(): Observable<T> {
        return this.http.get<any>(this.getPublcationTypeURL, this.getRequestHeaders())

            .pipe(catchError(error => {

                return this.handleError(error, () => this.GetPublicationType());

            }));
    }

    getChargesType<T>(): Observable<T> {
        return this.http.get<any>(this.getChargesTypeURL, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getChargesType());
            }));
    }
    getCharges() {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/Charge/GetAllActive`, this.getRequestHeaders());
    }

    GetMaterialCondition<T>(): Observable<T> {
        return this.http.get<any>(this.getMaterialConditionURL, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.GetMaterialCondition());
            }));
    }

}