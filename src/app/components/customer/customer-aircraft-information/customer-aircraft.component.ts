import { Component, OnInit, Input, EventEmitter, Output, ViewChild, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemMasterService } from '../../../services/itemMaster.service';
import { DashNumberService } from '../../../services/dash-number/dash-number.service';
import { AircraftModelService } from '../../../services/aircraft-model/aircraft-model.service';
import { CustomerService } from '../../../services/customer.service';
import { AuthService } from '../../../services/auth.service';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { DatePipe } from '@angular/common';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

declare var $ : any;
import { Table } from 'primeng/table';
@Component({
    selector: 'app-customer-aircraft',
    templateUrl: './customer-aircraft.component.html',
    styleUrls: ['./customer-aircraft.component.scss'],
    providers: [DatePipe]

})
export class CustomerAircraftComponent implements OnInit {
    @Input() savedGeneralInformationData: any = {};
    @Input() editGeneralInformationData;
    @Input() editMode;
    @Input() selectedCustomerTab: string = '';
    @Output() tab = new EventEmitter();
    @ViewChild("aircraftForm",{static:false}) aircraftForm: any;
    @Input() customerDataFromExternalComponents: any;
    isSpinnerVisible: boolean = false;
    disableSave: boolean = true;
    disableSaveAdd: boolean = true;
    manufacturerData: { value: any; label: any; }[];
    search_AircraftModelList: any = [];
    search_AircraftDashNumberList: any;
    selectAircraftManfacturer: any 
    selectedAircraftModel = [];
    selectedDashNumbers = [];
    selectedmemo: any = '';
    selectedOnly: boolean = false;
    targetData: any;
    viewAircraftData: any;
    modal: NgbModalRef;
    add_SelectedAircraftId: any;
    add_SelectedModel: any = [];
    add_SelectedDashNumber: any;
    resetinputmodel: any;
    isDeleteMode: boolean = false;
    add_AircraftModelList: any = [];
    add_AircraftDashNumberList: any = [];
    tempAircraftType: any;
    currentstatus: string = 'Active';
    tempAircraftModel: any;
    aircraftManfacturerIdsUrl: string = '';
    aircraftModelsIdUrl: string = '';
    dashNumberIdUrl: string = '';
    searchAircraftParams: string = '';
    multipleModelUrl: any = '';
    tempAircraftDashNumber: any;
    modelUnknown: boolean = false;
    airCraftMappingId: number;
    inventoryData: any = [];
    editAirCraftData: any = [];
    selectedRowForDelete: any;
    aircraftdata: any = [];
    aircraftauditHisory: any[];
    colaircraft: any[] = [
        { field: "AircraftType", header: "Aircraft" },
        { field: "AircraftModel", header: "Model" },
        { field: "DashNumber", header: "Dash Numbers" },
    ];
    colsaircraftLD = [
        { field: "aircraftType", header: "Aircraft" },
        { field: "aircraftModel", header: "Model" },
        { field: "dashNumber", header: "Dash Numbers" },
        { field: "inventory", header: "Inventory" },        
        { field: 'createdDate', header: 'Created Date' },
        { field: 'createdBy', header: 'Created By' },     
        { field: 'updatedDate', header: 'Updated Date' },
        { field: 'updatedBy', header: 'Updated By' }      
    ]
    selectedColumns = this.colsaircraftLD;
    dashNumberUnknown: boolean = false;
    aircraftListDataValues: any = [];
    id: number;
    customerCode: any;
    customerName: any;
    public sourceCustomer: any = {}
    totalRecords: any;
    totalPages: number;
    pageSize: number = 10;
    showAdvancedSearchCard: boolean = false;
    isViewMode: boolean = false;
    stopmulticlicks: boolean;
    currentDeletedstatus:boolean=false;
    restorerecord:any={}

    constructor(private route: ActivatedRoute, private itemser: ItemMasterService,
        private aircraftModelService: AircraftModelService,
        private Dashnumservice: DashNumberService,
        public customerService: CustomerService,
        private authService: AuthService,
        private alertService: AlertService,
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private activeModal: NgbActiveModal,
        private cd: ChangeDetectorRef
    ) {
        this.stopmulticlicks = false;
        this.id = this.route.snapshot.params['id'];
    }
    ngOnInit() {

        if (this.editMode) {
            //this.id = this.editGeneralInformationData.customerId;
            this.customerCode = this.editGeneralInformationData.customerCode;
            this.customerName = this.editGeneralInformationData.name;
            //this.getAircraftMappedDataByCustomerId();
            this.isViewMode = false;

        } else {
            //this.getAircraftMappedDataByCustomerId();
            if (this.customerDataFromExternalComponents) {
                //this.id = this.customerDataFromExternalComponents.customerId;
                this.customerCode = this.customerDataFromExternalComponents.customerCode;
                this.customerName = this.customerDataFromExternalComponents.name;

                this.isViewMode = true;
            } else {
                //this.id = this.savedGeneralInformationData.customerId;
                this.customerCode = this.savedGeneralInformationData.customerCode;
                this.customerName = this.savedGeneralInformationData.name;
                this.isViewMode = false;
            }
        }

        this.route.data.subscribe(data => {
        })
    }

    ngOnChanges(changes: SimpleChanges) {
        for (let property in changes) {
            if (property == 'selectedCustomerTab') {
				if (changes[property].currentValue != {} && changes[property].currentValue == "AircraftInfo") {
                    this.getAircraftMappedDataByCustomerId();
                    this.getAllAircraftManfacturer();
                    this.getAllAircraftModels();
                    this.getAllDashNumbers();
				}
			}
            if (property == 'customerDataFromExternalComponents') {
                if (changes[property].currentValue != {}) {
                    this.id = this.customerDataFromExternalComponents.customerId;
                    this.customerCode = this.customerDataFromExternalComponents.customerCode;
                    this.customerName = this.customerDataFromExternalComponents.name;
                    if(this.id > 0)
                        this.getAircraftMappedDataByCustomerId();
                    this.isViewMode = true;
                }
            }
        }
    }
    clearValue() {
        this.resetinputmodel = null;
    }
    enableSave() {
        this.disableSave = false;
    }
    enableSaveAdd() {
        this.disableSaveAdd = false;
    }
    closeDeleteModal() {
		$("#downloadPopup").modal("hide");
    }

    exportCSV(dt){
        dt._value = dt._value.map(x => {
            return {
                ...x,
                aircraftModel:x.aircraftModel =='Unknown' ?'':x.aircraftModel,
                dashNumber:x.dashNumber=='Unknown'?'':x.dashNumber,
                createdDate: x.createdDate ?  this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a'): '',
                updatedDate: x.updatedDate ?  this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a'): '',
            }
        });
        dt.exportCSV();
    }

    closeMyModel() {
        $("#editAirCraftDetails").modal("hide");
        this.disableSave = true;
    }  

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    get currentUserMasterCompanyId(): number {
		return this.authService.currentUser
		  ? this.authService.currentUser.masterCompanyId
		  : null;
    }

    getAllAircraftManfacturer() {
        this.itemser.getAircraft(this.currentUserMasterCompanyId).subscribe(res => {
            this.manufacturerData = res[0].map(x => {
                return {
                    value: x.aircraftTypeId, label: x.description
                }
            })
        },error => {});
    }

    // get all Aircraft Models
    getAllAircraftModels() {
        this.aircraftModelService.getAll(this.currentUserMasterCompanyId).subscribe(models => {
            const responseValue = models[0];
            const aircraftModelList = responseValue.map(models => {
                return {
                    label: models.modelName,
                    value: models.aircraftModelId
                };
            });
            this.search_AircraftModelList = aircraftModelList;
            this.add_AircraftModelList = aircraftModelList;
        },error =>{this.isSpinnerVisible = false});
    }
    viewAircraftdbldisplay(data) {
        this.viewAircraftData = data;
        $('#viewAircraft').modal('show');
    }

    // get all dashnumber
    getAllDashNumbers() {
        this.Dashnumservice.getAll(this.currentUserMasterCompanyId).subscribe(dashnumbers => {
            const responseData = dashnumbers[0];
            const dashNumberList = responseData.map(dashnumbers => {
                return {
                    label: dashnumbers.dashNumber,
                    value: dashnumbers.dashNumberId
                };
            });
            this.search_AircraftDashNumberList = dashNumberList;
            this.add_AircraftDashNumberList = dashNumberList;
        },error => {this.isSpinnerVisible = false});
    }
    editAirCraft(rowData) {
        this.editAirCraftData = { ...rowData };
        this.aircraftdata = rowData;
    }

    searchByFieldUrlCreateforAircraftInformation() {

        this.aircraftManfacturerIdsUrl = this.selectAircraftManfacturer == 'null' ? '' : this.selectAircraftManfacturer;
        if (this.selectedAircraftModel.length > 0) {

            const aircraftModelIds = this.selectedAircraftModel.reduce((acc, id) => {
                return `${acc},${id}`;
            }, '');
            this.aircraftModelsIdUrl = aircraftModelIds.substr(1);
        } else {
            this.aircraftModelsIdUrl = '';
        }
        if (this.selectedDashNumbers.length > 0) {
            const dashNumberIds = this.selectedDashNumbers.reduce((acc, id) => {
                return `${acc},${id}`;
            }, '');
            this.dashNumberIdUrl = dashNumberIds.substr(1);
        } else {
            this.dashNumberIdUrl = '';
        }
    }

    async getAircraftModelByManfacturerType(id) {       
        //this.selectAircraftManfacturer = String(id);
        // construct url from array
        await this.searchByFieldUrlCreateforAircraftInformation();
        // reset the dropdowns
        this.selectedAircraftModel = [];
        this.selectedDashNumbers = []
        // checks where multi select is empty or not and calls the service
        if (this.selectAircraftManfacturer !== '' && this.selectAircraftManfacturer !== null) {
            this.aircraftModelService.getAircraftModelListByManufactureId(this.selectAircraftManfacturer).subscribe(models => {
                    const responseValue = models[0];
                    this.search_AircraftModelList = responseValue.map(models => {
                        return {
                            label: models.modelName,
                            value: models.aircraftModelId
                        };
                    });
                },error => {this.isSpinnerVisible = false});
        } else {
            this.getAllAircraftModels();
            this.getAllDashNumbers();
        }
    }
    async getDashNumberByManfacturerandModel() {
        await this.searchByFieldUrlCreateforAircraftInformation();
        this.selectedDashNumbers = []

        if (this.aircraftManfacturerIdsUrl !== '' && this.aircraftModelsIdUrl !== '') {
            this.Dashnumservice.getDashNumberByModelTypeId(
                this.aircraftModelsIdUrl,
                this.aircraftManfacturerIdsUrl
            ).subscribe(dashnumbers => {
                const responseData = dashnumbers;
                this.search_AircraftDashNumberList = responseData.map(dashnumbers => {

                    return {
                        label: dashnumbers.dashNumber,
                        value: dashnumbers.dashNumberId
                    };
                });
            },error => {this.isSpinnerVisible = false});
        }
    }

    //  search aircraft information by all parameter
    async searchAircraftInformation() {        
        await this.searchByFieldUrlCreateforAircraftInformation();
        this.searchAircraftParams = '';
        // checks where multi select is empty or not and calls the service
        if (
            (this.aircraftManfacturerIdsUrl !== '' || this.aircraftManfacturerIdsUrl!== null) &&
            this.aircraftModelsIdUrl !== '' &&
            this.dashNumberIdUrl !== ''
        ) {
            this.searchAircraftParams = `AircraftTypeId=${this.aircraftManfacturerIdsUrl}&AircraftModelId=${this.aircraftModelsIdUrl}&DashNumberId=${this.dashNumberIdUrl}`;
        }
        else if (
            (this.aircraftManfacturerIdsUrl !== '' || this.aircraftManfacturerIdsUrl!== null) &&
            this.aircraftModelsIdUrl !== '' &&
            this.dashNumberIdUrl !== ''
        ) {
            this.searchAircraftParams = `AircraftTypeId=${this.aircraftManfacturerIdsUrl}&AircraftModelId=${this.aircraftModelsIdUrl}&DashNumberId=${this.dashNumberIdUrl}`;
        }
        // search only by manfacturer and Model and  publicationId
        else if (
            (this.aircraftManfacturerIdsUrl !== '' || this.aircraftManfacturerIdsUrl!== null) &&
            this.aircraftModelsIdUrl !== ''
        ) {
            this.searchAircraftParams = `AircraftTypeId=${this.aircraftManfacturerIdsUrl}&AircraftModelId=${this.aircraftModelsIdUrl}`;
        }
        else if (
            (this.aircraftManfacturerIdsUrl !== '' || this.aircraftManfacturerIdsUrl!== null) &&
            this.dashNumberIdUrl !== ''
        ) {
            this.searchAircraftParams = `AircraftTypeId=${this.aircraftManfacturerIdsUrl}&DashNumberId=${this.dashNumberIdUrl}`;
        }
        else if (
            this.aircraftModelsIdUrl !== '' &&
            this.dashNumberIdUrl !== ''
        ) {
            this.searchAircraftParams = `AircraftModelId=${this.aircraftModelsIdUrl}&DashNumberId=${this.dashNumberIdUrl}`;
        }        
        else if (this.aircraftManfacturerIdsUrl !== '' || this.aircraftManfacturerIdsUrl!== null) {
            this.searchAircraftParams = `AircraftTypeId=${this.aircraftManfacturerIdsUrl}`;
        }
        // search only by model and publicationId
        else if (this.aircraftModelsIdUrl !== '') {
            this.searchAircraftParams = `AircraftModelId=${this.aircraftModelsIdUrl}`;
        }
        // search only by dashNumber and publicationId
        else if (this.dashNumberIdUrl !== '') {
            this.searchAircraftParams = `DashNumberId=${this.dashNumberIdUrl}`;
        }
        if (this.selectedmemo !== '') {
            this.searchAircraftParams = `${this.searchAircraftParams}&memo=${this.selectedmemo}`
        } else {
            this.searchAircraftParams = this.searchAircraftParams;
        }        
        this.customerService.searchAirMappedByMultiTypeIDModelIDDashIDByCustomerId(this.id, this.searchAircraftParams).subscribe(res => {
            this.aircraftListDataValues = res;
            if (this.aircraftListDataValues.length > 0) {
                this.totalRecords = this.aircraftListDataValues.length;
                this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            }
        },error => {this.isSpinnerVisible = false;});
    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }
    pageIndexChange(event) {
        this.pageSize = event.rows;
    }

    // add Inventory pop Functions
    getAircraftModelByManfacturer(value) {
        this.tempAircraftType = value.originalEvent.target.textContent;

        if (this.tempAircraftType) {
            this.aircraftModelService.getAircraftModelListByManufactureId(this.add_SelectedAircraftId).subscribe(models => {

                const responseValue = models[0];
                this.add_AircraftModelList = responseValue.map(models => {
                    return {
                        label: models.modelName,
                        value: models
                    }
                });

            },error => {this.isSpinnerVisible = false});
            this.add_SelectedModel = [];
            this.add_SelectedDashNumber = [];
        }
    }

    // get dashNumbers by Type and Model 
    getDashNumberByTypeandModel(value) {
        this.tempAircraftModel = value.originalEvent.target.textContent;
        this.multipleModelUrl = this.add_SelectedModel.reduce((acc, obj) => {

            return `${acc},${obj.aircraftModelId}`
        }, '')
        this.multipleModelUrl = this.multipleModelUrl.substr(1);

        this.Dashnumservice.getDashNumberByModelTypeId(this.multipleModelUrl, this.add_SelectedAircraftId).subscribe(dashnumbers => {
            const responseData = dashnumbers;
            this.add_AircraftDashNumberList = responseData.map(dashnumbers => {
                return {
                    label: dashnumbers.dashNumber,
                    value: dashnumbers.dashNumberId
                }
            }); 

        },error => {this.isSpinnerVisible = false});
    }

    selectedDashnumbervalue(value) {
        this.tempAircraftDashNumber = value.originalEvent.target.textContent;
    }

    mapAircraftInventory() {

        if (this.add_SelectedModel == undefined || this.add_SelectedModel.length <= 0) {
            this.modelUnknown = true
        }
        if (this.add_SelectedDashNumber == undefined || this.add_SelectedDashNumber.length <= 0) {
            this.dashNumberUnknown = true
        }

        if (this.add_SelectedAircraftId !== undefined && this.add_SelectedModel.length > 0 && this.add_SelectedDashNumber !== undefined && this.add_SelectedDashNumber.length > 0) {
            this.Dashnumservice.getAllDashModels(this.multipleModelUrl, this.add_SelectedAircraftId, this.add_SelectedDashNumber).subscribe(aircraftdata => {
                const responseValue = aircraftdata;
                this.inventoryData = responseValue.map(x => {
                    return {
                        AircraftTypeId: x.typeid,
                        AircraftType: x.aircraft,
                        AircraftModel: x.model,
                        DashNumber: x.dashNumber,
                        AircraftModelId: x.modelid,
                        DashNumberId: x.dashNumberId,
                        Inventory: null,
                        Memo: '',
                        IsChecked: false
                    }
                })
            })
            //},error => this.saveFailedHelper(error))
        }

        if (this.add_SelectedAircraftId !== undefined && this.modelUnknown) {
            this.inventoryData = [{
                AircraftTypeId: this.add_SelectedAircraftId,
                AircraftType: this.tempAircraftType,
                AircraftModel: 'Unknown',
                DashNumber: 'Unknown',
                AircraftModelId: '',
                DashNumberId: '',
                Inventory: null,
                Memo: '',
                IsChecked: false
            }]
        }
        if (this.add_SelectedAircraftId !== undefined && this.add_SelectedModel.length > 0 && this.dashNumberUnknown) {
            this.inventoryData = this.add_SelectedModel.map(x => {
                return {
                    AircraftTypeId: this.add_SelectedAircraftId,
                    AircraftType: this.tempAircraftType,
                    AircraftModel: x.modelName,
                    DashNumber: 'Unknown',
                    AircraftModelId: x.aircraftModelId,
                    DashNumberId: '',
                    Inventory: null,
                    Memo: '',
                    IsChecked: false
                }
            })
        }
    }
    resetAircraftModelsorDashNumbers() {
        if (this.modelUnknown) {
            this.add_SelectedModel = [];
            this.add_SelectedDashNumber = undefined;
        }
        if (this.dashNumberUnknown) {

            this.add_SelectedDashNumber = undefined;
        }
    }
    updateCustomerAircraft() {

        this.isSpinnerVisible = true;
        const data = {
            ...this.editAirCraftData,
            customerAircraftMappingId: this.aircraftdata.customerAircraftMappingId,
            dashNumberId: this.aircraftdata.dashNumberId,
            aircraftModelId: this.aircraftdata.aircraftModelId,
            customerId: this.id,
            createdBy: this.userName,
            updatedBy: this.userName,
            aircraftType: this.aircraftdata.aircraftType,
            aircraftTypeId: this.aircraftdata.aircraftTypeId,
            dashNumber: this.aircraftdata.dashNumber,
            masterCompanyId: this.currentUserMasterCompanyId,
            isActive: true,
            isDeleted: false,
            aircraftModel: this.aircraftdata.aircraftModel
        }

        this.customerService.updatecustomeraircraft(data, this.aircraftdata.customerAircraftMappingId).subscribe(res => {

            this.getAircraftMappedDataByCustomerId();
            this.alertService.showMessage(
                'Success',
                `Updated Aircraft Sucessfully `,
                MessageSeverity.success
            );
            this.isSpinnerVisible = false;
        },error => { this.isSpinnerVisible = false;})
        $("#editAirCraftDetails").modal("hide");
        this.disableSave = true;
        this.isSpinnerVisible = false;
    }
    openAddInventoryPopup(content) {
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
    }
    inventoryValidation(event, from) {
        if (from == 'fromedit' && (event.target.value == null || event.target.value == '' || event.target.value == undefined)) {
            this.disableSave = false;
        }
        if (event.target.value && event.target.value == 0) {
            this.alertService.showMessage(
                'Warn',
                'Inventory should be greater then 0',
                MessageSeverity.warn
            );
            event.target.value = '';
            event.target.value = null;
            if (from == 'fromedit') this.editAirCraftData.inventory = '';
        } else {
            return true;
        }
    }

    saveAircraft() {
        this.isSpinnerVisible = true;
        const data = this.inventoryData.map(obj => {
            return {
                ...obj,
                DashNumberId: obj.DashNumber === 'Unknown' ? null : obj.DashNumberId,
                AircraftModelId: obj.AircraftModel === 'Unknown' ? null : obj.AircraftModelId,
                CustomerId: this.id,
                MasterCompanyId: this.currentUserMasterCompanyId,
                createdBy: this.userName,
                updatedBy: this.userName,
                IsDeleted: false,
            }
        })
        this.customerService.postCustomerAircrafts(data).subscribe(res => {
            this.alertService.showMessage(
                'Success',
                'Mapped Aircraft Inventory Successfully',
                MessageSeverity.success
            );
            this.inventoryData = []
            this.add_SelectedAircraftId = undefined;
            this.add_SelectedModel = [];
            this.add_SelectedDashNumber = undefined;
            this.dashNumberUnknown = false;
            this.modelUnknown = false;
            this.dismissModel();
            this.getAircraftMappedDataByCustomerId()
        }, error => {
            this.inventoryData = []
            this.add_SelectedAircraftId = undefined;
            this.add_SelectedModel = [];
            this.add_SelectedDashNumber = undefined;
            this.dashNumberUnknown = false;
            this.modelUnknown = false;
            this.getAircraftMappedDataByCustomerId()
        })
    }

    getAircraftMappedDataByCustomerId() {
        this.isSpinnerVisible = true;
        if(this.id > 0)
        {
            this.customerService.getMappedAirCraftDetails(this.id).subscribe(res => {
                this.aircraftListDataValues = res;
                if (this.aircraftListDataValues.length > 0) {
                    this.totalRecords = this.aircraftListDataValues.length;
                    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
                }
                this.isSpinnerVisible = false;
            }, error => {this.isSpinnerVisible = false;})
        }
    }
    
    getCustomerAircraftHistory(row) {
        this.isSpinnerVisible = true;
        const { customerAircraftMappingId } = row;
        this.customerService.getMappedAirCraftDetailsAudit(customerAircraftMappingId).subscribe(res => {
            this.aircraftauditHisory = res;
            this.isSpinnerVisible = false;
        }, error => { this.isSpinnerVisible = false;});
    }
    
    openAircraftView(data) {
        this.viewAircraftData = data;
    }
    getColorCodeForHistory(i, field, value) {
        const data = this.aircraftauditHisory;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
    }

    dismissModel() {
        this.modal.close();
        this.add_SelectedDashNumber = '';
        this.add_SelectedModel = '';
        this.add_SelectedAircraftId = '';
        this.disableSaveAdd = true;
    }
    
    deleteAircraftMappedInventory(content, rowData) {

        this.isDeleteMode = true;
        this.selectedRowForDelete = rowData;

        this.airCraftMappingId = rowData.customerAircraftMappingId;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }
    deleteItemAndCloseModel() {
        this.isSpinnerVisible = true;
        let airCraftingMappingId = this.airCraftMappingId;
        if (airCraftingMappingId > 0) {
            this.customerService.deleteAircraftInvetoryById(airCraftingMappingId).subscribe(
                response => this.saveCompleted(this.sourceCustomer),
                error => {this.isSpinnerVisible = false});
        }
        this.modal.close();
        this.isSpinnerVisible = false;
    }
    nextClick() {
        this.stopmulticlicks = true;
        this.tab.emit('Atachapter');
        setTimeout(() => {
            this.stopmulticlicks = false;
        }, 500)
    }
    backClick() {

        this.tab.emit('Contacts');
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
        this.getAircraftMappedDataByCustomerId();
        this.isSpinnerVisible = false;
    }
    private saveFailedHelper(error: any) {
        this.isSpinnerVisible = false;
        this.alertService.stopLoadingMessage();
        //this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
        setTimeout(() => this.alertService.stopLoadingMessage(), 10000);
        
    }

    enableDisableAdvancedSearch(val) {
        this.showAdvancedSearchCard = val;
        this.selectAircraftManfacturer = '';
        this.selectedAircraftModel = [];
        this.selectedDashNumbers = [];
        this.aircraftManfacturerIdsUrl = '';
        this.aircraftModelsIdUrl = '';
        this.dashNumberIdUrl = '';
        this.selectedmemo = '';
        this.getAircraftMappedDataByCustomerId();
    }

    getDeleteListByStatus(value){
        this.isSpinnerVisible = true;
        this.currentDeletedstatus=value;
        if (this.id > 0) {
            this.customerService.getMappedAirCraftDetailsByIdAndStatus(this.id, value).subscribe(res => {
                this.aircraftListDataValues = res;
                if (this.aircraftListDataValues.length > 0) {
                    this.totalRecords = this.aircraftListDataValues.length;
                    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
                }
                this.isSpinnerVisible = false;
            }, error => {this.isSpinnerVisible = false;})
        }
        this.isSpinnerVisible = false;
    }

    restore(content, rowData) {
        this.restorerecord = rowData;
        this.airCraftMappingId = rowData.customerAircraftMappingId;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    restoreRecord() {
        this.isSpinnerVisible = true;
        let airCraftingMappingId = this.airCraftMappingId;
        if (airCraftingMappingId > 0) {
            this.customerService.restoreAircraftInvetoryById(airCraftingMappingId).subscribe(res => {
                this.currentDeletedstatus=true,
                this.getDeleteListByStatus(true);
                this.alertService.showMessage("Success", `Restored Successfully`, MessageSeverity.success)
                this.isSpinnerVisible = false;
            }, error => {this.isSpinnerVisible = false;
                         this.modal.close();
                    })
                this.modal.close();
        }
        this.isSpinnerVisible = false;
        this.modal.close();
    }

}