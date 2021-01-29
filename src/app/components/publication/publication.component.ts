import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { fadeInOut } from '../../services/animations';
import { MasterComapnyService } from '../../services/mastercompany.service';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { MasterCompany } from '../../models/mastercompany.model';
import { Publication } from '../../models/publication.model';
import { PublicationService } from '../../services/publication.service';
import { AuditHistory } from '../../models/audithistory.model';
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
import { SingleScreenAuditDetails } from "../../models/single-screen-audit-details.model";
import { Router } from '@angular/router';
import { listSearchFilterObjectCreation } from '../../generic/autocomplete';
import { EmployeeService } from '../../services/employee.service';
import { AircraftManufacturerService } from '../../services/aircraft-manufacturer/aircraftManufacturer.service';
import { AircraftModelService } from '../../services/aircraft-model/aircraft-model.service';
import { DashNumberService } from '../../services/dash-number/dash-number.service';
import { AtaMainService } from '../../services/atamain.service';
declare var $: any;
import { DatePipe } from '@angular/common';
import { ConfigurationService } from '../../services/configuration.service';
import { CommonService } from '../../services/common.service';
import { MenuItem } from 'primeng/api';
// import { truncate } from 'fs';

@Component({
    selector: 'app-publication',
    templateUrl: './publication.component.html',
    styleUrls: ['./publication.component.scss'],
    animations: [fadeInOut],
    providers: [DatePipe]
})
export class PublicationComponent implements OnInit, AfterViewInit {
    allCustomerFinanceDocumentsLicurrentDeletedstatuscurrentDeletedstatusstColumns: any[] = [
        { field: 'tagTypeName', header: 'Tag Type' },

        { field: 'docName', header: 'Name' },
        { field: 'docDescription', header: 'Description' },
        { field: 'docMemo', header: 'Memo' },

        { field: "fileName", header: "File Name" },
        { field: 'fileSize', header: 'File Size' },

        { field: 'createdDate', header: 'Created Date' },
        { field: 'createdBy', header: 'CreatedBy' },
        { field: 'updatedDate', header: 'Updated Date' },
        { field: 'updatedBy', header: 'UpdatedBy' },
        { field: 'download', header: 'Actions' },
    ];
    allCustomerFinanceDocumentsList: any = [];

    sourceViewforDocumentAudit: any = [];
    pageSize: number = 10;
    pageIndex: number = 0;
    totalRecords: number = 0;
    totalPages: number = 0;
    allpublic: any[] = [];
    selectedreason: any;
    publication_Name: any = "";
    description: any = "";
    partNumber: any = "";
    model: any = "";
    ataMain: any = "";
    ataSubChapter: any = "";
    ataPositionZone: any = "";
    platform: any = "";
    memo: any = "";
    createdBy: any = "";
    selectedOnly: boolean = false;
    targetData: any;
    updatedBy: any = "";
    createdDate: any = "";
    updatedDate: any = "";
    disableSave: boolean = false;
    allEmployeeinfo: any[] = [];
    AuditDetails: SingleScreenAuditDetails[];
    auditHistory: AuditHistory[];
    Active: string = "Active";
    isSpinnerVisible: Boolean = false;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    displayedColumns = ['PublicationId', 'PartNumber', 'description'];
    dataSource: MatTableDataSource<Publication>;
    allpublicationInfo: any = [];
    allComapnies: MasterCompany[] = [];
    private isSaving: boolean;
    public sourceAction: Publication;
    private bodyText: string;
    loadingIndicator: boolean;
    closeResult: string;
    selectedColumn: Publication[];
    title: string = "Create";
    id: number;
    errorMessage: any;
    modal: NgbModalRef;
    cols: any[];
    auditCols: any[];
    selectedRow: any;
    publicationRecordId: any;
    selectedColumns: any[];
    publicationName: string;
    filteredBrands: any[];
    localCollection: any[] = [];
    private isEditMode: boolean = false;
    private isDeleteMode: boolean = false;
    public isActive: boolean = false;
    viewCheck: boolean = true;
    generalInfo: any;
    pnMappingList = [];
    aircraftList: any = [];
    ataList = [];
    formData = new FormData()
    publicationIdInput: string = "";
    descriptionInput: string = "";
    publicationTypeInput: string = "";
    publishbyInput: string = "";
    employeeNameInput: string = "";
    locationInput: string = "";
    lazyLoadEventDataInput: any;
    inputValue: any;

    viewAircraftData: any = {};
    viewAtaData: any = {};

    breadcrumbs: MenuItem[];
    home: any;
    headersforPNMapping = [
        { field: 'partNumber', header: 'PN' },
        { field: 'partDescription', header: 'PN Description' },
        { field: 'itemClassification', header: 'Item Classification' },
        { field: 'manufacturerName', header: 'Manufacturer' },
        { field: 'itemGroup', header: 'Item Group' }
    ];
    aircraftInformationCols: any[] = [
        { field: 'partNumber', header: 'PN Number' },
        { field: 'partDescription', header: 'PN Description' },
        { field: 'manufacturerName', header: 'Manufacturer' },
        { field: 'itemGroup', header: 'Item Group' },
        { field: 'aircraft', header: 'Aircraft' },
        { field: 'model', header: 'Model' },
        { field: 'dashNumber', header: 'Dash Numbers' },
    ];
    atacols = [
        { field: 'partNumber', header: 'PN Number' },
        { field: 'partDescription', header: 'PN Description' },
        { field: 'manufacturerName', header: 'Manufacturer' },
        { field: 'itemGroup', header: 'Item Group' },
        { field: 'ataChapter', header: 'ATA Chapter' },
        { field: 'ataSubChapter', header: 'ATA SubChapter' }
    ];
    headersforAttachment = [
        { field: 'tagTypeName', header: 'Tag Type' }
    ];


    first: number = 0;
    pagesize: number = 10;
    attachmentsPageSize: number = 3;
    pnMappingPageSize: number = 10;
    aircraftPageSize: number = 10;
    ataPageSize: number = 10;
    attachmentList: any[] = [];
    showModelAircraftModel: boolean = false;
    selectedAircraftModel: any;
    selectedDashNumbers: any;
    selectAircraftManfacturer: any;
    selectedATAchapter: any;
    selectedATASubChapter: any;
    airCraftTypesList = [
        { label: 'Select Aircraft', value: null }
    ];
    aircraftModelList = [
        { label: 'Select Aircraft Model', value: null }
    ];
    dashNumberList = [
        { label: 'Select Dash Number', value: null }
    ];
    ataChapterList = [
        { label: 'Select ATA Chapter', value: null }
    ];
    ataSubChapterList = [
        { label: 'Select ATA SubChapter', value: null }
    ];
    selectedRowforDelete: any;
    showAdvancedSearchCard: boolean = false;
    lazyLoadEventData: any;
    viewType: any = 'mpn';
    advanceSearchReq: any = {};
    status: string = 'active';
    documentsContent: any;
    moduleName: any = 'Publication';

    currentDeletedstatus: boolean = false;
    currentPnMappingDeletedstatus: boolean = false;
    currentstatus: string = 'Active';
    public allWorkFlows: Publication[] = [];
    restorerecord: any = {};
    constructor(private breadCrumb: SingleScreenBreadcrumbService,
        private configurations: ConfigurationService,
        private authService: AuthService, private datePipe: DatePipe, private modalService: NgbModal, private activeModal: NgbActiveModal, private _fb: FormBuilder, private alertService: AlertService, public publicationService: PublicationService, private dialog: MatDialog, private masterComapnyService: MasterComapnyService, private router: Router, public employeeService: EmployeeService, private aircraftManufacturerService: AircraftManufacturerService, private aircraftModelService: AircraftModelService, private Dashnumservice: DashNumberService, private ataMainSer: AtaMainService, private commonService: CommonService,
    ) {
        this.displayedColumns.push('action');
        this.dataSource = new MatTableDataSource();
        this.sourceAction = new Publication();

    }
    ngOnInit(): void {
        this.breadcrumbs = [
            { label: 'Publications' },
            { label: 'Publications List' },
        ];
        this.cols = [
            { field: 'partNos', header: 'PN' },
            { field: 'pnDescription', header: 'PN Description' },
            { field: 'revisionNum', header: 'Revision Num' },
            { field: 'publicationId', header: 'Pub ID' },
            { field: 'description', header: 'Pub Description' },
            { field: 'publicationType', header: 'Pub Type' },
            { field: 'publishedBy', header: 'Published By' },
            { field: 'revisionDate', header: 'Revision Date' },
            { field: 'nextReviewDate', header: 'Next Review Date' },
            { field: 'expirationDate', header: 'Expiration Date' },
            { field: 'location', header: 'Location' },
            { field: 'verifiedBy', header: 'Verified By' },
            { field: 'verifiedDate', header: 'Verified Date' },
            { field: 'createdDate', header: 'Created Date' },
            { field: 'createdBy', header: 'CreatedBy' },
            { field: 'updatedDate', header: 'Updated Date' },
            { field: 'updatedBy', header: 'UpdatedBy' },
        ];

        this.auditCols = [
            { field: 'partNos', header: 'PN' },
            { field: 'pnDescription', header: 'PN Description' },
            { field: 'revisionNum', header: 'Revision Num' },
            { field: 'publicationId', header: 'Pub ID' },
            { field: 'description', header: 'Pub Description' },
            { field: 'publicationType', header: 'Pub Type' },
            { field: 'publishedBy', header: 'Published By' },
            { field: 'location', header: 'Location' },
            { field: 'verifiedByName', header: 'Verified By' },
            { field: 'verifiedDate', header: 'Verified Date' },
        ];
        this.breadCrumb.currentUrl = '/singlepages/singlepages/app-publication';
        this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);
        this.selectedColumns = this.cols;


    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }
    pageIndexChange(event) {
        this.pageSize = event.rows;
    }
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    private loadData(data) {
        this.isSpinnerVisible = true;
        this.lazyLoadEventDataInput = data;
        const isdelete = this.currentDeletedstatus ? true : false;
        data.filters['viewType'] = this.viewType;
        data.filters['status'] = this.status ? this.status : this.currentstatus;
        data.filters['isDeleted'] = isdelete;
        const PagingData = { ...data, filters: listSearchFilterObjectCreation(data.filters) }
        this.publicationService.getPublications(PagingData).subscribe(
            results => {
                this.onDataLoadSuccessful(results[0]['results']);
                this.totalRecords = results[0]['totalRecordsCount']
                this.totalPages = Math.ceil(this.totalRecords / this.pagesize);
                this.isSpinnerVisible = false;
            }, err => {
                this.isSpinnerVisible = false;
            });

    }

    changeOfDocumentStatus(status) {
    }

    errorMessageHandler(log) {
        this.alertService.showMessage(
            'Error',
            log.error,
            MessageSeverity.error
        );
    }
    changeOfStatus(status, viewType) {
        const lazyEvent = this.lazyLoadEventDataInput;
        this.viewType = viewType === '' ? this.viewType : viewType;
        this.isSpinnerVisible = true;
        this.loadData({
            ...lazyEvent,
            filters: {
                ...lazyEvent.filters,
                viewType: this.viewType
            }
        })

    }
    getVenListByStatus(status) {
        this.status = status;
        this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: status };
        const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
        this.isSpinnerVisible = true;
        this.loadData(PagingData);
    }
    getDeleteListByStatus(value) {
        this.currentDeletedstatus = true;
        const pageIndex = parseInt(this.lazyLoadEventDataInput.first) / this.lazyLoadEventDataInput.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = pageIndex;
        this.status = status;
        this.isSpinnerVisible = true;
        if (value == true) {
            this.currentstatus = "ALL";

            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: "ALL" };
            const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
            this.loadData(PagingData)
        } else {
            this.currentDeletedstatus = false;
            this.currentstatus = "ALL"
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: "ALL" };
            const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
            this.loadData(PagingData);
        }
    }
    restore(content, rowData) {
        this.restorerecord = rowData;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
        }, () => {
        })
    }
    restoreRecord() {
        this.isSpinnerVisible = true;
        this.commonService.updatedeletedrecords('Publication', 'PublicationRecordId', this.restorerecord.publicationRecordId).subscribe(res => {
            this.modal.close();
            this.isSpinnerVisible = false;
            this.getDeleteListByStatus(true)
            this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
        }, error => {
            this.isSpinnerVisible = false;
        })
    }
    eventHandler(event) {
        let value = event.target.value.toLowerCase()
        if (this.selectedreason) {
            if (value == this.selectedreason.toLowerCase()) {
                this.disableSave = true;
            }
            else {
                this.disableSave = false;
            }
        }
    }


    publicationId(event) {
        for (let i = 0; i < this.allpublic.length; i++) {
            if (event == this.allpublic[i][0].publicationName) {

                this.disableSave = true;
                this.selectedreason = event;
            }
        }
    }


    private loadMasterCompanies() {
        this.isSpinnerVisible = true;
        this.masterComapnyService.getMasterCompanies().subscribe(
            results => {
                this.onDataMasterCompaniesLoadSuccessful(results[0])

                this.isSpinnerVisible = false;
            },
            error => {
                this.onDataLoadFailed(error)

                this.isSpinnerVisible = false;
            }
        );

    }

    public applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue;
    }

    private refresh() {
        this.applyFilter(this.dataSource.filter);
    }

    private onDataLoadSuccessful(allWorkFlows) {

        this.dataSource.data = allWorkFlows;
        this.allpublicationInfo = allWorkFlows.map(x => {
            return {
                ...x,
            }
        });

    }

    private onDataMasterCompaniesLoadSuccessful(allComapnies: MasterCompany[]) {
        this.allComapnies = allComapnies;

    }

    private onDataLoadFailed(error: any) {

    }

    openDelete(content, row) {
        this.selectedRowforDelete = row;
        this.isEditMode = false;
        this.isDeleteMode = true;
        this.sourceAction = row;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
        }, () => {
        })
    }

    openStep1() {
        $('#step1').collapse('show');
    }

    openAllCollapse() {
        $('#step1').collapse('show');
        $('#step2').collapse('show');
        $('#step3').collapse('show');
        $('#step4').collapse('show');
    }
    closeAllCollapse() {
        $('#step1').collapse('hide');
        $('#step2').collapse('hide');
        $('#step3').collapse('hide');
        $('#step4').collapse('hide');
    }

    openView(row) {
        this.closeAllCollapse();
        this.generalInfo = true;
        $('#step1').collapse('show');
        this.isActive = row.isActive;
        this.isSpinnerVisible = true;
        this.loadMasterCompanies();
        this.getFilesByPublicationId(row.publicationRecordId);
        this.publicationRecordId = row.publicationRecordId;
        this.toGetDocumentsList(row.publicationRecordId);
        this.publicationService.getpublicationbyIdView(row.publicationRecordId).subscribe(res => {
            this.isSpinnerVisible = false;
            this.generalInfo = res[0];
        }, error => {
            this.isSpinnerVisible = false;
        })

        this.isSpinnerVisible = true;

        this.publicationService.getPublicationPNMapping(row.publicationRecordId)
            .subscribe(res => {
                this.isSpinnerVisible = false;

                this.pnMappingList = res.map(x => {
                    return {
                        ...x,
                        partNumber: x.partNumber,
                        partDescription: x.partDescription,
                        itemClassification: x.itemClassification,
                        manufacturer: x.manufacturerName
                    };
                }, error => {
                    this.isSpinnerVisible = false;
                });
            });

        this.isSpinnerVisible = true;

        this.publicationService
            .getAircraftMappedByPublicationId(row.publicationRecordId)
            .subscribe(res => {
                this.isSpinnerVisible = false;

                this.aircraftList = res.map(x => {
                    return {
                        ...x,
                        aircraft: x.aircraftType,
                        model: x.aircraftModel,
                        dashNumber: x.dashNumber,
                    };
                });
                if (this.aircraftList && this.aircraftList.length > 0) {
                    this.aircraftList.forEach((airCraft, index) => {
                        if (this.aircraftList[index].dashNumber.toLowerCase() == 'unknown') {
                            this.aircraftList[index].dashNumber = '';
                        }
                        if (this.aircraftList[index].model.toLowerCase() == 'unknown') {
                            this.aircraftList[index].model = '';
                        }
                    });
                }
            }, error => {
                this.isSpinnerVisible = false;
            });

        this.isSpinnerVisible = true;
        this.publicationService
            .getAtaMappedByPublicationId(row.publicationRecordId)
            .subscribe(res => {
                this.isSpinnerVisible = false;
                const responseData = res;
                this.ataList = responseData.map(x => {
                    return {
                        ...x,
                        ataChapter: `${x.ataChapterCode} - ${x.ataChapterName}`,
                        ataSubChapter: `${x.ataSubChapterCode} - ${x.ataSubChapterDescription}`,
                    };
                });
            }, error => {
                this.isSpinnerVisible = false;
            });
        this.isSpinnerVisible = false;
    }

    viewSelectedRowdbl(rowData) {
        this.openView(rowData);
        $('#view').modal('show');
    }


    closeDeleteModal() {
        $("#downloadConfirmation").modal("hide");
    }

    exportCSV(dt) {
        dt._value = dt._value.map(x => {
            return {
                ...x,
                revisionDate: x.revisionDate ? this.datePipe.transform(x.revisionDate, 'MMM-dd-yyyy hh:mm a') : '',
                nextReviewDate: x.nextReviewDate ? this.datePipe.transform(x.nextReviewDate, 'MMM-dd-yyyy hh:mm a') : '',
                expirationDate: x.expirationDate ? this.datePipe.transform(x.expirationDate, 'MMM-dd-yyyy hh:mm a') : '',
                verifiedDate: x.verifiedDate ? this.datePipe.transform(x.verifiedDate, 'MMM-dd-yyyy hh:mm a') : '',
                createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a') : '',
                updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a') : '',
            }
        });
        dt.exportCSV();
    }



    openDocumentsList(content, rowData) {
        this.selectedRow = rowData;
        this.publicationRecordId = rowData.publicationRecordId;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
    }
    openEdit(row) {
        this.isSpinnerVisible = true;
        const { publicationRecordId } = row;
        this.router.navigateByUrl(`/singlepages/singlepages/app-publication/edit/${publicationRecordId}`);
    }


    filterpublications(event) {

        this.localCollection = [];
        for (let i = 0; i < this.allpublicationInfo.length; i++) {
            let publicationName = this.allpublicationInfo[i].publicationId;
            if (publicationName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.allpublic.push([{
                    "publicationId": this.allpublicationInfo[i].publicationId,
                    "publicationName": publicationName
                }]),
                    this.localCollection.push(publicationName);
            }
        }
    }

    deleteItemAndCloseModel() {
        this.isSaving = true;
        this.sourceAction.updatedBy = this.userName;
        this.isSpinnerVisible = true;
        this.publicationService.deleteAcion(this.sourceAction.publicationRecordId).subscribe(
            response => {
                this.isSpinnerVisible = false;
                this.loadData(this.lazyLoadEventDataInput);
                this.saveCompleted(this.sourceAction)
            },
            error => {

                this.isSpinnerVisible = false;
                this.saveFailedHelper(error)
            })
            ;
        this.modal.close();
    }

    dismissModel() {
        this.isDeleteMode = false;
        this.isEditMode = false;
        this.modal.close();
    }

    private saveCompleted(user?: Publication) {
        this.isSaving = false;

        if (this.isDeleteMode == true) {
            this.alertService.showMessage("Success", `Action was deleted successfully`, MessageSeverity.success);
            this.isDeleteMode = false;
        }
        else {
            this.alertService.showMessage("Success", `Action was edited successfully`, MessageSeverity.success);

        }
    }

    handleChange(rowData, e) {
        if (e.checked == false) {
            this.isSpinnerVisible = true;
            this.sourceAction = rowData;
            this.sourceAction.updatedBy = this.userName;
            this.Active = "In Active";
            this.sourceAction.isActive == false;
            this.publicationService.publicationStatus(this.sourceAction.publicationRecordId, false, this.userName).subscribe(
                response => {
                    this.saveCompleted(this.sourceAction);
                    const lazyEvent = this.lazyLoadEventDataInput;
                    this.loadData({
                        ...lazyEvent,
                        filters: {
                            ...lazyEvent.filters,
                            viewType: this.viewType,
                            status: this.status
                        }
                    });
                    this.isSpinnerVisible = false;
                },
                error => {
                    this.saveFailedHelper(error)
                    this.isSpinnerVisible = false;
                });
        }
        else {
            this.isSpinnerVisible = true;
            this.sourceAction = rowData;
            this.sourceAction.updatedBy = this.userName;
            this.Active = "Active";
            this.sourceAction.isActive == true;
            this.publicationService.publicationStatus(this.sourceAction.publicationRecordId, true, this.userName).subscribe(
                response => {
                    this.saveCompleted(this.sourceAction);
                    const lazyEvent = this.lazyLoadEventDataInput;
                    this.loadData({
                        ...lazyEvent,
                        filters: {
                            ...lazyEvent.filters,
                            viewType: this.viewType,
                            status: this.Active
                        }
                    });
                    this.isSpinnerVisible = false;
                },
                error => {
                    this.saveFailedHelper(error)
                    this.isSpinnerVisible = false;
                });
        }

    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    private saveFailedHelper(error: any) {
        this.isSpinnerVisible = false;
        this.isSaving = false;
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }


    publicationPagination(event: { first: any; rows: number }) {
        const pageIndex = parseInt(event.first) / event.rows;
        this.pageIndex = pageIndex;
        this.pagesize = event.rows; //10
        event.first = pageIndex;
        this.loadData(event);
    }

    async getAircraftModelByManfacturerType() {
        this.selectedAircraftModel = null
        this.selectedDashNumbers = null
        this.aircraftModelList = [
            { label: 'Select Aircraft Model', value: null }
        ];
        this.dashNumberList = [
            { label: 'Select Dash Number', value: null }
        ];
        if (this.selectAircraftManfacturer !== '') {

            this.isSpinnerVisible = true;
            this.aircraftModelService
                .getAircraftModelListByManufactureId(this.selectAircraftManfacturer)
                .subscribe(models => {
                    this.isSpinnerVisible = false;
                    const responseValue = models[0];
                    responseValue.map(models => {
                        this.aircraftModelList.push({
                            label: models.modelName,
                            value: models.aircraftModelId
                        });
                    });
                }, error => {

                    this.isSpinnerVisible = false;
                });
        } else {
        }
    }

    async getDashNumberByManfacturerandModel() {
        this.selectedDashNumbers = null
        this.dashNumberList = [
            { label: 'Select DashNumber', value: null }
        ];

        if (this.selectAircraftManfacturer !== '' && this.selectedAircraftModel !== '') {
            this.isSpinnerVisible = true;
            this.Dashnumservice.getDashNumberByModelTypeId(
                this.selectedAircraftModel,
                this.selectAircraftManfacturer
            ).subscribe(dashnumbers => {
                const responseData = dashnumbers;
                this.isSpinnerVisible = false;
                responseData.map(dashnumbers => {
                    this.dashNumberList.push({
                        label: dashnumbers.dashNumber,
                        value: dashnumbers.dashNumberId
                    })
                });
            }, error => {
                this.isSpinnerVisible = false;
            });
        }
    }

    getSubChapterByATAChapter() {
        if (this.selectedATAchapter !== '') {

            this.isSpinnerVisible = true;
            this.ataMainSer
                .getMultiATASubDesc(this.selectedATAchapter)
                .subscribe(atasubchapter => {
                    this.isSpinnerVisible = false;
                    const responseData = atasubchapter;
                    responseData.map(x => {
                        this.ataSubChapterList.push({
                            label: x.ataChapterCode + '-' + x.description,
                            value: x.ataSubChapterId
                        });
                    });
                }, error => {
                    this.isSpinnerVisible = false;
                });

        } else {
        }
    }

    onSearchAircraftInfoAtaChapter() {
        this.selectedATAchapter = this.selectedATAchapter ? this.selectedATAchapter : 0;
        this.selectedATASubChapter = this.selectedATASubChapter ? this.selectedATASubChapter : 0;
        this.selectAircraftManfacturer = this.selectAircraftManfacturer ? this.selectAircraftManfacturer : 0;
        this.selectedAircraftModel = this.selectedAircraftModel ? this.selectedAircraftModel : 0;
        this.selectedDashNumbers = this.selectedDashNumbers ? this.selectedDashNumbers : 0;
        if (this.selectAircraftManfacturer !== undefined || this.selectedATAchapter !== undefined) {
            const requestParams = {

                first: 0,
                rows: 10,
                sortOrder: 1,
                filters: {
                    ViewType: this.viewType,
                    ataChapterId: this.selectedATAchapter ? this.selectedATAchapter : 0,
                    ataSubChapterId: this.selectedATASubChapter ? this.selectedATASubChapter : 0,
                    airCraftId: this.selectAircraftManfacturer ? this.selectAircraftManfacturer : 0,
                    modelId: this.selectedAircraftModel ? this.selectedAircraftModel : 0,
                    dashNumberId: this.selectedDashNumbers ? this.selectedDashNumbers : 0,
                    partNos: this.advanceSearchReq.partNos,
                    PNDescription: this.advanceSearchReq.PNDescription
                }

            }

            this.isSpinnerVisible = true;
            this.publicationService.getpublicationslistadvancesearch(requestParams).subscribe(results => {
                this.isSpinnerVisible = false;
                this.onDataLoadSuccessful(results[0]['results']);
                this.totalRecords = results[0]['totalRecordsCount']
                this.totalPages = Math.ceil(this.totalRecords / this.pagesize);


            }, error => {
                this.isSpinnerVisible = false;
            })



        }
    }

    onReset() {
        this.selectAircraftManfacturer = null;
        this.selectedAircraftModel = null;
        this.selectedDashNumbers = null;
        this.selectedATAchapter = null;
        this.selectedATASubChapter = null;
        this.advanceSearchReq = {};
        this.inputValue = '';
        this.lazyLoadEventDataInput.filters = {};
        this.loadData(this.lazyLoadEventDataInput);

    }

    downloadFileUpload(rowData) {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadattachedfile?filePath=${rowData.link}`;

        window.location.assign(url);

    }

    sampleExcelDownload() {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=Publication&fileName=publication.xlsx`;
        window.location.assign(url);
    }

    customExcelUpload(event) {
        const file = event.target.files;

        if (file.length > 0) {

            this.formData.append('file', file[0])
            this.publicationService.publicationFileUpload(this.formData).subscribe(res => {
                event.target.value = '';

                this.formData = new FormData();
                this.loadData(this.lazyLoadEventDataInput);
                this.alertService.showMessage(
                    'Success',
                    `Successfully Uploaded  `,
                    MessageSeverity.success
                );
            })
        }
    }
    openHistoryDoc(rowData) {

        this.isSpinnerVisible = true;
        this.commonService.GetAttachmentPublicationAudit(rowData.attachmentDetailId).subscribe(
            res => {
                this.isSpinnerVisible = false;
                this.sourceViewforDocumentAudit = res;
            }, error => {
                this.isSpinnerVisible = false;
            })

    }

    getColorCodeForHistoryDoc(i, field, value) {
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
    toGetDocumentsList(publicationRecordId) {
        var moduleId = 50;
        this.isSpinnerVisible = true;
        this.publicationService.getFilesBypublicationNew(publicationRecordId).subscribe(res => {
            this.isSpinnerVisible = false;
            this.allCustomerFinanceDocumentsList = res;
        }, error => {
            this.isSpinnerVisible = false;
        })
    }

    getAuditHistoryById(rowData) {
        this.isSpinnerVisible = true;
        this.publicationService.getPublicationAuditDetails(rowData.publicationRecordId).subscribe(res => {
            this.isSpinnerVisible = false;
            this.auditHistory = res;
        }, error => {
            this.isSpinnerVisible = false;
        })
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
    dismissDocumentPopupModel(type) {

        this.closeMyModel(type);

    }
    closeMyModel(type) {

        $(type).modal("hide");

    }


    onChangeInputField(value, field) {
        this.isSpinnerVisible = true;
        const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
        this.publicationService.getWorkFlows(PagingData).subscribe(
            results => {

                this.isSpinnerVisible = false;
                this.onDataLoadSuccessful(results[0]);
                this.totalRecords = results[0][0]['totalRecords'];
                this.totalPages = Math.ceil(this.totalRecords / this.pagesize);
            },
            error => {
                this.isSpinnerVisible = false;
                this.onDataLoadFailed(error)
            }
        );
    }
    enableDisableAdvancedSearch(val) {
        this.showAdvancedSearchCard = val;
        this.onReset();
    }

    getFilesByPublicationId(publicationRecordId) {

        this.isSpinnerVisible = true;
        this.publicationService.getFilesBypublication(publicationRecordId).subscribe(res => {

            this.isSpinnerVisible = false;
            this.attachmentList = res || [];
            if (this.attachmentList.length > 0) {
                this.attachmentList.forEach(item => {
                    item["isFileFromServer"] = true;
                    item.attachmentDetails.forEach(fItem => {
                        fItem["isFileFromServer"] = true;
                    })
                })
            }
        }, error => {
            this.isSpinnerVisible = false;
        });
    }


    getPnMappingDeleteListByStatus() {
        this.isSpinnerVisible = true;
        this.publicationService
            .getPublicationPNMapping(this.publicationRecordId, !this.currentPnMappingDeletedstatus)
            .subscribe(res => {
                this.isSpinnerVisible = false;
                this.pnMappingList = res.map(x => {
                    return {
                        ...x,
                        partNumber: x.partNumber,
                        partDescription: x.partDescription,
                        itemClassification: x.itemClassification,
                        manufacturer: x.manufacturerName
                    };
                });
            }, error => {

                this.isSpinnerVisible = true;
            });

    }
    closeModal() {
        this.viewAircraftData = {};
        if (this.modal) {
            this.modal.close()
        }
    }

    openAircraftView(rowData, content) {
        this.viewAircraftData = rowData;
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {
        }, () => { })
    }
    openAtaView(rowData, content) {
        this.viewAtaData = rowData;
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {
        }, () => { })
    }
}
