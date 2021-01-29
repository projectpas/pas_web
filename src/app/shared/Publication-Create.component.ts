import { Component, Input, OnChanges, OnInit, EventEmitter, Output } from "@angular/core";
import { IWorkFlow } from "../Workflow/WorkFlow";
import { ActionService } from "../Workflow/ActionService";
import { IPublicationType } from "../Workflow/PublicationType";
import { IPublicationAircraftManufacturer } from "../Workflow/PublicationAircraftManufacturer";
import { IPublicationModel } from "../Workflow/PublicationModel";
import { IPublicationStatus } from "../Workflow/PublicationStatus";
import { IPublication } from "../Workflow/Publication";
import { EmployeeService } from "../services/employee.service";
import { PublicationService } from "../services/publication.service";
import { Publication } from "../models/publication.model";
import { AlertService, MessageSeverity } from "../services/alert.service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
declare var $: any;
import { MasterComapnyService } from "../services/mastercompany.service";
import { WorkFlowtService } from "../services/workflow.service";
import { ConfigurationService } from "../services/configuration.service";
import { getObjectById } from "../generic/autocomplete";
import { AuthService } from "../services/auth.service";
import { CommonService } from "../services/common.service";

@Component({
    selector: 'grd-publication',
    templateUrl: './Publication-Create.component.html',
    styleUrls: ['./Publication-Create.component.css']
})

export class PublicationCreateComponent implements OnInit, OnChanges {
    allEmployeeinfo: any[] = [];
    firstCollection: any[] = [];
    @Input() itemMasterId = 0;
    @Input() workFlow: IWorkFlow;
    @Input() UpdateMode: boolean;
    @Output() notify: EventEmitter<IWorkFlow> = new EventEmitter<IWorkFlow>();
    publicationTypes: any = [];
    publicationAircraftManufacturers: IPublicationAircraftManufacturer[];
    publicationModels: IPublicationModel[];
    publicationStatuses: IPublicationStatus[];
    row: any;
    errorMessage: string;
    locations: any[] = [];
    updateModeforModels: boolean = false;
    publications: any[];
    dropdownSettings: any;
    currentPage: number = 1;
    itemsPerPage: number = 10;
    closeResult: string;
    modal: NgbModalRef;
    generalInfo: any;
    pnMappingList: any = [];
    aircraftList: any = [];
    ataList: any = [];
    isActive: any;
    allComapnies: any;
    attachmentList: any = [];
    attachmentsPageSize: number = 10;
    pnMappingPageSize: number = 10;
    aircraftPageSize: number = 10;
    ataPageSize: number = 10;
    first: number = 0;
    isSpinnerVisible = false;

    headersforPNMapping = [
        { field: 'partNumber', header: 'PN ID/Code' },
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
        { field: 'ataChapter', header: 'AtaChapter' },
        { field: 'ataSubChapter', header: 'AtaSubChapter' }
    ];
    headersforAttachment = [
        { field: 'tagTypeName', header: 'Tag Type' }
    ];
    publicationDropdown: any;
    aircraftListByPubId: any = [];
    aircraftModelListByPubId: any = [];
    dashNumber: any;
    isEditModeBinding: boolean = false;

    constructor(private actionService: ActionService,
        private authService: AuthService,
        private masterComapnyService: MasterComapnyService,
        private _workflowService: WorkFlowtService,
        private modalService: NgbModal, private employeeService: EmployeeService,
        private configurations: ConfigurationService,
        private publicationService: PublicationService,
        private alertService: AlertService,
        private commonService: CommonService) {
    }

    ngOnInit(): void {
        this.dropdownSettings = {
            singleSelection: false,
            idField: 'dashNumberId',
            textField: 'dashNumber',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 3,
            allowSearchFilter: false
        };
        this.getPublicationByItemMasterId(this.itemMasterId);
        this.row = this.workFlow.publication[0];
        if (this.row == undefined) {
            this.row = {};
        }
        this.row.taskId = this.workFlow.taskId;

        if (this.UpdateMode == true && this.workFlow.publication.length >= 0) {
            this.publications = [];
            if (this.workFlow.publication.length > 0) {

                this.bindEditModeData(this.workFlow.publication);
            }
        }
        else {
            this.row.publicationId = "0";
            this.row.publicationRecordId = "0";
        }
        this.loadPublicationTypes();


    }

    loadPublicationTypes() {
        let publicationTypeIds = [];
        publicationTypeIds.push(0);
        if (this.UpdateMode) {
            this.workFlow.publication.forEach(acc => {
                publicationTypeIds.push(acc.publicationTypeId);
            })
        }
        this.isSpinnerVisible = true;
        this.commonService.autoSuggestionSmartDropDownList('PublicationType', 'PublicationTypeId', 'Name', '', true, 20, publicationTypeIds)
            .subscribe(res => {
                this.isSpinnerVisible = false;
                this.publicationTypes = res.map(x => {
                    return {
                        ...x,
                        publicationTypeId: x.value,
                        name: x.label
                    }
                });
            }, error => {
                this.isSpinnerVisible = false;
            });
    }

    Browse(): void {
        var brws = document.getElementById("myFile");
    }

    ngOnChanges(): void {
    }

    filterfirstName(event) {
        this.firstCollection = [];
        for (let i = 0; i < this.allEmployeeinfo.length; i++) {
            let firstName = this.allEmployeeinfo[i].firstName;
            if (firstName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.firstCollection.push(firstName);
            }
        }
    }

    addRow(): void {
        var newRow = Object.assign({}, this.row);
        newRow.workflowPublicationsId = "0";
        newRow.id = "0";
        newRow.taskId = this.workFlow.taskId;
        newRow.publicationId = "0";
        newRow.publicationRecordId = "0";
        newRow.publicationDescription = "";
        newRow.publicationType = "";
        newRow.sequence = "";
        newRow.source = "";
        newRow.aircraftManufacturer = "";
        newRow.model = "";
        newRow.location = "";
        newRow.revision = "";
        newRow.revisionDate = "";
        newRow.verifiedBy = "";
        newRow.status = "";
        newRow.verifiedDate = "";
        newRow.aircraft = [];
        newRow.aircraftModels = [];
        newRow.workflowPublicationDashNumbers = [];
        newRow.allDashNumbers = [];
        newRow.isDeleted = false;
        newRow.attachmentDetails = []
        this.workFlow.publication.push(newRow);
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }



    getPublicationByItemMasterId(itemMasterId) {
        this.isSpinnerVisible = true;
        this._workflowService.getPublicationsByItemMasterId(itemMasterId).subscribe(res => {
            this.publicationDropdown = res;

            this.isSpinnerVisible = false;
        }, error => {
            this.isSpinnerVisible = false;
        });
    }
    showAlert: boolean = false;
    public onPublicationChange(event, wfPublication, index) {
        console.log("event", wfPublication)
        console.log("workflow", this.workFlow)
        var isEpnExist = this.workFlow.publication.filter(x => x.publicationId == wfPublication.publicationId && x.taskId == this.workFlow.taskId);
        if (isEpnExist.length > 1) {
            wfPublication.publicationId = '';
            wfPublication.publicationDescription = '';
            wfPublication.publicationType = '';
            wfPublication.revisionDate = '';
            wfPublication.sequence = '';
            wfPublication.source = '';
            wfPublication.location = '';
            wfPublication.verifiedBy = '';
            wfPublication.verifiedDate = '';
            wfPublication.status = '';
            wfPublication.attachmentDetails = [];
            this.alertService.showMessage("Workflow", "Pub Id already exist in Exclusion List.", MessageSeverity.error);
            this.showAlert = false;
        }

        const pubData = this.publicationDropdown;
        for (var i = 0; i < pubData.length; i++) {
            if (parseInt(pubData[i].publicationRecordId) === parseInt(wfPublication.publicationId)) {
                wfPublication.attachmentDetails = pubData[i].attachmentDetails;
                break
            }
        }
        if (wfPublication.publicationId == 0) {
            this.setPublicationData(null, wfPublication);
            return;
        }
        if (this.publications != undefined) {
            var selectedPublication = this.publications.filter(function (publication) {
                return publication.publicationRecordId == wfPublication.publicationId;
            });
            if (selectedPublication.length == 0) {
                this.loadPublicationById(wfPublication, true);
            }
            else {
                this.setPublicationData(selectedPublication[0], wfPublication);
            }
        }
        else {
            this.publications = [];
            this.loadPublicationById(wfPublication, true);
        }
    }
    setAircraftArray: any = [];
    setModelArray: any = [];
    setDashNumberArray: any = [];
    getAircraftByPublicationId(data, index) {
        this.setAircraftArray = [];
        this.isSpinnerVisible = true;
        this.setAircraftArray.push(data.aircraftManufacturer ? data.aircraftManufacturer : 0);
        this.publicationService.getAircraftManfacturerByPublicationId(this.itemMasterId, data.publicationId ? data.publicationId : data, this.setAircraftArray.join()).subscribe(res => {
            this['aircraftListByPubId' + index] = res;
            this.isSpinnerVisible = false;
        }, error => {
            this.isSpinnerVisible = false;
        });
    }

    getModelByAircraftId(x, index) {
        this.setModelArray = [];
        this.setModelArray.push(x.model ? x.model : 0);
        this.publicationService.getAircraftModelByAircraftManfacturerId(this.itemMasterId, x.publicationId, x.aircraftManufacturer, this.setModelArray.join()).subscribe(res => {
            this['aircraftModelListByPubId' + index] = res;
        }, error => {
            this.isSpinnerVisible = false;
        });
    }

    getDashNumberByModelandAircraftIds(x, index, from) {
        this.setDashNumberArray = [];
        this.isSpinnerVisible = true;
        if (x && x.workflowPublicationDashNumbers && x.workflowPublicationDashNumbers.length != 0) {
            x.workflowPublicationDashNumbers.forEach(element => {
                this.setDashNumberArray.push(element.aircraftDashNumberId)
            });
        } else {
            this.setDashNumberArray.push(0);
        }
        this.publicationService.getDashNumberByModelandAircraftIds(this.itemMasterId, x.publicationId, x.aircraftManufacturer, x.model, this.setDashNumberArray.join()).subscribe(res => {
            this.isSpinnerVisible = false;
            this['dashNumberListByModelId' + index] = res.map(x => {
                return {
                    // ...x,
                    AircraftDashNumberId: x.dashNumberId,
                    dashNumberId: x.dashNumberId,
                    dashNumber: x.dashNumber,

                }
            });
            if (from == 'html') {
                this.workFlow.publication[index].workflowPublicationDashNumbers = null;
            }
        }, error => {
            this.isSpinnerVisible = false;
        })
    }

    getDynamicVariableData(variable, index) {
        return this[variable + index]
    }

    private getUniqueAircraft(aircraftMapping: any[]): any[] {
        var aircraft = [];
        var distinctAircraftIds = [];
        for (var i = 0; i < aircraftMapping.length; i++) {
            if (aircraftMapping[i].aircraftTypeId != undefined && distinctAircraftIds.indexOf(aircraftMapping[i].aircraftTypeId) == -1) {
                aircraft.push(aircraftMapping[i]);
                distinctAircraftIds.push(aircraftMapping[i].aircraftTypeId);
            }
        }

        return aircraft;
    }

    private getUniqueAircraftModels(publication: any): any[] {
        var aircraftModels = [];
        var distinctAircraftModelIds = [];

        for (var i = 0; i < publication.itemMasterAircraftMapping.length; i++) {
            if (publication.itemMasterAircraftMapping[i].aircraftModelId != undefined &&
                publication.itemMasterAircraftMapping[i].aircraftTypeId == publication.aircraftManufacturer &&
                distinctAircraftModelIds.indexOf(publication.itemMasterAircraftMapping[i].aircraftModelId) == -1) {
                aircraftModels.push(publication.itemMasterAircraftMapping[i]);
                distinctAircraftModelIds.push(publication.itemMasterAircraftMapping[i].aircraftModelId);
            }
        }

        return aircraftModels;
    }

    private getUniqueAircraftDashNumbers(publication: any): any[] {
        var aircraftDashNumbers = [];
        var distinctAircraftaircraftDashNumbersIds = [];

        for (var i = 0; i < publication.itemMasterAircraftMapping.length; i++) {
            if (publication.itemMasterAircraftMapping[i].dashNumberId != undefined &&
                publication.itemMasterAircraftMapping[i].aircraftTypeId == publication.aircraftManufacturer &&
                publication.itemMasterAircraftMapping[i].aircraftModelId == publication.model &&

                distinctAircraftaircraftDashNumbersIds.indexOf(publication.itemMasterAircraftMapping[i].dashNumberId) == -1) {
                aircraftDashNumbers.push(publication.itemMasterAircraftMapping[i]);
                distinctAircraftaircraftDashNumbersIds.push(publication.itemMasterAircraftMapping[i].aircraftTypeId);
            }
        }

        return aircraftDashNumbers;
    }

    bindEditModeData(data) {
        this.workFlow.publication = data.map((x, index) => {
            if (x.publicationId) {
                this.getAircraftByPublicationId(x, index);
                this.getModelByAircraftId(x, index);
                this.getDashNumberByModelandAircraftIds(x, index, 'onload');
            }
            return {
                ...x
            }
        })
    }

    private loadPublicationById(wfPublication: any, isDropdownChange: boolean) {
        this.isSpinnerVisible = true;
        this.publicationService.getPublicationForWorkFlow(wfPublication.publicationId).subscribe(
            res => {
                this.isSpinnerVisible = false;
                if (res[0] != undefined && res[0] != null) {
                    this.publications.push(res[0]);

                    if (wfPublication.publicationId == res[0].publicationRecordId) {
                        wfPublication.itemMasterAircraftMapping = res[0].itemMasterAircraftMapping;

                        wfPublication.aircraft = this.getUniqueAircraft(res[0].itemMasterAircraftMapping);

                        if (!isDropdownChange) {
                            wfPublication.aircraftModels = this.getUniqueAircraftModels(wfPublication);
                            wfPublication.allDashNumbers = this.getUniqueAircraftDashNumbers(wfPublication);

                        }
                        else {
                            wfPublication.aircraftModels = [];
                            wfPublication.allDashNumbers = [];
                            wfPublication.workflowPublicationDashNumbers = [];
                        }

                        if (isDropdownChange) {
                            this.setPublicationData(res[0], wfPublication);
                        }
                    }
                }
            }, error => {
                this.isSpinnerVisible = false;
            });
    }

    downloadFileUpload(rowData) {
        console.log("lin", rowData);
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadattachedfile?filePath=${rowData.link}`;
        window.location.assign(url);
    }

    private filterUniqueCombination(publication: any): void {
        var pubs = [];

        for (var imm of publication.itemMasterAircraftMapping) {
            var existingPublication = pubs.filter(x =>
                x.aircraftTypeId == imm.aircraftTypeId
                && x.aircraftModelId == imm.aircraftModelId
                && x.dashNumberId == imm.dashNumberId);

            if (existingPublication.length == 0) {
                pubs.push(imm);
            }
        }
        publication.itemMasterAircraftMapping = pubs;
    }

    private setPublicationData(selectedPublication: any, row: any) {
        if (selectedPublication != null) {
            row.publicationDescription = selectedPublication.description != null ? selectedPublication.description : '';
            row.revisionDate = selectedPublication.revisionDate != null ? new Date(selectedPublication.revisionDate).toLocaleDateString() : '';
            row.publicationType = selectedPublication.publicationTypeId != null ? selectedPublication.publicationTypeId : '';
            row.sequence = selectedPublication.sequence != null ? selectedPublication.sequence : '';
            row.aircraftManufacturer = '0';
            row.itemMasterAircraftMapping = selectedPublication.itemMasterAircraftMapping;
            row.aircraft = this.getUniqueAircraft(selectedPublication.itemMasterAircraftMapping);
            row.source = selectedPublication.asd != null ? selectedPublication.asd : '';
            row.model = '0';
            row.aircraftModels = [];
            row.allDashNumbers = [];
            row.location = selectedPublication.location != null ? selectedPublication.location : '';
            row.verifiedBy = selectedPublication.verifiedBy != null ? selectedPublication.verifiedBy : '';
            row.status = selectedPublication.isActive != null ? selectedPublication.isActive : '';
            row.verifiedDate = selectedPublication.verifiedDate != undefined ? new Date(selectedPublication.verifiedDate).toLocaleDateString() : '';
        }
        else {
            row.publicationDescription = '';
            row.revisionDate = '';
            row.publicationType = 0;
            row.sequence = '';
            row.aircraftManufacturer = '0';
            row.aircraft = [];
            row.source = '';
            row.model = '0';
            row.workflowPublicationDashNumbers = [];
            row.itemMasterAircraftMapping = [];
            row.aircraftModels = [];
            row.allDashNumbers = [];
            row.location = '';
            row.verifiedBy = '';
            row.status = 0;
            row.verifiedDate = '';
        }
    }

    public getAircraftModels(publication) {
        publication.aircraftModels = this.getUniqueAircraftModels(publication);
        publication.model = '0';
        publication.workflowPublicationDashNumbers = [];
        publication.allDashNumbers = [];
    }

    getDashNumbers(event, publication): void {
        var uniquePublication = this.workFlow.publication.filter(x => x.taskId == this.workFlow.taskId && x.publicationId == publication.publicationId
            && x.aircraftManufacturer == publication.aircraftManufacturer
            && x.model == publication.model);

        if (uniquePublication.length > 1) {
            event.target.value = '0';
            this.alertService.showMessage('Publication', 'Same combination is already in use, try other combination', MessageSeverity.error);
            return;
        }

        publication.allDashNumbers = this.getUniqueAircraftDashNumbers(publication);
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

    loadMasterCompanies() {
        this.isSpinnerVisible = true;
        this.masterComapnyService.getMasterCompanies().subscribe(
            res => {
                this.isSpinnerVisible = false;
                this.allComapnies = res;
            }
            , error => {
                this.isSpinnerVisible = false;
            });
    }

    getFilesByPublicationId(publicationRecordId) {
        this.isSpinnerVisible = true;
        this.publicationService.getFilesBypublication(publicationRecordId).subscribe(res => {
            this.attachmentList = res || [];
            this.isSpinnerVisible = false;
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

    viewPublicationDetails(row) {
        row = { ...row, publicationRecordId: row.publicationId };
        this.closeAllCollapse();
        this.isActive = row.isActive;
        this.loadMasterCompanies();
        this.getFilesByPublicationId(row.publicationRecordId);

        //get general info
        this.isSpinnerVisible = true;
        this.publicationService.getpublicationbyIdView(row.publicationRecordId).subscribe(res => {
            this.generalInfo = res[0];
            this.isSpinnerVisible = false;
        }, error => {
            this.isSpinnerVisible = false;
        });

        //get PN Mapping info
        this.isSpinnerVisible = true;
        this.publicationService.getPublicationPNMapping(row.publicationRecordId)
            .subscribe(res => {
                this.isSpinnerVisible = false;
                this.pnMappingList = res.map(x => {
                    return {
                        ...x,
                        partNumber: x.partNumber,
                        partDescription: x.partDescription,
                        itemClassification: x.itemClassification
                    };
                });
            }, error => {
                this.isSpinnerVisible = false;
            });

        //get aircraft info
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
            }, error => {
                this.isSpinnerVisible = false;
            });

        // get ata chapter info
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
        $('#view1').modal('show');
        $('#step1').collapse('show');
    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }

    onDataLoadFailed(log) {
        const errorLog = log;
        var msg = '';
        if (errorLog.message) {
            if (errorLog.error && errorLog.error.errors.length > 0) {
                for (let i = 0; i < errorLog.error.errors.length; i++) {
                    msg = msg + errorLog.error.errors[i].message + '<br/>'
                }
            }
            this.alertService.showMessage(
                errorLog.error.message,
                msg,
                MessageSeverity.error
            );
        }
        else {
            this.alertService.showMessage(
                'Error',
                log.error,
                MessageSeverity.error
            );
        }
    }
    dismissModel() {
        this.modal.close();
    }
    deletedRowIndex: any;
    deleteRowRecord: any = {};
    openDelete(content, row, index) {
        this.deletedRowIndex = index;
        this.publicationDropdown.forEach(element => {
            if (element.publicationRecordId == row.publicationId) {
                row.publication = element.publicationId;
            }
        });
        this.deleteRowRecord = row;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    deleteRow(): void {
        if (this.workFlow.publication[this.deletedRowIndex].id == "0" || this.workFlow.publication[this.deletedRowIndex].id == "") {
            this.workFlow.publication.splice(this.deletedRowIndex, 1);
        }
        else {
            this.workFlow.publication[this.deletedRowIndex].isDeleted = true;
            this.workFlow.publication[this.deletedRowIndex].isDelete = true;
        }
        this.dismissModel();
    }

}