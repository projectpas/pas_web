import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { fadeInOut } from '../../../../services/animations';
import { MessageSeverity, AlertService } from '../../../../services/alert.service';
import { ItemMasterService } from '../../../../services/itemMaster.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AircraftModelService } from '../../../../services/aircraft-model/aircraft-model.service';
import { DashNumberService } from '../../../../services/dash-number/dash-number.service';
import { CommonService } from '../../../../services/common.service';
import { WorkOrderService } from '../../../../services/work-order/work-order.service';
import { getValueFromArrayOfObjectById } from '../../../../generic/autocomplete';
import { AuthService } from '../../../../services/auth.service';
import { VendorService } from '../../../../services/vendor.service';
import { AtaSubChapter1Service } from '../../../../services/atasubchapter1.service';
import { takeUntil } from "rxjs/operators";
import { Subject } from 'rxjs';
import { DBkeys } from '../../../../services/db-Keys';
import { DatePipe } from '@angular/common';
declare var $: any;


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
    @Input() isCapViewMode: any = false;
    isSpinnerVisible: boolean = false;
    manufacturerData: any = [];
    LoadValues: any;
    selectedAircraftId: any;
    itemMasterCapesId: any;
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
    addrawNo: number = 0;
    colaircraft: any[] = [];
    cols: any[] = [
        { field: 'addedDate', header: 'Date Added', width: "150px" },
        { field: 'isVerified', header: 'Verified', width: "70px" },
        { field: 'verifiedById', header: 'Verified By', width: "150px" },
        { field: 'verifiedDate', header: 'Verified Date', width: "150px" },
        { field: 'memo', header: 'Memo', width: "150px" },

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
    arrayEmplsit: any[] = [];
    arrayItemMasterlist: any[] = [];
    itemMasterListOriginal: any;
    partListItemMaster: any;
    managementStructureData: any = [];

    constructor(public itemser: ItemMasterService,
        private aircraftModelService: AircraftModelService,
        private Dashnumservice: DashNumberService,
        private commonService: CommonService,
        private alertService: AlertService,
        private authService: AuthService,
        public vendorser: VendorService,
        private atasubchapter1service: AtaSubChapter1Service,
        private activatedRoute: ActivatedRoute,
        private _router: Router,
        private datePipe: DatePipe) {
        this.itemser.currentUrl = '/itemmastersmodule/itemmasterpages/app-item-master-create-capabilities';
        this.itemser.bredcrumbObj.next(this.itemser.currentUrl);//Bread Crumb
    }

    ngOnInit() {
        this.getCapabilityTypesList();
        this.getAircraftTypesList();
        this.getItemMasterList();
        this.resetFormData();
        this.getAllEmployees();
        this.selectedColums = this.cols;
        // this.getManagementStructureDetails(this.authService.currentUser
        //     ? this.authService.currentUser.managementStructureId
        //     : null, this.authService.currentUser ? this.authService.currentUser.employeeId : 0);
    }
    ngOnChanges(changes: SimpleChanges) {
        this.aircraftData = [];
        this.getManagementStructureDetails(this.authService.currentUser
            ? this.authService.currentUser.managementStructureId
            : null, this.authService.currentUser ? this.authService.currentUser.employeeId : 0);

    }

    getItemMasterList() {
        this.isSpinnerVisible = true;
        this.itemser.getItemStockList("Stock", this.currentUserMasterCompanyId).subscribe(res => {
            let resData = res[0];
            this.itemMastersList = resData;
            if (resData) {
                for (let i = 0; i < resData.length; i++) {
                    this.pnData.push({
                        label: resData[i].im.partNumber, value: resData[i].itemMasterId
                    })
                    if (this.itemMasterId) {
                        if (resData[i].im.itemMasterId == this.itemMasterId) {
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
        //this.commonService.smartDropDownList('CapabilityType', 'CapabilityTypeId', 'CapabilityTypeDesc','','', 0,this.authService.currentUser.masterCompanyId).subscribe(res => {
        this.commonService.autoSuggestionSmartDropDownList('CapabilityType', 'CapabilityTypeId', 'CapabilityTypeDesc', '', '', 0, '0', this.currentUserMasterCompanyId).subscribe(res => {
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

    get currentUserMasterCompanyId(): number {
        return this.authService.currentUser
            ? this.authService.currentUser.masterCompanyId
            : null;
    }

    get employeeId() {
        return this.authService.currentUser ? this.authService.currentUser.employeeId : 0;
    }
    isEditMode: boolean = true;
    businessUnitList: any = []; divisionList: any = []; departmentList: any = [];
    getManagementStructureDetails(id, empployid = 0, editMSID = 0) {
        empployid = empployid == 0 ? this.employeeId : empployid;
        editMSID = this.isEditMode ? editMSID = id : 0;
        this.commonService.getManagmentStrctureData(id, empployid, editMSID).subscribe(response => {
            if (response) {
                const result = response;
                if (result[0] && result[0].level == 'Level1') {
                    this.legalEntityList = result[0].lstManagmentStrcture;
                    this.managementStructure.companyId = result[0].managementStructureId;
                    this.managementStructure.managementStructureId = result[0].managementStructureId;
                    this.managementStructure.buId = 0;
                    this.managementStructure.divisionId = 0;
                    this.managementStructure.departmentId = 0;
                    this.businessUnitList = [];
                    this.divisionList = [];
                    this.departmentList = [];
                } else {
                    this.managementStructure.companyId = 0;
                    this.managementStructure.buId = 0;
                    this.managementStructure.divisionId = 0;
                    this.managementStructure.departmentId = 0;
                    this.legalEntityList = [];
                    this.businessUnitList = [];
                    this.divisionList = [];
                    this.departmentList = [];
                }
                if (result[1] && result[1].level == 'Level2') {
                    this.businessUnitList = result[1].lstManagmentStrcture;
                    this.managementStructure.buId = result[1].managementStructureId;
                    this.managementStructure.managementStructureId = result[1].managementStructureId;
                    this.managementStructure.divisionId = 0;
                    this.managementStructure.departmentId = 0;
                    this.divisionList = [];
                    this.departmentList = [];
                } else {
                    if (result[1] && result[1].level == 'NEXT') {
                        this.businessUnitList = result[1].lstManagmentStrcture;

                    }
                    this.managementStructure.buId = 0;
                    this.managementStructure.divisionId = 0;
                    this.managementStructure.departmentId = 0;
                    this.divisionList = [];
                    this.departmentList = [];
                }

                if (result[2] && result[2].level == 'Level3') {
                    this.divisionList = result[2].lstManagmentStrcture;
                    this.managementStructure.divisionId = result[2].managementStructureId;
                    this.managementStructure.managementStructureId = result[2].managementStructureId;
                    this.managementStructure.departmentId = 0;
                    this.departmentList = [];
                } else {
                    if (result[2] && result[2].level == 'NEXT') {
                        this.divisionList = result[2].lstManagmentStrcture;

                    }
                    this.managementStructure.divisionId = 0;
                    this.managementStructure.departmentId = 0;
                    this.departmentList = [];
                }

                if (result[3] && result[3].level == 'Level4') {
                    this.departmentList = result[3].lstManagmentStrcture;;
                    this.managementStructure.departmentId = result[3].managementStructureId;
                    this.managementStructure.managementStructureId = result[3].managementStructureId;
                } else {
                    this.managementStructure.departmentId = 0;
                    if (result[3] && result[3].level == 'NEXT') {
                        this.departmentList = result[3].lstManagmentStrcture;
                    }
                }
            }
        });
    }

    mapAircraftInformation() {
        this.viewTable = true;
        this.aircraftData = [];
        var newRow = Object.assign({}, this.aircraftData);
        newRow.IsChecked = false,
        newRow.capabilityTypeId = 0,
        newRow.capailityTypeName = '';
        newRow.description = '';
        newRow.entryDate = new Date();
        newRow.isVerified = false;
        newRow.verifiedById = 0;
        newRow.verifiedDate = null;
        newRow.addedDate = new Date();
        newRow.memo = '';
        newRow.companyId = 0;
        newRow.buId = 0;
        newRow.divisionId = 0;
        newRow.departmentId = 0;

        this.capabilityTypeId.map((x, index) => {
            const obj = { ...newRow };
            obj.id = index;
            obj.capabilityTypeId = x;
            this.aircraftData.push(obj);
        })
        this.aircraftData.map((x, index) => {
            x.capailityTypeName = getValueFromArrayOfObjectById('label', 'value', x.capabilityTypeId, this.capabalityTypeList);
            x.companyId = this.managementStructure.companyId;
            x.managementStructureId = this.managementStructure.managementStructureId;
            x.buId = this.managementStructure.buId;
            x.divisionId = this.managementStructure.divisionId;
            x.departmentId = this.managementStructure.departmentId;
            this['legalEntityList' + index] = this.legalEntityList;
            this['businessUnitList' + index] = this.businessUnitList;
            this['divisionList' + index] = this.divisionList;
            this['departmentList' + index] = this.departmentList;

        });
        this.capabilityTypeId = null;
        this.getAllEmployees();
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
                for (let i = 0; i < mappedAircraftData.length; i++) {
                    this.aircraftData = [...this.aircraftData, mappedAircraftData[i]]
                }
                this.filterDashNumberDropdown(this.aircraftData);

            })
        }
        if (this.selectedAircraftId !== undefined && this.modelUnknown) {
            let mappedAircraftData = [{
                AircraftType: this.newValue,
                aircraftTypeId: this.selectedAircraftId,
                AircraftModel: 'Unknown',
                DashNumber: 'Unknown',
                AircraftModelId: 0,
                DashNumberId: 0,
                IsChecked: false,
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
            for (let i = 0; i < mappedAircraftData.length; i++) {
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
            for (let i = 0; i < mappedAircraftData.length; i++) {
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

    FilterItemMaster(event) {
        if (event.query !== undefined && event.query !== null) {
            this.getAllPartListSmartDropDown(event.query);
        }
    }

    getAllPartListSmartDropDown(strText = '') {
        if (this.arrayItemMasterlist.length == 0) {
            this.arrayItemMasterlist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('ItemMaster', 'ItemMasterId', 'PartNumber', strText, true, 20, this.arrayItemMasterlist.join(),this.currentUserMasterCompanyId).subscribe(response => {
            this.itemMasterListOriginal = response.map(x => {
                return {
                    partNumber: x.label, itemMasterId: x.value
                }
            })
            this.partListItemMaster = [...this.itemMasterListOriginal];
        }, err => {            
        });
    }

    selectedCapesParts(event) {
        if (event.itemMasterId !== undefined && event.itemMasterId !== null) {
            this.itemMasterCapesId = event.itemMasterId;
        }
    }

    async getPartPublicationByItemMasterId(itemMasterId) {
        this.capabilityTypeId = [];
        this.aircraftData = [];
        let iMid = this.activatedRoute.snapshot.paramMap.get('id');
        if (!iMid) {
            iMid = this.itemMasterIDFromPartNumberSelection;
        }
        for (let i = 0; i < this.itemMastersList.length; i++) {
            if (this.itemMastersList[i].itemMasterId == iMid) {
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

    resetVerified(rowData, value, index) {
        if (value === false) {
            this.aircraftData[index].verifiedById = null;
            this.aircraftData[index].verifiedDate = null;
        } if (value == true) {
            this.aircraftData[index].verifiedDate = new Date();
            const employee = this.authService.currentEmployee;
            this.aircraftData[index].verifiedById = employee.value;
        }
    }

    // Not in Use
    getAtAChapters() {
        this.commonService.smartDropDownList('ATAChapter', 'ATAChapterId', 'ATAChapterName').subscribe(res => {
            this.ataChapters = res;
        })
    }

    // Not in Use
    getIntergationWithList() {
        this.commonService.smartDropDownList('IntegrationPortal', 'IntegrationPortalId', 'Description').subscribe(res => {
            this.intergationList = res;
        })
    }

    async getAllEmployees() {
        if (this.arrayEmplsit.length == 0) {
            this.arrayEmplsit.push(0, this.authService.currentEmployee.value);
        }
        await this.commonService.autoCompleteDropdownsCertifyEmployeeByMS('', true, 200, this.arrayEmplsit.join(), this.currentUserManagementStructureId, this.authService.currentUser.masterCompanyId).subscribe(res => {
            this.employeeList = res;
        }, error => error => this.saveFailedHelper(error))
    }

    getLegalEntity() {
        this.commonService.getLegalEntityList().subscribe(res => {
            this.legalEntityList = res;
        })
    }

    selectedLegalEntity(legalEntityId, index) {
        if (index == null) {
            index = this.aircraftData.length - 1;
        }
        if (legalEntityId) {
            this.aircraftData[index].managementStructureId = legalEntityId;
            this.commonService.getManagementStructurelevelWithEmployee(legalEntityId, this.employeeId).subscribe(res => {
                // this.commonService.getBusinessUnitListByLegalEntityId(legalEntityId).subscribe(res => {
                this['businessUnitList' + index] = res;
                this['divisionList' + index] = [];
                this['departmentList' + index] = [];
            })
        }
    }

    selectedBusinessUnit(businessUnitId, index) {
        if (index == null) {
            index = this.aircraftData.length - 1;
        }
        if (businessUnitId) {
            this.aircraftData[index].managementStructureId = businessUnitId;
            // this.commonService.getDivisionListByBU(businessUnitId).subscribe(res => {
            this.commonService.getManagementStructurelevelWithEmployee(businessUnitId, this.employeeId).subscribe(res => {
                this['divisionList' + index] = res;
                this['departmentList' + index] = [];
            })
        }
    }

    selectedDivision(divisionUnitId, index) {
        if (index == null) {
            index = this.aircraftData.length - 1;
        }
        if (divisionUnitId) {
            this.aircraftData[index].managementStructureId = divisionUnitId;
            // this.commonService.getDepartmentListByDivisionId(divisionUnitId).subscribe(res => {
            this.commonService.getManagementStructurelevelWithEmployee(divisionUnitId, this.employeeId).subscribe(res => {
                this['departmentList' + index] = res;
            })
        }
    }

    selectedDepartment(departmentId, index) {
        if (index == null) {
            index = this.aircraftData.length - 1;
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
        if (this.itemMasterId) {
            iMid = this.itemMasterId
        }
        else {
            iMid = this.itemMasterCapesId;
        }

        const capesData = [
            ...this.aircraftData.map(x => {
                if (x.verifiedDate || x.addedDate) {
                    x.verifiedDate = this.datePipe.transform(x.verifiedDate, DBkeys.GLOBAL_DATE_FORMAT),
                        x.addedDate = this.datePipe.transform(x.addedDate, DBkeys.GLOBAL_DATE_FORMAT)
                }
                return {
                    ...x,
                    aircraftDashNumberId: x.DashNumberId,
                    itemMasterId: parseInt(iMid),
                    masterCompanyId: this.currentUserMasterCompanyId,
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
        this.capabilityTypeId = [];
        this.selectedAircraftId = null;
        this.selectedAircraftName = "";
        this.modelUnknown = false;
        this.selectedModelId = null;
        this.LoadValues = [];
        this.dashNumberUnknown = false;
        this.LoadDashnumber = [];
        this.newDashnumValue = [];
        this.newModelValue = [];
        this.aircraftData = [];
        this.viewTable = false;
    }

    onCloseCapes() {
        this.closeCapesPopup.emit(true);
    }

    filterDashNumberDropdown(aircraft) {
        var props = ['label', 'value'];
        var result = this.LoadDashnumber.filter(function (o1) {
            return !aircraft.some(function (o2) {
                return o1.value === o2.DashNumberId;          // assumes unique id
            });
        }).map(function (o) {
            return props.reduce(function (newo, name) {
                newo[name] = o[name];
                return newo;
            }, {});
        });
        this.LoadDashnumber = result;
        this.selectedDashnumber = undefined;
    }

    filterCapabilityListDropdown(aircraft) {
        var props = ['label', 'value'];
        var result = this.capabalityTypeList.filter(function (o1) {
            return !aircraft.some(function (o2) {
                return o1.value === o2.capabilityTypeId;          // assumes unique id
            });
        }).map(function (o) {
            return props.reduce(function (newo, name) {
                newo[name] = o[name];
                return newo;
            }, {});
        });
        this.capabalityTypeList = result;
        this.capabilityTypeId = undefined;
    }

    private saveFailedHelper(error: any) {
        this.isSpinnerVisible = false;
        //this.alertService.stopLoadingMessage();
        //this.alertService.showStickyMessage(error, null, MessageSeverity.error);
        //setTimeout(() => this.alertService.stopLoadingMessage(), 5000);
    }

    onAddTextAreaInfo(value, row_no) {
        if (value == 'memo') {
            this.textAreaLabel = 'Memo';
            this.textAreaInfo = this.aircraftData.memo;
            this.addrawNo = row_no;
        }
    }

    onSaveTextAreaInfo() {
        if (this.textAreaLabel == 'Memo') {
            if (this.isAdd) {
                this.aircraftData[this.addrawNo].memo = this.textAreaInfo;
            }
            else {
                this.aircraftData.memo = this.textAreaInfo;
            }
        }
        $('#capes-memo').modal('hide');
    }

    closeMemoModel() {
        $('#capes-memo').modal('hide');
    }   

    enableSave() { }
    managementStructure = {
        companyId: 0,
        buId: 0,
        divisionId: 0,
        departmentId: 0,
        managementStructureId: 0
    }

}