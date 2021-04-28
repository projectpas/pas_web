import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import 'rxjs/add/operator/map';
import { ConfigurationService } from '../configuration.service';
import { Observable } from 'rxjs';
import { EndpointFactory } from '../endpoint-factory.service';
import { environment } from 'src/environments/environment';
@Injectable()
export class AssetEndpoint extends EndpointFactory {
    baseUrl = environment.baseUrl;
    private readonly _assetlistUrl: string =this.baseUrl + "/api/AssetModule/Get";
    private readonly _assetlistNewUrl: string =this.baseUrl + "/api/AssetModule/assetlist";
    // private readonly _assetInventorylistUrl: string = "/api/AssetModule/GetAssetInventory";
    private readonly _assetInventorylistUrl: string = this.baseUrl +"/api/AssetModule/assetinventorylist";
    private readonly _calibrationlistUrl: string = this.baseUrl +"/api/AssetModule/getcalibrationmgmtlist";
    private readonly _allAssetlistUrl: string = this.baseUrl +"/api/AssetModule/GetAll";
    private readonly _addAssetUrlNew: string =this.baseUrl + "/api/AssetModule/AddAsset";
    private readonly _addaddcalibrationManagment: string =this.baseUrl + "/api/AssetModule/addcalibrationManagment";
    private readonly _addAssetIntangibleUrl: string = this.baseUrl +"/api/AssetModule/AddIntangibleAsset";
    private readonly _addAssetCalibrationUrl: string =this.baseUrl + "/api/AssetModule/AddAssetCalibration";
    private readonly _addAssetMaintenanceUrl: string =this.baseUrl + "/api/AssetModule/AddAssetMaintenance";
    private readonly _addAssetUrlNewInventory: string = this.baseUrl + "/api/AssetModule/addAssetInventory";
    private readonly _addAssetUrlNewInventoryIntangible: string =this.baseUrl +"/api/AssetModule/AddIntangibleAssetInventory"
    
    private readonly removeByIdURL: string = this.baseUrl +"/api/AssetModule/removeById";
    private readonly removeAssetInventoryByIdURL: string =this.baseUrl + "/api/AssetModule/removeAssetInventoryById";
    private readonly removeCapByIdURL: string =this.baseUrl + "/api/AssetModule/removeCapesById";
    private readonly _updateAssetUrl: string =this.baseUrl + "/api/AssetModule/UpdateAsset";
    private readonly _updateAssetIntangibleUrl: string =this.baseUrl + "/api/AssetModule/UpdateIntangibleAsset"; 
    private readonly _updateAssetCalibrationUrl: string =this.baseUrl + "/api/AssetModule/UpdateAssetCalibration";
    private readonly _updateAssetMaintenanceUrl: string =this.baseUrl + "/api/AssetModule/UpdateAssetMaintenance";
    private readonly _updateAssetInventoryUrl: string = this.baseUrl +"/api/AssetModule/updateAssetInventory";
    private readonly _updateAssetInventoryUrlIntangible: string =this.baseUrl + "/api/AssetModule/UpdateIntangibleAssetInventory";
   
    private readonly _updateAssetListingUrl: string =this.baseUrl + "/api/AssetModule/updateAssetListing";
    private readonly _updateAssetInventoryListingUrl: string =this.baseUrl + "/api/AssetModule/updateAssetInventoryListing";
    private readonly _capabilityListUrl: string = this.baseUrl +"/api/AssetModule/GetCapes";
    private readonly GetAssetmgmtlistbyID: string = this.baseUrl +"/api/AssetModule/GetAssetmgmtlistbyID";
    private readonly _getCapabilityUrl: string =this.baseUrl + "/api/AssetModule/capabilityGet";
    private readonly _getAssetCapabilityUrl: string =this.baseUrl + "/api/AssetModule/AssetcapabilityGet";
    private readonly getAuditById: string = this.baseUrl +"/api/AssetModule/audits";
    private readonly capesPost: string =this.baseUrl + "/api/AssetModule/Mancapespost";
    private readonly _updatecapesByNewUrl: string =this.baseUrl + "/api/AssetModule/Updatecapes";
    
    private readonly addassetcapes: string = this.baseUrl +"/api/AssetModule/addAssetCapes";
    // private readonly _updatecapesUrl: string =this.baseUrl + "/api/AssetModule/updatecapes";
    private readonly _updatecapesUrl: string =this.baseUrl + "/api/AssetModule/ActiveCapes";
    
    private readonly assetListGlobalSrhurl: string =this.baseUrl + "/api/AssetModule/assetglobalsearch";
    private readonly _getAssetUrl: string =this.baseUrl + "/api/AssetModule/GetAsset";
    private readonly _getAssetByIDUrl: string =this.baseUrl + "/api/AssetModule/GetAssetByID";
    private readonly _getAssetByInventoryIDUrl: string =this.baseUrl + "/api/AssetModule/GetAssetByInventoryID";
    private readonly _getByInventoryIDUrl: string =this.baseUrl + "/api/AssetModule/GetByInventoryID";
    private readonly _getAssetcapesUrl: string =this.baseUrl + "/api/AssetModule/GetAssetCapesAudit";
    private readonly _assetwarrantystatusListurl: string =this.baseUrl + "/api/AssetModule/GetWarrantyStatus";
    private readonly _CapesSearchUrl: string =this.baseUrl + '/api/AssetModule/GetAssetCapesRecordCheck';
    private readonly _customerList: string =this.baseUrl + '/api/AssetModule/List';
    private readonly excelUploadCapes: string =this.baseUrl + "/api/AssetModule/UploadCapsAircraftCustomData";
    private readonly _addDocumentDetails: string =this.baseUrl + '/api/AssetModule/customerDocumentUpload';
    private readonly _getInventoryDocumentAttachmentslist: string =this.baseUrl + "/api/AssetModule/getinventorydocumentattachmentdetails";
    private readonly allAssetIntangibleListURL: string =this.baseUrl + "api/AssetIntangibleAttributeType/GetAssetIntangibletype";

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    getAllAssetList<T>(): Observable<T> {
           return this.http.get<T>(this._allAssetlistUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getAllAssetList());
            });
    }
    getIntangibleList<T>(): Observable<T> {
        return this.http.get<T>(this.allAssetIntangibleListURL, this.getRequestHeaders())
         .catch(error => {
             return this.handleErrorCommon(error, () => this.getIntangibleList());
         });
 }
    getNewAsset<T>(userObject: any): Observable<T> {
            return this.http.post<T>(this._addAssetUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getNewAsset(userObject));
            });
    }
    addcalibrationManagment<T>(userObject: any): Observable<T> {
        return this.http.post<T>(this._addaddcalibrationManagment, JSON.stringify(userObject), this.getRequestHeaders())
        .catch(error => {
            return this.handleErrorCommon(error, () => this.addcalibrationManagment(userObject));
        });
   }
    addAssetIntangible<T>(userObject: any): Observable<T> {
         return this.http.post<T>(this._addAssetIntangibleUrl, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.addAssetIntangible(userObject));
            });
    }
    addAssetMaintance<T>(userObject: any): Observable<T> {
              return this.http.post<T>(this._addAssetMaintenanceUrl, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.addAssetMaintance(userObject));
            });
    }
    addAssetCalibration<T>(userObject: any): Observable<T> {
            return this.http.post<T>(this._addAssetCalibrationUrl, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.addAssetCalibration(userObject));
            });
    }
    updateAssetCalibration<T>(userObject: any): Observable<T> {
        return this.http.put<T>(this._updateAssetCalibrationUrl, JSON.stringify(userObject), this.getRequestHeaders())
        .catch(error => {
            return this.handleErrorCommon(error, () => this.updateAssetCalibration(userObject));
        });
}
    
    updateAssetMaintance<T>(userObject: any): Observable<T> {
             return this.http.put<T>(this._updateAssetMaintenanceUrl, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.updateAssetMaintance(userObject));
            });
    }
    
    getNewAssetInventory<T>(userObject: any): Observable<T> {
        
        if(userObject.isTangible==true){
        return this.http.post<T>(this._addAssetUrlNewInventory, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getNewAssetInventory(userObject));
            });
        }else{
            return this.http.post<T>(this._addAssetUrlNewInventoryIntangible, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getNewAssetInventory(userObject));
            });

        }
    }

    getDocumentUploadEndpoint<T>(file: any): Observable<T> {
        const headers = new Headers({ 'Content-Type': 'multipart/form-data' });
        return this.http.post<T>(`${this._addDocumentDetails}`, file);
    }
    getDocumentList(assetReordId, IsMaintenance) {
        return this.http.get<any>(`${this.baseUrl}/api/AssetModule/getAssetDocumentDetail/${assetReordId}/${IsMaintenance}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getDocumentList(assetReordId, IsMaintenance));
        });
    }

    getDocumentList_1(assetReordId, IsWarranty) {
        return this.http.get<any>(`${this.baseUrl}/api/AssetModule/getAssetDocumentDetail_1/${assetReordId}/${IsWarranty}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getDocumentList_1(assetReordId, IsWarranty));
        });
    }

    GetUploadDocumentsList(attachmentId, assetReordId, moduleId) {
        return this.http.get<any>(`${this._getInventoryDocumentAttachmentslist}?attachmentId=${attachmentId}&referenceId=${assetReordId}&moduleId=${moduleId}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.GetUploadDocumentsList(attachmentId, assetReordId, moduleId));
        });
    }
    deleteDocumentByCustomerAttachementId(assetAttachementId, updatedBy) {
        return this.http.delete(`${this.baseUrl}/api/common/attachmentDelete/${assetAttachementId}?updatedBy=${updatedBy}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.deleteDocumentByCustomerAttachementId(assetAttachementId, updatedBy));
        });
    }

    getByAssetIdDataEndpoint<T>(assetId: any): Observable<T> {
        let url = `${this._getAssetUrl}/${assetId}`;
        return this.http.get<T>(url, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getByAssetIdDataEndpoint(assetId));
            });
    }

    getByAssetIdByIDDataEndpoint<T>(assetId: any): Observable<T> {
        let url = `${this._getAssetByIDUrl}/${assetId}`;
        return this.http.get<T>(url, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getByAssetIdByIDDataEndpoint(assetId));
            });
    }

    getByAssetIdByInventoryIDDataEndpoint<T>(assetId: any): Observable<T> {
        let url = `${this._getAssetByInventoryIDUrl}/${assetId}`;
        return this.http.get<T>(url, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getByAssetIdByInventoryIDDataEndpoint(assetId));
            });
    }

    getByInventoryIDDataEndpoint<T>(assetinventoryId: any): Observable<T> {
        let url = `${this._getByInventoryIDUrl}/${assetinventoryId}`;
        return this.http.get<T>(url, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getByInventoryIDDataEndpoint(assetinventoryId));
            });
    }

    getAssetCapesAuditById<T>(assetcapesId: any): Observable<T> {
        let url = `${this._getAssetcapesUrl}/${assetcapesId}`;
        return this.http.get<T>(url, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getAssetCapesAuditById(assetcapesId));
            });
    }

    CapesFileUpload(file, assetRecordId,data) {
        return this.http.post(`${this.baseUrl}${this.excelUploadCapes}?assetRecordId=${assetRecordId}`, file,data)

    }
    
    getAssetList<T>(): Observable<T> {
        return this.http.get<T>(this._assetlistUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getAssetList());
            });
    }
    getAssetNewList<T>(data): Observable<T> {

        return this.http.post<T>(this._assetlistNewUrl,JSON.stringify(data), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getAssetNewList(data));
            });
    }
    getAssetListGlobalFilter<T>(data): Observable<T> {

        return this.http.post<T>(this.assetListGlobalSrhurl,JSON.stringify(data), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getAssetListGlobalFilter(data));
            });
    }

    
    // getpublicationListEndpointNew<T>(data): Observable<T> {
    //     return this.http.post(this.getPublicationsListUrl, JSON.stringify(data), this.getRequestHeaders())
    //       .catch(error => {
    //         return this.handleErrorCommon(error, () => this.getpublicationListEndpointNew(data));
    //       });
    //   }
    getAssetInventoryList<T>(data: any): Observable<T> {

        return this.http.post<T>(this._assetInventorylistUrl, JSON.stringify(data),this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getAssetInventoryList(data));
            });
    }

    GetCalibarationMgmtList<T>(data: any): Observable<T> {

        return this.http.post<T>(this._calibrationlistUrl, JSON.stringify(data),this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.GetCalibarationMgmtList(data));
            });
    }

    updateAsset<T>(roleObject: any, assetRecordId: number): Observable<T> {
        //let endpointUrl = `${this._updateAssetUrl}/${roleObject.assetRecordId}`;

        return this.http.put<T>(this._updateAssetUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.updateAsset(roleObject, assetRecordId));
            });
    }
    updateAssetIntangible<T>(roleObject: any, assetRecordId: number): Observable<T> {
        //let endpointUrl = `${this._updateAssetUrl}/${roleObject.assetRecordId}`;

        return this.http.put<T>(this._updateAssetIntangibleUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.updateAssetIntangible(roleObject, assetRecordId));
            });
    }
    
    updateAssetInventory<T>(roleObject: any, assetRecordId: number): Observable<T> {
        //let endpointUrl = `${this._updateAssetUrl}/${roleObject.assetRecordId}`;
if(roleObject.isTangible==true){
    return this.http.put<T>(this._updateAssetInventoryUrl, JSON.stringify(roleObject), this.getRequestHeaders())
    .catch(error => {
        return this.handleErrorCommon(error, () => this.updateAssetInventory(roleObject, assetRecordId));
    });
}else{
    return this.http.put<T>(this._updateAssetInventoryUrlIntangible, JSON.stringify(roleObject), this.getRequestHeaders())
    .catch(error => {
        return this.handleErrorCommon(error, () => this.updateAssetInventory(roleObject, assetRecordId));
    });
}
 
    }

    updateAssetListing<T>(assetRecordId: number, status: string,username:string): Observable<T> {
        let endpointUrl = `${this._updateAssetListingUrl}/${assetRecordId}/${status}/${username}`;
        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.updateAssetListing(assetRecordId, status,username));
            });
    }


    updateAssetInventoryListing<T>(assetInventoryId: number, status: string,username:string): Observable<T> {
        //let endpointUrl = `${this._updateAssetUrl}/${roleObject.assetRecordId}`;
        let endpointUrl = `${this._updateAssetInventoryListingUrl}/${assetInventoryId}/${status}/${username}`;
        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.updateAssetInventoryListing(assetInventoryId, status,username));
            });
    }

    removeAssetById<T>(assetRecordId: number): Observable<T> {
        let endpointUrl = `${this.removeByIdURL}/${assetRecordId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.removeAssetById(assetRecordId));
            });
    }

    removeAssetInventory<T>(assetRecordId: number): Observable<T> {
        let endpointUrl = `${this.removeAssetInventoryByIdURL}/${assetRecordId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.removeAssetInventory(assetRecordId));
            });
    }


    removeAssetCapesById<T>(assetCapesById: number): Observable<T> {
        let endpointUrl = `${this.removeCapByIdURL}/${assetCapesById}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.removeAssetCapesById(assetCapesById));
            });
    }

    GetAssetCapesRecordCheck<T>(assetrecordid: number, searchUrl: string) {
        let endpointUrl = `${this._CapesSearchUrl}?AssetRecordId=${assetrecordid}&${searchUrl}`;

        return this.http
            .get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.GetAssetCapesRecordCheck(assetrecordid, searchUrl));
            });
    }

    //For Capes Saving//
    saveAssetCapesInfo<T>(data: any,type): Observable<T> {
if(type=='add'){
        return this.http.post<T>(this.capesPost, JSON.stringify(data), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.saveAssetCapesInfo(data,type));
            });
    }else{
        return this.http.put<T>(this._updatecapesByNewUrl, JSON.stringify(data), this.getRequestHeaders())
        .catch(error => {
            return this.handleErrorCommon(error, () => this.saveAssetCapesInfo(data,type));
        });
    }
}

    addNewAssetCapesInfo<T>(data: any): Observable<T> {
        return this.http.post<T>(this.addassetcapes, JSON.stringify(data), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.addNewAssetCapesInfo(data));
            });
    }

    getAssetCapesAll<T>(data, id){
        let endpointUrl = `${this._customerList}/${id}`;
        return this.http.post<T>(endpointUrl, JSON.stringify(data), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getAssetCapesAll(data, id));
            });
    }


    getCapabilityTypeListEndpoint<T>(assetRecordId): Observable<T> {
        let endpointUrl = `${this._capabilityListUrl}/${assetRecordId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getCapabilityTypeListEndpoint(assetRecordId));
            });
    }


    getCapabilityDataEndpoint<T>(assetRecordId: any): Observable<T> {
        let url = `${this._getCapabilityUrl}/${assetRecordId}`;
        return this.http.get<T>(url, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getCapabilityDataEndpoint(assetRecordId));
            });
    }

    getAssetCapabilityDataEndpoint<T>(assetCapesId: any): Observable<T> {
        let url = `${this._getAssetCapabilityUrl}/${assetCapesId}`;
        return this.http.get<T>(url, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getAssetCapabilityDataEndpoint(assetCapesId));
            });
    }

    getAssetsById(assetRecordId,masterCompanyId) { 
        return this.http.get<any>(`${this.baseUrl}/api/workOrder/workorderassetview?assetRecordId=${assetRecordId}&masterCompanyId=${masterCompanyId !=undefined ? masterCompanyId :0}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getAssetsById(assetRecordId,masterCompanyId));
        });
    }

    updateCapes<T>(roleObject: any, assetCapesId: number,username:string): Observable<T> {
        let url = `${this._updatecapesUrl}/${roleObject.assetCapesId}/${roleObject.isActive}/${username}`;
        return this.http.get<T>(url, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.updateCapes(roleObject, assetCapesId,username));
            });
    }

    getAssetWarrantyStatus<T>(): Observable<T> {

        return this.http.get<T>(this._assetwarrantystatusListurl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getAssetWarrantyStatus());
            });
    }

    getAssetDataForInventoryById(id) {
        return this.http.get<any>(`${this.baseUrl}/api/AssetModule/GetAssetDataforInventory/${id}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getAssetDataForInventoryById(id));
        });
    }
    getAuditDataByInventoryId(id) {
        return this.http.get<any>(`${this.baseUrl}/api/AssetModule/getauditdatabyinventoryid/${id}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getAuditDataByInventoryId(id));
        });
    }

    getAuditDataBycalibrationId(id) {
        return this.http.get<any>(`${this.baseUrl}/api/AssetModule/getauditdatabycalibartionid/${id}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getAuditDataBycalibrationId(id));
        });
    }

    //Audit method in end pont services

    //getAudit<T>(assetRecordId: number): Observable<T> {
    //    let endpointUrl = `${this.getAuditById}/${assetRecordId}`;

    //    return this.http.get<T>(endpointUrl, this.getRequestHeaders())
    //        .catch(error => {
    //            return this.handleErrorCommon(error, () => this.getAudit(assetRecordId));
    //        });
    //}

    //asset inventory adjustment
    getAdjustmentByAssetInventoryId(id) {
        return this.http.post<any>(`${this.baseUrl}/api/AssetModule/getadjustmentbyassetinventoryid/${id}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getAdjustmentByAssetInventoryId(id));
        });
    }    
    assetAdjustmentPost<T>(data: any): Observable<T> {
        let url = `${this.baseUrl}/api/AssetModule/adjustmentpost`;
        return this.http.post<T>(url, JSON.stringify(data), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.assetAdjustmentPost(data));
            });
    }

    downloadAllAssetList<T>(data): Observable<T> {
        let url = `${this.baseUrl}/api/AssetModule/ExportassetList`;
        return this.http.post<T>(url, data, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.downloadAllAssetList(data));
            });
    }
    downloadAllAssetInventoryList<T>(data): Observable<T> {
        let url = `${this.baseUrl}/api/AssetModule/ExportAssetinventorylist`;
        return this.http.post<T>(url, data, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.downloadAllAssetInventoryList(data));
            });
    }
    downloadAllAssetCapsList<T>(data,assetRecordId): Observable<T> {
        let url = `${this.baseUrl}/api/AssetModule/ExportCapesList//${assetRecordId}`;
        return this.http.post<T>(url, data, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.downloadAllAssetCapsList(data,assetRecordId));
            });
    }

    downloadAllCalibrationList<T>(data): Observable<T> {
        let url = `${this.baseUrl}/api/AssetModule/ExportCalibrationList`;
        return this.http.post<T>(url, data, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.downloadAllCalibrationList(data));
            });
    }

    getCalibartionListByID<T>(assetRecordId): Observable<T> {
        let endpointUrl = `${this.GetAssetmgmtlistbyID}/${assetRecordId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getCalibartionListByID(assetRecordId));
            });
    }

    UpdatecalibartionMgmt(CalibrationManagment) {
        return this.http.post<any>(`${this.baseUrl}/api/AssetModule/UpdatecalibartionMgmt`, JSON.stringify(CalibrationManagment), this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.UpdatecalibartionMgmt(CalibrationManagment));
        });
    }
} 