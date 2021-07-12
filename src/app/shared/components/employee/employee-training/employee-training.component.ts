import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { fadeInOut } from '../../../../services/animations';
import { MasterComapnyService } from '../../../../services/mastercompany.service';
import { AlertService, DialogType, MessageSeverity } from '../../../../services/alert.service';
import { AuditHistory } from '../../../../models/audithistory.model';
import { AuthService } from '../../../../services/auth.service';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { MasterCompany } from '../../../../models/mastercompany.model';
import { EmployeeService } from '../../../../services/employee.service';
import { AppTranslationService } from '../../../../services/app-translation.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UnitOfMeasureService } from '../../../../services/unitofmeasure.service';
import { LocalStoreManager } from '../../../../services/local-store-manager.service';
import { DBkeys } from '../../../../services/db-Keys'
import { User } from '../../../../models/user.model';
import { ItemMasterService } from '../../../../services/itemMaster.service';
import { editValueAssignByCondition, formatNumberAsGlobalSettingsModule, getValueFromArrayOfObjectById } from '../../../../generic/autocomplete';
import { CommonService } from '../../../../services/common.service';
import { ConfigurationService } from '../../../../services/configuration.service';
import { AircraftModelService } from '../../../../services/aircraft-model/aircraft-model.service';
//import * as $ from 'jquery';
import * as moment from 'moment';
declare let $: any;

@Component({
    selector: 'app-employee-training',
    templateUrl: './employee-training.component.html',
    styleUrls: ['./employee-training.component.scss'],
    animations: [fadeInOut]
})

export class EmployeeTrainingComponent implements OnInit, AfterViewInit {
    @ViewChild("tabRedirectConfirmationModal3", { static: false }) public tabRedirectConfirmationModal3: ElementRef;
    @ViewChild('fileUploadInput', { static: false }) fileUploadInput: any;
    uploadedFileLength = 0;
    activeIndex: number;
    alltrainingTypes: any[];
    allPurchaseUnitOfMeasureinfo: any[];
    localunit: any[];
    manufacturerData: any;
    getAllFrequencyTrainingInfodrpData;
    employeeId: any;
    isSaving = true;
    disableSaveMemo: boolean = true;
    search_AircraftModelList: any;
    durationTypes: any = [
        { id: 1, type: 'Days' },
        { id: 2, type: 'Weeks' },
        { id: 3, type: 'Months' },
        { id: 3, type: 'Years' }
    ]
    nextOrPreviousTab: any;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    isEnableNext: any = false;
    displayedColumns = ['employeeId', 'createdBy', 'updatedBy', 'updatedDate', 'createdDate'];
    dataSource: MatTableDataSource<any>;
    allEmployeeinfo: any[] = [];
    allComapnies: MasterCompany[] = [];
    public sourceAction: any = {};
    public auditHisory: AuditHistory[] = [];
    loadingIndicator: boolean;
    isSpinnerVisible: boolean = false;
    closeResult: string;
    selectedColumn: any[];
    selectedColumns: any[];
    title: string = "Create";
    id: number;
    errorMessage: any;
    local: any;
    modal: NgbModalRef;
    employeeName: string;
    filteredBrands: any[];
    localCollection: any[] = [];
    sourceEmployee: any = {};
    public allWorkFlows: any[] = [];
    public empId: any;
    public firstName: any;
    public lastName: any;
    public nextbuttonEnable = false;
    public userA: any;
    formData = new FormData();
    @ViewChild("empform", { static: false }) formdata;
    allEmployeeTrainingDocumentsList: any = [];
    /** Actions ctor */
    private isEditMode: boolean = false;
    private isDeleteMode: boolean = false;
    Active: string = "Active";
    //added supriya
    index: number;
    memoPopupContent: any;
    memoPopupValue: any;
    isPopup: boolean = false;
    disableFileAttachmentSubmit: boolean = true;
    disableSave: boolean = true;
    totalRecordNew: number = 0;
    pageSizeNew: number = 3;
    empModuleId: number = 0;
    totalPagesNew: number = 0;
    currentDeletedstatus: boolean = false;
    public empcode: any;
    pageSize: number = 3;
    sourceViewforDocumentListColumns = [
        { field: 'fileName', header: 'File Name' },
    ]
    customerDocumentsColumns = [
        { field: 'docName', header: 'Name' },
        { field: 'docDescription', header: 'Description' },
        { field: 'docMemo', header: 'Memo' },
        { field: 'fileName', header: 'File Name' },
        { field: 'fileSize', header: 'File Size', width: "70px" },
        { field: 'createdDate', header: 'Created Date' },
        { field: 'createdBy', header: 'Created By', width: "80px" },
        { field: 'updatedDate', header: 'Updated Date' },
        { field: 'updatedBy', header: 'Updated By', width: "80px" },
    ];
    selectedColumnsDoc = this.customerDocumentsColumns;
    sourceViewforDocumentList: any = [];
    sourceViewforDocument: any = [];
    sourceViewforDocumentAudit: any = [];
    isEditButton: boolean = false;
    documentInformation = {
        docName: '',
        docMemo: '',
        docDescription: '',
        attachmentDetailId: 0
    }
    selectedFileAttachment: any = [];
    selectedFile: File = null;
    allDocumentListOriginal: any = [];
    selectedRowForDelete: any;
    rowIndex: number;
    isEditContent: boolean = false;
    arrayAircraftManfacturerlist: any = [];
    arrayTrainingtypelist: any = [];
    arrayFrequencyTrainingInfolist: any = [];
    arrayaircraftmodelarraylist: any = [];
    moduleName = 'Employee'
    constructor(private route: ActivatedRoute,
        private aircraftModelService: AircraftModelService,
        private itemser: ItemMasterService, private translationService: AppTranslationService,
        public unitService: UnitOfMeasureService, public authService: AuthService,
        private modalService: NgbModal, private activeModal: NgbActiveModal,
        private _fb: FormBuilder, private alertService: AlertService,
        private router: Router, public employeeService: EmployeeService,
        private dialog: MatDialog, private masterComapnyService: MasterComapnyService,
        private localStorage: LocalStoreManager, public commonService: CommonService,
        private configurations: ConfigurationService) {
        this.displayedColumns.push('action');
        this.dataSource = new MatTableDataSource();
        if (this.employeeService.generalCollection) {
            this.local = this.employeeService.generalCollection;
        }
        //this.getAllFrequencyTrainingData('');
        //this.loadTariningTypes('');       
        let user = this.localStorage.getDataObject<User>(DBkeys.CURRENT_USER);
        this.userA = user.userName;
        this.translationService.closeCmpny = false;

    }
    ngOnInit(): void {
        this.isSpinnerVisible = true;
        this.employeeId = this.route.snapshot.paramMap.get('id');
        if (this.employeeId) {
            this.isEditContent = true;
            this.employeeService.employeeId = this.employeeId;
            if (this.empId == null || this.empId == undefined) {
                this.employeeService.toGetEmployeeDetailsByEmpId(this.employeeId).subscribe(res => {
                    if (res) {
                        this.employeeService.employeeId = this.employeeId;
                        this.sourceEmployee = res;
                        this.empId = this.sourceEmployee.employeeId;
                        this.empcode = this.sourceEmployee.employeeCode;
                        this.firstName = this.sourceEmployee.firstName;
                        this.lastName = this.sourceEmployee.lastName;
                        this.sourceEmployee.aircraftManufacturerId = 0;
                        this.sourceEmployee.aircraftModelId = 0;
                        this.sourceEmployee.employeeTrainingTypeId = 0;
                        this.sourceEmployee.frequencyOfTrainingId = 0;
                        this.sourceEmployee.durationTypeId = 0;
                        this.isEnableNext = true;
                        if (this.sourceEmployee.employeeId) {
                            this.nextbuttonEnable = true;
                        }
                        setTimeout(() => {
                            this.isSpinnerVisible = true;
                            this.loadData();
                            if (this.empModuleId == 0 || this.empModuleId == undefined || this.empModuleId == null) {
                                this.commonService.autoSuggestionSmartDropDownList('AttachmentModule', 'AttachmentModuleId', 'Name', '', true, 0, this.arrayTrainingtypelist.join(), 0).subscribe(response => {
                                    if (response) {
                                        response.forEach(x => {
                                            if (x.label.toUpperCase() == "EMPLOYEE") {
                                                this.empModuleId = x.value;
                                            }
                                        });
                                        //this.toGetEmployeeTrainingDocumentsList(this.employeeId,this.empModuleId);
                                        this.toGetDocumentsListNew(this.employeeId, this.empModuleId);
                                    }
                                });
                            }
                            else if (this.empModuleId > 0) {
                                // this.toGetEmployeeTrainingDocumentsList(this.employeeId,this.empModuleId);
                                this.toGetDocumentsListNew(this.employeeId, this.empModuleId);
                            }
                            this.isSpinnerVisible = false;
                        }, 1200);
                    }
                }, err => {
                    this.isSpinnerVisible = false;
                    //const errorLog = err;
                    //this.errorMessageHandler(errorLog);		
                });
            }
            this.employeeService.currentUrl = this.employeeService.currentUrl = `/employeesmodule/employeepages/app-employee-training-edit/${this.employeeId}`;
        } else {
            this.isSpinnerVisible = false
            this.employeeService.currentUrl = '/employeesmodule/employeepages/app-employee-training';
        }
        this.employeeService.bredcrumbObj.next(this.employeeService.currentUrl);
        this.employeeService.ShowPtab = true;
        this.employeeService.alertObj.next(this.employeeService.ShowPtab);
        this.getAllAircraftManfacturer('');
        this.getAllFrequencyTrainingData('');
        this.loadTariningTypes('');
    }

    ngAfterViewInit() {
        this.route.queryParams
            .filter(params => params.order)
            .subscribe(params => {
                this.empId = params.order;
                this.empId = params.order;
                if (this.empId) {
                    this.nextbuttonEnable = true;

                }
                else {
                }
                this.firstName = params.firstname;
                this.lastName = params.lastname;
            });
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    private loadData() {
        this.empId = this.employeeId;
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.employeeService.getTrainingList(this.empId).subscribe(
            results => this.onDataLoadSuccessful(results[0]),
            error => { this.isSpinnerVisible = false; } //this.onDataLoadFailed(error)
        );
    }

    private loadTariningTypes(strText = '') {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = true;
        if (this.arrayTrainingtypelist.length == 0) {
            this.arrayTrainingtypelist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('EmployeeTrainingType', 'EmployeeTrainingTypeId', 'TrainingType', strText, true, 0, this.arrayTrainingtypelist.join(), this.currentUserMasterCompanyId).subscribe(response => {
            this.dataSource.data = response;
            this.alltrainingTypes = response;
            this.alertService.stopLoadingMessage();
            this.loadingIndicator = false;
        }, err => {
            this.alertService.stopLoadingMessage();
            this.loadingIndicator = false;
            this.isSpinnerVisible = false;
        });
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

    getDeleteListByStatus(value) {
        if (value) {
            this.currentDeletedstatus = true;
        } else {
            this.currentDeletedstatus = false;
        }
        this.toGetDocumentsListNew(this.empId, this.empModuleId);
    }

    // getAllAircraftManfacturer() {
    //     this.itemser.getAircraft().subscribe(res => {
    //         this.manufacturerData = res[0].map(x => {
    //             return {
    //                 value: x.aircraftTypeId, label: x.description
    //             }
    //         })
    //     },err => {
    //             const errorLog = err;
    //             this.errorMessageHandler(errorLog);
    //     });
    // }

    private getAllAircraftManfacturer(strText = '') {
        if (this.arrayAircraftManfacturerlist.length == 0) {
            this.arrayAircraftManfacturerlist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('AircraftType', 'aircraftTypeId', 'description', strText, true, 0, this.arrayAircraftManfacturerlist.join(), this.currentUserMasterCompanyId).subscribe(response => {
            this.manufacturerData = response;
        }, err => {
            this.isSpinnerVisible = false;
        });
    }

    onChangeManufacture(event, value) {
        this.search_AircraftModelList = [];
        this.sourceEmployee.aircraftModelIds = "";
        this.loadmodels(value);
    }

    loadmodels(value) {
        if (this.arrayaircraftmodelarraylist.length == 0) {
            this.arrayaircraftmodelarraylist.push(0);
        }
        this.aircraftModelService.getAircraftModelListByManufactureId(value, this.arrayaircraftmodelarraylist.join()).subscribe(models => {
            const responseValue = models[0];
            if (responseValue) {
                this.search_AircraftModelList = responseValue.map(models => {
                    return {
                        label: models.modelName,
                        value: models.aircraftModelId
                    };
                });
            }
        }, err => { });
    }

    private loadMasterCompanies() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.masterComapnyService.getMasterCompanies().subscribe(
            results => this.onDataMasterCompaniesLoadSuccessful(results[0]),
            error => { this.isSpinnerVisible = false } //this.onDataLoadFailed(error)
        );
    }

    public applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue;
    }

    changeDateEv(date) {
        if (date && date < this.setExpireDate) {
            this.setExpireDate = new Date();
        } else {
            this.setExpireDate = date;
        }
    }

    setExpireDate: any = new Date();
    private onDataLoadSuccessful(getTrainingList: any[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.dataSource.data = getTrainingList;
        this.allEmployeeinfo = getTrainingList;
        if (this.allEmployeeinfo.length > 0) {
            this.sourceEmployee = this.allEmployeeinfo[0].t;
            this.sourceEmployee.aircraftManufacturerId = this.sourceEmployee.aircraftManufacturerId == null ? 0 : this.sourceEmployee.aircraftManufacturerId;

            for (let i = 0; i < this.allEmployeeinfo.length; i++) {
                this.sourceEmployee.aircraftModelIds = this.allEmployeeinfo[i].aircraftModelIds;
            }
            // if(this.sourceEmployee.aircraftManufacturerId > 0) 
            // {
            //    this.loadmodels(this.sourceEmployee.aircraftManufacturerId);            
            // } else {
            //     this.sourceEmployee.aircraftManufacturerId = 0;
            //     this.sourceEmployee.aircraftModelId =  0;                
            // }            
            this.sourceEmployee.durationTypeId = this.sourceEmployee.durationTypeId == null ? 0 : this.sourceEmployee.durationTypeId;

            if (this.sourceEmployee.scheduleDate != null) {
                this.sourceEmployee.scheduleDate = new Date(this.sourceEmployee.scheduleDate);
            }
            if (this.sourceEmployee.completionDate != null) {
                this.sourceEmployee.completionDate = new Date(this.sourceEmployee.completionDate);
            }
            if (this.sourceEmployee.completionDate < this.setExpireDate) {
                this.setExpireDate = new Date();
            } else {
                this.setExpireDate = this.sourceEmployee.completionDate;
            }
            //this.sourceEmployee.completionDate
            if (this.sourceEmployee.expirationDate != null) {
                this.sourceEmployee.expirationDate = new Date(this.sourceEmployee.expirationDate);
            }
            this.sourceEmployee.cost = this.sourceEmployee.cost ? formatNumberAsGlobalSettingsModule(this.sourceEmployee.cost, 2) : '0.00';

            if (this.sourceEmployee.aircraftManufacturerId && this.sourceEmployee.aircraftManufacturerId > 0) {
                this.arrayAircraftManfacturerlist.push(this.sourceEmployee.aircraftManufacturerId);
            }
            this.getAllAircraftManfacturer('');

            if (this.sourceEmployee.employeeTrainingTypeId && this.sourceEmployee.employeeTrainingTypeId > 0) {
                this.arrayTrainingtypelist.push(this.sourceEmployee.employeeTrainingTypeId);
            }
            this.loadTariningTypes('');

            if (this.sourceEmployee.frequencyOfTrainingId && this.sourceEmployee.frequencyOfTrainingId > 0) {
                this.arrayFrequencyTrainingInfolist.push(this.sourceEmployee.frequencyOfTrainingId);
            }
            this.getAllFrequencyTrainingData('');

            if (this.sourceEmployee.aircraftManufacturerId > 0) {
                if (this.sourceEmployee.aircraftModelIds) {
                    this.loadmodels(this.sourceEmployee.aircraftManufacturerId);
                }
            } else {
                this.sourceEmployee.aircraftManufacturerId = 0;
                this.sourceEmployee.aircraftModelIds = "";
            }
        }
    }

    pageIndexChange(event) {
        this.pageSize = event.rows;
    }

    private onTariningTypesData(getTrainingList: any[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.dataSource.data = getTrainingList;
        this.alltrainingTypes = getTrainingList;
    }

    private onHistoryLoadSuccessful(auditHistory: AuditHistory[], content) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.auditHisory = auditHistory;
        this.modal = this.modalService.open(content, { size: 'lg' });
    }

    private onDataMasterCompaniesLoadSuccessful(allComapnies: MasterCompany[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.allComapnies = allComapnies;
    }

    private onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
    }

    handleChange(rowData, e) {
        if (e.checked == false) {
            this.sourceAction = rowData;
            this.sourceAction.updatedBy = this.userName;
            this.Active = "In Active";
            this.sourceAction.isActive == false;
            this.employeeService.updateEmployee(this.sourceAction).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => { this.isSpinnerVisible = false }) //this.saveFailedHelper(error));
        }
        else {
            this.sourceAction = rowData;
            this.sourceAction.updatedBy = this.userName;
            this.Active = "Active";
            this.sourceAction.isActive == true;
            this.employeeService.updateEmployee(this.sourceAction).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => { this.isSpinnerVisible = false })//this.saveFailedHelper(error));
        }
    }

    // not in use
    private onDataPurchaseunitSuccessful(getUnitOfMeasureList: any) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.allPurchaseUnitOfMeasureinfo = getUnitOfMeasureList;
    }

    private Purchaseunitofmeasure() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.unitService.getUnitOfMeasureList().subscribe(
            results => this.onDataPurchaseunitSuccessful(results[0]),
            error => { this.isSpinnerVisible = false }
        );

    }

    filterPurchaseUnitOfMeasures(event) {
        this.localunit = [];
        if (this.allPurchaseUnitOfMeasureinfo) {
            for (let i = 0; i < this.allPurchaseUnitOfMeasureinfo.length; i++) {
                let unitName = this.allPurchaseUnitOfMeasureinfo[i].description;
                if (unitName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                    this.localunit.push(unitName);
                }
            }
        }
    }

    open(content) {
        this.isEditMode = false;
        this.isDeleteMode = false;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceAction.isActive = true;
        this.employeeName = "";
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {
        }, () => { })
    }


    openDelete(content, row) {
        this.isEditMode = false;
        this.isDeleteMode = true;
        this.sourceAction = row;
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {
        }, () => { })
    }

    openEdit(content, row) {
        this.isEditMode = true;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceAction = row;
        this.employeeName = this.sourceAction.employeeName;
        this.loadMasterCompanies();
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {
        }, () => { })
    }

    openHelpText(content) {
        this.modal = this.modalService.open(content, { size: 'sm' });
    }

    openHist(content, row) {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.sourceAction = row;
        this.employeeService.historyEmployee(this.sourceAction.employeeId).subscribe(
            results => this.onHistoryLoadSuccessful(results[0], content),
            error => { this.isSpinnerVisible = false });
    }

    get currentUserMasterCompanyId(): number {
        return this.authService.currentUser
            ? this.authService.currentUser.masterCompanyId
            : null;
    }

    savetrainigSection() {
        if (!this.sourceEmployee.employeeTrainingTypeId || this.sourceEmployee.employeeTrainingTypeId == undefined || this.sourceEmployee.employeeTrainingTypeId == 0) {
            this.alertService.showMessage("Failure", `Training Type Required`, MessageSeverity.success);
        }
        else {
            this.isSpinnerVisible = true;
            if (!this.sourceEmployee.employeeTrainingId) {
                this.sourceEmployee.aircraftManufacturerId = this.sourceEmployee.aircraftManufacturerId == 0 ? null : this.sourceEmployee.aircraftManufacturerId;
                this.sourceEmployee.aircraftModelId = this.sourceEmployee.aircraftModelId == 0 ? null : this.sourceEmployee.aircraftModelId;
                this.sourceEmployee.createdBy = this.userName;
                this.sourceEmployee.updatedBy = this.userName;
                this.sourceEmployee.masterCompanyId = this.currentUserMasterCompanyId;
                this.sourceEmployee.isActive = true;
                this.sourceEmployee.employeeId = this.empId;
                this.sourceEmployee.createdBy = this.userA;
                this.sourceEmployee.updatedBy = this.userA;
                this.employeeService.newAddTraining(this.sourceEmployee).subscribe(data => {
                    this.isEnableNext = true;
                    this.isEditContent = true;
                    this.loadData()
                    this.onUploadDocumentListNew();
                    this.isSpinnerVisible = false;
                    this.isSaving = false;
                    this.alertService.showMessage("Success", `Training Information Saved Successfully`, MessageSeverity.success);
                    this.loadData();
                    this.disableSave = true;

                }, err => {
                    this.isSpinnerVisible = false;
                    //const errorLog = err;
                    //this.errorMessageHandler(errorLog);		
                });
            }
            else {
                this.sourceEmployee.updatedBy = this.userName;
                this.sourceEmployee.aircraftManufacturerId = this.sourceEmployee.aircraftManufacturerId == 0 ? null : this.sourceEmployee.aircraftManufacturerId;
                this.sourceEmployee.aircraftModelId = this.sourceEmployee.aircraftModelId == 0 ? null : this.sourceEmployee.aircraftModelId;
                this.sourceEmployee.masterCompanyId = this.currentUserMasterCompanyId;
                if (this.sourceEmployee.scheduleDate) {
                    let d = new Date(this.sourceEmployee.scheduleDate);
                    this.sourceEmployee.scheduleDate = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;

                }
                if (this.sourceEmployee.completionDate) {

                    let comdt = new Date(this.sourceEmployee.completionDate);
                    this.sourceEmployee.completionDate = `${comdt.getMonth() + 1}/${comdt.getDate()}/${comdt.getFullYear()}`;
                }
                if (this.sourceEmployee.completionDate < this.setExpireDate) {
                    this.setExpireDate = new Date();
                } else {
                    let comdt = new Date(this.sourceEmployee.completionDate);
                    this.setExpireDate = `${comdt.getMonth() + 1}/${comdt.getDate()}/${comdt.getFullYear()}`;
                }
                if (this.sourceEmployee.expirationDate != null) {
                    let comdt = new Date(this.sourceEmployee.expirationDate);
                    this.sourceEmployee.expirationDate = `${comdt.getMonth() + 1}/${comdt.getDate()}/${comdt.getFullYear()}`;
                }
                this.employeeService.updateTrainingDetails(this.sourceEmployee).subscribe(
                    data => {
                        this.onUploadDocumentListNew();
                        this.isSpinnerVisible = false;
                        this.isSaving = false;
                        this.disableSave = true;
                        this.alertService.showMessage("Success", `Training Information Updated Successfully`, MessageSeverity.success);
                        this.loadData();
                    }, err => {
                        this.isSpinnerVisible = false;
                        //const errorLog = err;
                        //this.errorMessageHandler(errorLog);		
                    }
                );
            }
        }
    }

    deleteItemAndCloseModel() {
        this.isSaving = true;
        this.sourceAction.updatedBy = this.userName;
        this.employeeService.deleteEmployee(this.sourceAction.employeeId).subscribe(
            response => this.saveCompleted(this.sourceAction),
            error => { this.isSpinnerVisible = false }) //this.saveFailedHelper(error));
        this.modal.close();
    }

    dismissModelNew() {
        this.isDeleteMode = false;
        this.isEditMode = false;
        this.modal.close();
    }

    private saveCompleted(user?: any) {
        this.isSaving = false;
        if (this.isDeleteMode == true) {
            this.alertService.showMessage("Success", `Action was deleted Successfully`, MessageSeverity.success);
            this.isDeleteMode = false;
        }
        else {
            this.alertService.showMessage("Success", `Action was edited Successfully`, MessageSeverity.success);
        }
        this.loadData();
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    previousClick() {
        this.activeIndex = 1;
        this.employeeService.indexObj.next(this.activeIndex);
        if (this.employeeId) {
            this.router.navigateByUrl(`/employeesmodule/employeepages/app-employee-certification-edit/${this.employeeId}`);
        } else {

            this.router.navigateByUrl('/employeesmodule/employeepages/app-employee-certification');
        }
    }

    private getAllFrequencyTrainingData(strText = '') {
        if (this.arrayFrequencyTrainingInfolist.length == 0) {
            this.arrayFrequencyTrainingInfolist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('FrequencyOfTraining', 'FrequencyOfTrainingId', 'FrequencyName', strText, true, 0, this.arrayFrequencyTrainingInfolist.join(), this.currentUserMasterCompanyId).subscribe(response => {
            this.getAllFrequencyTrainingInfodrpData = response;
        }, err => {
            this.isSpinnerVisible = false;
        });
    }

    // errorMessageHandler(log) {
    //     this.isSpinnerVisible = false;
    //     const errorLog = log;
    //     if (errorLog.error) {
    //         this.alertService.showMessage(
    //             "Validation Failed",
    //             errorLog.error,
    //             MessageSeverity.error
    //         );
    //         return;
    //     }
    //     var msg = '';
    //     if (errorLog.message) {
    //         if (errorLog.error && errorLog.error.errors.length > 0) {
    //             for (let i = 0; i < errorLog.error.errors.length; i++) {
    //                 msg = msg + errorLog.error.errors[i].message + '<br/>'
    //             }
    //         }
    //         this.alertService.showMessage(
    //             errorLog.error.message,
    //             msg,
    //             MessageSeverity.error
    //         );
    //     }
    //     else {
    //         this.alertService.showMessage(
    //             'Error',
    //             log.error,
    //             MessageSeverity.error
    //         );
    //     }
    // }

    // toGetEmployeeTrainingDocumentsList(employeeId,moduleId) {       
    //     this.commonService.GetDocumentsList(employeeId, moduleId,this.currentDeletedstatus).subscribe(res => {
    //         this.allEmployeeTrainingDocumentsList = res;
    //     })
    // }
    downloadFileUpload(rowData) {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadattachedfile?filePath=${rowData.link}`;
        window.location.assign(url);
    }

    // getEmployeeAttachmentDelete(rowData) {
    //     let attachmentDetailId = rowData.attachmentDetailId;
    //     let updatedBy = this.userName;

    //     this.commonService.GetAttachmentDeleteById(attachmentDetailId, updatedBy).subscribe(res => {
    //         this.toGetEmployeeTrainingDocumentsList(this.empId,this.empModuleId)
    //     })
    // }

    addDocumentDetails() {
        this.selectedFileAttachment = [];
        this.index = 0;
        this.disableFileAttachmentSubmit = false;
        this.isEditButton = false;
        this.documentInformation = {
            docName: '',
            docMemo: '',
            docDescription: '',
            attachmentDetailId: 0
        }
    }

    dismissDocumentPopupModel(type) {
        this.fileUploadInput.clear();
        this.closeMyModel(type);
    }

    closeMyModel(type) {
        $(type).modal("hide");
    }

    downloadFileUploadNew(link) {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadattachedfile?filePath=${link}`;
        window.location.assign(url);
    }

    fileUpload(event) {
        if (event.files.length === 0) {
            this.disableFileAttachmentSubmit = false;
        } else {
            this.disableFileAttachmentSubmit = true;
            this.enableSave();
        }

        var flag = false;
        const filesSelectedTemp = [];
        this.selectedFileAttachment = [];
        for (let file of event.files) {
            for (var i = 0; i < this.sourceViewforDocumentList.length; i++) {
                if (this.sourceViewforDocumentList[i].fileName == file.name) {
                    flag = true;
                    this.alertService.showMessage(
                        'Duplicate',
                        `Already Exists this file `,
                        MessageSeverity.warn
                    );
                    this.disableFileAttachmentSubmit = false;
                    if (this.fileUploadInput) {
                        this.fileUploadInput.clear()
                    }
                }
            }
            if (!flag) {
                filesSelectedTemp.push({
                    link: file.objectURL,
                    fileName: file.name,
                    isFileFromServer: false,
                    fileSize: file.size,
                });
                this.formData.append(file.name, file);
            }
        }
        for (var i = 0; i < filesSelectedTemp.length; i++) {
            this.selectedFileAttachment.push({
                docName: this.documentInformation.docName,
                docMemo: this.documentInformation.docMemo,
                docDescription: this.documentInformation.docDescription,
                createdBy: this.userName,
                updatedBy: this.userName,
                link: filesSelectedTemp[i].link,
                fileName: filesSelectedTemp[i].fileName,
                fileSize: filesSelectedTemp[i].fileSize,
                isFileFromServer: false,
                attachmentDetailId: 0,
            });
        }
    }

    onFileChanged(event) {
        this.selectedFile = event.target.files[0];
    }

    addDocumentInformation(type, documentInformation) {
        if (this.selectedFileAttachment != []) {
            for (var i = 0; i < this.selectedFileAttachment.length; i++) {
                this.sourceViewforDocumentList.push({
                    docName: documentInformation.docName,
                    docMemo: documentInformation.docMemo,
                    docDescription: documentInformation.docDescription,
                    link: this.selectedFileAttachment[i].link,
                    fileName: this.selectedFileAttachment[i].fileName,
                    isFileFromServer: false,
                    attachmentDetailId: 0,
                    createdBy: this.userName,
                    updatedBy: this.userName,
                    createdDate: Date.now(),
                    updatedDate: Date.now(),
                    fileSize: ((this.selectedFileAttachment[i].fileSize) / (1024 * 1024)).toFixed(2),
                })
            }
        }
        if (documentInformation.attachmentDetailId > 0 || this.index > 0) {
            for (var i = 0; i <= this.sourceViewforDocumentList.length; i++) {
                if (this.sourceViewforDocumentList[i].attachmentDetailId > 0) {

                    if (this.sourceViewforDocumentList[i].attachmentDetailId == documentInformation.attachmentDetailId) {
                        this.sourceViewforDocumentList[i].docName = documentInformation.docName;
                        this.sourceViewforDocumentList[i].docMemo = documentInformation.docMemo;
                        this.sourceViewforDocumentList[i].docDescription = documentInformation.docDescription;
                        break;
                    }
                }
                else {
                    if (i == this.index) {
                        this.sourceViewforDocumentList[i].docName = documentInformation.docName;
                        this.sourceViewforDocumentList[i].docMemo = documentInformation.docMemo;
                        this.sourceViewforDocumentList[i].docDescription = documentInformation.docDescription;
                        break;
                    }
                }
            }
            this.index = 0;
            this.isEditButton = false;
            this.disableFileAttachmentSubmit == true;
            this.dismissDocumentPopupModel(type);
        }
        this.dismissDocumentPopupModel(type)
        this.sourceViewforDocumentList = [...this.sourceViewforDocumentList]
        if (this.sourceViewforDocumentList.length > 0) {
            this.totalRecordNew = this.sourceViewforDocumentList.length;
            this.totalPagesNew = Math.ceil(this.totalRecordNew / this.pageSizeNew);
        }
        this.alertService.showMessage(
            'Success',
            `Added Attachment  Successfully`,
            MessageSeverity.success
        )
        this.index = 0;
        this.isEditButton = false;
        this.disableFileAttachmentSubmit == true;
        this.disableSave = false;
        if (this.fileUploadInput) {
            this.fileUploadInput.clear()
        }
    }

    editCustomerDocument(rowdata, index = 0) {
        this.selectedFileAttachment = [];
        this.isEditButton = true;
        this.index = index;
        this.documentInformation = rowdata;
        if (rowdata.attachmentDetailId > 0) {
            this.toGetDocumentView(rowdata.attachmentDetailId);
        }
        else {
            this.sourceViewforDocument = rowdata;
        }
    }

    deleteAttachmentRow(rowdata, index, content) {
        this.selectedRowForDelete = rowdata;
        this.rowIndex = index;
        this.modal = this.modalService.open(content, { size: 'sm' });
    }

    restoreAttachmentRow(rowdata, index, content) {
        this.selectedRowForDelete = rowdata;
        this.rowIndex = index;
        this.modal = this.modalService.open(content, { size: 'sm' });
    }

    deleteItemAndCloseModelNew() {
        let attachmentDetailId = this.selectedRowForDelete.attachmentDetailId;
        if (attachmentDetailId > 0) {
            this.commonService.GetAttachmentDeleteById(attachmentDetailId, this.userName).subscribe(res => {
                this.toGetDocumentsListNew(this.employeeId, this.empModuleId);
                this.alertService.showMessage(
                    'Success',
                    `Deleted Attachment  Successfully`,
                    MessageSeverity.success
                );
            })
        }
        else {
            this.sourceViewforDocumentList.splice(this.rowIndex, 1)
            this.totalRecordNew = this.sourceViewforDocumentList.length;
            this.totalPagesNew = Math.ceil(this.totalRecordNew / this.pageSizeNew);
        }
        this.modal.close();
    }

    restoreItemAndCloseModel() {
        let attachmentDetailId = this.selectedRowForDelete.attachmentDetailId;
        if (attachmentDetailId > 0) {
            this.commonService.GetAttachmentRestoreById(attachmentDetailId, this.userName).subscribe(res => {
                this.toGetDocumentsListNew(this.employeeId, this.empModuleId);
                this.alertService.showMessage(
                    'Success',
                    `Restored Attachment  Successfully`,
                    MessageSeverity.success
                );
            })
        }
        else {
            this.sourceViewforDocumentList.splice(this.rowIndex, 1)
            this.totalRecordNew = this.sourceViewforDocumentList.length;
            this.totalPagesNew = Math.ceil(this.totalRecordNew / this.pageSizeNew);
        }
        this.modal.close();
    }

    onUploadDocumentListNew() {
        const vdata = {
            referenceId: this.employeeId,
            masterCompanyId: this.currentUserMasterCompanyId,
            createdBy: this.userName,
            updatedBy: this.userName,
            moduleId: this.empModuleId,
        }
        for (var key in vdata) {
            this.formData.append(key, vdata[key]);
        }
        this.formData.append('attachmentdetais', JSON.stringify(this.sourceViewforDocumentList));
        this.commonService.uploadDocumentsEndpoint(this.formData).subscribe(res => {
            this.formData = new FormData();
            this.toGetDocumentsListNew(this.empId, this.empModuleId);
        }, err => {
            this.isSpinnerVisible = false;
            //const errorLog = err;
            //this.errorMessageHandler(errorLog);		
        });
    }

    toGetDocumentsListNew(id, moduleId) {
        this.commonService.GetDocumentsListNew(id, moduleId, this.currentDeletedstatus).subscribe(res => {
            this.sourceViewforDocumentList = res || [];
            this.allDocumentListOriginal = res;
            if (this.sourceViewforDocumentList.length > 0) {
                this.sourceViewforDocumentList.forEach(item => {
                    item["isFileFromServer"] = true;
                })
            }
            this.totalRecordNew = this.sourceViewforDocumentList.length;
            this.totalPagesNew = Math.ceil(this.totalRecordNew / this.pageSizeNew);
        }, err => {
            this.isSpinnerVisible = false;
            //const errorLog = err;
            //this.errorMessageHandler(errorLog);		
        });
    }

    toGetDocumentView(id) {
        this.commonService.GetAttachment(id).subscribe(res => {
            this.sourceViewforDocument = res || [];
        }, err => {
            this.isSpinnerVisible = false;
            //const errorLog = err;
            //this.errorMessageHandler(errorLog);		
        });
    }

    dateFilterForTableNew(date, field) {
        if (date !== '' && moment(date).format('MMMM DD YYYY')) {
            this.sourceViewforDocumentList = this.allDocumentListOriginal;
            const data = [...this.sourceViewforDocumentList.filter(x => {
                if (moment(x.createdDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'createdDate') {
                    return x;
                } else if (moment(x.updatedDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'updatedDate') {
                    return x;
                }
            })]
            this.sourceViewforDocumentList = data;
        } else {
            this.sourceViewforDocumentList = this.allDocumentListOriginal;
        }
    }

    dismissModel() {
        this.modal.close();
    }

    private onAuditHistoryLoadSuccessful(auditHistory, content) {
        this.alertService.stopLoadingMessage();
        this.sourceViewforDocumentAudit = auditHistory;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
    }

    private saveFailedHelper(error: any) {
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
    }

    openHistory(content, rowData) {
        this.alertService.startLoadingMessage();
        this.commonService.GetAttachmentAudit(rowData.attachmentDetailId).subscribe(
            results => this.onAuditHistoryLoadSuccessful(results, content),
            error => { this.isSpinnerVisible = false }) //this.saveFailedHelper(error));
    }

    getColorCodeForHistory(i, field, value) {
        const data = this.sourceViewforDocumentAudit;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
    }

    removeFile(event) {
        this.formData.delete(event.file.name)
        this.uploadedFileLength--;
        this.selectedFileAttachment = this.selectedFileAttachment.filter(({ fileName }) => fileName !== event.file.name);
        if (this.selectedFileAttachment.length == 0) {
            this.disableFileAttachmentSubmit = false;
        }

    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }

    formateNumber(obj) {
        obj.cost = obj.cost ? formatNumberAsGlobalSettingsModule(obj.cost, 2) : '0.00';
    }

    nextClick(nextOrPrevious) {
        this.nextOrPreviousTab = nextOrPrevious;
        // if (this.formdata.form.dirty) {  
        if (this.disableSave == false) {
            let content = this.tabRedirectConfirmationModal3;
            this.modal = this.modalService.open(content, { size: "sm" });
        }
        else {
            if (this.nextOrPreviousTab == 'Previous') {
                this.previousClick();
            } else {
                this.activeIndex = 3;
                this.employeeService.indexObj.next(this.activeIndex);
                var data = { "empId": this.empId, "firstName": this.firstName, "lastName": this.lastName };
                var stringData = JSON.stringify(data);
                var encryptedData = btoa(JSON.stringify(data));
                if (this.employeeId) {
                    this.router.navigateByUrl(`/employeesmodule/employeepages/app-employees-management-structure-edit/${this.empId}`);
                } else {
                    this.router.navigate(['/employeesmodule/employeepages/app-employees-management-structure'], { queryParams: { order: this.empId, 'firstName': this.firstName, 'lastName': this.lastName }, skipLocationChange: true });
                }
            }
        }
    }

    redirectToTabWithoutSave() {
        this.dismissModel();
        if (this.nextOrPreviousTab == 'Previous') {
            this.previousClick();
        } else {
            this.activeIndex = 3;
            this.employeeService.indexObj.next(this.activeIndex)
            this.activeIndex = 3;
            this.employeeService.indexObj.next(this.activeIndex)
            var data = { "empId": this.empId, "firstName": this.firstName, "lastName": this.lastName };
            var stringData = JSON.stringify(data);
            var encryptedData = btoa(JSON.stringify(data));
            if (this.employeeId) {
                this.router.navigateByUrl(`/employeesmodule/employeepages/app-employees-management-structure-edit/${this.empId}`);
            } else {
                this.router.navigate(['/employeesmodule/employeepages/app-employees-management-structure'], { queryParams: { order: this.empId, 'firstName': this.firstName, 'lastName': this.lastName }, skipLocationChange: true });
            }
        }

    }

    enableSaveMemo() {
        this.disableSaveMemo = false;
    }
    onClickMemo() {
        this.memoPopupContent = this.documentInformation.docMemo;
        //this.memoPopupValue = value;
        this.disableSaveMemo = true;
    }
    onClickPopupSave() {
        this.documentInformation.docMemo = this.memoPopupContent;
        this.memoPopupContent = '';
        $('#memo-popup-Doc').modal("hide");
    }
    closeMemoModel() {
        $('#memo-popup-Doc').modal("hide");
    }

    redirectToTab() {
        this.dismissModel();
        this.savetrainigSection();
        if (this.nextOrPreviousTab == 'Previous') {
            this.previousClick();
        } else {
            this.activeIndex = 3;
            this.employeeService.indexObj.next(this.activeIndex)
            this.activeIndex = 3;
            this.employeeService.indexObj.next(this.activeIndex)
            var data = { "empId": this.empId, "firstName": this.firstName, "lastName": this.lastName };
            var stringData = JSON.stringify(data);
            var encryptedData = btoa(JSON.stringify(data));
            if (this.employeeId) {
                this.router.navigateByUrl(`/employeesmodule/employeepages/app-employees-management-structure-edit/${this.empId}`);
            } else {
                this.router.navigate(['/employeesmodule/employeepages/app-employees-management-structure'], { queryParams: { order: this.empId, 'firstName': this.firstName, 'lastName': this.lastName }, skipLocationChange: true });
            }
        }
    }

    changeOfTab(event) {

    }

    enableSave() {
        if (this.sourceViewforDocumentList && this.sourceViewforDocumentList.length > 0) {
            this.disableSave = false;
        } else if (this.isEditButton == true) {
            this.disableSave = false;
        } else {
            this.disableSave = false;
        }
    }
}