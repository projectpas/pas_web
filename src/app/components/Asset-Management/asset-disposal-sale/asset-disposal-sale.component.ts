import { Component, OnInit, Input } from '@angular/core';
//import { AlertService } from '../../../services/alert.service';
import { AssetService } from '../../../services/asset/Assetservice';
import { Router } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { fadeInOut } from '../../../services/animations';
import { AlertService, DialogType, MessageSeverity } from '../../../services/alert.service';
import { CommonService } from '../../../services/common.service';
import { LegalEntityService } from '../../../services/legalentity.service';
import * as $ from 'jquery'

@Component({
    selector: 'app-asset-disposal-sale',
    templateUrl: './asset-disposal-sale.component.html',
    styleUrls: ['./asset-disposal-sale.component.scss'],
    animations: [fadeInOut]
}) 
/** Asset-listing component*/
export class AssetDisposalSaleComponent implements OnInit {
    @Input() assetsId;
    // isWorkOrder = false;
    isSaving: boolean;
    activeIndex: number;
    assetViewList: any = {};
    currentAsset: any = {};
    modal: NgbModalRef;
    historyModal: NgbModalRef;
    private isDeleteMode: boolean = false;
    private isEditMode: boolean = false;
    manufacturerId: any;
    currencyId: any;
    Active: string;
    selectedColumn: any;
    totalRecords: any;
    pageIndex: number = 0;
    pageSize: number = 10;
    totalPages: number;
	totalRecords1: any;
    pageIndex1: number = 0;
    pageSize1: number = 10;
    totalPages1: number;
    updateMode: boolean = false;
    allManagemtninfo: any[] = [];
    bulist: any[] = [];
    departmentList: any[] = [];
    divisionlist: any[] = [];
    maincompanylist: any[] = [];
    allManufacturerInfo: any[] = [];
    managementStructureData: any = [];

    ngOnInit(): void {
        this.loadData();
        this.activeIndex = 0;
        this.assetService.ShowPtab = false;
        this.assetService.alertObj.next(this.assetService.ShowPtab); //steps
        this.assetService.indexObj.next(this.activeIndex);
    }
    /** Asset-listing ctor */
    loadingIndicator: boolean;
    allAssetInfo: any[] = [];
    allAssetInfoNew: any[] = [];
    cols: { field: string; header: string; colspan: string }[];
    cols1: { field: string; header: string; }[];
    selectedColumns: { field: string; header: string; }[];
    selectedCol: { field: string; header: string; }[];
    constructor(private alertService: AlertService, private assetService: AssetService, private _route: Router,
        private modalService: NgbModal, private commonservice: CommonService,
        private legalEntityServices: LegalEntityService
    ) {
        this.assetService.isEditMode = false;
        this.assetService.listCollection = null;
    }

    //Functionality for pagination.
    //to-do: Build lazy loading
    changePage(event: { first: any; rows: number }) {
        const pageIndex = (event.first / event.rows);
        this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }

    private onDataLoadSuccessful(allWorkFlows: any[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.allAssetInfo = allWorkFlows;
        console.log(this.allAssetInfo);
        this.totalRecords = this.allAssetInfo.length;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        this.loadManagementdata();
    }

    private loadData() {

        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.assetService.getAssetList().subscribe(
            results => this.onDataLoadSuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );

        this.cols = [

            { field: 'name', header: 'Asset Name', colspan: '1' },
            { field: 'assetId', header: 'Asset ID', colspan: '1' },
            { field: 'alternateAssetId', header: 'Alt Asset ID', colspan: '1' },
            { field: 'manufacturer', header: 'Manufacturer', colspan: '1' },
            { field: 'isSerializedNew', header: 'Serial Num', colspan: '1' },
            { field: 'companyName', header: 'Level 01', colspan: '1' },
            { field: 'buName', header: 'Level 02', colspan: '1' },
            { field: 'deptName', header: 'Level 03', colspan: '1' },
            { field: 'divName', header: 'Level 04', colspan: '1' },
            { field: 'assetStatus', header: 'Status', colspan: '1' },
            { field: '', header: 'Updated Cost', colspan: '1' },
            { field: '', header: 'Existing Book Value', colspan: '1' },
            { field: '', header: 'Last Depr Date', colspan: '1' },
        ];

        this.selectedColumns = this.cols;
        
    }
    private onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

    }

    private loadManagementdata() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.legalEntityServices.getManagemententity().subscribe(
            results => this.onManagemtntdataLoad(results[0]),
            error => this.onDataLoadFailed(error)
        );
    }

    private onManagemtntdataLoad(getAtaMainList: any[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.allManagemtninfo = getAtaMainList;

        for (let i = 0; i < this.allManagemtninfo.length; i++) {

            if (this.allManagemtninfo[i].parentId == null) {
                this.maincompanylist.push(this.allManagemtninfo[i]);
            }
        }

        for (let i = 0; i < this.allAssetInfo.length; i++) {
            this.currentAsset = { ...this.allAssetInfo[i] };
            let companyName = '';
            let buName = '';
            let deptName = '';
            let divName = '';
            let manufacturerName = '';
            let managementStrName = '';
            this.setManagementStrucureData(this.currentAsset);
            if (this.currentAsset.companyId) {
                companyName = this.getNameById(this.currentAsset.companyId);
                managementStrName = companyName;
            }
            if (this.currentAsset.buisinessUnitId) {
                buName = this.getNameById(this.currentAsset.buisinessUnitId);
                managementStrName = managementStrName + ', ' + buName;
            }
            if (this.currentAsset.departmentId) {
                deptName = this.getNameById(this.currentAsset.departmentId);
                managementStrName = managementStrName + ', ' + deptName;
            }
            if (this.currentAsset.divisionId) {
                divName = this.getNameById(this.currentAsset.divisionId);
                managementStrName = managementStrName + ', ' + divName;
            }
            if (this.currentAsset.manufacturer) {
                manufacturerName = this.currentAsset.manufacturer.name
            }

            if (this.currentAsset.isDepreciable) {

            }

            this.currentAsset = {
                ...this.currentAsset,
                companyName: companyName,
                buName: buName,
                deptName: deptName,
                divName: divName,
                manufacturerName: manufacturerName,
                isSerializedNew: this.currentAsset.isSerialized == true ? 'Yes' : 'No',
                calibrationRequiredNew: this.currentAsset.calibrationRequired == true ? 'Yes' : 'No',
                assetClass: this.currentAsset.isDepreciable == true ? 'Tangible' : 'Intangible',
                assetType: this.currentAsset.assetType.assetTypeName,              
                assetStatus: this.currentAsset.isActive == true ? 'Active' : 'In Active',
                managementStrName: managementStrName,
            };
            
            this.allAssetInfoNew.push(this.currentAsset);
        }
        console.log(this.allManagemtninfo);
        console.log(this.allAssetInfoNew);

        //this.allAssetInfo = { ...this.allAssetInfoNew}
    }

    checkMSParents(msId) {
        this.managementStructureData.push(msId);
        for (let a = 0; a < this.allManagemtninfo.length; a++) {
            if (this.allManagemtninfo[a].managementStructureId == msId) {
                if (this.allManagemtninfo[a].parentId) {
                    this.checkMSParents(this.allManagemtninfo[a].parentId);
                    break;
                }
            }
        }

    }

    setManagementStrucureData(obj) {
        this.managementStructureData = [];
        this.checkMSParents(obj.managementStructureId);
        console.log(this.managementStructureData.length);
        if (this.managementStructureData.length == 4) {
            this.currentAsset.companyId = this.managementStructureData[3];
            this.currentAsset.buisinessUnitId = this.managementStructureData[2];
            this.currentAsset.departmentId = this.managementStructureData[1];
            this.currentAsset.divisionId = this.managementStructureData[0];
        }
        if (this.managementStructureData.length == 3) {
            this.currentAsset.companyId = this.managementStructureData[2];
            this.currentAsset.buisinessUnitId = this.managementStructureData[1];
            this.currentAsset.departmentId = this.managementStructureData[0];
            this.getBUList(this.currentAsset.companyId);
            this.getDepartmentlist(this.currentAsset.buisinessUnitId);
        }
        if (this.managementStructureData.length == 2) {
            this.currentAsset.companyId = this.managementStructureData[1];
            this.currentAsset.buisinessUnitId = this.managementStructureData[0];
            this.getBUList(this.currentAsset.companyId);
        }
        if (this.managementStructureData.length == 1) {
            this.currentAsset.companyId = this.managementStructureData[0];
        }

    }

    getBUList(companyId) {
        if (this.updateMode == false) {
            this.currentAsset.buisinessUnitId = "";
            this.currentAsset.departmentId = "";
            this.currentAsset.divisionId = "";
            this.currentAsset.managementStructureId = companyId;
            this.departmentList = [];
            this.divisionlist = [];
            this.bulist = [];
            for (let i = 0; i < this.allManagemtninfo.length; i++) {
                if (this.allManagemtninfo[i].parentId == companyId) {
                    this.bulist.push(this.allManagemtninfo[i])
                }
            }

        }
        else {
            this.departmentList = [];
            this.divisionlist = [];
            this.bulist = [];
            for (let i = 0; i < this.allManagemtninfo.length; i++) {
                if (this.allManagemtninfo[i].parentId == companyId) {
                    this.bulist.push(this.allManagemtninfo[i])
                }
            }
        }
    }

    getDepartmentlist(businessUnitId) {
        if (this.updateMode == false) {
            this.currentAsset.departmentId = "";
            this.currentAsset.divisionId = "";
            this.currentAsset.managementStructureId = businessUnitId;
            this.departmentList = [];
            this.divisionlist = [];
            for (let i = 0; i < this.allManagemtninfo.length; i++) {
                if (this.allManagemtninfo[i].parentId == businessUnitId) {
                    this.departmentList.push(this.allManagemtninfo[i]);
                }
            }

        }
        else {
            this.departmentList = [];
            this.divisionlist = [];
            for (let i = 0; i < this.allManagemtninfo.length; i++) {
                if (this.allManagemtninfo[i].parentId == businessUnitId) {
                    this.departmentList.push(this.allManagemtninfo[i]);
                }
            }
        }
    }

    getDivisionlist(departmentId) {
        if (this.updateMode == false) {
            this.currentAsset.divisionId = "";
            this.currentAsset.managementStructureId = departmentId;
            this.divisionlist = [];
            for (let i = 0; i < this.allManagemtninfo.length; i++) {
                if (this.allManagemtninfo[i].parentId == departmentId) {
                    this.divisionlist.push(this.allManagemtninfo[i]);
                }
            }
        }
        else {
            this.divisionlist = [];
            for (let i = 0; i < this.allManagemtninfo.length; i++) {
                if (this.allManagemtninfo[i].parentId == departmentId) {
                    this.divisionlist.push(this.allManagemtninfo[i]);
                }
            }
        }
    }

    getNameById(id) {
        for (let i = 0; i < this.allManagemtninfo.length; i++) {

            if (this.allManagemtninfo[i].managementStructureId == id) {
                return this.allManagemtninfo[i].code;
            }
        }
        return '';
    }

    openHistory(content, row) {

        this.historyModal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.historyModal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }
}