import { Component,Input, ViewChild, OnInit,  ElementRef, SimpleChanges } from '@angular/core';
import { fadeInOut } from '../../../../services/animations';
import { MessageSeverity, AlertService } from '../../../../services/alert.service';
import { FormBuilder, FormGroup,  FormArray } from '@angular/forms';
import { MenuItem } from 'primeng/api';
 
import { NgbModal,NgbModalRef, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemMasterService } from '../../../../services/itemMaster.service';
import { ATAMain } from '../../../../models/atamain.model';
import { ItemMasterCapabilitiesModel } from '../../../../models/itemMasterCapabilities.model';
import { AssetService } from '../../../../services/asset/Assetservice';
import { DashNumberService } from '../../../../services/dash-number/dash-number.service';
import { CommonService } from '../../../../services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AircraftModelService } from '../../../../services/aircraft-model/aircraft-model.service';
import { AircraftManufacturerService } from '../../../../services/aircraft-manufacturer/aircraftManufacturer.service';
import { AuthService } from '../../../../services/auth.service';
import { listSearchFilterObjectCreation, getValueFromArrayOfObjectById } from '../../../../generic/autocomplete';
import { AuditHistory } from '../../../../models/audithistory.model';
import { ConfigurationService } from '../../../../services/configuration.service';
import * as $ from 'jquery';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
@Component({
    selector: 'app-asset-capes',
    templateUrl: './asset-capes.component.html',
    styleUrls: ['./asset-capes.component.scss'],
    animations: [fadeInOut],
    providers:[DatePipe]
})

export class AssetCapesComponent implements OnInit {
    @ViewChild("tabRedirectConfirmationModal2",{static:false}) public tabRedirectConfirmationModal2: ElementRef;
    @Input() isView =false;
    @Input() viewassetRecordId:0
    matSpinner: boolean;
    modal: NgbModalRef;
    loadingIndicator: boolean;
    local: any;
    partCollection: any[];
    selectedActionName: any;
    disableSavepartNumber: boolean;
    sourceItemMasterCap: any = {};
    disableSavepartDescription: boolean;
    descriptionbyPart: any[] = [];
    allPartnumbersInfo: any[];
    alldashnumberinfo: any[];
    allManagemtninfo: any[] = [];
    maincompanylist: any[] = [];
    public auditHisory: AuditHistory[] = [];
    auditHistory: any[] = [];
    bulist: any[];
    departmentList: any[];
    divisionlist: any[];
    activeIndex: number;
    manufacturerData: any[] = [];
    allAircraftinfo: any[];
    completeAircraftManfacturerData: any[];
    formData = new FormData();
    allaircraftInfo: any[];
    selectedAircraftTypes: any;
    selectedAircraftDataModels: any[] = [];
    enablePopupData: boolean = false;
    currentVendorModels: any[] = [];
    selectedModels: any[] = [];
    allManufacturerInfo: any[];
    allDashnumberInfo: any[];
    allATAMaininfo1: ATAMain[];
    assetRecordId: number = 0;
    selectedColumn: any;
    disableSaveForEdit: boolean = false;
    //selectedManufacturer: any = [];//To Store selected Aircraft Manufacturer Data
    selectedManufacturer: any;
    selectedModel: any = [];//To Store selected Aircraft Modal Data
    capabilitiesForm: FormGroup;
    capabilityEditCollection: any[] = [];
    AssetCapesId: number;
    lazyLoadEventData: any;
    private isEditMode: boolean = false;
    private isDeleteMode: boolean = false;
    allAssetInfo: any[];
    allAssets: any[] = [];
    pageNumber = 0;
    breadcrumbs: MenuItem[];
    localCollection: any[];
    data: any;
    currentAsset: any;
    disableSave: boolean;
    onSelectedId: any;
    itemMasterId: number;
    showLable: boolean;
    allCapesInfo: ItemMasterCapabilitiesModel[] = [];
    selectedColumns: any;
    cols: { field: string; header: string;star:boolean }[];
    isSaving: boolean;
    currentCapes: any = {};
    search_AircraftDashNumberList: any;
    capabilityTypeData: any[];
    currentRow: any;
    disableAdd:any
    AssetId: any;
    static assetService;
    aircraftData: any;
    selectedDashnumber: any;
    dashNumberList: any = [];
    viewTable: boolean = false;
    aircraftdata = [];
    dashNumberUrl: any;
    newDashnumValue: any = [];
    selectAircraftManfacturer: any = [];
    selectedAircraftModel: any = [];
    selectedDashNumbers: any = [];
    selectedATAchapter: any = [];
    selectedAircraftId: any;
    selectedModelId: any;
    modelUnknown = false;
    dashNumberUnknown = false;
    newValue: any;
    LoadValues: any[] = [];
    totalRecords: number = 0;
    totalRecords1: number = 0;
    pageIndex: number = 0;
    pageSize: number = 10;
    pageSize1: number = 10;
    totalPages: number = 0;
    totalPages1: number = 0;
    searchAircraftParams: string = '';
    aircraftTypeId: number = 0;
    partNumber: string = '';
    capabilityid: number = 0;
    aircraftmodelId: number = 0;
    aircraftdashId: number = 0;
    home: any;
    nextOrPreviousTab: string;
    status: string = 'Active';
    currentstatus2: string = 'Active';
    currentDeletedstatus: boolean = false;
    lazyLoadEventDataInput: any;
    assetCapesId: number = 0;
    aircraftDataEdit: any = {};
    actionHide:boolean=false;
    filterText: string = '';
    errorDisplay: any;
    selectedRows:any=[];
    constructor(private router: ActivatedRoute, private modalService: NgbModal, private alertService: AlertService, public itemMasterService: ItemMasterService, private route: Router,
        private assetServices: AssetService, private dashnumberservices: DashNumberService, private authService: AuthService, private formBuilder: FormBuilder, private commonservice: CommonService
        , private aircraftManufacturerService: AircraftManufacturerService, private aircraftModelService: AircraftModelService, private configurations: ConfigurationService, private datePipe: DatePipe) {
        this.cols = [
            { field: 'partNumber', header: 'PN',star:true},
            { field: 'partDescription', header: 'PN Description' ,star:false },
            { field: 'captypedescription', header: 'Capability Type',star:true },
            { field: 'manufacturer', header: 'Aircraft Manufacturer',star:true },
            { field: 'modelname', header: 'Model',star:false },
            { field: 'dashnumber', header: 'Dash Number' ,star:false},
            { field: 'createdDate', header: 'Created Date' ,star:false},
            { field: 'createdBy', header: 'Created By' ,star:false},
            { field: 'updatedDate', header: 'Updated Date' ,star:false},
            { field: 'updatedBy', header: 'Updated By',star:false },
        ];
        this.selectedColumns = this.cols;
        this.AssetId = this.router.snapshot.params['id'];
        this.activeIndex = 1;
       // if (this.assetServices.listCollection == undefined) {
        // this.GetAssetData(this.AssetId);
       // }
        if (this.assetServices.listCollection != null && this.assetServices.isEditMode == true) {
            this.showLable = true;
            this.currentAsset = this.assetServices.listCollection;
            if (this.assetServices.listCollection) {
                this.local = this.assetServices.listCollection;
            }
            if(this.isView==false){
            this.aircraftManfacturerData('');
            }
        }
        else if (this.assetServices.generalCollection != null) {
            this.showLable = true;
            this.currentAsset = this.assetServices.generalCollection;
            if (this.assetServices.generalCollection) {
                this.local = this.assetServices.generalCollection;
                this.currentCapes = this.local;
            }
            if(this.isView==false){
            this.aircraftManfacturerData('');
            }
        }

    }

    capabilityForm: any = {
        selectedCap: "", CapabilityTypeId: 0, selectedPartId: [], selectedAircraftDataModels: [],
        selectedAircraftModelTypes: [], selectedAircraftTypes: [], selectedManufacturer: [], selectedModel: [], selectedDashNumbers: [], selectedDashNumbers2: [],
        modelUnknown: false
    };
    ngOnInit(): void {
        if( this.assetServices.isEditMode == false){

            this.breadcrumbs = [
                { label: 'Asset' },
                { label: 'Create Asset' },
            ];
        }else{

            this.breadcrumbs = [
                { label: 'Asset' },
                { label: 'Edit Asset' },
            ];
        }
        this.capabilitiesForm = this.formBuilder.group({
            mfgForm: this.formBuilder.array([]),
            overhaulForm: this.formBuilder.array([]),
            distributionForm: this.formBuilder.array([]),
            certificationForm: this.formBuilder.array([]),
            repairForm: this.formBuilder.array([]),
            exchangeForm: this.formBuilder.array([])
        });
        this.AssetId = this.router.snapshot.params['id'];
        if(this.isView==false){
        this.GetAssetData(this.AssetId);
        this.ptnumberlistdata('');
        this.aircraftManfacturerData('');
     this.getCapabilityTypeData('');
        // this.GetAssetData(this.viewassetRecordId);
}
    }
    ngOnChanges(changes: SimpleChanges){
this.viewassetRecordId=this.viewassetRecordId;
    }
    getmemo(event) {
        this.disableAdd = false;
    }

    onFilterCapability(value) {
        this.getCapabilityTypeData(value);
    }
    setEditArray: any = [];
     getCapabilityTypeData(value) {
        this.setEditArray = [];
        if (this.assetServices.isCapsEditMode == true) {
            this.setEditArray.push(this.AssetCapesId ? this.AssetCapesId : 0);
        } else {
            this.setEditArray.push(0);
        }
        const strText = value ? value : '';
        this.commonservice.autoSuggestionSmartDropDownList('CapabilityType', 'CapabilityTypeId', 'Description', strText, true, 20, this.setEditArray.join()).subscribe(res => {
            this.capabilityTypeData = res;
        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        });
    }


    colaircraft: any[] = [
        { field: 'CapibilityType', header: 'Capability Type',star:true },
        { field: 'PartNumber', header: 'PN' ,star:true},
        { field: 'AircraftType', header: 'Aircraft Manufacturer',star:true },
        { field: 'AircraftModel', header: 'Model',star:false },
        { field: 'DashNumber', header: 'Dash Number',star:false }
    ];
    private GetAssetData(assetid) {
        this.assetServices.getByAssetId(assetid).subscribe(
            results =>{ this.onassetdataSuccessful(results[0])},err => {			
                const errorLog = err;
                this.errorMessageHandler(errorLog);}
        );
    }

    private onassetdataSuccessful(getAssetData: any[]) {
        this.assetServices.isEditMode = true;
        this.activeIndex = 1;
        this.assetServices.indexObj.next(this.activeIndex);
        this.assetServices.listCollection = getAssetData;
        if (this.assetServices.listCollection != null) {

            this.showLable = true;
            this.currentAsset = this.assetServices.listCollection;
            if (this.assetServices.listCollection) {
                this.local = this.assetServices.listCollection;
            }
        }
        else if (this.assetServices.generalCollection != null) {
            this.showLable = true;
            this.currentAsset = this.assetServices.generalCollection;
            if (this.assetServices.generalCollection) {
                this.local = this.assetServices.generalCollection;
                this.currentCapes = this.local;
            }
        }
    }
    isSpinnerVisibleView:any=false;
    getAuditHistoryById(rowData) {
        this.isSpinnerVisibleView=true;
        this.assetServices.getAssetCapesAudit(rowData.assetCapesId).subscribe(res => {
            this.auditHistory = res;
            setTimeout(() => {
                this.isSpinnerVisibleView=false;
            }, 1200);
        },err => {			
            this.isSpinnerVisibleView=false;
            const errorLog = err;
            this.errorMessageHandler(errorLog);})
    }

    getColorCodeForHistory(i, field, value) {
        const data = this.auditHistory;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
    }


    sampleExcelDownloadForCapes() {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=AssetCapes&fileName=AssetCapes.xlsx`;
        window.location.assign(url);
    }
    CapesExcelUpload(event) {
        const file = event.target.files;
        if (file.length > 0) {

            this.formData.append('file', file[0])
            this.formData.append('masterCompanyId', this.authService.currentUser.masterCompanyId.toString())
            this.formData.append('createdBy', this.userName);
            this.formData.append('updatedBy', this.userName);
            this.formData.append('isActive', 'true');
            this.formData.append('isDeleted', 'false');
            const data={'masterCompanyId': this.authService.currentUser.masterCompanyId,
                        'createdBy':this.userName,
                        'updatedBy':this.userName,
                        'isActive':true,
                        'isDeleted':false
        }
            this.assetServices.CapesUpload(this.formData, this.currentAsset.assetRecordId,data).subscribe(res => {
                event.target.value = '';

                this.formData = new FormData();
                this.getList(this.lazyLoadEventData);
                this.alertService.showMessage(
                    'Success',
                    `Successfully Uploaded  `,
                    MessageSeverity.success
                );
            },err => {			
                const errorLog = err;
                this.errorMessageHandler(errorLog);})

        }

    }

    arrayItemMasterlist:any=[];
    ptnumberlistdata(strText = ''){
        this.arrayItemMasterlist=[];
		if(this.assetServices.isCapsEditMode==true) {			
            this.arrayItemMasterlist.push(this.aircraftDataEdit.partNumber ? this.aircraftDataEdit.partNumber :0); 
        }else{
            this.arrayItemMasterlist.push(0);
        }
            

        this.commonservice.autoSuggestionSmartDropDownList('ItemMaster', 'ItemMasterId', 'PartNumber',strText,true,20,this.arrayItemMasterlist.join()).subscribe(response => {
            this.allPartnumbersInfo = response.map(x => {
                return {
                    partNumber: x.label, itemMasterId: x.value
                }
            })                   
this.partCollection=this.allPartnumbersInfo;
		},err => {
			const errorLog = err;
			this.errorMessageHandler(errorLog);		
		});
    }

 
    loadData(event) {

        this.lazyLoadEventData = event;
        const pageIndex = parseInt(event.first) / event.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        event.first = pageIndex;

        this.lazyLoadEventDataInput = event;
        this.lazyLoadEventDataInput.globalFilter = this.filterText;
        this.lazyLoadEventDataInput.filters = {
            ...this.lazyLoadEventDataInput.filters,
            status: this.status ? this.status : 'Active'
        }
   const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters)}
        this.getList(PagingData);
    }
    recordId:any;
    async getList(data) {
        const isdelete = this.currentDeletedstatus ? true : false;
        data.filters.isDeleted = isdelete
        const PagingData = { ...data, filters: listSearchFilterObjectCreation(data.filters) }
        if(this.isView==false){
            this.recordId=this.currentAsset ? this.currentAsset.assetRecordId :this.AssetId;
        }else{
            this.recordId=this.viewassetRecordId;
        }
        if(this.recordId !=undefined){
        this.isSpinnerVisible = true;
        this.assetServices.getAssetCapesAll(PagingData,this.recordId).subscribe(res => {
           this.data = res.results;
             this.allCapesInfo = this.data;
            this.totalRecords = res.totalRecordsCount; 
            this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            this.isSpinnerVisible = false;
        },err => {	
            this.isSpinnerVisible = false;		
            const errorLog = err;
            this.errorMessageHandler(errorLog);});
        }
    }
    dateObject:any={}
    dateFilterForTable(date, field) {
this.dateObject={}
        date=moment(date).format('MM/DD/YYYY'); moment(date).format('MM/DD/YY')
if(date !="" && moment(date, 'MM/DD/YYYY',true).isValid()){
    if(field=='createdDate'){
        this.dateObject={'createdDate':date}
    }else if(field=='updatedDate'){
        this.dateObject={'updatedDate':date}
    }
    
    this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters ,...this.dateObject};
    const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
    this.getList(PagingData); 
}else{
    this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters,...this.dateObject};
    if(this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.createdDate){
        delete this.lazyLoadEventDataInput.filters.createdDate;
    }
    if(this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.updatedDate){
        delete this.lazyLoadEventDataInput.filters.updatedDate;
    }
    this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters,...this.dateObject};
        const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
        this.getList(PagingData); 
}
      
    }
    getCapesListByStatus(status) {
        this.currentstatus2=status;
        this.selectedRows=[];
        this.pageNumber = 0;
        const pageIndex = parseInt(this.lazyLoadEventDataInput.first) / this.lazyLoadEventDataInput.rows;
        this.pageIndex = pageIndex;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = pageIndex;
        this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: status };
        const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
        PagingData.first= 0;
        this.getList(PagingData);
    }
    getDeleteListByStatus(value) {
        this.pageNumber = 0;
        this.selectedRows=[];
        this.currentDeletedstatus = true;

        const pageIndex = parseInt(this.lazyLoadEventDataInput.first) / this.lazyLoadEventDataInput.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = pageIndex;
        this.status = status;
        if (value == true) {
            this.currentstatus2 = this.currentstatus2;

            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.currentstatus2 };
            const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
            this.getList(PagingData);
        } else {
            this.currentDeletedstatus = false;

            this.currentstatus2 = this.currentstatus2;
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.currentstatus2 };
            const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
            this.getList(PagingData);
        }
    }

    globalSearch(value) {
        const pageIndex = parseInt(this.lazyLoadEventDataInput.first) / this.lazyLoadEventDataInput.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = pageIndex;
        this.lazyLoadEventDataInput.globalFilter = value;
        this.filterText = value;

        this.status = this.currentstatus2;
        this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.currentstatus2 };
        const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters), globalFilter: value}
       
        this.getList(PagingData);
    }
    restorerecord: any = {}
    restoreRecord() {
        this.commonservice.updatedeletedrecords('AssetCapes', 'AssetCapesId', this.restorerecord.assetCapesId).subscribe(res => {
            this.getDeleteListByStatus(true)
            this.modal.close();

            this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
        },err => {			
            const errorLog = err;
            this.errorMessageHandler(errorLog);})
    }
    restore(content, rowData) {
        this.restorerecord = rowData;
        this.assetCapesId = rowData.assetCapesId;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false,windowClass: 'assetMangecls' });

    }

 

    get mfgFormArray(): FormArray {
        return this.capabilitiesForm.get('mfgForm') as FormArray;
    }
    get overhaulFormArray(): FormArray {
        return this.capabilitiesForm.get('overhaulForm') as FormArray;
    }


    get distributionFormArray(): FormArray {
        return this.capabilitiesForm.get('distributionForm') as FormArray;
    }

    get certificationFormArray(): FormArray {
        return this.capabilitiesForm.get('certificationForm') as FormArray;
    }

    get repairFormArray(): FormArray {
        return this.capabilitiesForm.get('repairForm') as FormArray;
    }

    get exchangeFormArray(): FormArray {
        return this.capabilitiesForm.get('exchangeForm') as FormArray;
    }
    changeOfTab(value) {
        const { assetId } = this.AssetId;
        this.AssetId=this.AssetId ? this.AssetId :this.assetServices.listCollection.assetRecordId;
        if (this.assetServices.isEditMode == true) {
            if (value === 'General') {
                this.activeIndex = 0;
                this.route.navigateByUrl(`assetmodule/assetpages/app-edit-asset/${this.AssetId}`);
            } else if (value === 'Capes') {
                this.activeIndex = 1;
                this.route.navigateByUrl(`/assetmodule/assetpages/app-asset-capes/${this.AssetId}`);
            } else if (value === 'Calibration') {
                this.activeIndex = 2;
                this.route.navigateByUrl(`/assetmodule/assetpages/app-asset-calibration/${this.AssetId}`);
            } else if (value == "Maintenance") {
                this.activeIndex = 3;
                this.route.navigateByUrl(`/assetmodule/assetpages/app-asset-maintenance-warranty/${this.AssetId}`);
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
        this.ptnumberlistdata(event.target.value);
    }

    onCapabilityTypeSelection(event) { 
        
        this.capabilityid=event.value;

        if (this.capabilityTypeData) {
            for (let i = 0; i < this.capabilityTypeData.length; i++) {
                if (event.value == this.capabilityTypeData[i].value) {
                    this.capabilityForm.selectedCap = this.capabilityTypeData[i].label;
                }
            }
        }
    }

    partnmId(event) {
      this.sourceItemMasterCap.partId = event.itemMasterId;
      this.itemMasterId = event.itemMasterId;
      this.disableSavepartNumber = true;
      this.selectedActionName = event.partNumber;
            this.disableSavepartDescription = true;
        
    }


    filterPNpartItems(event) {
		this.partCollection = this.allPartnumbersInfo;
		if (event.query !== undefined && event.query !== null) {
            this.ptnumberlistdata(event.query);
        }else{
            this.ptnumberlistdata('');
        }
			const partNum = [...this.allPartnumbersInfo.filter(x => {
				return x.partNumber.toLowerCase().includes(event.query.toLowerCase())
			})]
			this.partCollection = partNum;
	
    }

    onAssetIdselection(event) {
        if (this.allAssets) {

            for (let i = 0; i < this.allAssets.length; i++) {
                if (event == this.allAssets[i][0].assetId) {
                    this.currentAsset.assetRecordId = this.allAssets[i][0].assetRecordId;
                    this.disableSave = true;

                    this.onSelectedId = event;
                }
            }
        }
    }
    onFilteManufacturer(value){
        this.aircraftManfacturerData(value)
    }
     aircraftManfacturerData(value) {
    //     this.commonservice.smartDropDownList('AircraftType','AircraftTypeId','Description').subscribe(res => {
    //         this.manufacturerData=res;
    //         this.loadingIndicator = false;
    // },err => {			
    //     const errorLog = err;
    //     this.errorMessageHandler(errorLog);})

        this.setEditArray = [];
        if (this.assetServices.isCapsEditMode==true) {
            this.setEditArray.push(this.aircraftDataEdit.selectedAircraftTypes ? this.aircraftDataEdit.assetAcquisitionTypeId : 0);
        } else {
            this.setEditArray.push(0);
        }
        const strText = value ? value : '';
        this.commonservice.autoSuggestionSmartDropDownList('AircraftType','AircraftTypeId','Description', strText, true, 20, this.setEditArray.join()).subscribe(res => {
            this.manufacturerData = res;
            this.loadingIndicator = false;
        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        });




    } 

    loadModalsForExistingRecords(capData) {
        if (capData.selectedAircraftTypes) {
            // this.itemMasterService.getAircraftTypes(capData.selectedAircraftTypes).subscribe(
            //     results =>{ this.onDataLoadaircrafttypeSuccessfulForExisting(results[0], capData)},err => {			
            //         const errorLog = err;
            //         this.errorMessageHandler(errorLog);}
            // );
            this.commonservice.smartDropDownList('AircraftModel', 'AircraftModelId', 'ModelName', 'AircraftTypeId', capData.selectedAircraftTypes).subscribe( results => {
                const newResp = results.map(x => {
                    return {
                        ...x,
                        aircraftModelId: x.value,
                        modelName: x.label
                    }
                });
                this.onDataLoadaircrafttypeSuccessfulForExisting(newResp, capData)},err => {			
                const errorLog = err;
                this.errorMessageHandler(errorLog);})
        }
    }

    loadModalsForExistingRecords_1(capData, aircrafttypeid) {
        if (aircrafttypeid) {
            this.commonservice.smartDropDownList('AircraftModel', 'AircraftModelId', 'ModelName', 'AircraftTypeId', aircrafttypeid).subscribe( results => {
                const newResp = results.map(x => {
                    return {
                        ...x,
                        aircraftModelId: x.value,
                        modelName: x.label
                    }
                });
                this.onDataLoadaircrafttypeSuccessfulForExisting(newResp, capData)},err => {			
                const errorLog = err;
                this.errorMessageHandler(errorLog);})
            // this.itemMasterService.getAircraftTypes(aircrafttypeid).subscribe(
            //     results => {this.onDataLoadaircrafttypeSuccessfulForExisting(results[0], capData)},err => {			
            //         const errorLog = err;
            //         this.errorMessageHandler(errorLog);}
            // );
        }
    }

    private onDataLoadaircrafttypeSuccessfulForExisting(allWorkFlows: any[], capData) //getting Models Based on Manfacturer Selection
    {
        // console.log("caps",capData)
        if(allWorkFlows && allWorkFlows.length !=0){
        capData.selectedAircraftDataModels = [];
        allWorkFlows.forEach(element => {
            if(capData.selectedAircraftModelTypes && capData.selectedAircraftModelTypes.length !=0){
            for (let z = 0; z < capData.selectedAircraftModelTypes.length; z++) {
                if (element.aircraftModelId == capData.selectedAircraftModelTypes[z]) {
                    capData.selectedModel.push({ value: element.aircraftModelId, label: element.modelName, aircraftTypeId: capData.selectedAircraftTypes })
                }
            }
        }
            capData.selectedAircraftDataModels.push({ value: element.aircraftModelId, label: element.modelName, aircraftTypeId: capData.selectedAircraftTypes })
        });
        this.displayModalNames(capData);
    }else{
        capData.selectedAircraftDataModels = [];
        capData.search_AircraftDashNumberList = []; 
    }
    }
    displayModalNames(capData) {
        switch (capData.formArrayName) {
            case "mfgForm":
                this.mfgFormArray.controls.forEach(mfg => {
                    mfg['controls']['aircraftModelName'].setValue(this.getAirCraftModalName(capData.selectedAircraftDataModels, mfg['controls']['aircraftModelId'].value));
                    this.mfgFormArray.updateValueAndValidity();
                });
                break;
            case "overhaulForm":
                this.overhaulFormArray.controls.forEach(orl => {
                    orl['controls']['aircraftModelName'].setValue(this.getAirCraftModalName(capData.selectedAircraftDataModels, orl['controls']['aircraftModelId'].value));
                });
                break;
            case "distributionForm":
                this.distributionFormArray.controls.forEach(dist => {
                    dist['controls']['aircraftModelName'].setValue(this.getAirCraftModalName(capData.selectedAircraftDataModels, dist['controls']['aircraftModelId'].value));
                });
                break;
            case "certificationForm":
                this.certificationFormArray.controls.forEach(cert => {
                    cert['controls']['aircraftModelName'].setValue(this.getAirCraftModalName(capData.selectedAircraftDataModels, cert['controls']['aircraftModelId'].value));
                });
                break;
            case "repairForm":
                this.repairFormArray.controls.forEach(rep => {
                    rep['controls']['aircraftModelName'].setValue(this.getAirCraftModalName(capData.selectedAircraftDataModels, rep['controls']['aircraftModelId'].value));
                });
                break;
            case "exchangeForm":
                this.exchangeFormArray.controls.forEach(ex => {
                    ex['controls']['aircraftModelName'].setValue(this.getAirCraftModalName(capData.selectedAircraftDataModels, ex['controls']['aircraftModelId'].value));
                });
                break;
        }

    }

    openModelPopups(capData) {
        if (this.itemMasterService.isEditMode == false) {
            if (capData.selectedAircraftTypes) {
                // this.itemMasterService.getAircraftTypes(capData.selectedAircraftTypes).subscribe(
                //     results =>{ this.onDataLoadaircrafttypeSuccessful(results[0], capData)},err => {			
                //         const errorLog = err;
                //         this.errorMessageHandler(errorLog);}
                // );
                this.commonservice.smartDropDownList('AircraftModel', 'AircraftModelId', 'ModelName', 'AircraftTypeId', capData.selectedAircraftTypes).subscribe( results => {
                    const newResp = results.map(x => {
                        return {
                            ...x,
                            aircraftModelId: x.value,
                            modelName: x.label
                        }
                    });
                    this.onDataLoadaircrafttypeSuccessful(newResp, capData)
                })
            }
            else {
                this.allAircraftinfo = []; //Making empty if selecting is null
            }
        }
    }

    private onDataLoadaircrafttypeSuccessful(allWorkFlows: any[], capData) //getting Models Based on Manfacturer Selection
    {
        capData.selectedAircraftDataModels = [];
        allWorkFlows.forEach(element => {
            capData.selectedAircraftDataModels.push({ value: element.aircraftModelId, label: element.modelName, aircraftTypeId: element.aircraftTypeId })
        });

    }


    private ondashnumberSuccessful(allWorkFlows: any[]) {
        this.allDashnumberInfo = allWorkFlows;
    }

    getAircraftDashNumber(event): any {
        let selectedData = event.target.value;
        if (selectedData) {
            selectedData = selectedData.split(":")[1];
            this.aircraftdashId = selectedData;

        }

        this.dashnumberservices.getByModelId(this.aircraftdashId).subscribe(
            results => {this.ondashnumberSuccessful(results)},err => {			
                const errorLog = err;
                this.errorMessageHandler(errorLog);}
        );
    }

 

    aircraftModalChange_1(event, aircraftTypeId,edit) {
        let selectedData = event;
        if (edit != "edit") {
             selectedData = event.target.value;
            if (selectedData) {
                selectedData = selectedData.split(":")[1];
            }
        }
        // getCapesDashNumberByModelTypeId
if(selectedData !="" && selectedData !=undefined &&  selectedData !=null){
    this.dashnumberservices.getCapesDashNumberByModelTypeId(
        selectedData,
        aircraftTypeId
    ).subscribe(dashnumbers => {
        if(dashnumbers && dashnumbers.length !=0){
        const responseData = dashnumbers.reduce((acc, current) => {
            const x = acc.find(item => item.dashNumberId === current.dashNumberId);
            if (!x) {
              return acc.concat([current]);
            } else {
              return acc;
            }
          }, []);
    
        this.search_AircraftDashNumberList = responseData.map(dashnumbers => {
            return {
                label: dashnumbers.modelName + "-" + dashnumbers.dashNumber,
                value: dashnumbers.dashNumberId,
                modelId: dashnumbers.aircraftModelId,
            };
        });
    }
    },err => {			
        const errorLog = err;
        this.errorMessageHandler(errorLog);});
}else{
    this.search_AircraftDashNumberList=[];
}
        this.aircraftDataEdit.aircraftDashNumberId = null;
    }


    cunstructItemMastars() {
        let mfgData: any = [];
        this.capabilityEditCollection.forEach(element1 => {
            let element = element1.capability;
            if (element.isDelete != true) {
                this.currentAsset.assetRecordId = element.assetRecordId;
                let index = element.capabilityTypeId - 1;
                let capData = this.capabilityTypeData[index];
                let typeIndex = capData.selectedAircraftTypes.indexOf(element.aircraftTypeId);
                if (typeIndex == -1) {
                    capData.selectedAircraftTypes.push(element.aircraftTypeId);
                    capData.selectedManufacturer.push({ value: element.aircraftTypeId, label: this.getAircraftTypeName(element.aircraftTypeId) });
                }
                capData.selectedAircraftModelTypes.push(element.aircraftModelId);
                // capData.selectedModel.push({ value: element.aircraftModelId, label: this.getAirCraftModalName([], element.aircraftModelId) });
                this.addExistingData(capData, element)
            }
        });
        this.capabilityTypeData.forEach(element1 => {
            if (element1 && element1.selectedAircraftModelTypes && element1.selectedAircraftModelTypes.length > 0) {
                this.loadModalsForExistingRecords(element1);
                // if(this.mfgFormArray)
            }
        });

    }

    getAircraftTypeName(aircraftTypeId) {
        let label = "";
        for (let i = 0; i < this.manufacturerData.length; i++) {
            if (this.manufacturerData[i].value == aircraftTypeId) {
                label = this.manufacturerData[i].label
                break;
            }
        }
        return label;
    }
    getAirCraftModalName(modalData, modalId) {
        let label = "";
        for (let i = 0; i < modalData.length; i++) {
            if (modalData[i].value == modalId) {
                label = modalData[i].label
                break;
            }
        }
        return label;
    }
    getExistingRowBuList(companyId, formArray) {
        for (let i = 0; i < this.allManagemtninfo.length; i++) {
            if (this.allManagemtninfo[i].parentId == companyId) {
                formArray['buList'].push(this.allManagemtninfo[i])
            }
        }
    }

    getExistingRowDepartmentlist(businessUnitId, formArray) {
        for (let i = 0; i < this.allManagemtninfo.length; i++) {
            if (this.allManagemtninfo[i].parentId == businessUnitId) {
                formArray.departmentList.push(this.allManagemtninfo[i]);
            }
        }
    }

    getExistingRowDivisionlist(departmentId, formArray) {
        for (let i = 0; i < this.allManagemtninfo.length; i++) {
            if (this.allManagemtninfo[i].parentId == departmentId) {
                formArray.divisionlist.push(this.allManagemtninfo[i]);
            }
        }
    }
    managementStructureData: any = [];
    setManagementStrucureData(capObj) {
        this.managementStructureData = [];
        this.checkMSParents(capObj.managementStructureId);
        if (this.managementStructureData.length == 4) {
            capObj.companyId = this.managementStructureData[3];
            capObj.buisinessUnitId = this.managementStructureData[2];
            capObj.departmentId = this.managementStructureData[1];
            capObj.divisionId = this.managementStructureData[0];
        }
        if (this.managementStructureData.length == 3) {
            capObj.companyId = this.managementStructureData[2];
            capObj.buisinessUnitId = this.managementStructureData[1];
            capObj.departmentId = this.managementStructureData[0];
        }
        if (this.managementStructureData.length == 2) {
            capObj.companyId = this.managementStructureData[1];
            capObj.buisinessUnitId = this.managementStructureData[0];
        }
        if (this.managementStructureData.length == 1) {
            capObj.companyId = this.managementStructureData[0];
        }

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
    addExistingData(capData, data) {
        let capbilitiesObj = data;
        capbilitiesObj.aircraftTypeName = this.getAircraftTypeName(data.aircraftTypeId);
        capbilitiesObj.aircraftModelName = "";
        capbilitiesObj.entryDate = new Date()
        capbilitiesObj.isVerified = false;
        capbilitiesObj.isActive = true;
        capbilitiesObj.verifiedBy = "";

        capbilitiesObj.aircraftManufacturer = this.getAircraftTypeName(data.aircraftTypeId);
        capbilitiesObj.dateVerified = new Date();
        this.setManagementStrucureData(capbilitiesObj);
        // capData.push(data);
        let mfObj = this.formBuilder.group(capbilitiesObj);
        switch (capData.formArrayName) {
            case "mfgForm":
                this.mfgFormArray.push(mfObj);
                let mfgIndex = this.mfgFormArray.controls.length - 1;


                break;
            case "overhaulForm":
                this.overhaulFormArray.push(mfObj);
                let overIndex = this.overhaulFormArray.controls.length - 1;

                break;
            case "distributionForm":
                this.distributionFormArray.push(mfObj);
                let distIndex = this.distributionFormArray.controls.length - 1;

                break;
            case "certificationForm":
                this.certificationFormArray.push(mfObj);
                let certIndex = this.certificationFormArray.controls.length - 1;

                break;
            case "repairForm":
                this.repairFormArray.push(mfObj);
                let repIndex = this.repairFormArray.controls.length - 1;

                break;
            case "exchangeForm":
                this.exchangeFormArray.push(mfObj);
                let excngIndex = this.exchangeFormArray.controls.length - 1;


                break;
        }
    }
    checkIsExisted(capId, type, modal, myForm, capData) {
        let itemExisted = false;
        myForm.controls.forEach(data => {
            if (data['controls']['capabilityTypeId'].value == capId && data['controls']['aircraftTypeId'].value == type && data['controls']['aircraftModelId'].value == modal) {
                itemExisted = true;
                data['controls']['isDelete'].setValue(false);
            } else {
                let typeId = data['controls']['aircraftTypeId'].value;
                let typeIndex = capData.selectedAircraftTypes;
                if (typeIndex == -1) {
                }
                let modaleId = data['controls']['aircraftModelId'].value;
                let modalIndex = capData.selectedAircraftModelTypes.indexOf(modaleId);
                if (modalIndex == -1) {
                }
            }


        });
        return itemExisted;
    }

    dismissModel() {
        this.isDeleteMode = false;
        this.isEditMode = false;
        this.modal.close();
    }


    dismissModelWithAlert() {
if(this.aircraftData && this.aircraftData.length>0){
        this.nextOrPreviousTab = 'Close';
        let content = this.tabRedirectConfirmationModal2;
    this.modal = this.modalService.open(content, { size: "sm" });

}else{
    this.isDeleteMode = false;
    this.isEditMode = false;
    $('#addShippingInfo').modal('hide'); 
    // this.modal.close();
}
    }
    closeHistory(){
        $('#contentHist').modal('hide'); 
    }
    redirectToTab(){
        this.isDeleteMode = false;
        this.isEditMode = false;
        this.modal.close();
        this.totalRecords1 =0;
        this.totalPages1 = 0;
        $('#addShippingInfo').modal('hide'); 
    }

    addModels(capData) {
        let capbilitiesObj = new ItemMasterCapabilitiesModel;
        capData.selectedManufacturer.forEach(element1 => {
            capbilitiesObj.assetRecordId = this.currentAsset.assetRecordId;
            capbilitiesObj.aircraftTypeId = element1.value;
            capbilitiesObj.aircraftTypeName = element1.label;
            capbilitiesObj.capabilityTypeId = capData.CapabilityTypeId;
            capbilitiesObj.capabilityTypeName = capData.selectedCap;
            capbilitiesObj.aircraftManufacturer = element1.label;
            capbilitiesObj.PartId = capData.selectedPartId;
            capbilitiesObj.itemMasterId = this.itemMasterId;
            capbilitiesObj.AssetCapesId = this.AssetCapesId;
            capbilitiesObj.aircraftModelName = 'Undefined';
            capbilitiesObj.DashNumber = 'Undefined';
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

                            let index = capData.CapabilityTypeId - 1;
                            let mfObj = this.formBuilder.group(capbilitiesObj);
                            let mfgItemExisted = this.checkIsExisted(capData.CapabilityTypeId, element1.value, element2.value, this.mfgFormArray, capData);
                            if (mfgItemExisted == false) {
                                this.mfgFormArray.push(mfObj);
                                let mfgIndex = this.mfgFormArray.controls.length - 1;
                                this.mfgFormArray.controls[mfgIndex]['buList'] = [];
                                this.mfgFormArray.controls[mfgIndex]['departmentList'] = [];
                                this.mfgFormArray.controls[mfgIndex]['divisionlist'] = [];
                            }
                            else {
                                this.mfgFormArray.push(mfObj);
                                let mfgIndex = this.mfgFormArray.controls.length - 1;
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
                            else {
                                this.mfgFormArray.push(mfObj);
                                let mfgIndex = this.mfgFormArray.controls.length - 1;
                            }
                        }

                    });

                }

            });
        });

    }

    aircraftModalChange(event, capData) {

        let selectedData = event.value;
        capData.selectedModel = [];
        capData.selectedDashNumbers=[]
  this.search_AircraftDashNumberList=[];
  if(this.modelUnknown==false && capData.selectedAircraftModelTypes && capData.selectedAircraftModelTypes.length !=0 && this.dashNumberUnknown==true){
    this.disableCapesSave=false;
  }else{
    this.disableCapesSave=true;
  }
if( capData.selectedAircraftModelTypes && capData.selectedAircraftModelTypes.length !=0){
        this.dashnumberservices.getDashNumberByModelTypeId( capData.selectedAircraftModelTypes,capData.selectedAircraftTypes).subscribe(dashnumbers => {
            const responseData = dashnumbers;
            this.search_AircraftDashNumberList = responseData.map(dashnumbers => {
                return {
                    label: dashnumbers.dashNumber,
                    value: dashnumbers.dashNumberId,
                    modelId: dashnumbers.aircraftModelId
                }
            }); 

        },err => {			
            const errorLog = err;
            this.errorMessageHandler(errorLog);});
   
     }     }

    dashNumberChange(event, capData) {
        let selectedData = event.value;
        if(this.modelUnknown==false && capData.selectedAircraftModelTypes && capData.selectedAircraftModelTypes.length !=0 && this.dashNumberUnknown==false && selectedData){
            this.disableCapesSave=false;
          }else{
            this.disableCapesSave=true;
          }
        capData.selectedDashNumbers2 = [];
        selectedData.forEach(element1 => {
            this.search_AircraftDashNumberList.forEach(element2 => {
                if (element1 == element2.value) {
                    capData.selectedDashNumbers2.push(element2);
                }
            })
        })

    }
    cunstructFormForEdit() {
        if (this.manufacturerData.length > 0) {
            this.cunstructItemMastars();
        }
    }
    disableCapesSave:any=false;

    resetAircraftModelsorDashNumbers(event, type) {
        this.disableSaveForEdit = false;
        if (this.modelUnknown) {
            this.disableCapesSave=false;
            this.selectedModelId = undefined;
            this.selectedDashnumber = undefined;
            this.capabilityForm.selectedAircraftDataModels = undefined;
            this.capabilityForm.selectedAircraftModelTypes = undefined;
            this.capabilityForm.selectedModel = undefined;
            this.capabilityForm.selectedDashNumbers = undefined;
            this.capabilityForm.selectedDashNumbers2 = undefined;

            // if(newCapesData.selectedDashNumbers && newCapesData.selectedDashNumbers.length==0){
            //     this.dashNumberUnknown=true;
            // }


        }
        if(type==1 && event.target.checked==false  && this.assetServices.isCapsEditMode == false){
 
            this.disableCapesSave=true;
        }
        if(type==1 && event.target.checked==true  && this.assetServices.isCapsEditMode == false){

            this.disableCapesSave=false;
        }
        if(type==2 && event.target.checked==false && this.assetServices.isCapsEditMode == false){
     
            this.disableCapesSave=true;
        }
        if(type==2 && event.target.checked==true && this.assetServices.isCapsEditMode == false){
   
            this.disableCapesSave=false;
        }
        if(type==1 && event.target.checked==false && this.assetServices.isCapsEditMode == true){
            this.disableSaveForEdit=true;
     
        }
        if(type==2 && event.target.checked==false && this.assetServices.isCapsEditMode == true){
            this.disableSaveForEdit=true;
        
        }
        if (this.dashNumberUnknown) {
            if(this.modelUnknown==false && this.capabilityForm.selectedAircraftModelTypes && this.capabilityForm.selectedAircraftModelTypes.length !=0 && this.dashNumberUnknown){
                this.disableCapesSave=false;
              }
            //   else{
            //     this.disableCapesSave=true;
 
            //   }

              //for Edit
              if(this.modelUnknown==false && this.aircraftDataEdit.aircraftModelId  && this.dashNumberUnknown){
                this.disableSaveForEdit=false;
              }
            //   else{
            //     this.disableCapesSave=true;
    
            //   }
            this.selectedDashnumber = undefined;
            this.capabilityForm.selectedDashNumbers = undefined;
            this.capabilityForm.selectedDashNumbers2 = undefined;
        }
        if(type==1 && event.target.checked==false && this.assetServices.isCapsEditMode == true){

        this.loadModalsForExistingRecords_1(this.capabilityForm, this.aircraftDataEdit.aircraftTypeId);
        this.aircraftDataEdit.aircraftModelId="";
        this.aircraftDataEdit.aircraftDashNumberId="";
        this.dashNumberUnknown=true;
        }
        if(type==1 && event.target.checked==true && this.assetServices.isCapsEditMode == true){
          
            this.aircraftDataEdit.aircraftModelId="";
            this.aircraftDataEdit.aircraftDashNumberId="";
            }
        if(type==2 && event.target.checked==false &&  this.assetServices.isCapsEditMode == true){
     
            this.aircraftModalChange_1(this.aircraftDataEdit.aircraftModelId, this.aircraftDataEdit.aircraftTypeId,"edit");
            this.aircraftDataEdit.aircraftDashNumberId="";
        }
        if(type==2 && event.target.checked==true &&  this.assetServices.isCapsEditMode == true){
     
            // this.aircraftModalChange_1(this.aircraftDataEdit.aircraftModelId, this.aircraftDataEdit.aircraftTypeId,"edit");
            this.aircraftDataEdit.aircraftDashNumberId="";
        }
    }
    openDelete(content2, row) {

        this.isEditMode = false;
        this.isDeleteMode = true;
        this.assetServices.CapeslistCollection = row;
        this.modal = this.modalService.open(content2, { size: 'lg', backdrop: 'static', keyboard: false,windowClass: 'assetMangecls' });

    }

    removeAsset(): void {
        this.assetServices.removeCapesById(this.assetServices.CapeslistCollection.assetCapesId).subscribe(response => {
            this.alertService.showMessage("Success", `Asset Capes removed successfully.`, MessageSeverity.success);

            this.getList(this.lazyLoadEventData);
            this.modal.close();
        },err => {			
            const errorLog = err;
            this.errorMessageHandler(errorLog);});
    }

    resetFormArray(capData) {
        switch (capData.formArrayName) {
            case "mfgForm":
                this.mfgFormArray.controls = [];
                break;
            case "overhaulForm":
                this.overhaulFormArray.controls = [];
                break;
            case "distributionForm":
                this.distributionFormArray.controls = [];
                break;
            case "certificationForm":
                this.certificationFormArray.controls = [];
                break;
            case "repairForm":
                this.repairFormArray.controls = [];
                break;
            case "exchangeForm":
                this.exchangeFormArray.controls = [];
                break;
        }
    }
    getAircraftModelByManfacturer(event) {

        this.newValue = event.target.value;

        if (this.newValue) {
            this.aircraftModelService.getAircraftModelListByManufactureId(this.selectedAircraftId).subscribe(models => {

                const responseValue = models[0];
                this.LoadValues = responseValue.map(models => {
                    return {
                        label: models.modelName,
                        value: models
                    }
                });

            },err => {			
                const errorLog = err;
                this.errorMessageHandler(errorLog);});
            this.selectedModelId = undefined;
            this.selectedDashnumber = undefined;
        }
    }
    manufacturerChange(event, capData) {
        this.capabilityForm.selectedAircraftModelTypes="";
        this.capabilityForm.selectedAircraftDataModels="";
        let selectedData = event.value;
        // let selectedData = event.target.value;
        capData.selectedManufacturer = [];
        capData.selectedAircraftDataModels=[];
        this.search_AircraftDashNumberList=[];
        // if (selectedData) {
        //     selectedData = selectedData.split(":")[1];
            this.selectedAircraftId = selectedData;
            this.aircraftTypeId=selectedData;
        // }
        if (this.assetServices.isCapsEditMode == true) {
            this.loadModalsForExistingRecords_1(capData, this.selectedAircraftId);
        }

        this.manufacturerData.forEach(element2 => {
            if (selectedData == element2.value) {
                capData.selectedManufacturer.push(element2);
                this.newValue = element2.label;
            }
        })
        this.aircraftDataEdit.aircraftModelId = null;
        this.aircraftDataEdit.aircraftDashNumberId = null;
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    openCapess(){
        this.aircraftData=[];
        this.capabilityForm={};
        // this.dashNumberUnknown=null;
        this.modelUnknown=true;
        this.assetServices.isCapsEditMode = false;
        this.disableAdd=true;
        this.actionHide=true;
        this.dashNumberUnknown=true;
    }
    mapAircraftInformation(capdata) {
const newCapesData={...capdata};


        if(newCapesData.selectedDashNumbers && newCapesData.selectedDashNumbers.length==0){
            this.dashNumberUnknown=true;
        }

        this.viewTable = true;
        if(!this.assetServices.isCapsEditMode) {
            this.assetServices.isCapsEditMode = false;
        }
        this.searchAircraftParams = `CapabilityId=${newCapesData.CapabilityTypeId}&PartId=${this.itemMasterId}&AircraftTypeId=${newCapesData.selectedAircraftTypes}&AircraftModelId=${newCapesData.selectedAircraftModelTypes}&DashNumberId=${newCapesData.selectedDashNumbers ? newCapesData.selectedDashNumbers : undefined}`;
        this.assetServices.GetAssetCapesRecordCheck(this.currentAsset.assetRecordId, this.searchAircraftParams).subscribe(models => {
            this.actionHide=false;
            const responseValue = models[0];
            if (models[0] != null) {
                this.alertService.showMessage("", `Same Record Already Exists`, MessageSeverity.error);
                return;
            }
            else {
                if (this.assetServices.isCapsEditMode == false) {
                    if (newCapesData.selectedAircraftTypes !== undefined && newCapesData.selectedAircraftModelTypes !== undefined && newCapesData.selectedDashNumbers !== undefined) {
                        this.dashnumberservices.getAllDashModels(newCapesData.selectedAircraftModelTypes, newCapesData.selectedAircraftTypes, newCapesData.selectedDashNumbers).subscribe(aircraftdata => {
                            const responseValue = aircraftdata;
                            this.aircraftData = responseValue.map(x => {
                                return {
                                    AircraftType: x.aircraft,
                                    AircraftModel: x.model,
                                    DashNumber: x.dashNumber,
                                    AircraftModelId: x.modelid,
                                    DashNumberId: x.dashNumberId,
                                    CapibilityType: newCapesData.selectedCap,
                                    PartNumber: newCapesData.selectedPartId.partNumber,
                                    CapabilityId: newCapesData.CapabilityTypeId,
                                    ItemMasterId: this.itemMasterId,
                                    AircraftTypeId: newCapesData.selectedAircraftTypes,
                                    AircraftDashNumberId: x.dashNumberId,
                                    AssetRecordId: this.currentAsset.assetRecordId,
                                    MasterCompanyId: this.authService.currentUser.masterCompanyId,
                                    CreatedBy: this.userName,
                                    UpdatedBy: this.userName,
                                    CreatedDate: new Date(),
                                    UpdatedDate: new Date(),
                                    isActive: true,
                                    isDelete: false
                                }
                            });
       
                        })
                    } 
                    if (this.selectedAircraftId !== undefined && this.modelUnknown) {
                        this.aircraftData = [{
                            AircraftType: this.newValue,
                            // AircraftModel: 'Unknown',
                            // DashNumber: 'Unknown',
                            AircraftModel: null,
                            DashNumber: null,
                            AircraftModelId: '',
                            DashNumberId: '',
                            CapibilityType: newCapesData.selectedCap,
                            PartNumber: newCapesData.selectedPartId.partNumber,
                            CapabilityId: newCapesData.CapabilityTypeId,
                            ItemMasterId: this.itemMasterId,
                            AircraftTypeId: newCapesData.selectedAircraftTypes,
                            AircraftDashNumberId: null,
                            AssetRecordId: this.currentAsset.assetRecordId,
                            MasterCompanyId: this.authService.currentUser.masterCompanyId,
                            CreatedBy: this.userName,
                            UpdatedBy: this.userName,
                            CreatedDate: new Date(),
                            UpdatedDate: new Date(),
                            isActive: true,
                            isDelete: false
                        }]
                    }
                    // if (this.selectedAircraftId !== undefined && newCapesData.selectedModel !== undefined && this.dashNumberUnknown) {
                    if (newCapesData.selectedAircraftTypes !== undefined && newCapesData.selectedAircraftModelTypes !== undefined && (this.dashNumberUnknown || (newCapesData.selectedDashNumbers && newCapesData.selectedDashNumbers.length==0) )) {
    if(newCapesData.selectedAircraftModelTypes && newCapesData.selectedAircraftModelTypes.length !=0){
                        this.aircraftData = newCapesData.selectedAircraftModelTypes.map(x => {
                            return {
                                AircraftType: this.newValue,
                                AircraftModel: x ? getValueFromArrayOfObjectById('label', 'value', x, newCapesData.selectedAircraftDataModels) : null,
                                // DashNumber: 'Unknown',
                                DashNumber: null,
                                AircraftModelId: x,
                                DashNumberId: '',
                                CapibilityType: newCapesData.selectedCap,
                                PartNumber: newCapesData.selectedPartId.partNumber,
                                CapabilityId: newCapesData.CapabilityTypeId,
                                ItemMasterId: this.itemMasterId,
                                AircraftTypeId: newCapesData.selectedAircraftTypes,
                                AircraftDashNumberId: null,
                                AssetRecordId: this.currentAsset.assetRecordId,
                                MasterCompanyId: this.authService.currentUser.masterCompanyId,
                                CreatedBy: this.userName,
                                UpdatedBy: this.userName,
                                CreatedDate: new Date(),
                                UpdatedDate: new Date(),
                                isActive: true,
                                isDelete: false
                            }
                        })
                    }
                    }


              
                }
                else {
                    if (newCapesData.selectedAircraftModelTypes && newCapesData.selectedAircraftModelTypes.length > 1 || newCapesData.selectedDashNumbers && newCapesData.selectedDashNumbers.length > 1) {
                        // this.alertService.stopLoadingMessage();
                        this.alertService.showMessage("", `Multiple Records cannot be added in edit`, MessageSeverity.error);
                        return;
                    }
                    else {
                        if (newCapesData.selectedAircraftTypes !== undefined && newCapesData.selectedAircraftModelTypes !== undefined && newCapesData.selectedDashNumbers !== undefined) {
                            this.dashnumberservices.getAllDashModels(newCapesData.selectedAircraftModelTypes, newCapesData.selectedAircraftTypes, newCapesData.selectedDashNumbers).subscribe(aircraftdata => {
                                const responseValue = aircraftdata;
                                this.aircraftData = responseValue.map(x => {
                                    return {
                                        AssetCapesId: this.AssetCapesId,
                                        AircraftType: x.aircraft,
                                        AircraftModel: x.model,
                                        DashNumber: x.dashNumber,
                                        AircraftModelId: x.modelid,
                                        DashNumberId: x.dashNumberId,
                                        CapibilityType: newCapesData.selectedCap,
                                        PartNumber: newCapesData.selectedPartId.partNumber,
                                        CapabilityId: newCapesData.CapabilityTypeId,
                                        ItemMasterId: this.itemMasterId,
                                        AircraftTypeId: newCapesData.selectedAircraftTypes,
                                        AircraftDashNumberId: x.dashNumberId,
                                        AssetRecordId: this.currentAsset.assetRecordId,
                                        MasterCompanyId: this.authService.currentUser.masterCompanyId,
                                        CreatedBy: this.userName,
                                        UpdatedBy: this.userName,
                                        CreatedDate: new Date(),
                                        UpdatedDate: new Date(),
                                        isActive: true,
                                        isDelete: false
                                    }
                                });
                            })
                        }
                        if (this.selectedAircraftId !== undefined && this.modelUnknown) {
                            this.aircraftData = [{
                                AssetCapesId: this.AssetCapesId,
                                AircraftType: this.newValue,
                                // AircraftModel: 'Unknown',
                                // DashNumber: 'Unknown',
                                AircraftModel: null,
                                DashNumber: null,
                                AircraftModelId: '',
                                DashNumberId: '',
                                CapibilityType: newCapesData.selectedCap,
                                PartNumber: newCapesData.selectedPartId.partNumber,
                                CapabilityId: newCapesData.CapabilityTypeId,
                                ItemMasterId: this.itemMasterId,
                                AircraftTypeId: newCapesData.selectedAircraftTypes,
                                AircraftDashNumberId: null,
                                AssetRecordId: this.currentAsset.assetRecordId,
                                MasterCompanyId: this.authService.currentUser.masterCompanyId,
                                CreatedBy: this.userName,
                                UpdatedBy: this.userName,
                                CreatedDate: new Date(),
                                UpdatedDate: new Date(),
                                isActive: true,
                                isDelete: false
                            }]
                        }

                        if (this.selectedAircraftId !== undefined && newCapesData.selectedModel !== undefined && this.dashNumberUnknown) {
             console.log("dash nu,ber unknown",newCapesData)
                            this.aircraftData = newCapesData.selectedModel.map(x => {
                                return {
                                    AssetCapesId: this.AssetCapesId,
                                    AircraftType: this.newValue,
                                    AircraftModel: x.label,
                                    // DashNumber: 'Unknown',
                                    DashNumber: null,
                                    AircraftModelId: x.value,
                                    DashNumberId: '',
                                    CapibilityType: newCapesData.selectedCap,
                                    PartNumber: newCapesData.selectedPartId.partNumber,
                                    CapabilityId: newCapesData.CapabilityTypeId,
                                    ItemMasterId: this.itemMasterId,
                                    AircraftTypeId: newCapesData.selectedAircraftTypes,
                                    AircraftDashNumberId: null,
                                    AssetRecordId: this.currentAsset.assetRecordId,
                                    MasterCompanyId: this.authService.currentUser.masterCompanyId,
                                    CreatedBy: this.userName,
                                    UpdatedBy: this.userName,
                                    CreatedDate: new Date(),
                                    UpdatedDate: new Date(),
                                    isActive: true,
                                    isDelete: false
                                }
                            })
                        }


           
                    }
                }
            }
            this.totalRecords1 =this.aircraftData.length ?  this.aircraftData.length :0;
            console.log("event2",this.totalRecords1,this.pageSize1)
            this.totalPages1 = Math.ceil(this.totalRecords1 / this.pageSize1);
            console.log("event2",this.pageSize1)
            this.capabilityForm.selectedDashNumbers="";
            this.dashNumberUnknown=true;
            this.capabilityForm.selectedAircraftModelTypes="";
            this.modelUnknown=true;
            this.capabilityForm.selectedAircraftTypes="";
            this.capabilityForm.selectedPartId="";
            this.capabilityForm.CapabilityTypeId="";
        },err => {			
            const errorLog = err;
            this.errorMessageHandler(errorLog);});
             
    }
    loadData2(event) {
        const pageIndex = parseInt(event.first) / event.rows;;
        this.pageIndex = pageIndex;
        this.pageSize1 = pageIndex;
        event.first = pageIndex;
        console.log("event",this.pageSize1)
    }
    saveCapabilities(capdata,type) {

        const responseValue = this.aircraftData;
        if (this.assetServices.isCapsEditMode == false) { 
            this.assetServices.saveManfacturerinforcapes(responseValue,type).subscribe(data11 => {
                this.alertService.showMessage("Success", `Asset capes saved successfully.`, MessageSeverity.success);
                let data: any = {
                    selectedCap: "", CapabilityTypeId: 0, selectedPartId: [], selectedAircraftDataModels: [],
                    selectedAircraftModelTypes: [], selectedAircraftTypes: [], selectedManufacturer: [], selectedModel: [], selectedDashNumbers: [], selectedDashNumbers2: []
                };
                this.capabilityForm = data;
                //this.loadCapesData();
                this.getList(this.lazyLoadEventData);
                this.totalRecords1 =0;
                this.totalPages1 = 0;
   },err => {			
    const errorLog = err;
    this.errorMessageHandler(errorLog);})
            this.mfgFormArray.controls = [];
            // this.modal.close();
        }
        else {  
            this.allPartnumbersInfo.forEach(element => {
                if(element.partNumber==this.aircraftDataEdit.partNumber){
                   this.aircraftDataEdit.itemMasterId=element.itemMasterId
                }
               });
               this.aircraftDataEdit.itemMasterId=this.aircraftDataEdit.partNumber.itemMasterId;
               this.aircraftDataEdit.partNumber=this.aircraftDataEdit.partNumber.partNumber;
            const responseValue = [{
                ...this.aircraftDataEdit,
                assetRecordId: this.AssetId,
                masterCompanyId: this.authService.currentUser.masterCompanyId,
                createdBy: this.userName, 
                updatedBy: this.userName
            }];
           
            this.assetServices.saveManfacturerinforcapes(responseValue,type).subscribe(data11 => {
                this.alertService.showMessage("Success", `Asset capes updated successfully.`, MessageSeverity.success);
                let data: any = {
                    selectedCap: "", CapabilityTypeId: 0, selectedPartId: [], selectedAircraftDataModels: [],
                    selectedAircraftModelTypes: [], selectedAircraftTypes: [], selectedManufacturer: [], selectedModel: [], selectedDashNumbers: [], selectedDashNumbers2: []
                };
                this.capabilityForm = data;
                this.getList(this.lazyLoadEventData);

            },err => {			
                const errorLog = err;
                this.errorMessageHandler(errorLog);})
            this.mfgFormArray.controls = [];
        }
        if(type=='add'){
            $("#addShippingInfo").modal("hide");
        }else{
            this.modal.close();
        }
    }
    addBtnTitle(item) {
        let addBtnTitle = '';
        if (this.currentAsset.assetRecordId < 1) {
            addBtnTitle = "Please Select PN";
        } else {
            if (item.selectedAircraftTypes.length == 0) {
                addBtnTitle = "Please Select Aircraft Type";
            } else if (item.selectedAircraftModelTypes.length == 0) {
                addBtnTitle = "Please Select Aircraft Modal";
            } else {
                addBtnTitle = 'Add ' + item.Description;
            }
        }
        return addBtnTitle;
    }

    validateForm(form, fieldName: any) {
        let className = '';
        if (form.get(fieldName).valid) {
        } else {
            className = 'form-validation-error';
        }
        return className;
    };


    openCapes(content) {
        this.isEditMode = false;
        this.assetServices.isCapsEditMode = false;
        this.isDeleteMode = true;
        this.mfgFormArray.controls = [];
        this.aircraftData = [];
        this.capabilityForm = {
            selectedCap: "", CapabilityTypeId: 0, selectedPartId: [], selectedAircraftDataModels: [],
            selectedAircraftModelTypes: [], selectedAircraftTypes: [], selectedManufacturer: [],
            selectedModel: [], selectedDashNumbers: [], selectedDashNumbers2: [],
            modelUnknown: false
        };
        this.modelUnknown = false;
        this.dashNumberUnknown = false;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });

    }

    private onCapesLoaded(allCapes: ItemMasterCapabilitiesModel[]) {
        this.allCapesInfo = allCapes;
    }

    private loadCapesData() {
        if (this.currentAsset) {
            this.assetServices.getcapabilityListData(this.currentAsset.assetRecordId).subscribe(
                results =>{ this.onCapesLoaded(results[0])},err => {			
                    const errorLog = err;
                    this.errorMessageHandler(errorLog);}
            );

        }
    }
    getmemo2($event) {
        this.disableSaveForEdit = false;
    }

    opencapesToEdit(content, row) //this is for Edit Data get
    {
        this.disableSaveForEdit = true;
        this.aircraftDataEdit = {};
        this.mfgFormArray.controls = [];
        this.overhaulFormArray.controls = [];
        this.distributionFormArray.controls = [];
        this.certificationFormArray.controls = [];
        this.repairFormArray.controls = [];
        this.exchangeFormArray.controls = [];
        this.capabilityEditCollection = [];
        let getSelectedCollection = [];
        this.assetServices.isCapsEditMode = true;
        this.isSaving = true;
        this.AssetCapesId = row.assetCapesId;
        this.loadModalsForExistingRecords_1(this.capabilityForm, row.aircraftTypeId);
        this.aircraftModalChange_1(row.aircraftModelId, row.aircraftTypeId,"edit");
        this.assetServices.getAssetCapabilityData(row.assetCapesId).subscribe(data => {
            getSelectedCollection = data;
            this.aircraftDataEdit = data[0];
            this.aircraftDataEdit.partNumber= {partNumber :data[0].partNumber,itemMasterId:data[0].itemMasterId};
            if (getSelectedCollection) {
                this.capabilityid = data[0].capabilityId;
                this.partNumber = data[0].partNumber;
                this.itemMasterId = data[0].itemMasterId;
                this.aircraftTypeId = data[0].aircraftTypeId;
                this.aircraftmodelId = data[0].aircraftModelId;
                this.aircraftdashId = data[0].aircraftDashNumberId;
        
            }
      
            if(this.aircraftDataEdit.aircraftModelId){
                this.modelUnknown=false;
            }else{
                this.modelUnknown=true; 
            }
            
            if(this.aircraftDataEdit.aircraftDashNumberId){
                this.dashNumberUnknown=false;
            }else{
                this.dashNumberUnknown=true;  
            }
        },err => {			
            const errorLog = err;
            this.errorMessageHandler(errorLog);}
        );

        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });

    }

    saveCapes() { 
        this.assetServices.listCollection = this.local;
        this.activeIndex = 2;
        this.assetServices.indexObj.next(this.activeIndex);
        const { assetId } = this.local;
        this.alertService.showMessage("Success", `Asset capes saved successfully.`, MessageSeverity.success);
        this.route.navigateByUrl(`/assetmodule/assetpages/app-asset-calibration/${this.local.assetRecordId}`);
    }

    backClick() {
        this.assetServices.listCollection = this.local;
        this.activeIndex = 0;
        this.assetServices.indexObj.next(this.activeIndex);
        this.assetServices.isEditMode = true;
        this.isSaving = true;
        const { assetId } = this.local; 
        this.route.navigateByUrl(`/assetmodule/assetpages/app-edit-asset/${this.local.assetRecordId}`);
    }

    //turn the item active/inActive
    toggleActiveStatus(rowData) {


        this.assetServices.updateCapes({assetCapesId:rowData.assetCapesId, isActive:rowData.isActive},this.userName).subscribe(res => { 
            this.alertService.showMessage("Success", `Asset capes updated successfully.`, MessageSeverity.success);
            //this.loadCapesData();
            this.getList(this.lazyLoadEventData);
        },err => {			
            const errorLog = err;
            this.errorMessageHandler(errorLog);});
    }

    onCapesDataSuccessful(capesData, isActive) {
        const data = { ...capesData, isActive: isActive };
        this.alertService.showMessage("Success", `Asset capes saved successfully.`, MessageSeverity.success);
    }

    onCapesDataFail(error) {

    }

    nextClick() {
        this.currentAsset = this.assetServices.listCollection;
        this.activeIndex = 2;
        this.assetServices.indexObj.next(this.activeIndex);
        const { assetRecordId } = this.currentAsset;
        this.route.navigateByUrl(`/assetmodule/assetpages/app-asset-calibration/${assetRecordId}`);
    }

    isSpinnerVisible:boolean=false;
    exportData:any=[];
    exportCSV(dt){
        this.exportData=[];
            this.isSpinnerVisible = true;
            const isdelete=this.currentDeletedstatus ? true:false;
            const { assetRecordId } = this.currentAsset;
            let PagingData = {"first":0,"rows":dt.totalRecords,"sortOrder":1,"filters":{"status":this.currentstatus2,"isDeleted":isdelete},"globalFilter":""}
            this.assetServices.downloadAllAssetCapsList(PagingData,assetRecordId).subscribe(
                results => {
                    this.loadingIndicator = false;
                    dt._value = results['results'].map(x => {
                        return {
                            ...x,                  
                            createdDate: x.createdDate ?  this.datePipe.transform(x.createdDate, 'MM/dd/yyyy hh:mm a'): '',
                            updatedDate: x.updatedDate ?  this.datePipe.transform(x.updatedDate, 'MM/dd/yyyy hh:mm a'): '',
                        }
                    }); 
                    dt.exportCSV();
                    dt.value = this.allCapesInfo;
                    this.isSpinnerVisible = false;
                },err => {			
                    const errorLog = err;
                    this.errorMessageHandler(errorLog);}
            );
    } 




	errorMessageHandler(log) {
        // console.log("error",log);
        
        this.isSpinnerVisible=false;
        // var msg = '';
        this.alertService.showMessage(
            'Error',
            log,
            MessageSeverity.error
        ); 
        // if( typeof log == 'string' ) {
        //     this.alertService.showMessage(
		// 		'Error',
		// 		log,
		// 		MessageSeverity.error
		// 	); 

        // }else  if (log && log.error && log.error.errors.length > 0) {
		// 			for (let i = 0; i < log.error.errors.length; i++){
		// 				msg = msg + log.error.errors[i].message + '<br/>'
		// 			}
        //             this.alertService.showMessage(
        //                 log.error.message,
        //                 msg,
        //                 MessageSeverity.error
        //                 );
        //             }else{
        //                 this.alertService.showMessage(
        //                     'Error',
        //                     log,
        //                     MessageSeverity.error
        //                 ); 
        //             }
		   
    
}

}