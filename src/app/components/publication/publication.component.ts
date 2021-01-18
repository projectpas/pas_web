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

@Component({
    selector: 'app-publication',
    templateUrl: './publication.component.html',
    styleUrls: ['./publication.component.scss'],
    animations: [fadeInOut],
    providers: [DatePipe]
})
/** Actions component*/
export class PublicationComponent implements OnInit, AfterViewInit {
    //added by supriya
    allCustomerFinanceDocumentsListColumns: any[] = [
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
        // { field: 'delete', header: 'Delete' },
    ];
    allCustomerFinanceDocumentsList: any = [];

    sourceViewforDocumentAudit: any = [];
    //
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
    //, 'Sequence', 'createdBy', 'updatedBy', 'updatedDate', 'createdDate'
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
    /** Actions ctor */
    cols: any[];
    selectedColumns: any[];
    publicationName: string;
    filteredBrands: any[];
    localCollection: any[] = [];
    private isEditMode: boolean = false;
    private isDeleteMode: boolean = false;
    public isActive: boolean = false;
    viewCheck: boolean = true;
    // totalRecords: any=0;
    generalInfo: any;
    // pageIndex: number = 0;
    pnMappingList = [];
    aircraftList: any = [];
    ataList = [];
    formData = new FormData()
    // totalPages: number;
    publicationIdInput: string = "";
    descriptionInput: string = "";
    publicationTypeInput: string = "";
    publishbyInput: string = "";
    employeeNameInput: string = "";
    locationInput: string = "";
    lazyLoadEventDataInput: any;
    inputValue: any;
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
        //{ field: 'memo', header: 'Memo' }
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
        //{ field: 'link', header: 'Action' },
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
    constructor(private breadCrumb: SingleScreenBreadcrumbService,
        private configurations: ConfigurationService,
        private authService: AuthService, private datePipe: DatePipe, private modalService: NgbModal, private activeModal: NgbActiveModal, private _fb: FormBuilder, private alertService: AlertService, public publicationService: PublicationService, private dialog: MatDialog, private masterComapnyService: MasterComapnyService, private router: Router, public employeeService: EmployeeService, private aircraftManufacturerService: AircraftManufacturerService, private aircraftModelService: AircraftModelService, private Dashnumservice: DashNumberService, private ataMainSer: AtaMainService, private commonService: CommonService,
    ) {
        this.displayedColumns.push('action');
        this.dataSource = new MatTableDataSource();
        this.sourceAction = new Publication();

    }
    ngOnInit(): void {
        this.employeedata();

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
        ];
        this.breadCrumb.currentUrl = '/singlepages/singlepages/app-publication';
        this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);
        this.selectedColumns = this.cols;
        this.getAllAircraftManufacturer();
        this.getAllATAChapter();


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
    public allWorkFlows: Publication[] = [];

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
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            });

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
    // geListByStatus(status) {
    //     this.status = status;
    //     // this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: status };
    //     const PagingData = { ...this.lazyLoadEventDataInput, filters:{status: status} }
    //     this.loadData(PagingData);
    // }
    currentDeletedstatus: boolean = false;
    currentstatus: string = 'Active';
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
    restorerecord: any = {};
    restore(content, rowData) {
        this.restorerecord = rowData;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
        }, () => {
            // console.log('Backdrop click')
        })
    }
    restoreRecord() {
        this.commonService.updatedeletedrecords('Publication', 'PublicationRecordId', this.restorerecord.publicationRecordId).subscribe(res => {
            this.modal.close();
            this.getDeleteListByStatus(true)
            this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
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
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.masterComapnyService.getMasterCompanies().subscribe(
            results => this.onDataMasterCompaniesLoadSuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );

    }

    public applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue;
    }

    private refresh() {
        // Causes the filter to refresh there by updating with recently added data.
        this.applyFilter(this.dataSource.filter);
    }

    private onDataLoadSuccessful(allWorkFlows) {
        // alert('success');
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.dataSource.data = allWorkFlows;
        this.allpublicationInfo = allWorkFlows.map(x => {
            return {
                ...x,
                //employee: getValueFromArrayOfObjectById('firstName', 'employeeId', x.employee, this.allEmployeeinfo),
            }
        });

    }

    private onDataMasterCompaniesLoadSuccessful(allComapnies: MasterCompany[]) {
        // alert('success');
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.allComapnies = allComapnies;

    }

    private onDataLoadFailed(error: any) {
        // alert(error);
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

    }

    // open(content) {

    //     this.isEditMode = false;
    //     this.isDeleteMode = false;

    //     this.isSaving = true;
    //     this.loadMasterCompanies();
    //     this.disableSave = false;
    //     this.sourceAction = new Publication();
    //     this.sourceAction.isActive = true;
    //     this.publicationName = "";
    //     this.modal = this.modalService.open(content, { size: 'sm' });
    //     this.modal.result.then(() => {



    //         console.log('When user closes');
    //     }, () => { console.log('Backdrop click') })
    // }


    openDelete(content, row) {
        this.selectedRowforDelete = row;
        this.isEditMode = false;
        this.isDeleteMode = true;
        this.sourceAction = row;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
            // console.log('When user closes');
        }, () => {
            //  console.log('Backdrop click')
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
        // $('#view').modal('show');
        this.generalInfo = true;
        $('#step1').collapse('show');

        // console.log(row)
        //this.generalInfo = row;
        // this.sourceAction = row;
        // this.publication_Name = row.publicationId;
        // this.description = row.description;
        // this.partNumber = row.partNumber;
        // this.model = row.model;
        // this.ataMain = row.ataMain;
        // this.ataSubChapter = row.ataSubChapter;
        // this.ataPositionZone = row.ataPositionZone;
        // this.platform = row.platform;
        // this.memo = row.memo;
        // this.createdBy = row.createdBy;
        // this.updatedBy = row.updatedBy;
        // this.createdDate = row.createdDate;
        // this.updatedDate = row.updatedDate;
        this.isActive = row.isActive;
        this.isSpinnerVisible = true;
        this.loadMasterCompanies();
        this.getFilesByPublicationId(row.publicationRecordId);
        this.toGetDocumentsList(row.publicationRecordId);
        // this.modal = this.modalService.open(content, { size: 'lg' });
        // this.modal.result.then(() => {
        //     console.log('When user closes');
        // }, () => { console.log('Backdrop click') })

        //get general info
        this.publicationService.getpublicationbyIdView(row.publicationRecordId).subscribe(res => {
            this.generalInfo = res[0];

            // this.attachmentList = res[0].attachmentDetails.map(x => {
            //     return {
            //         ...x,
            //         fileName: x.fileName,
            //         //link: x.link
            //     }
            // })
            // console.log(this.attachmentList);
        })

        //get PN Mapping info
        this.publicationService.getPublicationPNMapping(row.publicationRecordId)
            .subscribe(res => {
                // console.log(res);
                this.pnMappingList = res.map(x => {
                    return {
                        ...x,
                        partNumber: x.partNumber,
                        partDescription: x.partDescription,
                        itemClassification: x.itemClassification
                    };
                });
            });

        //get aircraft info
        this.publicationService
            .getAircraftMappedByPublicationId(row.publicationRecordId)
            .subscribe(res => {
                this.aircraftList = res.map(x => {
                    return {
                        ...x,
                        aircraft: x.aircraftType,
                        model: x.aircraftModel,
                        dashNumber: x.dashNumber,
                        //memo: x.memo
                    };
                });
            });

        // get ata chapter info
        this.publicationService
            .getAtaMappedByPublicationId(row.publicationRecordId)
            .subscribe(res => {
                const responseData = res;
                this.ataList = responseData.map(x => {
                    return {
                        ...x,
                        ataChapter: `${x.ataChapterCode} - ${x.ataChapterName}`,
                        ataSubChapter: `${x.ataSubChapterCode} - ${x.ataSubChapterDescription}`,
                        // ataChapter: x.ataChapterName,
                        // ataSubChapter: x.ataSubChapterDescription,
                        // ataChapterCode: x.ataChapterCode,
                        // ataSubChapterId: x.ataSubChapterId,
                        // ataChapterId: x.ataChapterId
                    };
                });
            });
        this.isSpinnerVisible = false;
    }

    viewSelectedRowdbl(rowData) {
        this.openView(rowData);
        $('#view').modal('show');
    }


    closeDeleteModal() {
        // $("#downloadPublication").modal("hide");
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
            }
        });
        dt.exportCSV();
    }



    openDocumentsList(content, rowData) {
        this.openDocumentsList = rowData;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
    }
    // openHelpText(content) {
    //     this.modal = this.modalService.open(content, { size: 'sm' });
    //     this.modal.result.then(() => {
    //         console.log('When user closes');
    //     }, () => { console.log('Backdrop click') })
    // }
    openEdit(row) {
        this.isSpinnerVisible = true;
        const { publicationRecordId } = row;
        this.router.navigateByUrl(`/singlepages/singlepages/app-create-publication/edit/${publicationRecordId}`);
        // // this.router.navigateByUrl(`/singlepages/singlepages/app-publication/app-create-publication/edit/${publicationRecordId}`);
        // this.disableSave = false;
        // this.isEditMode = true;
        // this.isSaving = true;
        // this.loadMasterCompanies();
        // this.sourceAction = row;
        // console.log(this.sourceAction);
        // this.publicationName = this.sourceAction.publicationId;
        // this.loadMasterCompanies();        
        // this.modal = this.modalService.open(content, { size: 'sm' });
        // this.modal.result.then(() => {
        //     console.log('When user closes');
        // }, () => { console.log('Backdrop click') })
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
        this.publicationService.deleteAcion(this.sourceAction.publicationRecordId).subscribe(
            response => {
                this.loadData(this.lazyLoadEventDataInput);
                this.saveCompleted(this.sourceAction)
            },
            error => this.saveFailedHelper(error));
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

        //this.loadData();
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
                error => this.saveFailedHelper(error));
            //alert(e);
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
                error => this.saveFailedHelper(error));
            //alert(e);
        }

    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    private saveFailedHelper(error: any) {
        this.isSpinnerVisible = false;
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
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

    private employeedata() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.employeeService.getEmployeeList().subscribe(
            results => {
                // console.log(results),
                this.onempDataLoadSuccessful(results[0])
            },
            error => this.onDataLoadFailed(error)
        );
    }

    private onempDataLoadSuccessful(getEmployeeCerficationList: any[]) {
        // alert('success');
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        //this.dataSource.data = getEmployeeCerficationList;
        this.allEmployeeinfo = getEmployeeCerficationList;
    }

    publicationPagination(event: { first: any; rows: number }) {
        // console.log(event);
        const pageIndex = parseInt(event.first) / event.rows;
        this.pageIndex = pageIndex;
        this.pagesize = event.rows; //10
        event.first = pageIndex;
        this.loadData(event);
    }

    // get All AircraftManufacturer
    getAllAircraftManufacturer() {
        this.aircraftManufacturerService
            .getAll()
            .subscribe(aircraftManufacturer => {
                this.showModelAircraftModel = false;
                const responseData = aircraftManufacturer[0];
                responseData.map(x => {
                    this.airCraftTypesList.push({
                        value: x.aircraftTypeId,
                        label: x.description
                    });
                });
            });
    }

    // get AircraftModels By manufacturer Type
    async getAircraftModelByManfacturerType() {
        // construct url from array
        //await this.searchByFieldUrlCreateforAircraftInformation();
        // reset the dropdowns
        this.selectedAircraftModel = null
        this.selectedDashNumbers = null
        this.aircraftModelList = [
            { label: 'Select Aircraft Model', value: null }
        ];
        this.dashNumberList = [
            { label: 'Select Dash Number', value: null }
        ];
        // checks where select is empty or not and calls the service
        if (this.selectAircraftManfacturer !== '') {
            this.aircraftModelService
                .getAircraftModelListByManufactureId(this.selectAircraftManfacturer)
                .subscribe(models => {
                    const responseValue = models[0];
                    responseValue.map(models => {
                        this.aircraftModelList.push({
                            label: models.modelName,
                            value: models.aircraftModelId
                        });
                    });
                });
        } else {
            //this.getAllAircraftModels();
            //this.getAllDashNumbers();
        }
    }

    async getDashNumberByManfacturerandModel() {
        // construct url from array
        //await this.searchByFieldUrlCreateforAircraftInformation();
        // reset dropdown
        this.selectedDashNumbers = null
        this.dashNumberList = [
            { label: 'Select DashNumber', value: null }
        ];
        // checks where multi select is empty or not and calls the service

        if (this.selectAircraftManfacturer !== '' && this.selectedAircraftModel !== '') {
            this.Dashnumservice.getDashNumberByModelTypeId(
                this.selectedAircraftModel,
                this.selectAircraftManfacturer
            ).subscribe(dashnumbers => {
                const responseData = dashnumbers;
                responseData.map(dashnumbers => {
                    this.dashNumberList.push({
                        label: dashnumbers.dashNumber,
                        value: dashnumbers.dashNumberId
                    })
                });
            });
        }
    }

    // get ata chapter for dropdown
    getAllATAChapter() {
        this.ataMainSer.getAtaMainList().subscribe(Atachapter => {
            const response = Atachapter[0];
            response.map(x => {
                this.ataChapterList.push({
                    value: x.ataChapterId,
                    label: x.ataChapterCode + '-' + x.ataChapterName
                });
            });
        });
    }

    getSubChapterByATAChapter() {
        if (this.selectedATAchapter !== '') {
            this.ataMainSer
                .getMultiATASubDesc(this.selectedATAchapter)
                .subscribe(atasubchapter => {
                    const responseData = atasubchapter;
                    responseData.map(x => {
                        this.ataSubChapterList.push({
                            label: x.ataChapterCode + '-' + x.description,
                            value: x.ataSubChapterId
                        });
                    });
                });

        } else {
            //this.getAllSubChapters();
        }
    }

    onSearchAircraftInfoAtaChapter() {
        // console.log(this.selectedATAchapter, this.selectedATASubChapter, this.selectAircraftManfacturer, this.selectedAircraftModel, this.selectedDashNumbers, this.pageIndex, this.pagesize);
        this.selectedATAchapter = this.selectedATAchapter ? this.selectedATAchapter : 0;
        this.selectedATASubChapter = this.selectedATASubChapter ? this.selectedATASubChapter : 0;
        this.selectAircraftManfacturer = this.selectAircraftManfacturer ? this.selectAircraftManfacturer : 0;
        this.selectedAircraftModel = this.selectedAircraftModel ? this.selectedAircraftModel : 0;
        this.selectedDashNumbers = this.selectedDashNumbers ? this.selectedDashNumbers : 0;
        // console.log(this.selectedATAchapter, this.selectedATASubChapter, this.selectAircraftManfacturer, this.selectedAircraftModel, this.selectedDashNumbers, this.pageIndex, this.pagesize);
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
            this.publicationService.getpublicationslistadvancesearch(requestParams).subscribe(results => {
                // console.log(results);
                this.onDataLoadSuccessful(results[0]['results']);
                this.totalRecords = results[0]['totalRecordsCount']
                this.totalPages = Math.ceil(this.totalRecords / this.pagesize);
                // if (this.allpublicationInfo.length > 0) {
                //     this.totalRecords = this.allpublicationInfo.totalRecords;
                //     this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
                // }

            })



        }
    }

    onReset() {
        //this.loadData(this.lazyLoadEventDataInput);
        this.selectAircraftManfacturer = null;
        this.selectedAircraftModel = null;
        this.selectedDashNumbers = null;
        this.selectedATAchapter = null;
        this.selectedATASubChapter = null;
        this.advanceSearchReq = {};
        this.inputValue = '';
        this.lazyLoadEventDataInput.filters = {};
        this.loadData(this.lazyLoadEventDataInput);
        // this.publicationService.getWorkFlows(this.lazyLoadEventDataInput).subscribe(
        //     results => {
        //         console.log(results);
        //         this.onDataLoadSuccessful(results[0]);
        //         this.totalRecords = results[0][0]['totalRecords'];
        //         this.totalPages = Math.ceil(this.totalRecords / this.pagesize);
        //     },
        //     error => this.onDataLoadFailed(error)
        // );
        // this.publicationService.getWorkFlows(this.pageIndex, this.pagesize).subscribe(
        //     results => {
        //         this.onDataLoadSuccessful(results[0]['paginationList']);
        //         console.log(results[0]['totalRecordsCount']);
        //         this.totalRecords = results[0]['totalRecordsCount'];
        //     },
        //     error => this.onDataLoadFailed(error)
        // );        
    }

    downloadFileUpload(rowData) {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadattachedfile?filePath=${rowData.link}`;

        window.location.assign(url);

        // window.location.pathname = 'file:///C:/DevFiles/UplodFiles/Publication/162.png';
        // window.location.

        //const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=itemGroup&fileName=itemGroup.xlsx`;

        //window.location.assign(url);
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
        //const { customerShippingAddressId } = rowData.customerShippingAddressId;
        //const { customerShippingId } = rowData.customerShippingId;

        this.commonService.GetAttachmentPublicationAudit(rowData.attachmentDetailId).subscribe(
            res => {
                this.sourceViewforDocumentAudit = res;
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
        this.publicationService.getFilesBypublicationNew(publicationRecordId).subscribe(res => {

            //this.customerService.GetCustomerFinanceDocumentsList(customerId, moduleId).subscribe(res => {
            this.allCustomerFinanceDocumentsList = res;
        })
    }

    getAuditHistoryById(rowData) {
        this.publicationService.getPublicationAuditDetails(rowData.publicationRecordId).subscribe(res => {
            this.auditHistory = res;
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
        const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
        this.publicationService.getWorkFlows(PagingData).subscribe(
            results => {
                //this.onDataLoadSuccessful(results[0]['paginationList']);
                this.onDataLoadSuccessful(results[0]);
                //console.log(results[0]['totalRecordsCount']);
                this.totalRecords = results[0][0]['totalRecords'];
                this.totalPages = Math.ceil(this.totalRecords / this.pagesize);
            },
            error => this.onDataLoadFailed(error)
        );
    }
    enableDisableAdvancedSearch(val) {
        this.showAdvancedSearchCard = val;
        this.onReset();
    }

    getFilesByPublicationId(publicationRecordId) {

        this.publicationService.getFilesBypublication(publicationRecordId).subscribe(res => {
            this.attachmentList = res || [];
            if (this.attachmentList.length > 0) {
                this.attachmentList.forEach(item => {
                    item["isFileFromServer"] = true;
                    item.attachmentDetails.forEach(fItem => {
                        fItem["isFileFromServer"] = true;
                    })
                })
            }
        });
    }

}
