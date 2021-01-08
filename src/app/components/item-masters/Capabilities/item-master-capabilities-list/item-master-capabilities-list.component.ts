import { Component, ViewChild, OnInit, AfterViewInit, Input, ChangeDetectorRef, ElementRef, SimpleChanges } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
 
import { NgbModal,NgbModalRef, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { fadeInOut } from '../../../../services/animations';
import { MasterCompany } from '../../../../models/mastercompany.model';
import { AuditHistory } from '../../../../models/audithistory.model';
import { AuthService } from '../../../../services/auth.service';
import { MessageSeverity, AlertService } from '../../../../services/alert.service';
import { MasterComapnyService } from '../../../../services/mastercompany.service';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import { ItemMasterService } from '../../../../services/itemMaster.service';
import { ATAMain } from '../../../../models/atamain.model';
import { ATAChapter } from '../../../../models/atachapter.model';
import { ItemMasterCapabilitiesModel } from '../../../../models/itemMasterCapabilities.model';
import { DashNumberService } from '../../../../services/dash-number/dash-number.service';
import { LegalEntityService } from '../../../../services/legalentity.service';
import { IntegrationService } from '../../../../services/integration-service';
import { AtaMainService } from '../../../../services/atamain.service';
import { AtaSubChapter1Service } from '../../../../services/atasubchapter1.service';
import { WorkOrderService } from '../../../../services/work-order/work-order.service';
import { CommonService } from '../../../../services/common.service';
import * as $ from 'jquery';
import { ItemMasterCreateCapabilitiesComponent } from '../item-master-create-capabilities/item-master-create-capabilities.component';
import { DBkeys } from '../../../../services/db-Keys';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-item-master-capabilities-list',
    templateUrl: './item-master-capabilities-list.component.html',
    styleUrls: ['./item-master-capabilities-list.component.scss'],
    animations: [fadeInOut],
    providers: [DatePipe]

})
/** item-master-capabilities-list component*/
export class ItemMasterCapabilitiesListComponent implements OnInit {
    @Input() itemMasterId;
    @Input() selectedTab: string = "";
    @Input() partData: any = {}
    isSpinnerVisible: Boolean = false;
    activeIndex: number;
    selectedColumns: any[];
    isDeleteMode: boolean;
    isEditMode: boolean;
    loadingIndicator: boolean;
    auditHisory: any[];
    selectedreason: any;
    disableSave: boolean = true;
    allComapnies: MasterCompany[];
    modal: any;
    sourceAction: any;
    isSaving: boolean;
    allItemMasterCapsList: any[] = [];
    allItemMasterCapsListDt: any[] = [];
    selectedColumn: any;
    getSelectedCollection: any;
    colaircraft: any[] = [];
    matSpinner: boolean;
    local: any;
    partCollection: any[];
    itemclaColl: any[];
    selectedActionName: any;
    disableSavepartNumber: boolean;
    sourceItemMasterCap: any = {};
    disableSavepartDescription: boolean;
    descriptionbyPart: any[] = [];
    allPartnumbersInfo: any[];
    alldashnumberinfo: any[];
    allManagemtninfo: any[] = [];
    maincompanylist: any[] = [];
    bulist: any[];
    departmentList: any[];
    divisionlist: any[] = [];
    manufacturerData: any[] = [];
    allAircraftinfo: any[];
    selectedAircraftTypes: any;
    selectedAircraftDataModels: any[] = [];
    enablePopupData: boolean = false;
    currentVendorModels: any[] = [];
    selectedModels: any[] = [];
    allDashnumberInfo: any[];
    allATAMaininfo1: ATAMain[];
    assetRecordId: number = 0;
    selectedManufacturer: any = [];//To Store selected Aircraft Manufacturer Data
    selectedModel: any = [];//To Store selected Aircraft Modal Data
    capabilitiesForm: FormGroup;
    onSelectedId: any;
    parentManagementInfo: any[] = [];
    childManagementInfo: any[] = [];
    partListData: any[] = [];
    integrationvalues: any[] = [];
    cmmList: any[];
    capabilityTypeData: any[];
    managementStructureData: any = [];
    isDeleteCapabilityPopupOpened: boolean = false;
    selectedForDeleteCapabilityId: any;
    selectedForDeleteContent: any;
    showCapes: boolean = false;
    isEnableCapesList: boolean = true;
    globalSearchData: any = {};
    pnData: any;
    capabalityTypeList: any = [];
    aircraftModelData: any;
    ataChapterData: any;
    entityList: any;
    buData: any;
    divisionData: any;
    departmentData: any;
    @Input() isEnableItemMaster: boolean = false;
    @Input() isEnableItemMasterView: boolean = false;
    @ViewChild("addCapabilityButton",{static:false}) addCapabilityButton: ElementRef;
    selectedCapabilityType: any;
    isCapViewMode: boolean = false;
    itemMasterCapesPageSize: Number = 10;
    selectedItemMasterCapData: any = {};
    legalEntityList: any = [];
    capabilityauditHisory: AuditHistory[] = [];
    businessUnitList: any = [];
    employeeList: any = [];
    textAreaLabel: string;
    textAreaInfo: string;
    currentDeleteStatus: boolean = false;
    arraylistCapabilityTypeId:any[] = [];

    /** item-master-capabilities-list ctor */
    constructor(private itemMasterService: ItemMasterService,
        private cdRef: ChangeDetectorRef,
        private datePipe: DatePipe,
        private modalService: NgbModal, private authService: AuthService, private _route: Router, private alertService: AlertService, private dashnumberservices: DashNumberService, private formBuilder: FormBuilder, public workFlowtService: LegalEntityService, private atasubchapter1service: AtaSubChapter1Service, private atamain: AtaMainService, public inteService: IntegrationService, private workOrderService: WorkOrderService, private commonservice: CommonService, private activatedRoute: ActivatedRoute) {
        this.dataSource = new MatTableDataSource();
               
    }

    capabilityForm: any = {
        selectedCap: '', CapabilityTypeId: 0, companyId: 0, buId: 0, divisionId: 0, departmentId: 0, manufacturerId: 0, manufacturerLabel: '', ataChapterId: 0, ataChapterLabel: '', ataSubChapterId: 0, ataSubchapterLabel: '', cmmId: 0, cmmLabel: '', integrateWith: 0, integrateWithLabel: '', description: '', entryDate: '', isVerified: false, managementStructureId: 0, verifiedBy: '', dateVerified: '', nteHrs: 0, tat: 0, selectedPartId: [], selectedAircraftDataModels: [],
        selectedAircraftModelTypes: [], selectedAircraftTypes: [], selectedManufacturer: [], selectedModel: [], selectedDashNumbers: [], selectedDashNumbers2: []
    };
    capabilityEditForm: any = {
        itemMasterCapesId: 0, selectedCap: '', CapabilityTypeId: 0, companyId: 0, buId: 0, divisionId: 0, departmentId: 0, manufacturerId: 0, manufacturerLabel: '', ataChapterId: 0, ataChapterLabel: '', ataSubChapterId: 0, ataSubchapterLabel: '', cmmId: 0, cmmLabel: '', integrateWith: 0, integrateWithLabel: '', description: '', entryDate: '', isVerified: false, managementStructureId: 0, verifiedBy: '', dateVerified: '', nteHrs: 0, tat: 0, memo: '', selectedPartId: 0, selectedAircraftDataModels: [],
        selectedAircraftModelType: 0, selectedAircraftType: 0, selectedManufacturer: 0, selectedModel: 0, selectedDashNumber: 0
    };

    ngOnInit() {
        

        if(!this.isEnableItemMaster && !this.isEnableItemMasterView) {
            this.itemMasterService.currentUrl = '/itemmastersmodule/itemmasterpages/app-item-master-capabilities-list';
            this.itemMasterService.bredcrumbObj.next(this.itemMasterService.currentUrl);//Bread Crumb
        }

        this.capabilitiesForm = this.formBuilder.group({
            mfgForm: this.formBuilder.array([])
        });
        this.getAllEmployees();
        this.loadData();
        this.activeIndex = 0;
        this.itemMasterService.capabilityCollection = [];
        this.getCapabilityTypesList();
        //this.getCapabilityTypeData();
        this.getLegalEntity();
    }
    get mfgFormArray(): FormArray {
        return this.capabilitiesForm.get('mfgForm') as FormArray;
    }

    // getCapabilityTypeData() {
    //     this.commonservice.smartDropDownList('CapabilityType', 'CapabilityTypeId', 'Description').subscribe(res => {
    //         this.capabilityTypeData = res;
    //     })
    // }

    dataSource: MatTableDataSource<any>;
    cols: any[];
    pnCols: any[];
    nonPnCols: any[];
    paginator: MatPaginator;
    sort: MatSort;

    private onDataLoadFailed(error: any) {
        this.isSpinnerVisible = false;
    }

    private loadData() {
        this.isSpinnerVisible = true;
        let iMid = this.activatedRoute.snapshot.paramMap.get('id');
        
        if (!iMid) {
            iMid = "0"
        }
        if(this.itemMasterId){
            iMid = this.itemMasterId
        }

        let reqData = {
            first: 0,
            rows: 1000,
            sortOrder: -1,
            filters: {
                partNo: "",
                itemMasterId: iMid,
                isDeleted: this.currentDeleteStatus
            },
            globalFilter: null
        }
        this.itemMasterService.getItemMasterCapsList(reqData).subscribe(
            results => this.onDataLoadSuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );

        // To display the values in header and column name values
        this.pnCols = [
            { field: 'capabilityType', header: 'Cap Type' },
            { field: 'partNo', header: 'PN' },
            { field: 'pnDiscription', header: 'PN Description' },
            { field: 'level1', header: 'Management Structure' },
            { field: 'level2'},
            { field: 'level3'},
            { field: 'level4'},
            { field: 'isVerified', header: 'Verified' },
            { field: 'verifiedBy', header: 'Verified By' },
            { field: 'verifiedDate', header: 'Verified Date' },
            { field: 'memo', header: 'Memo' },
            { field: 'createdDate', header: 'Created Date' },
            { field: 'createdBy', header: 'Created By' },
            { field: 'updatedDate', header: 'Updated Date' },
            { field: 'updatedBy', header: 'Updated By' },
        ];
        this.nonPnCols = [
            { field: 'capabilityType', header: 'Cap Type' },
            { field: 'partNo', header: 'PN' },
            { field: 'pnDiscription', header: 'PN Description' },
            { field: 'level1', header: 'Level 01' },
            { field: 'level2', header: 'Level 02' },
            { field: 'level3', header: 'Level 03' },
            { field: 'level4', header: 'Level 04' },
            { field: 'isVerified', header: 'Verified' },
            { field: 'verifiedBy', header: 'Verified By' },
            { field: 'verifiedDate', header: 'Verified Date' },
            { field: 'memo', header: 'Memo' },
            { field: 'createdDate', header: 'Created Date' },
            { field: 'createdBy', header: 'Created By' },
            { field: 'updatedDate', header: 'Updated Date' },
            { field: 'updatedBy', header: 'Updated By' },
        ];

        if(this.itemMasterId == undefined){
            this.cols = this.nonPnCols
        } else {
            this.cols = this.pnCols
        }

        this.selectedColumns = this.cols;

    }

    private onDataLoadSuccessful(allWorkFlows: any[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.isSpinnerVisible = false;
        this.dataSource.data = allWorkFlows;
        this.allItemMasterCapsList = allWorkFlows;
        this.employeeList.filter(x => {

            for(let i = 0; i< this.employeeList.length; i++){
                for(let j=0; j < this.allItemMasterCapsList.length; j++){
                    if(this.allItemMasterCapsList[j].verifiedById == this.employeeList[i].value){
                        this.allItemMasterCapsList[j].verifiedBy = this.employeeList[i].label
                    }
                }
            }
        })
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if(this.activatedRoute.snapshot.url[0].path == "app-item-master-create-capabilities"){
            this.ptnumberlistdata();
            this.showCapes = true;
            let el: HTMLElement = this.addCapabilityButton.nativeElement;
            el.click();
        }
    }

    public applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue;
    }

    private refresh() {
        // Causes the filter to refresh there by updating with recently added data.
        this.applyFilter(this.dataSource.filter);
    }
    dismissModel() {
        this.isDeleteMode = false;
        this.isEditMode = false;
        if(this.modal){
            this.modal.close();
        }        
        this.isDeleteCapabilityPopupOpened = false;
        this.loadData();
    }

    openHelpText(content) {
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    get currentUserManagementStructureId(): number {
        return this.authService.currentUser
          ? this.authService.currentUser.managementStructureId
          : null;
      }

    openDelete(content, row) {

        this.isEditMode = false;
        this.isDeleteMode = true;
        this.sourceAction = row;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
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
        if (this.managementStructureData.length == 4) {
            this.capabilityEditForm.companyId = this.managementStructureData[3];
            this.capabilityEditForm.buId = this.managementStructureData[2];
            this.capabilityEditForm.departmentId = this.managementStructureData[1];
            this.capabilityEditForm.divisionId = this.managementStructureData[0];
            this.getBUList(this.capabilityEditForm.companyId);
            this.getDivisionlist(this.capabilityEditForm.buId);
            this.getDepartmentlist(this.capabilityEditForm.divisionId);
        }
        if (this.managementStructureData.length == 3) {
            this.capabilityEditForm.companyId = this.managementStructureData[2];
            this.capabilityEditForm.buId = this.managementStructureData[1];
            this.capabilityEditForm.departmentId = this.managementStructureData[0];
            this.getBUList(this.capabilityEditForm.companyId);
            this.getDivisionlist(this.capabilityEditForm.buId);
        }
        if (this.managementStructureData.length == 2) {
            this.capabilityEditForm.companyId = this.managementStructureData[1];
            this.capabilityEditForm.buId = this.managementStructureData[0];
            this.getBUList(this.capabilityEditForm.companyId);
        }
        if (this.managementStructureData.length == 1) {
            this.capabilityEditForm.companyId = this.managementStructureData[0];
        }

    }
    getLegalEntity() {
        this.commonservice.getLegalEntityList().subscribe(res => {
            this.legalEntityList = res;
        })
    }
    openView(content, row) //this is for Edit Data get
    {
        this.itemMasterService.isCapsEditMode = false;
        this.isEditMode = false;
        this.openPopUpWithData(content, row);
    }
    parsedText(text) {
        if (text) {
            const dom = new DOMParser().parseFromString(
                '<!doctype html><body>' + text,
                'text/html');
            const decodedString = dom.body.textContent;
            return decodedString;
        }
    }

    openEdits(row, index) //this is for Edit Data get
    {
        const capData = row;
        this.arraylistCapabilityTypeId.push(row.capabilityTypeId);
        this.getCapabilityTypesList();
        this.selectedItemMasterCapData = capData;
        this.selectedLegalEntity(row.levelId1);
        this.selectedBusinessUnit(row.levelId2);
        this.selectedDivision(row.levelId3);
        this.selectedDepartment(row.levelId4);
        this.getItemMasterDetailsById(row.itemMasterId);

        if (row.levelId1) {
            this.selectedItemMasterCapData.levelId1 = row.levelId1;
        }
        if (row.levelId2) {
            this.selectedItemMasterCapData.levelId2 = row.levelId2;
        }
        if (row.levelId3) {
            this.selectedItemMasterCapData.levelId3 = row.levelId3;
        }
        if (row.levelId4) {
            this.selectedItemMasterCapData.levelId4 = row.levelId4;
        }

        if(this.selectedItemMasterCapData.verifiedDate){
            this.selectedItemMasterCapData.verifiedDate = new Date(this.selectedItemMasterCapData.verifiedDate);
        } 
        if(this.selectedItemMasterCapData.addedDate){
            this.selectedItemMasterCapData.addedDate = new Date(this.selectedItemMasterCapData.addedDate);
        }   

    }
    getDynamicVariableData(variable, index) {
        return this[variable + index]
    }
    selectedLegalEntity(legalEntityId) {
        if (legalEntityId) {
            this.selectedItemMasterCapData['managementStructureId'] = legalEntityId;

            this.commonservice.getBusinessUnitListByLegalEntityId(legalEntityId).subscribe(res => {
                this.businessUnitList = res;
            })
        }

    }
    selectedBusinessUnit(businessUnitId) {
        if (businessUnitId) {
            this.selectedItemMasterCapData['managementStructureId'] = businessUnitId;

            this.commonservice.getDivisionListByBU(businessUnitId).subscribe(res => {

                this.divisionlist = res;
                this.departmentList = [];
            })
        }

    }
    selectedDivision(divisionUnitId) {
        if (divisionUnitId) {
            this.selectedItemMasterCapData['managementStructureId'] = divisionUnitId;

            this.commonservice.getDepartmentListByDivisionId(divisionUnitId).subscribe(res => {
                this.departmentList = res;
            })
        }

    }
    selectedDepartment(departmentId) {
        if (departmentId) {
            this.selectedItemMasterCapData['managementStructureId'] = departmentId;
        }
    }
    resetVerified(rowData, value) {
            rowData.verifiedById = null;
            rowData.verifiedDate = new Date();
    }
    openPopUpWithData(content, row) //this is for Edit Data get
    {

        this.getAircraftModel(row.aircraftTypeId, this.capabilityEditForm);
        this.getPartPublicationByItemMasterId(row.itemMasterId);
        this.setManagementStrucureData(row);

        this.capabilityEditForm.itemMasterCapesId = row.itemMasterCapesId;
        this.capabilityEditForm.CapabilityTypeId = row.capabilityId;
        this.capabilityEditForm.selectedPartId = row.itemMasterId;
        this.itemMasterId = row.itemMasterId;
        this.capabilityEditForm.selectedAircraftType = row.aircraftTypeId;
        this.capabilityEditForm.selectedAircraftModelType = row.aircraftModelId;
        this.capabilityEditForm.selectedDashNumber = row.aircraftDashNumberId;
        this.capabilityEditForm.description = row.description;
        this.capabilityEditForm.manufacturerId = row.manufacturerId;
        this.capabilityEditForm.cmmId = row.cmmId;
        this.capabilityEditForm.ataChapterId = row.ataChapterId;
        this.capabilityEditForm.ataSubChapterId = row.ataSubChapterId;
        this.capabilityEditForm.entryDate = new Date(row.entryDate);
        this.capabilityEditForm.integrateWith = row.isIntegrateWith;
        this.capabilityEditForm.isVerified = row.isVerified;
        this.capabilityEditForm.verifiedBy = row.verifiedBy;
        this.capabilityEditForm.dateVerified = new Date(row.dateVerified);
        this.capabilityEditForm.ntehrs = row.ntehrs;
        this.capabilityEditForm.tat = row.tat;
        this.capabilityEditForm.memo = row.memo;
        this.itemMasterService.capabilityCollection = this.getSelectedCollection;
        this.isEditMode = false;
        this.isDeleteMode = true;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
    }

    private saveCompleted(user?: any) {
        this.isSaving = false;
        if (this.isDeleteMode == true) {
            this.alertService.showMessage("Success", `Action was deleted successfully`, MessageSeverity.success);
            this.isDeleteMode = false;
        }
        else {
            this.alertService.showMessage("Success", `Action was edited successfully`, MessageSeverity.success);
        }

    }
    private saveFailedHelper(error: any) {
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
    }

    private onHistoryLoadSuccessful(auditHistory: AuditHistory[], content) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.capabilityauditHisory = auditHistory;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
    }

    public navigateTogeneralInfo() {
        this.itemMasterService.isCapsEditMode = false;
        this.itemMasterService.enableExternal = false;
        this._route.navigateByUrl('/itemmastersmodule/itemmasterpages/app-item-master-create-capabilities');

    }

    private ptnumberlistdata() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.itemMasterService.getPrtnumberslistList().subscribe(
            results => this.onptnmbersSuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );
    }

    private onptnmbersSuccessful(allWorkFlows: any[]) {

        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.allPartnumbersInfo = allWorkFlows;
    }

    openModelPopups(capData) {
        if (this.itemMasterService.isEditMode == false) {

            //Adding for Aircraft manafacturer List Has empty then List Should be null
            if (capData.selectedAircraftTypes.length > 0) {
                var arr = capData.selectedAircraftTypes;
                var selectedvalues = arr.join(",");
                this.itemMasterService.getAircraftTypes(selectedvalues).subscribe(
                    results => this.onDataLoadaircrafttypeSuccessful(results[0], capData),
                    error => this.onDataLoadFailed(error)
                );
            }
            else {
                this.allAircraftinfo = []; //Making empty if selecting is null
            }
        }
    }
    getAircraftModel(selectedAircraftType, capData) {
        if (this.itemMasterService.isEditMode == false) {
            this.itemMasterService.getAircraftTypes(selectedAircraftType).subscribe(
                results => this.onDataLoadaircrafttypeSuccessful(results[0], capData),
                error => this.onDataLoadFailed(error)
            );
        }
    }

    private onDataLoadaircrafttypeSuccessful(allWorkFlows: any[], capData) //getting Models Based on Manfacturer Selection
    {

        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        capData.selectedAircraftDataModels = [];
        allWorkFlows.forEach(element => {
            capData.selectedAircraftDataModels.push({ value: element.aircraftModelId, label: element.modelName, aircraftTypeId: element.aircraftTypeId })
        });

    }

    getAircraftDashNumber(event): any {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.dashnumberservices.getByModelId(event).subscribe(
            results => this.ondashnumberSuccessful(results),
            error => this.onDataLoadFailed(error)
        );
    }
    private ondashnumberSuccessful(allWorkFlows: any[]) {

        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.allDashnumberInfo = allWorkFlows;
    }
    // Not in Use
    // getCapabilityTypesListOld() {
    //     this.commonservice.smartDropDownList('CapabilityType', 'CapabilityTypeId', 'Description').subscribe(res => {
    //         this.capabalityTypeList = res;
    //     })
    // }

    getCapabilityTypesList() {   
        if(this.arraylistCapabilityTypeId.length == 0) {
			this.arraylistCapabilityTypeId.push(0); }
        this.commonservice.autoSuggestionSmartDropDownList('CapabilityType', 'CapabilityTypeId', 'Description', '', true, 100, this.arraylistCapabilityTypeId.join()).subscribe(res => {
            this.capabalityTypeList = res;
        },err => {
			const errorLog = err;
			this.saveFailedHelper(errorLog);
		});
    }

    partPNentHandler(event) {
        if (event.target.value != "") {
            let value = event.target.value.toLowerCase();
            if (this.selectedActionName) {
                if (value == this.selectedActionName.toLowerCase()) {
                    this.disableSavepartNumber = true;

                }
                else {
                    this.disableSavepartNumber = false;
                    this.sourceItemMasterCap.partDescription = "";
                    this.disableSavepartDescription = false;
                }
            }

        }
    }
    partEventHandler(event) {
        if (event) {
            if (event.target.value != "") {

                let value = event.target.value.toLowerCase();
                if (this.onSelectedId) {
                    if (value == this.onSelectedId.toLowerCase()) {
                        this.disableSave = true;
                    }
                    else {
                        this.disableSave = false;
                    }
                }
            }
        }
    }
    private onpartnumberloadsuccessfull(allWorkFlows: any[]) //getting Part Description
    {


        this.descriptionbyPart = allWorkFlows[0]
        this.sourceItemMasterCap.partDescription = allWorkFlows[0].partDescription;


    }
    partnmId(event) {
        //
        if (this.itemclaColl) {
            for (let i = 0; i < this.itemclaColl.length; i++) {
                if (event == this.itemclaColl[i][0].partName) {
                    this.sourceItemMasterCap.partId = this.itemclaColl[i][0].partId;
                    this.itemMasterId = this.itemclaColl[i][0].partId;
                    this.getPartPublicationByItemMasterId(this.itemMasterId)
                    this.disableSavepartNumber = true;
                    this.selectedActionName = event;
                }
            }
            this.itemMasterService.getDescriptionbypart(event).subscribe(
                results => this.onpartnumberloadsuccessfull(results[0]),
                error => this.onDataLoadFailed(error)


            );
            this.disableSavepartDescription = true;
        }
    }
    filterPNpartItems(event) {

        this.partCollection = [];
        this.itemclaColl = [];
        if (this.allPartnumbersInfo) {
            if (this.allPartnumbersInfo.length > 0) {

                for (let i = 0; i < this.allPartnumbersInfo.length; i++) {
                    let partName = this.allPartnumbersInfo[i].partNumber;
                    if (partName) {
                        if (partName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                            this.itemclaColl.push([{
                                "partId": this.allPartnumbersInfo[i].itemMasterId,
                                "partName": partName
                            }]),

                                this.partCollection.push(partName);
                        }
                    }
                }
            }
        }
    }
    // onCapabilityTypeSelection(event) {
    //     if (this.capabilityTypeData) {
    //         for (let i = 0; i < this.capabilityTypeData.length; i++) {
    //             if (event == this.capabilityTypeData[i].value) {
    //                 this.capabilityForm.selectedCap = this.capabilityTypeData[i].label;
    //             }
    //         }
    //     }
    // }
    onPartNumberSelection(event) {
        this.getPartPublicationByItemMasterId(event);
    }
    onPartIdselection(event) {
        if (this.itemclaColl) {

            for (let i = 0; i < this.itemclaColl.length; i++) {
                if (event == this.itemclaColl[i][0].partId) {
                    this.disableSave = true;

                    this.onSelectedId = event;
                }
            }
        }
    }
    
    onCmmselection(event) {
        if (this.cmmList) {
            for (let i = 0; i < this.cmmList.length; i++) {
                if (event == this.cmmList[i].value) {
                    this.capabilityForm.cmmLabel = this.cmmList[i].label;
                }
            }
        }
    }

    onIntegrateWithselection(event) {
        if (this.integrationvalues) {
            for (let i = 0; i < this.integrationvalues.length; i++) {
                if (event == this.integrationvalues[i].value) {
                    this.capabilityForm.integrateWithLabel = this.integrationvalues[i].label;
                }
            }
        }
    }


    private loadManagementdataForTree() {
        this.workFlowtService.getManagemententity().subscribe(
            results => this.onManagemtntdataLoadTree(results[0]),
            error => this.onDataLoadFailed(error)
        );
    }

    private onManagemtntdataLoadTree(managementInfo: any[]) {
        this.allManagemtninfo = managementInfo;
        this.parentManagementInfo = managementInfo;
        this.childManagementInfo = managementInfo;
        for (let i = 0; i < this.allManagemtninfo.length; i++) {
            if (this.allManagemtninfo[i].parentId == null) {
                this.bulist = [];
                this.divisionlist = [];
                this.departmentList = [];
                this.maincompanylist.push(this.allManagemtninfo[i]);
            }
        }
    }

    getBUList(companyId) {
        if (!this.isEditMode)
            this.capabilityForm.managementStructureId = companyId;
        else
            this.capabilityEditForm.managementStructureId = companyId;
        this.bulist = [];
        this.divisionlist = [];
        this.departmentList = [];
        for (let i = 0; i < this.allManagemtninfo.length; i++) {
            if (this.allManagemtninfo[i].parentId == companyId) {
                this.bulist.push(this.allManagemtninfo[i]);
            }
        }
        for (let i = 0; i < this.partListData.length; i++) {
            this.partListData[i].parentCompanyId = companyId;
            this.getParentBUList(this.partListData[i]);
            if (this.partListData[i].childList) {
                for (let j = 0; j < this.partListData[i].childList.length; j++) {
                    this.partListData[i].childList[j].childCompanyId = companyId;
                    this.getChildBUList(this.partListData[i].childList[j]);
                }
            }
        }

    }

    getDivisionlist(buId) {
        if (this.isEditMode)
            this.capabilityForm.managementStructureId = buId;
        else
            this.capabilityEditForm.managementStructureId = buId;
        this.divisionlist = [];
        this.departmentList = [];
        for (let i = 0; i < this.allManagemtninfo.length; i++) {
            if (this.allManagemtninfo[i].parentId == buId) {
                this.divisionlist.push(this.allManagemtninfo[i]);
            }
        }
        for (let i = 0; i < this.partListData.length; i++) {
            this.partListData[i].parentbuId = buId;
            this.getParentDivisionlist(this.partListData[i]);
            if (this.partListData[i].childList) {
                for (let j = 0; j < this.partListData[i].childList.length; j++) {
                    this.partListData[i].childList[j].childbuId = buId;
                    this.getChildDivisionlist(this.partListData[i].childList[j]);
                }
            }
        }
    }

    getDepartmentlist(divisionId) {
        if (this.isEditMode)
            this.capabilityForm.managementStructureId = divisionId;
        else
            this.capabilityEditForm.managementStructureId = divisionId;
        this.departmentList = [];
        for (let i = 0; i < this.allManagemtninfo.length; i++) {
            if (this.allManagemtninfo[i].parentId == divisionId) {
                this.departmentList.push(this.allManagemtninfo[i]);
            }
        }
        for (let i = 0; i < this.partListData.length; i++) {
            this.partListData[i].parentDivisionId = divisionId;
            this.getParentDeptlist(this.partListData[i]);
            if (this.partListData[i].childList) {
                for (let j = 0; j < this.partListData[i].childList.length; j++) {
                    this.partListData[i].childList[j].childDivisionId = divisionId;
                    this.getChildDeptlist(this.partListData[i].childList[j]);
                }
            }
        }
    }

    getDepartmentId(departmentId) {
        if (this.isEditMode)
            this.capabilityForm.managementStructureId = departmentId;
        else
            this.capabilityEditForm.managementStructureId = departmentId;
        for (let i = 0; i < this.partListData.length; i++) {
            this.partListData[i].parentDeptId = departmentId;
        }
        for (let i = 0; i < this.partListData.length; i++) {
            this.partListData[i].parentDeptId = departmentId;
            this.getParentDeptId(this.partListData[i]);
            if (this.partListData[i].childList) {
                for (let j = 0; j < this.partListData[i].childList.length; j++) {
                    this.partListData[i].childList[j].childDeptId = departmentId;
                    this.getChildDeptId(this.partListData[i].childList[j]);
                }
            }
        }
    }

    getParentBUList(partList) {
        partList.managementStructureId = partList.parentCompanyId;
        partList.parentBulist = []
        partList.parentDivisionlist = [];
        partList.parentDepartmentlist = [];
        for (let i = 0; i < this.parentManagementInfo.length; i++) {
            if (this.parentManagementInfo[i].parentId == partList.parentCompanyId) {
                partList.parentBulist.push(this.parentManagementInfo[i]);
            }
        }
    }

    getParentDivisionlist(partList) {
        partList.managementStructureId = partList.parentbuId;
        partList.parentDivisionlist = [];
        partList.parentDepartmentlist = [];
        for (let i = 0; i < this.parentManagementInfo.length; i++) {
            if (this.parentManagementInfo[i].parentId == partList.parentbuId) {
                partList.parentDivisionlist.push(this.parentManagementInfo[i]);
            }
        }
    }

    getParentDeptlist(partList) {
        partList.managementStructureId = partList.parentDivisionId;
        partList.parentDepartmentlist = [];
        for (let i = 0; i < this.parentManagementInfo.length; i++) {
            if (this.parentManagementInfo[i].parentId == partList.parentDivisionId) {
                partList.parentDepartmentlist.push(this.parentManagementInfo[i]);
            }
        }
    }

    getParentDeptId(partList) {
        partList.managementStructureId = partList.parentDeptId;
    }

    getChildBUList(partChildList) {
        partChildList.managementStructureId = partChildList.childCompanyId;
        partChildList.childBulist = [];
        partChildList.childDivisionlist = [];
        partChildList.childDepartmentlist = [];
        for (let i = 0; i < this.childManagementInfo.length; i++) {
            if (this.childManagementInfo[i].parentId == partChildList.childCompanyId) {
                partChildList.childBulist.push(this.childManagementInfo[i]);
            }
        }
    }

    getChildDivisionlist(partChildList) {
        partChildList.managementStructureId = partChildList.childbuId;
        partChildList.childDivisionlist = [];
        partChildList.childDepartmentlist = [];
        for (let i = 0; i < this.childManagementInfo.length; i++) {
            if (this.childManagementInfo[i].parentId == partChildList.childbuId) {
                partChildList.childDivisionlist.push(this.childManagementInfo[i]);
            }
        }
    }

    getChildDeptlist(partChildList) {
        partChildList.managementStructureId = partChildList.childDivisionId;
        partChildList.childDepartmentlist = [];
        for (let i = 0; i < this.childManagementInfo.length; i++) {
            if (this.childManagementInfo[i].parentId == partChildList.childDivisionId) {
                partChildList.childDepartmentlist.push(this.childManagementInfo[i]);
            }
        }
    }

    getChildDeptId(partChildList) {
        partChildList.managementStructureId = partChildList.childDeptId;
    }

    async getPartPublicationByItemMasterId(itemMasterId) {
        await this.workOrderService.getPartPublicationByItemMaster(itemMasterId).subscribe(res => {
            this.cmmList = res.map(x => {
                return {
                    value: x.publicationRecordId,
                    label: x.publicationId
                }
            });
        })
    }
    async getAllEmployees() {
        await this.commonservice.getCertifiedEmpList(this.currentUserManagementStructureId).subscribe(res => {
            if(res) {
                this.employeeList = res.map(x => {
                    return {
                        value: x.employeeId,
                        label: x.name
                    }
                });
            }
        })
    }

    addModels(capData) {
        let capbilitiesObj = new ItemMasterCapabilitiesModel;
        capData.selectedManufacturer.forEach(element1 => {
            capbilitiesObj.aircraftTypeId = element1.value;
            capbilitiesObj.aircraftTypeName = element1.label;
            capbilitiesObj.capabilityId = capData.CapabilityTypeId;
            capbilitiesObj.capabilityTypeName = capData.selectedCap;
            capbilitiesObj.aircraftManufacturer = element1.label;
            capbilitiesObj.PartId = capData.selectedPartId;
            capbilitiesObj.itemMasterId = this.itemMasterId;

            capbilitiesObj.manufacturerLabel = capData.manufacturerLabel;
            capbilitiesObj.ataChapterLabel = capData.ataChapterLabel;
            capbilitiesObj.ataSubchapterLabel = capData.ataSubchapterLabel;
            capbilitiesObj.cmmLabel = capData.cmmLabel;
            capbilitiesObj.integrateWithLabel = capData.integrateWithLabel;

            capbilitiesObj.manufacturerId = capData.manufacturerId;
            capbilitiesObj.ataChapterId = capData.ataChapterId;
            capbilitiesObj.ataSubChapterId = capData.ataSubChapterId;
            capbilitiesObj.cmmId = capData.cmmId;
            capbilitiesObj.integrateWith = capData.integrateWith;
            capbilitiesObj.description = capData.description;
            capbilitiesObj.entryDate = capData.entryDate;
            capbilitiesObj.isVerified = capData.isVerified;
            capbilitiesObj.managementStructureId = capData.managementStructureId;
            capbilitiesObj.verifiedBy = capData.verifiedBy;
            capbilitiesObj.dateVerified = capData.dateVerified;
            capbilitiesObj.nteHrs = capData.nteHrs;
            capbilitiesObj.tat = capData.tat;
            capbilitiesObj.aircraftModelName = 'Undefined';
            capbilitiesObj.DashNumber = 'Undefined';
            capbilitiesObj.AircraftDashNumberId = capData.selectedDashNumbers;

            if (capData.selectedModel.length == 0) {
                let mfObj = this.formBuilder.group(capbilitiesObj);
                this.mfgFormArray.push(mfObj);
                let mfgIndex = this.mfgFormArray.controls.length - 1;
                this.mfgFormArray.controls[mfgIndex]['buList'] = [];
                this.mfgFormArray.controls[mfgIndex]['departmentList'] = [];
                this.mfgFormArray.controls[mfgIndex]['divisionlist'] = [];
            }

            capData.selectedModel.forEach(element2 => {
                if (element2.aircraftTypeId == element1.value) {
                    capbilitiesObj.aircraftModelName = element2.label;
                    capbilitiesObj.aircraftModelId = element2.value;

                    if (capData.selectedDashNumbers2.length == 0) {
                        let mfObj = this.formBuilder.group(capbilitiesObj);
                        let mfgItemExisted = this.checkIsExisted(capData.CapabilityTypeId, element1.value, element2.value, this.mfgFormArray, capData);
                        if (mfgItemExisted == false) {
                            this.mfgFormArray.push(mfObj);
                            let mfgIndex = this.mfgFormArray.controls.length - 1;
                            this.mfgFormArray.controls[mfgIndex]['buList'] = [];
                            this.mfgFormArray.controls[mfgIndex]['departmentList'] = [];
                            this.mfgFormArray.controls[mfgIndex]['divisionlist'] = [];

                        }
                    }

                    capData.selectedDashNumbers2.forEach(element3 => {
                        if (element3.modelId == element2.value) {

                            capbilitiesObj.DashNumber = element3.label;
                            capbilitiesObj.AircraftDashNumberId = element3.value;
                            let mfObj = this.formBuilder.group(capbilitiesObj);
                            let mfgItemExisted = this.checkIsExisted(capData.CapabilityTypeId, element1.value, element2.value, this.mfgFormArray, capData);
                            if (mfgItemExisted == false) {
                                this.mfgFormArray.push(mfObj);
                                let mfgIndex = this.mfgFormArray.controls.length - 1;
                                this.mfgFormArray.controls[mfgIndex]['buList'] = [];
                                this.mfgFormArray.controls[mfgIndex]['departmentList'] = [];
                                this.mfgFormArray.controls[mfgIndex]['divisionlist'] = [];

                            }

                        } else {
                            let mfObj = this.formBuilder.group(capbilitiesObj);
                            let mfgItemExisted = this.checkIsExisted(capData.CapabilityTypeId, element1.value, element2.value, this.mfgFormArray, capData);
                            if (mfgItemExisted == false) {
                                this.mfgFormArray.push(mfObj);
                                let mfgIndex = this.mfgFormArray.controls.length - 1;
                                this.mfgFormArray.controls[mfgIndex]['buList'] = [];
                                this.mfgFormArray.controls[mfgIndex]['departmentList'] = [];
                                this.mfgFormArray.controls[mfgIndex]['divisionlist'] = [];

                            }
                        }

                    });

                }

            });



        });

    }
    checkIsExisted(capId, type, modal, myForm, capData) {
        let itemExisted = false;
        myForm.controls.forEach(data => {
            if (data['controls']['capabilityTypeId'].value == capId && data['controls']['aircraftTypeId'].value == type && data['controls']['aircraftModelId'].value == modal) {
                itemExisted = true;
                data['controls']['isDelete'].setValue(false);
            } else {
                let typeId = data['controls']['aircraftTypeId'].value;
                let typeIndex = capData.selectedAircraftTypes.indexOf(typeId);
                if (typeIndex == -1) {
                    //  data['controls']['isDelete'].setValue(true);
                }
                let modaleId = data['controls']['aircraftModelId'].value;
                let modalIndex = capData.selectedAircraftModelTypes.indexOf(modaleId);
                if (modalIndex == -1) {
                    // data['controls']['isDelete'].setValue(true);
                }
            }


        });
        return itemExisted;
    }
    saveCapability() {     
        this.selectedItemMasterCapData["updatedBy"]="admin";  
        this.selectedItemMasterCapData["createdBy"]="admin";  
        this.selectedItemMasterCapData["companyId"]=this.selectedItemMasterCapData.levelId1;  
        this.selectedItemMasterCapData["buId"]=this.selectedItemMasterCapData.levelId2;  
        this.selectedItemMasterCapData["divisionId"]=this.selectedItemMasterCapData.levelId3;  
        this.selectedItemMasterCapData["departmentId"]=this.selectedItemMasterCapData.levelId4;  
        this.selectedItemMasterCapData["masterCompanyId"]=DBkeys.MASTER_COMPANY_ID;
        this.selectedItemMasterCapData["verifiedDate"] = this.datePipe.transform(this.selectedItemMasterCapData["verifiedDate"], DBkeys.GLOBAL_DATE_FORMAT);
        this.selectedItemMasterCapData["addedDate"] = this.datePipe.transform(this.selectedItemMasterCapData["addedDate"], DBkeys.GLOBAL_DATE_FORMAT);
        
        this.itemMasterService.updateItemMasterCapes(this.selectedItemMasterCapData.itemMasterCapesId, this.selectedItemMasterCapData).subscribe(res => {
            this.selectedItemMasterCapData = {};

            this.loadData();
            this.alertService.showMessage(
                'Capes',
                'Saved Capes Details Successfully',
                MessageSeverity.success
            );
            
        })
    }

    onAddCapes() {
        this.showCapes = true;
    }
    onViewCapes(rowData){
        this.showCapes = true;
        this.selectedItemMasterCapData = rowData;
        //this.getItemMasterDetailsById(rowData.itemMasterId)
    }
    closeCapes() {
        this.showCapes = false;
        this.isCapViewMode = false;
        
        $('#capes1').modal('hide');
    }
    closeCapesPopup(data) {
        this.closeCapes();
    }
    deleteCapability(content, capabilityId, capabilityType) {
        this.selectedForDeleteCapabilityId = capabilityId;
        this.selectedForDeleteContent = content;
        this.selectedCapabilityType = capabilityType;
        if (this.isDeleteCapabilityPopupOpened == true) {
            this.itemMasterService.deleteCapabilityById(capabilityId, "admin").subscribe(res => {
                this.dismissModel()
                this.isDeleteCapabilityPopupOpened = false;
                this.selectedCapabilityType = "";
                this.alertService.showMessage("Success", `Action was deleted successfully`, MessageSeverity.success);
            }),
                error => {
                    console.log("ERROR:" + error);
                }
        }
        else {
            this.isDeleteCapabilityPopupOpened = true
            this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        }

    }
    enableSave() {
		this.disableSave = false;

	}
    loadCapesList(data) {
        this.loadData();
    }
    searchCaps(){

    }

    restoreCapabilityRow(capabilityId) {
        this.itemMasterService.restoreCapabilityById(capabilityId, "admin").subscribe(res => {
            this.alertService.showMessage("Success", `Action was Restore successfully`, MessageSeverity.success);
            this.loadData();
        },
        error => error => this.saveFailedHelper(error));
        
    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }

    getAuditHistory(content, row){
        this.getItemMasterDetailsById(row.itemMasterId)
            this.isSaving = true;
            this.itemMasterService.getItemMasterCapabilityAuditHistory(row.itemMasterCapesId).subscribe(
                results => {
                    this.capabilityauditHisory = results
                },
                error => this.saveFailedHelper(error));
    }

    getColorCodeForHistory(i, field, value) {
        const data = this.capabilityauditHisory;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
    }


    ngOnChanges(changes: SimpleChanges) {
        for (let property in changes) {
            if (property == 'selectedTab') {
                if (changes[property].currentValue == "Capes") {
                    this.loadData();
                    this.ptnumberlistdata();
				}                
            }
          }

      }

      dismissCapesViewModal() {
          $('#viewCap').modal('hide');
      }
      dismissCapesHistoryModal() {
        $('#viewHistory').modal('hide');
    }
    getItemMasterDetailsById(itemmasterid){
        this.isSpinnerVisible = true;
        this.itemMasterService.getItemMasterDetailById(itemmasterid).subscribe(res => {
            this.partData = res[0];
            
            this.isSpinnerVisible = false;
        }, error => {
            this.onDataLoadFailed(error)
        })
    }
    onAddTextAreaInfo(value) {
		if(value == 'memo') {
			this.textAreaLabel = 'Memo';
			this.textAreaInfo = this.selectedItemMasterCapData.memo;
		}
    }
    
    onSaveTextAreaInfo() {
		if(this.textAreaLabel == 'Memo') {
			this.selectedItemMasterCapData.memo = this.textAreaInfo;
        }
    }

    getCapesListOnDeleteStatus(value) {
        this.currentDeleteStatus = value;
        this.loadData();
    }

    exportCSV(capabilityListTable) {
        this.isSpinnerVisible = true;   
        this.allItemMasterCapsListDt = capabilityListTable;
        
        if (capabilityListTable.totalRecords > 0){

            for(let i=0; i < capabilityListTable.totalRecords; i++){

                capabilityListTable._value[i].Verified == 1; //this.allItemMasterCapsList[i].Verified == 1 ? 'check' : 'unchecked';

                //this.allItemMasterCapsListDt[i].verifiedDate == this.datePipe.transform(capabilityListTable.value[i].verifiedDate, 'yyyy-MM-dd, h:mm a');
                capabilityListTable._value[i].createdDate == this.datePipe.transform(capabilityListTable.value[i].createdDate, 'yyyy-MM-dd, h:mm a');
                capabilityListTable._value[i].updatedDate == this.datePipe.transform(capabilityListTable.value[i].updatedDate, 'yyyy-MM-dd, h:mm a');

            }
       
        capabilityListTable.exportCSV();
        capabilityListTable = this.allItemMasterCapsListDt;
        this.isSpinnerVisible = false;
        }
	}

}