import { Component, ViewChild, OnInit, SimpleChanges, AfterViewInit, Input, EventEmitter, Output } from '@angular/core';
import { AtaSubChapter1Service } from '../../../services/atasubchapter1.service';
import { AtaMainService } from '../../../services/atamain.service';
import { getValueFromObjectByKey, getObjectByValue, getValueFromArrayOfObjectById } from '../../../generic/autocomplete';
import { AuthService } from '../../../services/auth.service';
import { CustomerService } from '../../../services/customer.service';
import { MessageSeverity, AlertService } from '../../../services/alert.service';
declare var $ : any;
import { DatePipe } from '@angular/common';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-customer-ata',
    templateUrl: './customer-ata.component.html',
    styleUrls: ['./customer-ata.component.scss'],
    providers: [DatePipe]
})
/** anys component*/
export class CustomerATAInformationComponent implements OnInit {
    @Input() savedGeneralInformationData;
    @Input() editGeneralInformationData;
    @Input() editMode;
    @Input() search_ataChapterList;
    @Input() ataListDataValues = [];
    @Input() contactList;
    @Input() selectedTab: string = "";
    @Input() selectedCustomerTab: string = '';
    @Input() customerDataFromExternalComponents: any;
    @Output() tab = new EventEmitter();
    @Output() refreshCustomerATAMapped = new EventEmitter();
    @Output() getMappedContactByCustomerId = new EventEmitter();
    ataChapter: any;
    selectedOnly: boolean = false;
    targetData: any;
    currentstatus: string = 'Active';
    currentDeletedstatus:boolean=false;
    atasubchapterValues: any;
    ataChapterList: { value: any; label: string; }[];
    search_SelectedATA = []
    search_SelectedContact = []
    search_SelectedATASubChapter = []
    ataHeaders = [
        { field: 'firstName', header: 'Contact' },
        { field: 'ataChapterName', header: 'ATA Chapter' },
        { field: 'ataSubChapterDescription', header: 'ATA Sub-Chapter' },
        { field: 'createdDate', header: 'Created Date' },
        { field: 'createdBy', header: 'Created By' } , 
        { field: 'updatedDate', header: 'Updated Date' },
        { field: 'updatedBy', header: 'Updated By' },                    
    ]
    showAdvancedSearchCard: boolean = false;
    selectedColumns = this.ataHeaders;
    ataChapterIdUrl: string;
    contactIdUrl: string;
    ataSubchapterIdUrl: any;
    search_ataSubChapterList: any;
    id: number;
    isViewMode: boolean = false;
    contactid: number;
    searchATAParams: string;
    customerName: any;
    customerCode: any;
    modal: NgbModalRef;
    hypen: any = "-";
    isDeleteMode: boolean = false;
    isSpinnerVisible: boolean = false;
    public sourceCustomer: any = {}
    customerContactATAMappingId: number;
    selectedRowForDelete: any;    
    totalRecords: number = 0;
    pageIndex: number = 0;
    pageSize: number = 10;
    totalPages: number = 0;
    originalATASubchapterData: any = [];
    stopmulticlicks: boolean;
    loaderForATA = true;
    auditHistory1: any;
    constructor(
        private atasubchapter1service: AtaSubChapter1Service,
        private atamain: AtaMainService,
        private authService: AuthService,
        public customerService: CustomerService,
        private alertService: AlertService,
        private modalService: NgbModal,
        private datePipe: DatePipe,
        private activeModal: NgbActiveModal,
    ) {
        this.stopmulticlicks = false;
    }

    ngOnInit() {

        if (this.editMode) {
            this.id = this.editGeneralInformationData.customerId;
            this.customerCode = this.editGeneralInformationData.customerCode;
            this.customerName = this.editGeneralInformationData.name;
            //this.getOriginalATASubchapterList();

        } else {
            //this.getMappedATAByCustomerId();
            if (this.customerDataFromExternalComponents) {
                this.id = this.customerDataFromExternalComponents.customerId;
                this.customerCode = this.customerDataFromExternalComponents.customerCode;
                this.customerName = this.customerDataFromExternalComponents.name;
                this.isViewMode = true;
            }
            else{

                this.id = this.savedGeneralInformationData.customerId;
                this.customerCode = this.savedGeneralInformationData.customerCode;
                this.customerName = this.savedGeneralInformationData.name;
                this.isViewMode = false;
            }
        }
        
    }

    ngOnChanges(changes: SimpleChanges) {
        for (let property in changes) {
            if (property == 'selectedCustomerTab') {
				if (changes[property].currentValue != {} && changes[property].currentValue == "Atachapter") {
                    if (this.editMode) {
                        this.getOriginalATASubchapterList();
                    }
                    this.getMappedATAByCustomerId();
                    this.getAllATASubChapter();
                    this.getContactsByCustomerId();
				}
			}
            if (property == 'customerDataFromExternalComponents') {
                if (changes[property].currentValue != {}) {
                    this.id = this.customerDataFromExternalComponents.customerId;
                    this.customerCode = this.customerDataFromExternalComponents.customerCode;
                    this.customerName = this.customerDataFromExternalComponents.name;
                    this.getMappedATAByCustomerId();
                    this.isViewMode = true;
                }
            }
        }
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    // get all subchapters
    getAllATASubChapter() {
        this.isSpinnerVisible = true;
        this.atasubchapter1service.getAtaSubChapter1List().subscribe(res => {
            const ataSubChapter = res[0].map(x => {
                return {
                    label: `${x.ataSubChapterCode}-${x.description}`,
                    value: x
                }
            })
            // making copy for the subchapters in both add and seach 
            this.search_ataSubChapterList = ataSubChapter;
            this.isSpinnerVisible = false;
        },error => this.saveFailedHelper(error))
    }

    getOriginalATASubchapterList() {
        this.isSpinnerVisible = true;
        this.atasubchapter1service.getAtaSubChapter1List().subscribe(res => {
            const responseData = res[0];
            this.originalATASubchapterData = responseData;
            this.getMappedATAByCustomerId();
            this.isSpinnerVisible = false;
        },error => this.saveFailedHelper(error))

    }

    closeDeleteModal() {
		$("#downloadExportPopup").modal("hide");
    }
    
    exportCSV(dt){
        dt._value = dt._value.map(x => {
            return {
                ...x,
                createdDate: x.createdDate ?  this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a'): '',
                updatedDate: x.updatedDate ?  this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a'): '',
            }
        });
        dt.exportCSV();
    }

    // get mapped ata by customer id 
    getMappedATAByCustomerId() {
        this.isSpinnerVisible = true;
        this.customerService.getATAMappedByCustomerId(this.id).subscribe(res => {
            this.loaderForATA = false;
            this.ataListDataValues = res;
            if (res.length > 0) {
                this.totalRecords = res.length;
                this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            }
            this.isSpinnerVisible = false;
        }, err => {
            this.loaderForATA = false;
        })
    }

    // search URL generation 
    searchByFieldUrlCreateforATA() {
        if (this.search_SelectedContact.length > 0) {
            const contactIds = this.search_SelectedContact.reduce((acc, value) => {
                return `${acc},${value}`;
            }, '');
            this.contactIdUrl = contactIds.substr(1);
        } else {
            this.contactIdUrl = '';
        }
        if (this.search_SelectedATA.length > 0) {
            const ataIds = this.search_SelectedATA.reduce((acc, value) => {
                return `${acc},${value}`;
            }, '');
            this.ataChapterIdUrl = ataIds.substr(1);
        } else {
            this.ataChapterIdUrl = '';
        }
        if (this.search_SelectedATASubChapter.length > 0) {
            const ataSubchapterIds = this.search_SelectedATASubChapter.reduce((acc, id) => {
                return `${acc},${id}`;
            }, '');
            this.ataSubchapterIdUrl = ataSubchapterIds.substr(1);
        } else {
            this.ataSubchapterIdUrl = '';
        }
    }

    // get sub chapter by multiple ids in the search
    getSubChapterByATAChapter() {
        this.isSpinnerVisible = true;
        this.searchByFieldUrlCreateforATA();
        if (this.ataChapterIdUrl !== '') {
            this.atamain
                .getMultiATASubDesc(this.ataChapterIdUrl)
                .subscribe(atasubchapter => {
                    const responseData = atasubchapter;
                    this.search_ataSubChapterList = responseData.map(x => {
                        return {
                       label: `${x.ataSubChapterCode}-${x.description}`,
                        value: x.ataSubChapterId
                        };
                    });
                },error => this.saveFailedHelper(error));
                this.isSpinnerVisible = false;

        } else {
            this.getAllATASubChapter();
            this.isSpinnerVisible = false;
        }
    }

    getContactsByCustomerId() {
        this.customerService.getCustomerContactGet(this.id).subscribe(res => {
            const responseData: any = res;
            this.contactList = responseData.map(x => {
                return {
                    label: x.firstName + " " + x.lastName, value: x.contactId
                }
            })
        },error => this.saveFailedHelper(error))

    }

    async searchATA() {
        await this.searchByFieldUrlCreateforATA();
        this.searchATAParams = '';
        // checks where multi select is empty or not and calls the service
        if (this.ataChapterIdUrl !== '' && this.ataSubchapterIdUrl !== '' && this.contactIdUrl !== '') {

            this.searchATAParams = `contactId=${this.contactIdUrl}&ataChapterId=${
                this.ataChapterIdUrl
                }&ataSubChapterId=${this.ataSubchapterIdUrl}`;
        }
        else if (this.ataChapterIdUrl !== '' && this.contactIdUrl !== '') {

            this.searchATAParams = `contactId=${this.contactIdUrl}&ataChapterId=${this.ataChapterIdUrl}`;
        }
        else if (this.ataSubchapterIdUrl !== '' && this.contactIdUrl !== '') {
            this.searchATAParams = `contactId=${this.contactIdUrl}&ataSubChapterId=${this.ataSubchapterIdUrl}`;
        }
        else if (this.ataSubchapterIdUrl !== '' && this.ataChapterIdUrl !== '') {
            this.searchATAParams = `ataChapterId=${this.ataChapterIdUrl}&ataSubChapterId=${this.ataSubchapterIdUrl}`;
        }

        else if (this.ataChapterIdUrl !== '') {

            this.searchATAParams = `ataChapterId=${this.ataChapterIdUrl}`;
        }
        else if (this.ataSubchapterIdUrl !== '') {
            this.searchATAParams = `ataSubChapterId=${this.ataSubchapterIdUrl}`;
        }

        else if (this.contactIdUrl !== '') {
            this.searchATAParams = `contactId=${this.contactIdUrl}`;
        }

        this.isSpinnerVisible = true;
        this.customerService
            .searchATAMappedByMultiATAIDATASUBIDByCustomerId(
                this.id,
                this.searchATAParams,
            )
            .subscribe(res => {
                this.ataListDataValues = res;
                if (res.length > 0) {
                    this.totalRecords = res.length;
                    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
                }

                this.contactIdUrl = '';
                this.ataSubchapterIdUrl = '';
                this.ataChapterIdUrl = '';
                this.isSpinnerVisible = false;
            },error => this.saveFailedHelper(error));
    }

    pageIndexChange(event) {
        this.pageSize = event.rows;
    }

    nextClick() {
        this.stopmulticlicks = true;
        this.tab.emit('Financial');
       
        setTimeout(() => {
            this.stopmulticlicks = false;
        }, 500)
    }
    backClick() {
        this.tab.emit('AircraftInfo');
    }


    dismissModel() {
        this.modal.close();
    }
    deleteATAMapping(content, rowData) {
        this.selectedRowForDelete = rowData;
        this.isDeleteMode = true;

        this.customerContactATAMappingId = rowData.customerContactATAMappingId
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }
    deleteItemAndCloseModel() {
        let airCraftingMappingId = this.customerContactATAMappingId;
        if (airCraftingMappingId > 0) {

            this.customerService.deleteATAMappedByContactId(airCraftingMappingId).subscribe(
                response => this.saveCompleted(this.sourceCustomer),
                error => this.saveFailedHelper(error));
        }
        this.modal.close();
    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }
    private saveCompleted(user?: any) {

        if (this.isDeleteMode == true) {
            this.alertService.showMessage("Success", `Action was deleted successfully`, MessageSeverity.success);
            this.isDeleteMode = false;
        }
        else {
            this.alertService.showMessage("Success", `Action was edited successfully`, MessageSeverity.success);
            this.saveCompleted
        }
        this.getMappedATAByCustomerId();
    }
    private saveFailedHelper(error: any) {
        this.isSpinnerVisible = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
        setTimeout(() => this.alertService.stopLoadingMessage(), 5000);
    }
    enableDisableAdvancedSearch(val) {
        this.showAdvancedSearchCard = val;
        this.search_SelectedContact = [];
        this.search_SelectedATA = [];
        this.search_SelectedATASubChapter = [];
        this.getMappedATAByCustomerId();
    }

    getATAAuditHistoryById(rowData) {
        this.isSpinnerVisible = true;
        this.customerService.getCustomerContactATAAuditDetails(rowData.customerContactATAMappingId).subscribe(res => {
            this.auditHistory1 = res;
            this.isSpinnerVisible = false;
        },error => this.saveFailedHelper(error))
    }
    getColorCodeForHistoryATA(i, field, value) {
        const data = this.auditHistory1;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
    }

}