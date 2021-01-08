import { Component, ViewChild, OnInit, AfterViewInit, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { ConditionService } from '../../../../services/condition.service';
import { Condition } from '../../../../models/condition.model';
import { fadeInOut } from '../../../../services/animations';
import { MessageSeverity, AlertService } from '../../../../services/alert.service';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
 
import { NgbModal,NgbModalRef, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MultiSelectModule } from 'primeng/multiselect';
import { ItemMasterService } from '../../../../services/itemMaster.service';
import { LegalEntityService } from '../../../../services/legalentity.service';
import { AtaMainService } from '../../../../services/atamain.service';
import { ATAMain } from '../../../../models/atamain.model';
import { ItemMasterCapabilitiesModel } from '../../../../models/itemMasterCapabilities.model';
import { Router, ActivatedRoute } from '@angular/router';
import { AircraftModelService } from '../../../../services/aircraft-model/aircraft-model.service';
import { DashNumberService } from '../../../../services/dash-number/dash-number.service';
import { CommonService } from '../../../../services/common.service';
import { WorkOrderService } from '../../../../services/work-order/work-order.service';
import { getValueFromObjectByKey, getValueFromArrayOfObjectById } from '../../../../generic/autocomplete';
import { AuthService } from '../../../../services/auth.service';
import { VendorService } from '../../../../services/vendor.service';
import { AtaSubChapter1Service } from '../../../../services/atasubchapter1.service';
import { takeUntil } from "rxjs/operators";
import { Subject } from 'rxjs';
import { DBkeys } from '../../../../services/db-Keys';
import { DatePipe } from '@angular/common';
import * as $ from 'jquery';


@Component({
    selector: 'app-item-master-create-capabilities',
    templateUrl: './item-master-create-capabilities.component.html',
    styleUrls: ['./item-master-create-capabilities.component.scss'],
    animations: [fadeInOut],
    providers: [DatePipe]
})
/** item-master-create-capabilities component*/
export class ItemMasterCreateCapabilitiesComponent implements OnInit {
    @Input() itemMasterId;
    @Input() isCapViewMode : any = false;
    isSpinnerVisible: boolean = false;
    manufacturerData: any = [];
    LoadValues: any;
    selectedAircraftId: any;
    modelUnknown = false;
    dashNumberUnknown = false;
    dashNumberUrl = '';
    selectedModelId: any;
    LoadDashnumber = [];
    selectedDashnumber = undefined;
    newDashnumValue: any = [];
    newModelValue: any = [];
    viewTable: boolean = false;
    aircraftData: any;
    newValue: any;
    capabilityTypeId: any = [];
    ataChapters = [];
    intergationList = [];
    cmmList = [];
    employeeList = [];
    moduleName = 'Capes';
    textAreaLabel: string;
    textAreaInfo: string;
    isAdd: boolean = false;
    addrawNo:number = 0;
    colaircraft: any[] = [

    ];
    cols: any[] = [
        {field: 'addedDate', header: 'Date Added', width: "150px"},
        {field: 'isVerified', header: 'Verified', width: "100px"},
        {field: 'verifiedById', header: 'Verified By', width: "150px"},
        {field: 'verifiedDate', header: 'Verified Date', width: "150px"},
        {field: 'memo', header: 'Memo',width: "150px"},

    ];
    capabalityTypeList: any;
    legalEntityList: any = [];
    pnData: any = [];
    itemMasterIDFromPartNumberSelection: any;
    @Output() loadCapesList = new EventEmitter<any>();
    @Output() closeCapesPopup = new EventEmitter<any>();
    @Input() isEnableCapesList: boolean = false;
    selectedAircraftName: any;
    partData: any = {};
    itemMastersList: any[] = [];
    private onDestroy$: Subject<void> = new Subject<void>();
    selectedColums: any[];

    constructor(public itemser: ItemMasterService,
        private aircraftModelService: AircraftModelService,
        private Dashnumservice: DashNumberService,
        private commonService: CommonService,
        private workOrderService: WorkOrderService,
        private alertService: AlertService,
        private authService: AuthService,
        public vendorser: VendorService,
        private atasubchapter1service: AtaSubChapter1Service,
        private activatedRoute: ActivatedRoute,
        private _router: Router,
        private datePipe: DatePipe

    ) {
        this.itemser.currentUrl = '/itemmastersmodule/itemmasterpages/app-item-master-create-capabilities';
            this.itemser.bredcrumbObj.next(this.itemser.currentUrl);//Bread Crumb
     }
    ngOnInit() {
        this.getCapabilityTypesList();
        this.getAircraftTypesList();
        this.getItemMasterList();
        this.resetFormData();
        this.selectedColums = this.cols;

    }
    getItemMasterList() {

this.isSpinnerVisible = true;
        this.itemser.getItemStockList("Stock").subscribe(res => {
            
            let resData = res[0];
            this.itemMastersList = resData;
            if (resData) {
                for (let i = 0; i < resData.length; i++) {
                    this.pnData.push({
                        label: resData[i].im.partNumber, value: resData[i].itemMasterId
                    })
                    if(this.itemMasterId){
                        if(resData[i].im.itemMasterId == this.itemMasterId){
                            this.partData = {
                                partNumber: resData[i].im.partNumber,
                                partDescription: resData[i].im.partDescription,
                                manufacturerName: resData[i].manufacturer[0].name,
                                itemClassification: resData[i].itemClassfication[0].description
                            }
                        }
                    }
                   
                }
            }
            this.isSpinnerVisible = false;
        })
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    getCapabilityTypesList() {
        this.commonService.smartDropDownList('CapabilityType', 'CapabilityTypeId', 'Description').subscribe(res => {
            this.capabalityTypeList = res;
        })
    }

    getAircraftTypesList() {
        this.itemser.getAircraft().subscribe(res => {
            const allaircraftInfo = res[0];


            if (allaircraftInfo) {
                if (allaircraftInfo.length > 0) {
                    for (let i = 0; i < allaircraftInfo.length; i++)
                        this.manufacturerData.push(
                            { value: allaircraftInfo[i].aircraftTypeId, label: allaircraftInfo[i].description },
                        );
                }
            }
        })
    }

    getAircraftModelByManfacturer(value) {
        let airtCraftObject = this.manufacturerData.find(element => element.value == this.selectedAircraftId);
        this.selectedAircraftName = airtCraftObject.label;
        this.aircraftModelService.getAircraftModelListByManufactureId(this.selectedAircraftId).subscribe(models => {

            const responseValue = models[0];
            this.LoadValues = responseValue.map(models => {
                return {
                    label: models.modelName,
                    value: models
                }
            });

        });
        this.selectedModelId = undefined;
        this.selectedDashnumber = undefined;
    }

    getDashNumberByTypeandModel(value) {
        this.newModelValue = value.originalEvent.target.textContent;
        this.dashNumberUrl = this.selectedModelId.reduce((acc, obj) => {

            return `${acc},${obj.aircraftModelId}`
        }, '')
        this.dashNumberUrl = this.dashNumberUrl.substr(1);
        this.Dashnumservice.getDashNumberByModelTypeId(this.dashNumberUrl, this.selectedAircraftId).subscribe(dashnumbers => {
            const responseData = dashnumbers;
            this.LoadDashnumber = responseData.map(dashnumbers => {
                return {
                    label: dashnumbers.dashNumber,
                    value: dashnumbers.dashNumberId
                }
            });
            this.filterDashNumberDropdown(this.aircraftData)

        });
    }

    selectedDashnumbervalue(value) {
        this.newDashnumValue = value.originalEvent.target.textContent;
    }


    resetAircraftModelsorDashNumbers() {
        if (this.modelUnknown) {
            this.selectedModelId = undefined;
            this.selectedDashnumber = undefined;

        }
        if (this.dashNumberUnknown) {

            this.selectedDashnumber = undefined;

        }

    }
    get currentUserManagementStructureId(): number {
        return this.authService.currentUser
          ? this.authService.currentUser.managementStructureId
          : null;
      }
    mapAircraftInformation(){
        this.viewTable = true;
        this.commonService
          .getManagementStructureDetails(this.currentUserManagementStructureId)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe(res => {
            let mappedAircraftData = this.capabilityTypeId.map(x => {
                return {
                    IsChecked: false,
                    capabilityTypeId: x,
                    capailityTypeName: getValueFromArrayOfObjectById('label', 'value', x, this.capabalityTypeList),
                    managementStructureId: this.currentUserManagementStructureId,
                    description: '',
                    
                    entryDate: new Date(),                   
                    isVerified: false,
                    verifiedById: null,
                    verifiedDate: null,
                    addedDate: new Date(),
                    memo: '',
                    companyId: res.Level1,
                    buId: res.Level2,
                    divisionId: res.Level3,
                    departmentId: res.Level4,
                }
            })
            this.aircraftData = mappedAircraftData;
            for(let i=0; i<this.aircraftData.length; i++){
               
                this.selectedLegalEntity(res.Level1, i);
                this.selectedBusinessUnit(res.Level2, i);
            this.selectedDivision(res.Level3, i);
            this.selectedDepartment(res.Level4, i);
            }
            this.capabilityTypeId = null;
        });
            this.getLegalEntity();
            this.getAllEmployees();            
            
    }
    loadManagementStructure(managementStructureId) {
        this.commonService
          .getManagementStructureDetails(managementStructureId)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe(res => {
            this.selectedLegalEntity(res.Level1, null);
            this.selectedBusinessUnit(res.Level2, null);
            this.selectedDivision(res.Level3, null);
            this.selectedDepartment(res.Level4, null);
          });
      }
      
    mapAircraftInformationOld() {
    this.viewTable = true;
    if (this.selectedAircraftId !== undefined && this.selectedModelId !== undefined && this.selectedDashnumber !== undefined) {
        this.Dashnumservice.getAllDashModels(this.dashNumberUrl, this.selectedAircraftId, this.selectedDashnumber).subscribe(aircraftdata => {
            const responseValue = aircraftdata;
            let mappedAircraftData = responseValue.map(x => {
                return {
                    AircraftType: x.aircraft,
                    aircraftTypeId: this.selectedAircraftId,
                    AircraftModel: x.model,
                    DashNumber: x.dashNumber,
                    AircraftModelId: x.modelid,
                    DashNumberId: x.dashNumberId,
                    IsChecked: false,
                    // ...this.capes

                    capabilityTypeId: this.capabilityTypeId,
                    capailityTypeName: getValueFromArrayOfObjectById('label', 'value', this.capabilityTypeId, this.capabalityTypeList),
                    managementStructureId: null,
                    description: '',
                    ataChapterId: null,
                    ataSubChapterId: null,
                    entryDate: new Date(),
                    cmmId: null,
                    integrateWithId: null,
                    isVerified: false,
                    verifiedById: null,
                    verifiedDate: new Date(),
                    addedDate: new Date(),
                    memo: '',
                    companyId: null,
                    buId: null,
                    divisionId: null,
                    departmentId: null,
                }
            })
            for(let i=0; i<mappedAircraftData.length; i++){
                this.aircraftData = [...this.aircraftData, mappedAircraftData[i]]
            }
            this.filterDashNumberDropdown(this.aircraftData);

        })
    }
    if (this.selectedAircraftId !== undefined && this.modelUnknown) {
        let mappedAircraftData  = [{
            AircraftType: this.newValue,
            aircraftTypeId: this.selectedAircraftId,
            AircraftModel: 'Unknown',
            DashNumber: 'Unknown',
            AircraftModelId: 0,
            DashNumberId: 0,
            IsChecked: false,
            // ...this.capes
            capabilityTypeId: this.capabilityTypeId,
            capailityTypeName: getValueFromArrayOfObjectById('label', 'value', this.capabilityTypeId, this.capabalityTypeList),
            managementStructureId: null,
            description: '',
            ataChapterId: null,
            ataSubChapterId: null,
            entryDate: new Date(),
            cmmId: null,
            integrateWithId: null,
            isVerified: false,
            verifiedById: null,
            verifiedDate: new Date(),
            addedDate: new Date(),
            memo: '',
            companyId: null,
            buId: null,
            divisionId: null,
            departmentId: null,
        }]
        for(let i=0; i<mappedAircraftData.length; i++){
            this.aircraftData = [...this.aircraftData, mappedAircraftData[i]]
        }
    }

    if (this.selectedAircraftId !== undefined && this.selectedModelId !== undefined && this.dashNumberUnknown) {
        let mappedAircraftData = this.selectedModelId.map(x => {
            return {
                AircraftType: this.newValue,
                aircraftTypeId: this.selectedAircraftId,
                AircraftModel: x.modelName,
                DashNumber: 'Unknown',
                AircraftModelId: x.aircraftModelId,
                DashNumberId: 0,
                IsChecked: false,
                // ...this.capes,
                capabilityTypeId: this.capabilityTypeId,
                capailityTypeName: getValueFromArrayOfObjectById('label', 'value', this.capabilityTypeId, this.capabalityTypeList),
                managementStructureId: null,
                description: '',
                ataChapterId: null,
                ataSubChapterId: null,
                entryDate: new Date(),
                cmmId: null,
                integrateWithId: null,
                isVerified: false,
                verifiedById: null,
                verifiedDate: new Date(),
                addedDate: new Date(),
                memo: '',
                companyId: null,
                buId: null,
                divisionId: null,
                departmentId: null,
            }
        })
        for(let i=0; i<mappedAircraftData.length; i++){
            this.aircraftData = [...this.aircraftData, mappedAircraftData[i]]
        }
    }
    this.getPartPublicationByItemMasterId(this.itemMasterId);
    this.getAtAChapters();
    this.getIntergationWithList();
    this.getAllEmployees();
    this.getLegalEntity();

    }


    getDynamicVariableData(variable, index) {
        return this[variable + index]
    }



    async getPartPublicationByItemMasterId(itemMasterId) {
        this.capabilityTypeId = [];
        this.aircraftData = [];
        let iMid = this.activatedRoute.snapshot.paramMap.get('id');
        if (!iMid) {
            iMid = this.itemMasterIDFromPartNumberSelection;
        }
        for(let i=0; i<this.itemMastersList.length; i++){
            if(this.itemMastersList[i].itemMasterId == iMid){
                this.partData = {
                    partNumber: this.itemMastersList[i].partNumber,
                    partDescription: this.itemMastersList[i].partDescription,
                    manufacturerName: this.itemMastersList[i].manufacturer.name,
                    itemClassification: this.itemMastersList[i].itemClassification.description
                }
            }
        }
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
    resetVerified(rowData, value) {
        if (value === false) {
            rowData.verifiedById = null;
            rowData.verifiedDate = null;
        } if(value == true){
            rowData.verifiedDate = new Date();
        }
    }

    getAtAChapters() {
        this.commonService.smartDropDownList('ATAChapter', 'ATAChapterId', 'ATAChapterName').subscribe(res => {
            this.ataChapters = res;
        })
    }
    getIntergationWithList() {
        this.commonService.smartDropDownList('IntegrationPortal', 'IntegrationPortalId', 'Description').subscribe(res => {
            this.intergationList = res;
        })
    }
    async getAllEmployees() {
        await this.commonService.getCertifiedEmpList(this.currentUserManagementStructureId).subscribe(res => {
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


    getLegalEntity() {
        this.commonService.getLegalEntityList().subscribe(res => {
            this.legalEntityList = res;
        })
    }


    selectedLegalEntity(legalEntityId, index) {
        if(index == null){
            index = this.aircraftData.length -1;
        }
        if (legalEntityId) {
            this.aircraftData[index].managementStructureId = legalEntityId;
            this.commonService.getBusinessUnitListByLegalEntityId(legalEntityId).subscribe(res => {
                this['businessUnitList' + index] = res;

            })
        }

    }
    selectedBusinessUnit(businessUnitId, index) {
        if(index == null){
            index = this.aircraftData.length -1;
        }
        if (businessUnitId) {
            this.aircraftData[index].managementStructureId = businessUnitId;
            this.commonService.getDivisionListByBU(businessUnitId).subscribe(res => {

                this['divisionList' + index] = res;
            })
        }

    }
    selectedDivision(divisionUnitId, index) {
        if(index == null){
            index = this.aircraftData.length -1;
        }
        if (divisionUnitId) {
            this.aircraftData[index].managementStructureId = divisionUnitId;
            this.commonService.getDepartmentListByDivisionId(divisionUnitId).subscribe(res => {
                this['departmentList' + index] = res;
            })
        }

    }
    selectedDepartment(departmentId, index) {
        if(index == null){
            index = this.aircraftData.length -1;
        }
        if (departmentId) {
            this.aircraftData[index].managementStructureId = departmentId;
        }
    }

    // get subchapter by Id in the add ATA Mapping
    getATASubChapterByATAChapter(value, index) {


        this.atasubchapter1service.getATASubChapterListByATAChapterId(value).subscribe(atasubchapter => {
            const responseData = atasubchapter[0];
            this["ataSubChapaters" + index] = responseData.map(x => {
                return {
                    label: x.description,
                    value: x.ataChapterId
                }
            })
        })
    }

    saveCapability() {
        this.isSpinnerVisible = true;
        let iMid = this.activatedRoute.snapshot.paramMap.get('id');
        if (!iMid) {
            iMid = this.itemMasterIDFromPartNumberSelection;
        }
        if(this.itemMasterId){
            iMid = this.itemMasterId
        }


        const capesData = [
            ...this.aircraftData.map(x => {
                if(x.verifiedDate  || x.addedDate){
                   x.verifiedDate =  this.datePipe.transform(x.verifiedDate, DBkeys.GLOBAL_DATE_FORMAT),
                   x.addedDate =  this.datePipe.transform(x.addedDate, DBkeys.GLOBAL_DATE_FORMAT)
                }                
                return {
                    ...x,
                    aircraftDashNumberId: x.DashNumberId,
                    itemMasterId: parseInt(iMid),
                    masterCompanyId: 1,
                    createdBy: this.userName,
                    updatedBy: this.userName,
                    createdDate: new Date(),
                    updatedDate: new Date(),
                    isActive: true,
                    isDeleted: false
                }
            }),

        ]
        this.itemser.saveItemMasterCapes(capesData).subscribe(res => {
            this.aircraftData = [];
            this.resetFormData();
            this.loadCapesList.emit(true);
            this.isSpinnerVisible = false;
            if (res.statusCode == 500) {
                this.alertService.showMessage(
                    'Error',
                    res.message,
                    MessageSeverity.error
                );
            }
            else {
                this.alertService.showMessage(
                    this.moduleName,
                    'Saved Capes Details Successfully',
                    MessageSeverity.success
                );
                let iMid = this.activatedRoute.snapshot.paramMap.get('id');
                if (!iMid && !this.itemMasterId) {
                    this._router.navigateByUrl('/itemmastersmodule/itemmasterpages/app-item-master-capabilities-list');
                }
            }
        },
        error => this.saveFailedHelper(error))
    }

    resetFormData() {
        this.itemMasterIDFromPartNumberSelection = null;
        this.capabilityTypeId  = [] ;
        this.selectedAircraftId = null;
        this.selectedAircraftName = "";
        this.modelUnknown = false;
        this.selectedModelId = null;
        this.LoadValues = [];
        this.dashNumberUnknown = false;
        this.LoadDashnumber = [];
        this.newDashnumValue = [];
        this.newModelValue = [];
        this.aircraftData  = [];
        this.viewTable = false;
    }
    onCloseCapes() {
        this.closeCapesPopup.emit(true);
    }
    filterDashNumberDropdown (aircraft){        
        var props =  ['label', 'value'];
        var result = this.LoadDashnumber.filter(function(o1){
            return !aircraft.some(function(o2){
                return o1.value === o2.DashNumberId;          // assumes unique id
            });
        }).map(function(o){  
            return props.reduce(function(newo, name){
                newo[name] = o[name];
                return newo;
            }, {});
        });
        this.LoadDashnumber = result;
        this.selectedDashnumber = undefined;
    }

    filterCapabilityListDropdown (aircraft){        
        var props =  ['label', 'value'];
        var result = this.capabalityTypeList.filter(function(o1){
            return !aircraft.some(function(o2){
                return o1.value === o2.capabilityTypeId;          // assumes unique id
            });
        }).map(function(o){  
            return props.reduce(function(newo, name){
                newo[name] = o[name];
                return newo;
            }, {});
        });
        this.capabalityTypeList = result;
        this.capabilityTypeId = undefined;
    }

    private saveFailedHelper(error: any) {
        this.isSpinnerVisible = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
        setTimeout(() => this.alertService.stopLoadingMessage(), 5000);
    }
    onAddTextAreaInfo(value,row_no) {
		if(value == 'memo') {
			this.textAreaLabel = 'Memo';
            this.textAreaInfo = this.aircraftData.memo;
            this.addrawNo = row_no;
		}
    }
    
    onSaveTextAreaInfo() {
		if(this.textAreaLabel == 'Memo') {
            if(this.isAdd){
                this.aircraftData[this.addrawNo].memo = this.textAreaInfo;
            }
            else{
                this.aircraftData.memo = this.textAreaInfo;
            }
        }
        $('#capes-memo').modal('hide');
    }

    closeMemoModel()
    {
        $('#capes-memo').modal('hide');
    }
}