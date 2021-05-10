import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { Role } from '../../models/role.model';
import { AuthService } from '../auth.service';
import { AssetEndpoint } from './Asset-endpoint.service';


export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };


@Injectable()
export class AssetService {
    currentAssetId: number;
    generalcustomer: boolean = false;
    contacts: boolean = false;
    financial: boolean = false;
    billing: boolean = false;
    shipping: boolean = false;
    sales: boolean = false;
    warnings: boolean = false;
    readonly = true;
    read = true;
    enableExternal: boolean = false;
    customerobject: any[];
    financeCollection: any;
    CapeslistCollection: any;
    paymentCollection: any;
    salesCollection: any;
    shippingCollection: any;
    isEditMode: boolean = false;
    listCollection: any;
    generalCollection: any;
    auditServiceCollection: any = {};
    ShowPtab: boolean = true;
    contactCollection: any;
    customergeneralcollection: any;
    public static readonly roleAddedOperation: RolesChangedOperation = "add";
    public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
    public static readonly roleModifiedOperation: RolesChangedOperation = "modify";
    
    //for steps start
    public alertObj = new Subject<any>();
    public alertChangeObject$ = this.alertObj.asObservable();
    public indexObj = new Subject<any>();
    public indexObjChangeObject$ = this.indexObj.asObservable();
      //for steps End

    public currentUrl = this.router.url;
    public navigationObj = new Subject<any>();
    navigationObjChangeObject$ = this.navigationObj.asObservable();
    public bredcrumbObj = new Subject<any>();
    public bredcrumbObjChangeObject$ = this.bredcrumbObj.asObservable();
    isCapsEditMode: boolean;
    capabilityCollection: any;
         

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,
        private assetEndpoint: AssetEndpoint) { }


    addAsset(asset: any) {
        return this.assetEndpoint.getNewAsset<any>(asset);
    }
    addcalibrationManagment(asset: any) {
        return this.assetEndpoint.addcalibrationManagment<any>(asset);
    }
    addAssetIntangible(asset: any) {
        return this.assetEndpoint.addAssetIntangible<any>(asset);
    }
    addAssetMaintance(asset: any){
        return this.assetEndpoint.addAssetMaintance<any>(asset);
    }
    updateAssetMaintance(asset: any){
        return this.assetEndpoint.updateAssetMaintance<any>(asset);
    }
    addAssetCalibration(asset: any){
        return this.assetEndpoint.addAssetCalibration<any>(asset);
    }
    updateAssetCalibration(asset: any){
        return this.assetEndpoint.updateAssetCalibration<any>(asset);
    }
    
    addAssetInventory(asset: any) {
        return this.assetEndpoint.getNewAssetInventory<any>(asset);
    }
    documentUploadAction(action: any) {
        return this.assetEndpoint.getDocumentUploadEndpoint<any>(action);
    }
    getDocumentList(assetReordId, IsMaintenance) {
        return this.assetEndpoint.getDocumentList(assetReordId, IsMaintenance)
    }
    getDocumentList_1(assetReordId, IsWarranty) {
        return this.assetEndpoint.getDocumentList_1(assetReordId, IsWarranty)
    }
    toGetUploadDocumentsList(attachmentId, assetReordId, moduleId) {
        return this.assetEndpoint.GetUploadDocumentsList(attachmentId, assetReordId, moduleId);
    }
    deleteDocumentByCustomerAttachementId(assetAttachementId, updatedby) {
        return this.assetEndpoint.deleteDocumentByCustomerAttachementId(assetAttachementId, updatedby);
    }
    //To get List from Database//
    getAssetList() {
        return Observable.forkJoin(this.assetEndpoint.getAssetList<any[]>());
    }
    getAssetNewList(data) {
        return this.assetEndpoint.getAssetNewList<any>(data);
    }
    getAssetListGlobalFilter(data){
        return this.assetEndpoint.getAssetListGlobalFilter<any>(data);
    }
    getAssetInventoryList(data) {
        return Observable.forkJoin(this.assetEndpoint.getAssetInventoryList<any[]>(data));
   
    } 
    GetCalibarationMgmtList(data) {
        return Observable.forkJoin(this.assetEndpoint.GetCalibarationMgmtList<any[]>(data));
   
    } 

    getAssetCapesAudit(assetcapesId: number) {
        return this.assetEndpoint.getAssetCapesAuditById<any[]>(assetcapesId);
    }

    CapesUpload(file, assetrecordid,data) {
        return this.assetEndpoint.CapesFileUpload(file, assetrecordid,data);
    }

    getAllAssetList() {
        return Observable.forkJoin(this.assetEndpoint.getAllAssetList<any[]>());
    }

    getByAssetId(assetId: number) { 
        return this.assetEndpoint.getByAssetIdDataEndpoint<any>(assetId);
    }
getIntangibleList(){
    return Observable.forkJoin(this.assetEndpoint.getIntangibleList<any[]>());
}
    getByAssetById(assetId: number) {
        return this.assetEndpoint.getByAssetIdByIDDataEndpoint<any>(assetId);
    }

    getByAssetByInventoryId(assetId: number) {
        return this.assetEndpoint.getByAssetIdByInventoryIDDataEndpoint<any>(assetId);
    }

    getByInventoryId(assetinventoryId: number) {
        return this.assetEndpoint.getByInventoryIDDataEndpoint<any>(assetinventoryId);
    }

    updateAsset(asset: any) {
        return this.assetEndpoint.updateAsset(asset, asset.assetRecordId);
    }
    updateAssetIntangible(asset: any) {
        return this.assetEndpoint.updateAssetIntangible(asset, asset.assetRecordId);
    }
    
    updateAssetInventory(asset: any) {
        return this.assetEndpoint.updateAssetInventory<any>(asset, asset.assetRecordId);
    }

    updateAssetListing(assetRecordId: number, status: string,username:string) {
        return this.assetEndpoint.updateAssetListing(assetRecordId, status,username);
    }

    updateAssetInventoryListing(assetInventoryId: number, status: string,username:string) {
        return this.assetEndpoint.updateAssetInventoryListing(assetInventoryId, status,username);
    }

    GetAssetCapesRecordCheck(assetRecordId: number, searchUrl: string) {
        return this.assetEndpoint.GetAssetCapesRecordCheck(assetRecordId, searchUrl);
    }

    remove(assetRecordId: number) {
        return this.assetEndpoint.removeAssetById(assetRecordId);
    }

    removeAssetInventory(assetRecordId: number) {
        return this.assetEndpoint.removeAssetInventory(assetRecordId);
    }

    removeCapesById(AssetCapesId: number) {
        return this.assetEndpoint.removeAssetCapesById(AssetCapesId);
    }
    //For Saving of Capes//
    saveManfacturerinforcapes(data,type) {
        return this.assetEndpoint.saveAssetCapesInfo<any>(data,type);
    }

    addNewAssetInfocapes(data) {
        return this.assetEndpoint.addNewAssetCapesInfo<any>(data);
    }
    

    getcapabilityListData(assetRecordId) {
        return Observable.forkJoin(
            this.assetEndpoint.getCapabilityTypeListEndpoint<any[]>(assetRecordId));
    }

    getAssetCapesAll(data, id) {
        return this.assetEndpoint.getAssetCapesAll(data, id);
    }

    getCapabilityData(assetRecordId?: number) {
        return this.assetEndpoint.getCapabilityDataEndpoint<any>(assetRecordId);
    }

    getAssetCapabilityData(assetCapesId?: number) {
        return this.assetEndpoint.getAssetCapabilityDataEndpoint<any>(assetCapesId);
    }

    getAssetsById(assetsRecordsId,masterCompanyId){
        return this.assetEndpoint.getAssetsById(assetsRecordsId,masterCompanyId);
    }
    //Audit method in services
    //getAudit(assetRecordId: number) {
    //    return this.assetEndpoint.getAudit<any[]>(assetRecordId);
    //}
    updateCapes(assetcapes: any,username) {
        return this.assetEndpoint.updateCapes(assetcapes, assetcapes.AssetCapesId,username);
    }
    getAssetWarrantyStatus() {
        return Observable.forkJoin(this.assetEndpoint.getAssetWarrantyStatus<any[]>());
    }
    getAssetDataForInventoryById(id: number) {
        return this.assetEndpoint.getAssetDataForInventoryById(id);
    }
    getAuditDataByInventoryId(id: number) {
        return this.assetEndpoint.getAuditDataByInventoryId(id);
    }

    GetAuditDataByAssetList(id: number) {
        return this.assetEndpoint.GetAuditDataByAssetList(id);
    }
    getAuditDataBycalibrationId(id: number) {
        return this.assetEndpoint.getAuditDataBycalibrationId(id);
    }
    //asset inventory adjustment
    getAdjustmentByAssetInventoryId(id){
        return this.assetEndpoint.getAdjustmentByAssetInventoryId(id);
    }
    assetAdjustmentPost(data){
        return this.assetEndpoint.assetAdjustmentPost(data);
    }
    downloadAllAssetList(data){
        return this.assetEndpoint.downloadAllAssetList(data);
    }

    downloadAllAssetInventoryList(data){
        return this.assetEndpoint.downloadAllAssetInventoryList(data);
    }
    downloadAllAssetCapsList(data,assetRecordId){
        return this.assetEndpoint.downloadAllAssetCapsList(data,assetRecordId);
    }

    downloadAllCalibrationList(data){
        return this.assetEndpoint.downloadAllCalibrationList(data);
    }

    getCalibartionListByID(assetRecordId) {
        return Observable.forkJoin(
            this.assetEndpoint.getCalibartionListByID<any[]>(assetRecordId));
    }

    UpdatecalibartionMgmt(CalibrationManagment) {
        return this.assetEndpoint.UpdatecalibartionMgmt(CalibrationManagment)
    }



}