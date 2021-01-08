import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import 'rxjs/add/operator/map';
import { ConfigurationService } from '../configuration.service';
import { Observable } from 'rxjs';
import { EndpointFactory } from '../endpoint-factory.service';
import {catchError} from 'rxjs/operators';
@Injectable()
export class AssetEndpoint extends EndpointFactory {
    
    private readonly _assetlistUrl: string = "/api/AssetModule/Get";
    private readonly _assetlistNewUrl: string = "/api/AssetModule/assetlist";
    // private readonly _assetInventorylistUrl: string = "/api/AssetModule/GetAssetInventory";
    private readonly _assetInventorylistUrl: string = "/api/AssetModule/assetinventorylist";
    private readonly _allAssetlistUrl: string = "/api/AssetModule/GetAll";
    private readonly _addAssetUrlNew: string = "/api/AssetModule/AddAsset";
    private readonly _addAssetIntangibleUrl: string = "/api/AssetModule/AddIntangibleAsset";
    private readonly _addAssetCalibrationUrl: string = "/api/AssetModule/AddAssetCalibration";
    private readonly _addAssetMaintenanceUrl: string = "/api/AssetModule/AddAssetMaintenance";
    private readonly _addAssetUrlNewInventory: string =  "/api/AssetModule/addAssetInventory";
    private readonly _addAssetUrlNewInventoryIntangible: string ="/api/AssetModule/AddIntangibleAssetInventory"
    
    private readonly removeByIdURL: string = "/api/AssetModule/removeById";
    private readonly removeAssetInventoryByIdURL: string = "/api/AssetModule/removeAssetInventoryById";
    private readonly removeCapByIdURL: string = "/api/AssetModule/removeCapesById";
    private readonly _updateAssetUrl: string = "/api/AssetModule/UpdateAsset";
    private readonly _updateAssetIntangibleUrl: string = "/api/AssetModule/UpdateIntangibleAsset"; 
    private readonly _updateAssetCalibrationUrl: string = "/api/AssetModule/UpdateAssetCalibration";
    private readonly _updateAssetMaintenanceUrl: string = "/api/AssetModule/UpdateAssetMaintenance";
    private readonly _updateAssetInventoryUrl: string = "/api/AssetModule/updateAssetInventory";
    private readonly _updateAssetInventoryUrlIntangible: string = "/api/AssetModule/UpdateIntangibleAssetInventory";
   
    private readonly _updateAssetListingUrl: string = "/api/AssetModule/updateAssetListing";
    private readonly _updateAssetInventoryListingUrl: string = "/api/AssetModule/updateAssetInventoryListing";
    private readonly _capabilityListUrl: string = "/api/AssetModule/GetCapes";
    private readonly _getCapabilityUrl: string = "/api/AssetModule/capabilityGet";
    private readonly _getAssetCapabilityUrl: string = "/api/AssetModule/AssetcapabilityGet";
    private readonly getAuditById: string = "/api/AssetModule/audits";
    private readonly capesPost: string = "/api/AssetModule/Mancapespost";
    private readonly _updatecapesByNewUrl: string = "/api/AssetModule/Updatecapes";
    
    private readonly addassetcapes: string = "/api/AssetModule/addAssetCapes";
    // private readonly _updatecapesUrl: string = "/api/AssetModule/updatecapes";
    private readonly _updatecapesUrl: string = "/api/AssetModule/ActiveCapes";
    
    private readonly assetListGlobalSrhurl: string = "/api/AssetModule/assetglobalsearch";
    private readonly _getAssetUrl: string = "/api/AssetModule/GetAsset";
    private readonly _getAssetByIDUrl: string = "/api/AssetModule/GetAssetByID";
    private readonly _getAssetByInventoryIDUrl: string = "/api/AssetModule/GetAssetByInventoryID";
    private readonly _getByInventoryIDUrl: string = "/api/AssetModule/GetByInventoryID";
    private readonly _getAssetcapesUrl: string = "/api/AssetModule/GetAssetCapesAudit";
    private readonly _assetwarrantystatusListurl: string = "/api/AssetModule/GetWarrantyStatus";
    private readonly _CapesSearchUrl: string = '/api/AssetModule/GetAssetCapesRecordCheck';
    private readonly _customerList: string = '/api/AssetModule/List';
    private readonly excelUploadCapes: string = "/api/AssetModule/UploadCapsAircraftCustomData";
    private readonly _addDocumentDetails: string = '/api/AssetModule/customerDocumentUpload';
    private readonly _getInventoryDocumentAttachmentslist: string = "/api/AssetModule/getinventorydocumentattachmentdetails";
    private readonly allAssetIntangibleListURL: string = "api/AssetIntangibleAttributeType/GetAssetIntangibletype";

    
    get CapesSearchUrl() { return this.configurations.baseUrl + this._CapesSearchUrl }
    get allAssetListURL() { return this.configurations.baseUrl + this._allAssetlistUrl; }
    get assetListurl() { return this.configurations.baseUrl + this._assetlistUrl; }
    get assetNewListurl() { return this.configurations.baseUrl + this._assetlistNewUrl; }
    get assetInventoryListurl() { return this.configurations.baseUrl + this._assetInventorylistUrl; }
    get removeById() { return this.configurations.baseUrl + this.removeByIdURL; }
    get customerList() { return this.configurations.baseUrl + this._customerList; }
    get removeAssetInventoryById() { return this.configurations.baseUrl + this.removeAssetInventoryByIdURL; }
    get updateById() { return this.configurations.baseUrl + this._updateAssetListingUrl; }
    get updateByInventoryId() { return this.configurations.baseUrl + this._updateAssetInventoryListingUrl; }
    get removeCapesById() { return this.configurations.baseUrl + this.removeCapByIdURL; }
    get capabilityTypeListUrl() { return this.configurations.baseUrl + this._capabilityListUrl; }
    get getCapabilityUrl() { return this.configurations.baseUrl + this._getCapabilityUrl; }
    get getAsetCapabilityUrl() { return this.configurations.baseUrl + this._getAssetCapabilityUrl; }
    get getAssetUrl() { return this.configurations.baseUrl + this._getAssetUrl; }
    get getAssetByIDUrl() { return this.configurations.baseUrl + this._getAssetByIDUrl; }
    get getAssetByInventoryIDUrl() { return this.configurations.baseUrl + this._getAssetByInventoryIDUrl; }
    get getByInventoryIDUrl() { return this.configurations.baseUrl + this._getByInventoryIDUrl; }
    get getAssetcapesUrl() { return this.configurations.baseUrl + this._getAssetcapesUrl; }


    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }


    getAllAssetList<T>(): Observable<T> {
           return this.http.get<any>(this.allAssetListURL, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAllAssetList());
            }));
    }
    getIntangibleList<T>(): Observable<T> {
        return this.http.get<any>(this.allAssetIntangibleListURL, this.getRequestHeaders())
         .pipe(catchError(error => {
             return this.handleError(error, () => this.getIntangibleList());
         }));
 }
    getNewAsset<T>(userObject: any): Observable<T> {
            return this.http.post<any>(this._addAssetUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getNewAsset(userObject));
            }));
    }
    addAssetIntangible<T>(userObject: any): Observable<T> {
         return this.http.post<any>(this._addAssetIntangibleUrl, JSON.stringify(userObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.addAssetIntangible(userObject));
            }));
    }
    addAssetMaintance<T>(userObject: any): Observable<T> {
              return this.http.post<any>(this._addAssetMaintenanceUrl, JSON.stringify(userObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.addAssetMaintance(userObject));
            }));
    }
    addAssetCalibration<T>(userObject: any): Observable<T> {
            return this.http.post<any>(this._addAssetCalibrationUrl, JSON.stringify(userObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.addAssetCalibration(userObject));
            }));
    }
    updateAssetCalibration<T>(userObject: any): Observable<T> {
        return this.http.put<any>(this._updateAssetCalibrationUrl, JSON.stringify(userObject), this.getRequestHeaders())
        .pipe(catchError(error => {
            return this.handleError(error, () => this.updateAssetCalibration(userObject));
        }));
}
    
    updateAssetMaintance<T>(userObject: any): Observable<T> {
             return this.http.put<any>(this._updateAssetMaintenanceUrl, JSON.stringify(userObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.updateAssetMaintance(userObject));
            }));
    }
    
    getNewAssetInventory<T>(userObject: any): Observable<T> {
        
        if(userObject.isTangible==true){
        return this.http.post<any>(this._addAssetUrlNewInventory, JSON.stringify(userObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getNewAssetInventory(userObject));
            }));
        }else{
            return this.http.post<any>(this._addAssetUrlNewInventoryIntangible, JSON.stringify(userObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getNewAssetInventory(userObject));
            }));

        }
    }

    getDocumentUploadEndpoint<T>(file: any): Observable<T> {
        const headers = new Headers({ 'Content-Type': 'multipart/form-data' });
        return this.http.post<T>(`${this._addDocumentDetails}`, file);
    }
    getDocumentList(assetReordId, IsMaintenance) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/AssetModule/getAssetDocumentDetail/${assetReordId}/${IsMaintenance}`, this.getRequestHeaders()).pipe(catchError(error => {
            return this.handleError(error, () => this.getDocumentList(assetReordId, IsMaintenance));
        }));
    }

    getDocumentList_1(assetReordId, IsWarranty) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/AssetModule/getAssetDocumentDetail_1/${assetReordId}/${IsWarranty}`, this.getRequestHeaders()).pipe(catchError(error => {
            return this.handleError(error, () => this.getDocumentList_1(assetReordId, IsWarranty));
        }));
    }

    GetUploadDocumentsList(attachmentId, assetReordId, moduleId) {
        return this.http.get<any>(`${this._getInventoryDocumentAttachmentslist}?attachmentId=${attachmentId}&referenceId=${assetReordId}&moduleId=${moduleId}`, this.getRequestHeaders()).pipe(catchError(error => {
            return this.handleError(error, () => this.GetUploadDocumentsList(attachmentId, assetReordId, moduleId));
        }));
    }
    deleteDocumentByCustomerAttachementId(assetAttachementId, updatedBy) {
        return this.http.delete(`${this.configurations.baseUrl}/api/common/attachmentDelete/${assetAttachementId}?updatedBy=${updatedBy}`, this.getRequestHeaders()).pipe(catchError(error => {
            return this.handleError(error, () => this.deleteDocumentByCustomerAttachementId(assetAttachementId, updatedBy));
        }));
    }

    getByAssetIdDataEndpoint<T>(assetId: any): Observable<T> {
        let url = `${this.getAssetUrl}/${assetId}`;
        return this.http.get<any>(url, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getByAssetIdDataEndpoint(assetId));
            }));
    }

    getByAssetIdByIDDataEndpoint<T>(assetId: any): Observable<T> {
        let url = `${this.getAssetByIDUrl}/${assetId}`;
        return this.http.get<any>(url, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getByAssetIdByIDDataEndpoint(assetId));
            }));
    }

    getByAssetIdByInventoryIDDataEndpoint<T>(assetId: any): Observable<T> {
        let url = `${this.getAssetByInventoryIDUrl}/${assetId}`;
        return this.http.get<any>(url, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getByAssetIdByInventoryIDDataEndpoint(assetId));
            }));
    }

    getByInventoryIDDataEndpoint<T>(assetinventoryId: any): Observable<T> {
        let url = `${this.getByInventoryIDUrl}/${assetinventoryId}`;
        return this.http.get<any>(url, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getByInventoryIDDataEndpoint(assetinventoryId));
            }));
    }

    getAssetCapesAuditById<T>(assetcapesId: any): Observable<T> {
        let url = `${this.getAssetcapesUrl}/${assetcapesId}`;
        return this.http.get<any>(url, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAssetCapesAuditById(assetcapesId));
            }));
    }

    CapesFileUpload(file, assetRecordId,data) {
        return this.http.post(`${this.configurations.baseUrl}${this.excelUploadCapes}?assetRecordId=${assetRecordId}`, file,data)

    }
    
    getAssetList<T>(): Observable<T> {
        return this.http.get<any>(this.assetListurl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAssetList());
            }));
    }
    getAssetNewList<T>(data): Observable<T> {

        return this.http.post<any>(this.assetNewListurl,JSON.stringify(data), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAssetNewList(data));
            }));
    }
    getAssetListGlobalFilter<T>(data): Observable<T> {

        return this.http.post<any>(this.assetListGlobalSrhurl,JSON.stringify(data), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAssetListGlobalFilter(data));
            }));
    }

    
    // getpublicationListEndpointNew<T>(data): Observable<T> {
    //     return this.http.post(this.getPublicationsListUrl, JSON.stringify(data), this.getRequestHeaders())
    //       .catch(error => {
    //         return this.handleError(error, () => this.getpublicationListEndpointNew(data));
    //       });
    //   }
    getAssetInventoryList<T>(data: any): Observable<T> {

        return this.http.post<any>(this.assetInventoryListurl, JSON.stringify(data),this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAssetInventoryList(data));
            }));
    }

    updateAsset<T>(roleObject: any, assetRecordId: number): Observable<T> {
        //let endpointUrl = `${this._updateAssetUrl}/${roleObject.assetRecordId}`;

        return this.http.put<any>(this._updateAssetUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.updateAsset(roleObject, assetRecordId));
            }));
    }
    updateAssetIntangible<T>(roleObject: any, assetRecordId: number): Observable<T> {
        //let endpointUrl = `${this._updateAssetUrl}/${roleObject.assetRecordId}`;

        return this.http.put<any>(this._updateAssetIntangibleUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.updateAssetIntangible(roleObject, assetRecordId));
            }));
    }
    
    updateAssetInventory<T>(roleObject: any, assetRecordId: number): Observable<T> {
        //let endpointUrl = `${this._updateAssetUrl}/${roleObject.assetRecordId}`;
if(roleObject.isTangible==true){
    return this.http.put<any>(this._updateAssetInventoryUrl, JSON.stringify(roleObject), this.getRequestHeaders())
    .pipe(catchError(error => {
        return this.handleError(error, () => this.updateAssetInventory(roleObject, assetRecordId));
    }));
}else{
    return this.http.put<any>(this._updateAssetInventoryUrlIntangible, JSON.stringify(roleObject), this.getRequestHeaders())
    .pipe(catchError(error => {
        return this.handleError(error, () => this.updateAssetInventory(roleObject, assetRecordId));
    }));
}
 
    }

    updateAssetListing<T>(assetRecordId: number, status: string,username:string): Observable<T> {
        //let endpointUrl = `${this._updateAssetUrl}/${roleObject.assetRecordId}`;
        let endpointUrl = `${this.updateById}/${assetRecordId}/${status}/${username}`;
        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.updateAssetListing(assetRecordId, status,username));
            }));
    }


    updateAssetInventoryListing<T>(assetInventoryId: number, status: string,username:string): Observable<T> {
        //let endpointUrl = `${this._updateAssetUrl}/${roleObject.assetRecordId}`;
        let endpointUrl = `${this._updateAssetInventoryListingUrl}/${assetInventoryId}/${status}/${username}`;
        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.updateAssetInventoryListing(assetInventoryId, status,username));
            }));
    }

    removeAssetById<T>(assetRecordId: number): Observable<T> {
        let endpointUrl = `${this.removeById}/${assetRecordId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.removeAssetById(assetRecordId));
            }));
    }

    removeAssetInventory<T>(assetRecordId: number): Observable<T> {
        let endpointUrl = `${this.removeAssetInventoryById}/${assetRecordId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.removeAssetInventory(assetRecordId));
            }));
    }


    removeAssetCapesById<T>(assetCapesById: number): Observable<T> {
        let endpointUrl = `${this.removeCapesById}/${assetCapesById}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.removeAssetCapesById(assetCapesById));
            }));
    }

    GetAssetCapesRecordCheck<T>(assetrecordid: number, searchUrl: string) {
        let endpointUrl = `${this.CapesSearchUrl}?AssetRecordId=${assetrecordid}&${searchUrl}`;

        return this.http
            .get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.GetAssetCapesRecordCheck(assetrecordid, searchUrl));
            }));
    }

    //For Capes Saving//
    saveAssetCapesInfo<T>(data: any,type): Observable<T> {
if(type=='add'){
        return this.http.post<any>(this.capesPost, JSON.stringify(data), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.saveAssetCapesInfo(data,type));
            }));
    }else{
        return this.http.put<any>(this._updatecapesByNewUrl, JSON.stringify(data), this.getRequestHeaders())
        .pipe(catchError(error => {
            return this.handleError(error, () => this.saveAssetCapesInfo(data,type));
        }));
    }
}

    addNewAssetCapesInfo<T>(data: any): Observable<T> {
        return this.http.post<any>(this.addassetcapes, JSON.stringify(data), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.addNewAssetCapesInfo(data));
            }));
    }

    getAssetCapesAll<T>(data, id){
        //return this.http.post(this.customerList, JSON.stringify(data), this.getRequestHeaders())
        //    .catch(error => {
        //        return this.handleError(error, () => this.getAssetCapesAll(data, id));
        //    });

        let endpointUrl = `${this.customerList}/${id}`;

        return this.http.post<any>(endpointUrl, JSON.stringify(data), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAssetCapesAll(data, id));
            }));
    }


    getCapabilityTypeListEndpoint<T>(assetRecordId): Observable<T> {
        let endpointUrl = `${this.capabilityTypeListUrl}/${assetRecordId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getCapabilityTypeListEndpoint(assetRecordId));
            }));
    }


    getCapabilityDataEndpoint<T>(assetRecordId: any): Observable<T> {
        let url = `${this.getCapabilityUrl}/${assetRecordId}`;
        return this.http.get<any>(url, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getCapabilityDataEndpoint(assetRecordId));
            }));
    }

    getAssetCapabilityDataEndpoint<T>(assetCapesId: any): Observable<T> {
        let url = `${this.getAsetCapabilityUrl}/${assetCapesId}`;
        return this.http.get<any>(url, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAssetCapabilityDataEndpoint(assetCapesId));
            }));
    }

    getAssetsById(assetRecordId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/workorderassetview?assetRecordId=${assetRecordId}`, this.getRequestHeaders()).pipe(catchError(error => {
            return this.handleError(error, () => this.getAssetsById(assetRecordId));
        }));
    }

    updateCapes<T>(roleObject: any, assetCapesId: number,username:string): Observable<T> {
        let url = `${this._updatecapesUrl}/${roleObject.assetCapesId}/${roleObject.isActive}/${username}`;
        return this.http.get<any>(url, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.updateCapes(roleObject, assetCapesId,username));
            }));
    }

    getAssetWarrantyStatus<T>(): Observable<T> {

        return this.http.get<any>(this._assetwarrantystatusListurl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAssetWarrantyStatus());
            }));
    }

    getAssetDataForInventoryById(id) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/AssetModule/GetAssetDataforInventory/${id}`, this.getRequestHeaders()).pipe(catchError(error => {
            return this.handleError(error, () => this.getAssetDataForInventoryById(id));
        }));
    }
    getAuditDataByInventoryId(id) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/AssetModule/getauditdatabyinventoryid/${id}`, this.getRequestHeaders()).pipe(catchError(error => {
            return this.handleError(error, () => this.getAuditDataByInventoryId(id));
        }));
    }

    //Audit method in end pont services

    //getAudit<T>(assetRecordId: number): Observable<T> {
    //    let endpointUrl = `${this.getAuditById}/${assetRecordId}`;

    //    return this.http.get<T>(endpointUrl, this.getRequestHeaders())
    //        .catch(error => {
    //            return this.handleError(error, () => this.getAudit(assetRecordId));
    //        });
    //}

    //asset inventory adjustment
    getAdjustmentByAssetInventoryId(id) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/AssetModule/getadjustmentbyassetinventoryid/${id}`, this.getRequestHeaders()).pipe(catchError(error => {
            return this.handleError(error, () => this.getAdjustmentByAssetInventoryId(id));
        }));
    }    
    assetAdjustmentPost<T>(data: any): Observable<T> {
        let url = `${this.configurations.baseUrl}/api/AssetModule/adjustmentpost`;
        return this.http.post<any>(url, JSON.stringify(data), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.assetAdjustmentPost(data));
            }));
    }

    downloadAllAssetList<T>(data): Observable<T> {
        let url = `${this.configurations.baseUrl}/api/AssetModule/ExportassetList`;
        return this.http.post<any>(url, data, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.downloadAllAssetList(data));
            }));
    }
    downloadAllAssetInventoryList<T>(data): Observable<T> {
        let url = `${this.configurations.baseUrl}/api/AssetModule/ExportAssetinventorylist`;
        return this.http.post<any>(url, data, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.downloadAllAssetInventoryList(data));
            }));
    }
    downloadAllAssetCapsList<T>(data,assetRecordId): Observable<T> {
        let url = `${this.configurations.baseUrl}/api/AssetModule/ExportCapesList//${assetRecordId}`;
        return this.http.post<any>(url, data, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.downloadAllAssetCapsList(data,assetRecordId));
            }));
    }
}