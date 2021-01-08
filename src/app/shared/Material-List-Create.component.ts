import { Component, Input, OnChanges, OnInit, EventEmitter, Output, OnDestroy } from "@angular/core";
import { IWorkFlow } from "../Workflow/WorkFlow";
import { IMaterialCondition } from "../Workflow/MaterialCondition";
import { IMaterialMandatory } from "../Workflow/MaterialMandatory";
import { IMaterialUOM } from "../Workflow/MaterialUOM";
import { ActionService } from "../Workflow/ActionService";
import { IMaterialList } from "../Workflow/MaterialList";
import { VendorService } from "../services/vendor.service";
import { ConditionService } from "../services/condition.service";
import { ItemClassificationService } from "../services/item-classfication.service";
import { UnitOfMeasureService } from "../services/unitofmeasure.service";
import { ItemMasterService } from "../services/itemMaster.service";
import { AlertService, MessageSeverity } from "../services/alert.service";
import { WorkOrderQuoteService } from "../services/work-order/work-order-quote.service";
import { NgForm } from "@angular/forms";
import * as $ from 'jquery';
import * as cloneDeep from 'lodash/cloneDeep';
import { CommonService } from "../services/common.service";
import { AtaSubChapter1Service } from "../services/atasubchapter1.service";
import { getValueFromArrayOfObjectById, formatNumberAsGlobalSettingsModule } from "../generic/autocomplete";
import { MasterComapnyService } from "../services/mastercompany.service";
import { MasterCompany } from "../models/mastercompany.model";
import { ATASubChapter } from "../models/atasubchapter.model";

@Component({
    selector: 'grd-material',
    templateUrl: './Material-List-Create.component.html',
    styleUrls: ['./Material-List-Create.component.css']
})
export class MaterialListCreateComponent implements OnInit, OnChanges {
    @Input() workFlowObject;
    partCollection: any[] = [];
    itemclaColl: any[] = [];
    allPartnumbersInfo: any[] = [];
    allUomdata: any[] = [];
    itemClassInfo: any[] = [];
    AltEquPartInfo: any = [];
    allconditioninfo: any[] = [];
    partListData: any[] = [];
    isEnableItemMasterView: boolean = true;
    isViewItemMasterNHA: boolean = true;
    isViewItemMasterTLA: boolean = true;
    isViewItemMasterAlternate: boolean = true;
    isViewItemMasterEquivalency: boolean = true;
    itemMasterView = false;
    @Input() isWorkOrder = false;
    @Input() isEdit = false;
    @Input() editData;
    @Input() isQuote = false;
    @Input() taskList: any = [];
    @Input() workFlow: IWorkFlow;
    @Input() markupList;
    @Input() UpdateMode: boolean;
    @Input() isWorkFlow: boolean = false;
    @Input() mpnPartNumbersList: any = [];
    @Output() workFlowChange = new EventEmitter();
    @Output() saveMaterialListForWO = new EventEmitter();
    @Output() updateMaterialListForWO = new EventEmitter();
    @Input() isSubWorkOrder=false;
    @Input() unitOfMeasuresList = [];
    @Input() percentageListFromSource = [];
    @Input() conditionsListFromSource = [];
    @Input() isView: boolean = false;
    @Output() notify: EventEmitter<IWorkFlow> =
        new EventEmitter<IWorkFlow>();
    materialCondition: any = [];
    materialMandatory: IMaterialMandatory[];
    materialUOM: any[] = [];
    row: any;
    sourceWorkFlow: any = {};
    errorMessage: string;
    allPartDetails: any[] = [];
    totalCost: number = 0;
    globalDeffered = false;
    isDeferredBoolean: any = false;
    currentPage: number = 1;
    itemsPerPage: number = 10;
    variableIdOfNew: any[];
    defaultUOMId: number;
    defaultConditionId: any;
    itemMasterId: any;
    allUploadedDocumentsList: any;
    viewItemMaster: any = {};
    partNumber: any;
    description: any;
    isAlternatePartChecked: boolean;
    isSerialized: any;
    isTimeLife: any;
    nha: any;
    stockLevel: any;
    nationalStockNumber: any;
    itemClassificationId: any;
    manufacturerId: any;
    priorityId: any;
    currencyId: any;
    stockUnitOfMeasureId: any;
    purchaseUnitOfMeasureId: any;
    itemGroupId: any;
    isAcquiredMethodBuy: any;
    expirationDate: any;
    isReceivedDateAvailable: any;
    isManufacturingDateAvailable: any;
    isTagDateAvailable: any;
    isOpenDateAvailable: any;
    isShippedDateAvailable: any;
    isOtherDateAvailable: any;
    provisionId: any;
    isHazardousMaterial: any;
    selectedAircraftTypes: any;
    isEnabeCapes: any;
    pma: any;
    der: any;
    ataMainId: any;
    isSchematic: any;
    overhaulHours: any;
    rpHours: any;
    testHours: any;
    turnTimeOverhaulHours: any;
    turnTimeRepairHours: any;
    rfqTracking: any;
    manufacturingDays: any;
    listPrice: any;
    glAccountId: any;
    exportCurrencyId: any;
    consumeUnitOfMeasureId: any;
    soldUnitOfMeasureId: any;
    leadTimeDays: any;
    leadTimeHours: any;
    reorderPoint: any;
    reorderQuantiy: any;
    minimumOrderQuantity: any;
    isExchangeInfoAvailable: any;
    exportWeight: any;
    exportValue: any;
    salesMarkUpOnListPrice: any;
    createdBy: any;
    exportClassificationId: any;
    exportSizeLength: any;
    exportSizeWidth: any;
    exportSizeHeight: any;
    updatedBy: any;
    memo: any;
    createddate: any;
    updatedDate: any;
    orginalAtaSubChapterValues: ATASubChapter[] = [];
    aircraftListDataValues: any;
    ataMappedList: any;
    filterManufacturerData: any[];
    filterDiscriptionData: any[];
    filterPartItemClassificationData: any[];
    ntaeData: any;
    ntaeData2: any;
    ntaeData3: any;
    ntaeData4: any;
    purchaseSalesInfo: any = [];
    exchangeLoanInfo: any = {};
    viewItemMasterNS: any = {};
    aircraftauditHistory: any = [];
    pageSize: number = 10;
    cols = [
        { field: 'partNumber', header: 'PN' },
        { field: 'partDescription', header: 'PN Description' },
        { field: 'manufacturerdesc', header: 'Manufacturer' },
        //{ field: '', header: 'Material Type' },
        { field: 'classificationdesc', header: 'Classification' },
        //{ field: '', header: 'capes' },
        { field: 'itemGroup', header: 'Group Name' },
        //{ field: '', header: ' Aircraft Manufacturer' },
        { field: 'nationalStockNumber', header: 'NSN' },
        { field: 'isSerialized', header: 'S/N' },
        { field: 'isTimeLife', header: 'Time Life' },
        //{ field: 'updatedDate', header: 'Updated Date' },
        //{ field: 'createdDate', header: 'Created Date' }
    ];
    cols1 = [
        //{ field: 'actionId', header: 'Action Id' },
        { field: 'partNumber', header: 'PN' },
        { field: 'partDescription', header: 'Description' },
        { field: 'isHazardousMaterial', header: 'Is Hazardous Material' },
        { field: 'manufacturerdesc', header: 'Manufacturer' },
        { field: 'unitCost', header: 'Unit Cost' },
        { field: 'listPrice', header: 'List Price' },

        //{ field: 'updatedDate', header: 'Updated Date' },
        //{ field: 'createdDate', header: 'Created Date' }


    ];
    colsaircraftLD: any[] = [
        { field: "aircraft", header: "Aircraft" },
        { field: "model", header: "Model" },
        { field: "dashNumber", header: "Dash Numbers" },
        { field: "memo", header: "Memo" }
    ];

    atasub: any[] = [
        { field: 'ataChapterName', header: 'ATA Chapter' },
        { field: 'ataSubChapterDescription', header: 'ATA Sub-Chapter' }
    ];

    pnCols1 = [
        { field: 'partNo', header: 'PN' },
        { field: 'pnDiscription', header: 'PN Description' },
        { field: 'capabilityType', header: 'Cap Type' },
        { field: 'level1', header: 'Level 01' },
        { field: 'level2', header: 'Level 02' },
        { field: 'level3', header: 'Level 03' },
        { field: 'level4', header: 'Level 04' },
        { field: 'isVerified', header: 'Verified' },
        { field: 'verifiedBy', header: 'Verified By' },
        { field: 'verifiedDate', header: 'Date Verified' },
        { field: 'memo', header: 'Memo' }
    ];


    alterTableColumns: any[] = [
        { field: "altPartNo", header: "PN" },
        { field: "altPartDescription", header: "Description" },
        { field: "manufacturer", header: "Manufacturer " }
    ];
    //nhaTableColumns: any[] = [
    //    { field: "altPartNo", header: "PN" },
    //    { field: "altPartDescription", header: "Description" },
    //    { field: "manufacturer", header: "Manufacturer " }
    //];
    //tlaTableColumns: any[] = [
    //    { field: "altPartNo", header: "PN" },
    //    { field: "altPartDescription", header: "Description" },
    //    { field: "manufacturer", header: "Manufacturer " }
    //];
    equivalencyTableColumns: any[] = [
        { field: "altPartNo", header: "PN" },
        { field: "altPartDescription", header: "Description" },
        { field: "manufacturer", header: "Manufacturer " },
        { field: "itemClassification", header: "ITEM CLASSIFICATION " },
    ];
    provisionListData: any=[];
    conditionList: any=[];
    constructor(private actionService: ActionService,
        private commonService: CommonService,
        private itemMasterService: ItemMasterService,
        private atasubchapter1service: AtaSubChapter1Service,
        private workOrderQuoteService: WorkOrderQuoteService,
        private itemser: ItemMasterService,
        private vendorService: VendorService,
        private alertService: AlertService,
        public unitofmeasureService: UnitOfMeasureService,
        public itemClassService: ItemClassificationService,
        private masterComapnyService: MasterComapnyService, ) {
    }
    percentageList: any;

    // constructor(private actionService: ActionService,
    //     private commonservice : CommonService,
    //     private itemser: ItemMasterService, 
    // private vendorService: VendorService, 
    // private conditionService: ConditionService,
    //  public itemClassService: ItemClassificationService,
    //   public unitofmeasureService: UnitOfMeasureService,
    //    private alertService: AlertService, 
    //    private workOrderQuoteService: WorkOrderQuoteService) {

    // }

    defaultMaterialMandatory: string;

    ngOnInit(): void {        
        // this.row = this.workFlow.materialList[0];
        // if (this.row == undefined) {
        //     this.row = {};
        // }
        // this.row.taskId = this.workFlow.taskId;

this.isSubWorkOrder=this.isSubWorkOrder;
        if (this.isWorkOrder) {
            this.row = this.workFlow.materialList[0];
            // console.log(this.editData);
            if (this.isEdit) {
                this.workFlow.materialList = [];
                // this.getPartConditions(this.editData,0);
                // const data = {
                //     ...this.editData,
                //     partDescription: this.editData.epnDescription,
                //     partNumber: this.editData.epn,

                // }

                // console.log(this.editData);

                // this.getPartConditions(this.editData, 0);  // for new conditions
                // this.loadAltEquPartInfoData({ itemMasterId: this.editData.itemMasterId }, 0)

                this.workFlow.materialList.push(this.editData);
                this.reCalculate();
            } else {
                this.workFlow.materialList = [];
                // this.row = this.workFlow.materialList[0];
                // console.log("thiss", this.row);
                this.addRow();
                this.workFlow.materialQtySummation = 0;
                this.workFlow.materialExtendedCostSummation = 0;
                this.workFlow.totalMaterialCost = 0;
                this.workFlow.materialExtendedPriceSummation = 0;
            }

        } else {
            // this.row = this.workFlow.materialList[0];
            if (this.row == undefined) {
                this.row = {};
            }
            this.row.taskId = this.workFlow.taskId;
            this.workFlow.materialList.map((x, index) => {
                // console.log(x);

                // this.getPartConditions(x, index),
                    this.getPNDetails(x);
            })
        }

        if (this.isQuote && this.editData.length > 0) {
            this.workFlow.materialList = this.editData;
        }
        else if (this.isQuote) {
            this.workFlow.materialList = [];
            this.addRow();
        }





        // this.actionService.GetMaterialMandatory().subscribe(
        //     mandatory => {
        //         this.materialMandatory = mandatory;
        //         this.defaultMaterialMandatory = 'Mandatory';
        //         if ((this.workFlow.workflowId == undefined || this.workFlow.workflowId == '0') && this.workFlow.materialList[0] != undefined) {
        //             this.workFlow.materialList[0].mandatorySupplementalId = 1;
        //         }
        //     },
        //     error => this.errorMessage = <any>error
        // );
        this.commonService.smartDropDownList('MaterialMandatories', 'Id', 'Name').subscribe(
        mandatory => {
            this.materialMandatory = mandatory.map(x => {
                    return {
                        id: x.value,
                        name: x.label
                    }
                  });
                //   console.log("this.materialMandatory",this.materialMandatory);
            this.defaultMaterialMandatory = 'Mandatory';
            if ((this.workFlow.workflowId == undefined || this.workFlow.workflowId == '0') && this.workFlow.materialList[0] != undefined) {
                this.workFlow.materialList[0].mandatorySupplementalId = 1;
            }
        },
        err => {
            // this.isSpinnerVisible = false;
            this.errorHandling(err);
        }
    );


        // this.loadConditionData();
        // this.loadItemClassData();
        // this.loadPartData();
        // this.loadUOMData();
        if(!this.isView){
            this.getPartnumbers('');
        }
        this.getAllPercentage();
        if (this.isWorkOrder || this.isQuote) {
        this.provisionList();
        this.getConditionsList();
        }
        //    this.loadAltEquPartInfoData();
        // if (this.UpdateMode) {
        //     this.reCalculate();

        // }
    }
    


    ngOnChanges() {
        if(this.workFlow) {
            this.getConditionsList();
            if(this.workFlow.materialList.length > 0) {
                this.workFlow.materialList = this.workFlow.materialList.map(x => {
                    return {
                        ...x,
                        quantity: x.quantity ? formatNumberAsGlobalSettingsModule(x.quantity, 0) : '0',
                        unitCost: x.unitCost ? formatNumberAsGlobalSettingsModule(x.unitCost, 2) : '0.00',
                        extendedCost: x.extendedCost ? formatNumberAsGlobalSettingsModule(x.extendedCost, 2) : '0.00',
                        price: x.price ? formatNumberAsGlobalSettingsModule(x.price, 2) : '0.00',
                        extendedPrice: x.extendedPrice ? formatNumberAsGlobalSettingsModule(x.extendedPrice, 2) : '0.00'
                    }
                })
            }
        }
        if (this.UpdateMode) {
            this.reCalculate();
        }
        if (this.isQuote && this.editData.length > 0) {
            this.workFlow.materialList = this.editData;
            // this.getPartConditions(this.editData[0], 0);
        }
        else if(this.isQuote && (!this.editData || this.editData.length <= 0)){
            this.workFlow.materialList = [];
            this.addRow();
        }
        // else  {

        // }
        // if (this.workFlow.materialList && this.workFlow.materialList.length == 0)
        // this.row = this.workFlow.materialList[0];
        // if (!this.isWorkFlow) {
        // }
        // console.log("event changes")
    }

    onSelectMaterialManditory(rowData){
        this.materialMandatory.forEach(
            x=>{
                if(x['id'] == rowData.mandatorySupplementalId){
                    rowData['mandatoryOrSupplemental'] = x['name'];
                }
            }
        )
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
    getConditionsList() {
        if(this.conditionsListFromSource.length == 0){
            this.commonService.smartDropDownList('Condition', 'ConditionId', 'Description').subscribe(res => {
                this.conditionList = res;
            },
            err => {
                // this.isSpinnerVisible = false;
                this.errorHandling(err);
            })
        }
        else{
            this.conditionList = this.conditionsListFromSource.map(x=>{ return {label: x.description, value: x.conditionId}});
        }
    }

    onTaskChhange(task) {
        this.taskList.forEach((t)=>{
            if(t.taskId == task.taskId){
                task['taskName'] = t.description;
            }
        })
    }

    reCalculate() {
        this.calculateExtendedCostSummation();
        this.calculateQtySummation();
        this.calculatePriceSummation();
        this.calculateExtendedPriceSummation();
    }

    filterpartItems(event) { 
        this.partCollection = [];
        this.itemclaColl = [];
        if (this.allPartnumbersInfo != undefined && this.allPartnumbersInfo.length > 0) {
            for (let i = 0; i < this.allPartnumbersInfo.length; i++) {
                let partName = this.allPartnumbersInfo[i].partNumber;
                let canPush = true;
                for(let mpnPartIndex = 0; mpnPartIndex<this.mpnPartNumbersList.length; mpnPartIndex++){
                    if(this.mpnPartNumbersList[mpnPartIndex]['label'] == partName){
                        canPush = false;
                    }
                }
                if (partName.toLowerCase().indexOf(event.query.toLowerCase()) == 0 && canPush) {
                    var alreadySelected = this.workFlow.materialList.find(x => x.itemMasterId == this.allPartnumbersInfo[i].itemMasterId && this.workFlow.taskId == x.taskId);
                    if (this.workFlow.partNumber != this.allPartnumbersInfo[i].itemMasterId && alreadySelected == undefined) {
                        this.itemclaColl.push([{
                            "partId": this.allPartnumbersInfo[i].itemMasterId,
                            "partName": partName,
                            "description": this.allPartnumbersInfo[i].partDescription,
                            "masterCompanyId": this.allPartnumbersInfo[i].masterCompanyId,
                            "itemClassificationId": this.allPartnumbersInfo[i].itemClassificationId,
                            "itemClassification":this.allPartnumbersInfo[i].itemClassification,
                            "unitOfMeasureId":this.allPartnumbersInfo[i].unitOfMeasureId,
                            "unitOfMeasure":this.allPartnumbersInfo[i].unitOfMeasure,
                            "stockType":this.allPartnumbersInfo[i].stockType
                        }]);
                        this.partCollection.push(partName);
                    }
                }
            }
        }
    }

    onPartSelect(event, material, index) {
        // console.log("list sear", event, material);

        if (this.itemclaColl) {
            var materialObj = this.workFlow.materialList.find(x => x.partNumber == event && x.taskId == this.workFlow.taskId);

            var itemMasterId = this.itemclaColl.find(x => x[0].partName == event)[0].partId;

            if (materialObj != undefined) {
                if (this.workFlow.exclusions) {
                    var isPartExcluded = this.workFlow.exclusions.find(x => x.itemMasterId != '' && x.itemMasterId == itemMasterId && x.taskId == this.workFlow.taskId)
                    if (isPartExcluded != undefined) {
                        material.itemMasterId = '';
                        material.partDescription = '';
                        material.partNumber = '';
                        material.itemClassificationId = '';
                        material.masterCompanyId = '';
                        material.partName = '';
                        event = '';
                        this.alertService.showMessage("Workflow", "Part Number already exist in Exclusion List.", MessageSeverity.error);
                        return;
                    }
                }
            }
// console.log("itemclas",this.itemclaColl);
            for (let i = 0; i < this.itemclaColl.length; i++) {
                if (event == this.itemclaColl[i][0].partName) {
                    material.itemMasterId = this.itemclaColl[i][0].partId;
                    material.partDescription = this.itemclaColl[i][0].description;
                    material.partNumber = this.itemclaColl[i][0].partName;
                    material.masterCompanyId = this.itemclaColl[i][0].masterCompanyId ? this.itemclaColl[i][0].masterCompanyId :1;
                    // material.unitOfMeasureId = this.allPartDetails.find(x => x.itemMasterId == material.itemMasterId).purchaseUnitOfMeasureId;
                    // material.stockType = this.allPartDetails.find(x => x.itemMasterId == material.itemMasterId).stockType;
                    material.stockType=this.itemclaColl[i][0].stockType;
                    material.itemClassificationId = this.itemclaColl[i][0].itemClassificationId;
                    material.itemClassification=this.itemclaColl[i][0].itemClassification;
                    material.unitOfMeasure=this.itemclaColl[i][0].unitOfMeasure;
                    material.unitOfMeasureId=this.itemclaColl[i][0].unitOfMeasureId;
                }
            };

            material.conditionCodeId= this.conditionList[0].value;
            this.getPNDetails(material);
        }

        // this.getPartConditions(material, index)
        // this.loadAltEquPartInfoData(material, index);
    }
    clearautoCompleteInput(currentRecord, field) {
        currentRecord[field] = null;
    }

    provisionList(){
        this.commonService.smartDropDownList('Provision', 'ProvisionId', 'Description').subscribe(res => {
        //    console.log("sub work order list",this.isSubWorkOrder)
           this.provisionListData=[];
            if(this.isSubWorkOrder){
                res.forEach(element => {
                    if(element.label!="Sub Work Order"){
                        this.provisionListData.push(element);
                    }
                });
                // this.provisionListData = res;
                // console.log("provision list",this.provisionListData)
            }else{
                this.provisionListData = res;
            }
            // console.log("this.provisionsdfsdf",this.provisionListData)
        },
        err => {
            // this.isSpinnerVisible = false;
            this.errorHandling(err);
        }) 
    }
    getAllPercentage() {
        if(this.percentageListFromSource.length == 0){
            this.commonService.smartDropDownList('[Percent]', 'PercentId', 'PercentValue').subscribe(res => {
                this.percentageList = res;
            },
            err => {
                // this.isSpinnerVisible = false;
                this.errorHandling(err);
            })
        }
        else{
            this.percentageList = this.percentageListFromSource;
        }
    }
    getPartnumbers(value){
        this.commonService.getPartnumList(value).subscribe(res=>{
            // console.log("res",res)
            this.allPartnumbersInfo = res;
        },
        err => {
            // this.isSpinnerVisible = false;
            this.errorHandling(err);
        }) 
    }
 
    // private ptnumberlistdata() {
        // this.itemser.getPrtnumberslistList().subscribe(
        //     results => this.onptnmbersSuccessful(results[0]),
        // );

       
    // }

    // private onptnmbersSuccessful(allWorkFlows: any[]) {
    //     this.allPartnumbersInfo = allWorkFlows;
    // }

    // private loadPartData() {
    //     this.vendorService.getPartDetails().subscribe(
    //         data => {
    //             this.allPartDetails = data[0];

    //             if (this.vendorService.isEditMode == false) {

    //                 for (let i = 0; i < this.partListData.length; i++) {
    //                     this.partListData[i].partListObj = this.allPartDetails;
    //                 }
    //             }
    //         })
    // }

    // private loadConditionData() {
    //     this.conditionService.getConditionList().subscribe(data => {
    //         console.log("common condition list",data[0])
    //         this.materialCondition = data[0];
    //         var defaultCondition = this.materialCondition.find(x => x.description.trim().toLowerCase() == "new");

    //         this.defaultConditionId = defaultCondition != undefined ? defaultCondition.conditionId : 0;

    //         if ((this.workFlow.workflowId == undefined || this.workFlow.workflowId == '0') && !this.isEdit && this.workFlow.materialList[0] != undefined) {
    //             this.workFlow.materialList[0].conditionCodeId = this.defaultConditionId;
    //         }
    //     })
    // }
    partconditionsList = [];
    async getPartConditions(part, index) {
        // this.materialCondition = [];
        // console.log("index", index)
        if (part) {
            await this.workOrderQuoteService.getPartConditions(part.itemMasterId).subscribe(
                res => {
                    this.materialCondition = res;
                    // console.log("res", res);
                    if (this.materialCondition && this.materialCondition.length > 0) {

                        this['partconditionsList' + index] = this.materialCondition;
                        var defaultCondition = this['partconditionsList' + index].find(x => x.condition.trim().toLowerCase() == "new");
                        this.defaultConditionId = defaultCondition != undefined ? defaultCondition.conditionId : this.materialCondition[0].conditionId;
                        // console.log("conditionid", this.defaultConditionId);
                        if ((this.workFlow.workflowId == undefined || this.workFlow.workflowId == '0') && !this.isEdit && this.workFlow.materialList[index] != undefined) {
                            this.workFlow.materialList[index].conditionCodeId = this.defaultConditionId;
                        }
                        this.getPNDetails(this.workFlow.materialList[index]);
                    } else {
                        this['partconditionsList' + index] = [];
                    }

                },
                err => {
                    // this.isSpinnerVisible = false;
                    this.errorHandling(err);
                }
            )
        }
    }

    getProvisionDetails(event,part, index){

    }

    // private loadItemClassData() {
        // this.itemClassService.getWorkFlows().subscribe(data => { this.itemClassInfo = data[0] });
//         this.commonService.smartDropDownList('ItemClassification', 'ItemClassificationId', 'Description').subscribe(res => {
//             this.itemClassInfo = res.map(x => {
//                 return {
//                     itemClassificationId: x.value,
//                     description: x.label
//                 }
//               });
// console.log("res",this.itemClassInfo);
//          })
//     }

    altequPartList = [];
    async loadAltEquPartInfoData(data, index) {
        if (data) {
            await this.itemClassService.loadAltEquPartInfoData(data.itemMasterId).subscribe(res => {
                this.AltEquPartInfo = res;
                this['altequPartList' + index] = this.AltEquPartInfo;
                // console.log("conditions", res);
                if (this.AltEquPartInfo && this.AltEquPartInfo.length > 0) {


                    if ((this.workFlow.workflowId == undefined || this.workFlow.workflowId == '0') && !this.isEdit && this.workFlow.materialList[0] != undefined) {
                        this.workFlow.materialList[0].AltEquPartDescription = this.altequPartList[index][0].partDescription
                    }
                } else {
                    this.workFlow.materialList[0].AltEquPartId = '';
                    this.workFlow.materialList[0].AltEquPartDescription = '';
                }


            },
            err => {
                // this.isSpinnerVisible = false;
                this.errorHandling(err);
            });
        }
    }
    // getaltequDetails(event, material, index) {
    //     // var defaultCondition = this.materialCondition.find(x => x.condition.toLowerCase() == "new");
    //     console.log("event", event, material, index);
    //     // this.workFlow.materialList[index].AltEquPartId = event.target.value;
    //     this.workFlow.materialList[index].AltEquPartDescription = this.materialCondition.find(x => {
    //         if (x.partNumber == event.target.value) {
    //             return x.partDescription;
    //         }
    //     })
    // }
    memoIndex;
    onAddTextAreaInfo(material, index) {
        this.memoIndex = index;
        // console.log("memolist", material, index);
        this.textAreaInfo = material.memo;
    }
    textAreaInfo: any;
    onSaveTextAreaInfo(memo) {
        if (memo) {
            this.textAreaInfo = memo;
            // console.log("hello cjkf", this.workFlow.materialList)
            this.workFlow.materialList[this.memoIndex].memo = this.textAreaInfo;
            // console.log("index", this.workFlow.materialList);
            // items.indexOf(3452)

        }
        $("#textarea-popup").modal("hide");
    }
    onCloseTextAreaInfo() {
        $("#textarea-popup").modal("hide");
    }
    // private loadUOMData() {
    //     if(this.unitOfMeasuresList.length == 0){
    //         this.commonService.smartDropDownList('UnitOfMeasure', 'UnitOfMeasureId', 'ShortName').subscribe(uomdata => {
    //             this.materialUOM = uomdata.map(x => { return {'unitOfMeasureId': x.value, "shortName": x.label, "description": x.label}});
    
    //         });
    //     }
    //     else{
    //         this.materialUOM = this.unitOfMeasuresList;
    //     }
    // }

    // setUOM(){
    //     var defaultUOM = this.materialUOM.find(x => x.shortName.trim().toLowerCase() == "ea".toLowerCase());
    //     this.defaultUOMId = defaultUOM != undefined ? defaultUOM.defaultUOMId : 0;
    //     if ((this.workFlow.workflowId == undefined || this.workFlow.workflowId == '0') && !this.isEdit && this.workFlow.materialList[0] != undefined) {
    //         this.workFlow.materialList[0].unitOfMeasureId = this.defaultUOMId;
    //     }
    // }

    addRow(): void {
        // console.log("value assign new")
        var newRow = Object.assign({}, this.row);
        // var newRow = Object.assign({}, this.workFlow.materialList[0]);
        // this.workFlow.materialList[0]
        newRow.workflowMaterialListId = "0";
        if (this.taskList) {
            this.taskList.forEach(
                task => {
                    if (task.description == "Assemble") {
                        newRow.taskId = task.taskId;
                    }
                }
            )
        }
        newRow.conditionCodeId = this.defaultConditionId;
        newRow.extendedCost = "0.00";
        newRow.extraCost = "0.00";
        newRow.itemClassificationId = "";
        newRow.itemMasterId = "";
        newRow.mandatorySupplementalId = 1;
        newRow.partDescription = "";
        newRow.partNumber = "";
        newRow.isDeferred = this.isDeferredBoolean;
        newRow.memo = "";
        newRow.price = "0.00";
        newRow.provisionId = "";
        newRow.quantity = "";
        newRow.unitCost = "0.00";
        newRow.unitOfMeasureId = this.defaultUOMId;
        newRow.isDelete = false;
        newRow.extendedPrice = '';
        // console.log("new itemsdf", newRow)
        
        if(this.materialMandatory){
            this.materialMandatory.forEach(
                x=>{
                    if(x['id'] == 1){
                        newRow['mandatoryOrSupplemental'] = x['name'];
                    }
                }
            )
        }
        else{
            newRow['mandatoryOrSupplemental'] = 'Mandatory';
        }
            
        this.workFlow.materialList.push(newRow);
    }

    deleteRow(index, form: NgForm): void {
        if (this.workFlow.materialList[index].workflowMaterialListId == undefined || this.workFlow.materialList[index].workflowMaterialListId == "0" || this.workFlow.materialList[index].workflowMaterialListId == "") {
            this.workFlow.materialList.splice(index, 1);
            let temp = cloneDeep(this.workFlow.materialList);
            form.resetForm();
            this.workFlow.materialList = cloneDeep(temp);
        }
        else {
            this.workFlow.materialList[index].isDelete = true;
        }
        this.reCalculate();
    }


    calculateExtendedCost(material): void {
        material.unitCost = material.unitCost ? formatNumberAsGlobalSettingsModule(material.unitCost, 2) : '';
        material.quantity = material.quantity ? material.quantity.toString().replace(/\,/g,'') : 0;
        if (material.quantity != "" && material.unitCost) {
            material.extendedCost = formatNumberAsGlobalSettingsModule((material.quantity * material.unitCost.toString().replace(/\,/g,'')), 2);
        }
        else {
            material.extendedCost = "";
        }
        this.calculateExtendedCostSummation();
    }


    // sum of extended cost
    calculateExtendedCostSummation() {
        this.workFlow.materialExtendedCostSummation = this.workFlow.materialList.reduce((acc, x) => {
            return acc + parseFloat(x.extendedCost == undefined || x.extendedCost === '' ? 0 : x.extendedCost.toString().replace(/\,/g,''))
        }, 0);

        this.workFlow.totalMaterialCostValue = this.workFlow.materialExtendedCostSummation ? formatNumberAsGlobalSettingsModule(this.workFlow.materialExtendedCostSummation, 2) : null;
        this.workFlow.materialExtendedCostSummation = this.workFlow.totalMaterialCostValue
    }

    calculateExtendedPrice(material): void {
        material.price = material.price ? formatNumberAsGlobalSettingsModule(material.price, 2) : '';
        if (material.quantity != "" && material.price != "") {
            material.extendedPrice = formatNumberAsGlobalSettingsModule((material.quantity * parseFloat(material.price.toString().replace(/\,/g,''))), 2);
        }
        else {
            material.extendedPrice = "";
        }
        this.calculateExtendedPriceSummation();
    }


    // sum of extended cost
    calculateExtendedPriceSummation() {
        this.workFlow.materialExtendedPriceSummation = this.workFlow.materialList.reduce((acc, x) => {
            return acc + parseFloat(x.extendedPrice == undefined || x.extendedPrice === '' ? 0 : x.extendedPrice.toString().replace(/\,/g,''))
        }, 0);

        this.workFlow.materialExtendedPriceSummation = this.workFlow.materialExtendedPriceSummation ? formatNumberAsGlobalSettingsModule(this.workFlow.materialExtendedPriceSummation, 2) : null;
    }

    // sum of the qty
    calculateQtySummation() {
        this.workFlow.materialQtySummation = this.workFlow.materialList.reduce((acc, x) => {
            return acc + parseFloat(x.quantity == undefined || x.quantity === '' ? 0 : x.quantity.toString().replace(/\,/g,''))
        }, 0);

        this.workFlow.materialList.forEach(function (material) {
            material.quantity = material.quantity != '' ? parseFloat(material.quantity.toString().replace(/\,/g,'')) : '';
        });
    }

    validateQuantity(event, material): void {

        if (!material.quantity) {
            material.quantity = '0';
            // material.quantity = formatNumberAsGlobalSettingsModule(material.quantity, 0);
            // event.target.value = parseInt(material.quantity);
            // material.quantity = parseInt(material.quantity);
        }
    }

    // calculate the price summation 
    calculatePriceSummation() {
        this.workFlow.totalMaterialCost = this.workFlow.materialList.reduce((acc, x) => {
            return acc + parseFloat(x.price == undefined || x.price === '' ? 0 : x.price)
        }, 0);

        this.workFlow.totalMaterialCost = this.workFlow.totalMaterialCost ? formatNumberAsGlobalSettingsModule(this.workFlow.totalMaterialCost, 2) : '0.00';
    }

    isDeferredEnable(e) {
        if (e.target.checked) {
            this.workFlow.materialList = [...this.workFlow.materialList.map(x => {
                return {
                    ...x,
                    isDeferred: true
                }
            })]
            this.isDeferredBoolean = true;
        } else {
            this.workFlow.materialList = [...this.workFlow.materialList.map(x => {
                return {
                    ...x,
                    isDeferred: false
                }
            })]
            this.isDeferredBoolean = false;
        }
    }

    saveMaterialsWorkOrder() {
        // console.log("materiallist",this.workFlow)
        if(this.isQuote==true || this.isWorkOrder==true){
        this.workFlow.materialList.forEach(element => {
            if(element.provisionId){
                this.provisionListData.forEach(child => {
                    if(child.value==element.provisionId){
                        element.provision=child.label;
                    }
                });
                
            }
        });
    }
        this.saveMaterialListForWO.emit(this.workFlow);
        this.workFlow.materialList = [];
        // this.row = this.workFlow.materialList[0];
        this.addRow();
        this.workFlow.materialQtySummation = 0;
        this.workFlow.materialExtendedCostSummation = 0;
        this.workFlow.totalMaterialCost = 0;
        this.workFlow.materialExtendedPriceSummation = 0;
    }
    closeMaterialTab (){
    this.workFlow.materialList = [];

    // this.getDynamicVariableData:any=[];
    this.addRow();
    this.workFlow.materialList[0].conditionCodeId=0;
    // this.workFlow.materialList[0].mandatoryOrSupplemental=0;
}
    updateMaterialsWorkOrder() {
        this.updateMaterialListForWO.emit(this.workFlow);
        this.workFlow.materialList = [];
        // this.row = this.workFlow.materialList[0];
        this.addRow();
        this.workFlow.materialQtySummation = 0;
        this.workFlow.materialExtendedCostSummation = 0;
        this.workFlow.totalMaterialCost = 0;
        this.workFlow.materialExtendedPriceSummation = 0;
    }

    markupChanged(matData) {
        try {
            this.markupList.forEach((markup) => {
                if (markup.value == matData.markupPercentageId) {
                    matData.materialCostPlus = (matData.extendedPrice) + (((matData.extendedPrice) / 100) * Number(markup.label))
                }
            })
        }
        catch (e) {
            // console.log(e);
        }
    }

    getTotalCostPlusAmount() {
        let total = 0;
        this.workFlow.materialList.forEach(
            (material) => {
                if (material.materialCostPlus) {
                    total += material.materialCostPlus;
                }
            }
        )
        return total;
    }

    getTotalFixedAmount() {
        let total = 0;
        this.workFlow.materialList.forEach(
            (material) => {
                if (material.fixedAmount) {
                    total += Number(material.fixedAmount);
                }
            }
        )
        return total;
    }

    getPNDetails(part) {
        // console.log("get pnDetails", part)
        if (part.partNumber && part.conditionCodeId) {
            // this.allPartDetails.forEach(
                // pn => {
                    // if (pn.partNumber == part.partNumber) {
                        this.workOrderQuoteService.getPartDetails(part.itemMasterId, part.conditionCodeId)
                            .subscribe(
                                partDetail => {
                                    if (partDetail) {
                                        part.unitCost = part.unitCost ? formatNumberAsGlobalSettingsModule(part.unitCost, 2) : formatNumberAsGlobalSettingsModule(partDetail["pP_UnitPurchasePrice"], 2);
                                        part.billingRate = partDetail["sP_FSP_FlatPriceAmount"];
                                        part.markupPercentageId = partDetail["sP_CalSPByPP_MarkUpPercOnListPrice"];
                                        part.stockType = part.stockType ? part.stockType : partDetail["stockType"];
                                        part.price = part.price ? formatNumberAsGlobalSettingsModule(part.price, 2) : formatNumberAsGlobalSettingsModule(partDetail["salePrice"], 2);
                                        this.calculateExtendedCost(part);
                                        this.calculateExtendedPrice(part);
                                    }
                                },
                                err => {
                                    // this.isSpinnerVisible = false;
                                    this.errorHandling(err);
                                }
                            // )
                    // }
                // }
            )
        }
    }
    getDynamicVariableData(variable, index) {
        return this[variable + index];
    }

    expandAllItemMasterDetails() {
        $('#step1').collapse('show');
        $('#step2').collapse('show');
        $('#step3').collapse('show');
        $('#step4').collapse('show');
        $('#step5').collapse('show');
        $('#step6').collapse('show');
        $('#step7').collapse('show');
        $('#step8').collapse('show');
    }
    closeAllItemMasterDetails() {
        $('#step1').collapse('hide');
        $('#step2').collapse('hide');
        $('#step3').collapse('hide');
        $('#step4').collapse('hide');
        $('#step5').collapse('hide');
        $('#step6').collapse('hide');
        $('#step7').collapse('hide');
        $('#step8').collapse('hide');
    }
    closeItemMasterDetails() {
        $('#step1').collapse('show');
        $('#step2').collapse('hide');
        $('#step3').collapse('hide');
        $('#step4').collapse('hide');
        $('#step5').collapse('hide');
        $('#step6').collapse('hide');
        $('#step7').collapse('hide');
        $('#step8').collapse('hide');
    }

    toGetAllDocumentsList(itemMasterId) {
        var moduleId = 22;
        this.commonService.GetDocumentsList(itemMasterId, moduleId).subscribe(res => {
            this.allUploadedDocumentsList = res;
            //console.log(this.allEmployeeTrainingDocumentsList);
        },
        err => {
            // this.isSpinnerVisible = false;
            this.errorHandling(err);
        })
    }
    getItemMasterById(itemMasterId) {
        this.itemMasterService.getItemMasterDetailById(itemMasterId).subscribe(res => {
            this.viewItemMaster = res[0];
        },
        err => {
            // this.isSpinnerVisible = false;
            this.errorHandling(err);
        });
    }

    getPurchaseSalesInfo(id) {
        this.itemMasterService.getPurcSaleDetailById(id).subscribe(res => {
            this.purchaseSalesInfo = res;
        },
        err => {
            // this.isSpinnerVisible = false;
            this.errorHandling(err);
        });
    }
    openView(row) {
        // console.log(row);

        this.closeItemMasterDetails();
        // $('#step1').collapse('show');
        this.itemMasterId = row.itemMasterId;
        this.toGetAllDocumentsList(row.itemMasterId);
        this.getItemMasterById(row.itemMasterId);
        this.getPurchaseSalesInfo(this.itemMasterId);
        // this.viewItemMaster = row;
        this.partNumber = row.partNumber;
        this.description = row.partDescription;
        if (row.isAlternatePartChecked) {
            this.isAlternatePartChecked = true;
        }
        else {
            this.isAlternatePartChecked = false;
        }
        this.isSerialized = row.isSerialized;
        this.isTimeLife = row.isTimeLife;
        this.nha = row.nha;
        this.stockLevel = row.stockLevel;
        this.nationalStockNumber = row.nationalStockNumber;
        if (row.itemClassification) {
            this.itemClassificationId = row.itemClassification.description;
        }
        else { this.itemClassificationId = "" }
        if (row.manufacturer) {
            this.manufacturerId = row.manufacturer.name;
        }
        else { this.manufacturerId = "" }

        if (row.priority) {
            this.priorityId = row.priority.description;
        }
        else { this.priorityId = "" }

        //this.currencyId = row.currencyId;

        if (row.currency) {
            this.currencyId = row.currency.symbol;
        }
        else { this.currencyId = "" }
        this.stockUnitOfMeasureId = row.stockUnitOfMeasureId;
        this.purchaseUnitOfMeasureId = row.purchaseUnitOfMeasureId;
        this.itemGroupId = row.itemGroup;
        this.isAcquiredMethodBuy = row.isAcquiredMethodBuy;
        this.expirationDate = row.expirationDate;
        this.isReceivedDateAvailable = row.isReceivedDateAvailable;
        this.isManufacturingDateAvailable = row.isManufacturingDateAvailable;
        this.isTagDateAvailable = row.isTagDateAvailable;
        this.isOpenDateAvailable = row.isOpenDateAvailable;
        this.isShippedDateAvailable = row.isShippedDateAvailable;
        this.isOtherDateAvailable = row.isOtherDateAvailable;
        this.provisionId = row.provisionId;
        this.isHazardousMaterial = row.isHazardousMaterial;
        this.selectedAircraftTypes = row.selectedAircraftTypes;
        this.isEnabeCapes = row.isEnabeCapes;
        this.pma = row.pma;
        this.der = row.der;
        this.ataMainId = row.ataMainId;
        this.isSchematic = row.isSchematic;
        this.overhaulHours = row.overhaulHours;
        this.rpHours = row.rpHours;
        this.testHours = row.testHours;
        this.turnTimeOverhaulHours = row.turnTimeOverhaulHours;
        this.turnTimeRepairHours = row.turnTimeRepairHours;
        this.rfqTracking = row.rfqTracking;
        this.manufacturingDays = row.manufacturingDays;
        this.listPrice = row.listPrice;
        this.glAccountId = row.glAccountId;
        this.exportCurrencyId = row.exportCurrencyId;
        this.consumeUnitOfMeasureId = row.consumeUnitOfMeasureId;
        this.soldUnitOfMeasureId = row.soldUnitOfMeasureId;
        this.leadTimeDays = row.leadTimeDays;
        this.leadTimeHours = row.leadTimeHours;
        this.stockLevel = row.stockLevel;
        this.reorderPoint = row.reorderPoint;
        this.reorderQuantiy = row.reorderQuantiy;
        this.minimumOrderQuantity = row.minimumOrderQuantity;
        this.isExchangeInfoAvailable = row.isExchangeInfoAvailable;
        this.exportWeight = row.exportWeight;
        this.exportValue = row.exportValue;
        this.salesMarkUpOnListPrice = row.salesMarkUpOnListPrice;
        this.createdBy = row.createdBy;
        //this.exportClassificationId = row.exportClassificationId;
        if (row.exportClassification) {
            this.exportClassificationId = row.exportClassification.description;
        }
        else {
            this.exportClassificationId = "";
        }
        this.exportSizeLength = row.exportSizeLength;
        this.exportSizeWidth = row.exportSizeWidth;
        this.exportSizeHeight = row.exportSizeHeight;
        this.updatedBy = row.updatedBy;
        // this.exportCountryId = row.exportCountryId;
        this.memo = row.memo;
        this.createddate = row.createdDate;
        this.updatedDate = row.updatedDate;

        this.getAllSubChapters();
        this.getAircraftMappedDataByItemMasterId(row.itemMasterId);
        this.getATAMappedDataByItemMasterId(row.itemMasterId);
        // this.getCapabilityList(row.itemMasterId);
        this.getNtaeData(row.itemMasterId);
        this.getExchange(row.itemMasterId);

        this.loadMasterCompanies();
        // this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
        // this.modal.result.then(() => {
        //         console.log('When user closes');
        //     },
        //     () => { console.log('Backdrop click') });
    }
    getAllSubChapters() {
        this.atasubchapter1service
            .getAtaSubChapter1List()
            .subscribe(atasubchapter => {
                const responseData = atasubchapter[0];
                this.orginalAtaSubChapterValues = responseData;
            },
            err => {
                // this.isSpinnerVisible = false;
                this.errorHandling(err);
            });
    }
    getAircraftMappedDataByItemMasterId(itemMasterId) {
        this.itemMasterService.getMappedAirCraftDetails(itemMasterId).subscribe(data => {
            const responseData = data;
            this.aircraftListDataValues = responseData.map(x => { //aircraftListData
                return {
                    ...x,
                    aircraft: x.aircraftType,
                    model: x.aircraftModel,
                    dashNumber: x.dashNumber,
                    memo: x.memo,
                }
            });
        },
        err => {
            // this.isSpinnerVisible = false;
            this.errorHandling(err);
        });
    }
    getATAMappedDataByItemMasterId(itemMasterId) {
        // check whether edit or create and send and passes ItemMasterId
        this.itemMasterService.getMappedATADetails(itemMasterId).subscribe(res => {
            this.ataMappedList = res.map(x => {
                return {
                    ...x,
                    ataChapterName: x.ataChapterCode + ' - ' + x.ataChapterName,
                    ataSubChapterDescription: getValueFromArrayOfObjectById('ataSubChapterCode', 'ataSubChapterId', x.ataSubChapterId, this.orginalAtaSubChapterValues) + ' - ' + x.ataSubChapterDescription
                }
            });
        },
        err => {
            // this.isSpinnerVisible = false;
            this.errorHandling(err);
        });
    }
    getNtaeData(itemMasterId) {
        this.filterManufacturerData = [];
        this.filterDiscriptionData = [];
        this.filterPartItemClassificationData = [];
        let reqData = {
            first: 0,
            rows: 10,
            sortOrder: 1,
            filters: {
                ItemMasterId: itemMasterId,
                MappingType: 3,
            },
        }
        let reqDatas = {
            first: 0,
            rows: 10,
            sortOrder: 1,
            filters: {
                ItemMasterId: itemMasterId,
                MappingType: 4,
            },
            globalFilter: null
        }
        let reqDatas1 = {
            first: 0,
            rows: 10,
            sortOrder: 1,
            filters: {
                ItemMasterId: itemMasterId,
                MappingType: 1,
            },
            globalFilter: null
        }
        let reqDatas2 = {
            first: 0,
            rows: 10,
            sortOrder: 1,
            filters: {
                ItemMasterId: itemMasterId,
                MappingType: 2,
            },
            globalFilter: null
        }

        this.itemMasterService.getnhatlaaltequpartlis(reqData).subscribe(res => {
            this.ntaeData = res;
            this.getntlafieds(this.ntaeData);
        },
        err => {
            // this.isSpinnerVisible = false;
            this.errorHandling(err);
        });
        this.itemMasterService.getnhatlaaltequpartlis(reqDatas).subscribe(res => {
            this.ntaeData2 = res;
            this.getntlafieds(this.ntaeData2);
        },
        err => {
            // this.isSpinnerVisible = false;
            this.errorHandling(err);
        });
        this.itemMasterService.getnhatlaaltequpartlis(reqDatas1).subscribe(res => {
            this.ntaeData3 = res;
            this.getntlafieds(this.ntaeData3);
        },
        err => {
            // this.isSpinnerVisible = false;
            this.errorHandling(err);
        });

        this.itemMasterService.getequivalencypartlist(reqDatas2).subscribe(res => {
            this.ntaeData4 = res;
            for (let i = 0; i < this.ntaeData4.length; i++) {
                // if (this.ntaeData4[i].attachmentDetails) {
                // 	this.ntaeData4[i]["fileName"] = this.ntaeData4[i].attachmentDetails.ad.fileName
                // }
                this.filterManufacturerData.push({
                    label: this.ntaeData4[i].manufacturer,
                    value: this.ntaeData4[i].manufacturerId
                });
                this.filterDiscriptionData.push({
                    label: this.ntaeData4[i].altPartDescription,
                    value: this.ntaeData4[i].altPartDescription
                });
                this.filterPartItemClassificationData.push({
                    label: this.ntaeData4[i].itemClassification,
                    value: this.ntaeData4[i].itemClassificationId
                });
            }
        },
        err => {
            // this.isSpinnerVisible = false;
            this.errorHandling(err);
        });

        //}
    }
    getExchange(itemMasterId) {
        this.itemMasterService.getExchangeLoan(itemMasterId).subscribe(res => {
            if (res[0] != null && res[0] != undefined) {
                this.exchangeLoanInfo = res[0];
            }
            // if (c[0] != null) {
            // this.currentItem = c[0];
            // this.exchangeListPrice = this.currentItem.exchangeListPrice;
            // this.exchangeCorePrice = this.currentItem.exchangeCorePrice;
            // this.exchangeOverhaulPrice = this.currentItem.exchangeOverhaulPrice;
            // this.exchangeOutrightPrice = this.currentItem.exchangeOutrightPrice;
            // this.exchangeCoreCost = this.currentItem.exchangeCoreCost;
            // this.loanFees = this.currentItem.loanFees;
            // this.loanCorePrice = this.currentItem.loanCorePrice;
            // this.loanOutrightPrice = this.currentItem.loanOutrightPrice;

            // this.showExchange = this.currentItem.isExchange;
            // this.showLoan = this.currentItem.isLoan;
            // }
        },
        err => {
            // this.isSpinnerVisible = false;
            this.errorHandling(err);
        });
    }
    private loadMasterCompanies() {
        this.alertService.startLoadingMessage();
        // this.loadingIndicator = true;

        this.masterComapnyService.getMasterCompanies().subscribe(
            results => {this.onDataMasterCompaniesLoadSuccessful(results[0])
            // error => this.onDataLoadFailed(error)
             },
             err => {
                 // this.isSpinnerVisible = false;
                 this.errorHandling(err);
             } );

    }

    private onDataMasterCompaniesLoadSuccessful(allStockInfo: MasterCompany[]) {
        // alert('success');
        this.alertService.stopLoadingMessage();
        // this.loadingIndicator = false;
        //this.allStockInfo = allStockInfo;

    }
    getntlafieds(ntaeData) {
        for (let i = 0; i < ntaeData.length; i++) {
            this.filterManufacturerData.push({
                label: ntaeData[i].manufacturer,
                value: ntaeData[i].manufacturerId
            });
            this.filterDiscriptionData.push({
                label: ntaeData[i].altPartDescription,
                value: ntaeData[i].altPartDescription
            });
        }
        this.itemMasterView = true;
        $('#itemMasterView').modal('show');

    }
    dismissItemMasterModel() {
        $('#itemMasterView').modal('hide');
        this.itemMasterId = undefined;
    }
    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }

    checkQuantityAvailability(){
        let result = false;
        this.workFlow.materialList.forEach(
            material => {
                if(!material.quantity || Number(material.quantity)<=0){
                    result = true;
                }
            }
        )
        return result;
    }
    moduleName:any='';
    errorHandling(err){
        if(err['error']['errors']){
            err['error']['errors'].forEach(x=>{
                this.alertService.showMessage(
                    this.moduleName,
                    x['message'],
                    MessageSeverity.error
                );
            })
        }
        else{
            this.alertService.showMessage(
                this.moduleName,
                'Saving data Failed due to some input error',
                MessageSeverity.error
            );
        }
    }
    handleError(err){
        if(err['error']['errors']){
            err['error']['errors'].forEach(x=>{
                this.alertService.showMessage(
                    this.moduleName,
                    x['message'],
                    MessageSeverity.error
                );
            })
        }
        else{
            this.alertService.showMessage(
                this.moduleName,
                'Saving data Failed due to some input error',
                MessageSeverity.error
            );
        }
    }
} 