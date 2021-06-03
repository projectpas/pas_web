import { Component, Input, Output, OnChanges,EventEmitter, OnInit } from "@angular/core";
import { CommonService } from '../../../../../services/common.service';
import { formatNumberAsGlobalSettingsModule } from "../../../../../generic/autocomplete";
import { AuthService } from "../../../../../services/auth.service";
declare var $: any;
@Component({ 
  selector: "app-wo-margin",
  templateUrl: "./wo-margin.component.html",
  styleUrls: ["./wo-margin.component.css"]
})
export class WoMarginComponent implements OnInit, OnChanges {
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() searchAnotherPN: EventEmitter<boolean> = new EventEmitter<boolean>();
   @Input() part:any={}; 
  @Input() display: boolean; 
  @Input() isEdit = false;
  @Input() editData;
  @Input() isStockView=false;
  @Input() isStockLine=false;
  @Input() isSubWorkOrder=false;
  @Input() enableUpdateBtn:boolean=false;
  @Output() saveFinalMaterialListData = new EventEmitter<any>();
  @Output() updateFinalMaterialListData = new EventEmitter<any>();
  @Output() setmaterialListForUpdate = new EventEmitter<any>();

  disableUpdateButton:boolean=true;
  percentage: any[] = [];
  invalidQuantityenteredForQuantityFromThis: boolean = false;
  formObject:any={
    partNumberObj:undefined,
    quantity:0,
    conditionIds:undefined,
    provisionId:0,
    stocklineQuantity:0
  };
  isSpinnerVisible = false;
  setEditArray:any=[];
  provisionListData:any=[];
  taskList:any=[];
  materialMandatory:any=[];
  constructor(private commonService: CommonService,
    private authService: AuthService, ) {
  }
    ngOnInit() {
      console.log("hello")
}
  ngOnChanges()    { 
    this.formObject=={
      partNumberObj:undefined,
      quantity:0,
      conditionIds:undefined,
      provisionId:0,
      stocklineQuantity:0
    };
    this.part=this.part;
    console.log("part",this.part)
    this.formObject.quantity=this.part.quantity; 
    this.formObject.stocklineQuantity=this.part.stocklineQuantity;
    this.formObject.qtyOnHand = this.part.qtyOnHand;
    if(this.isStockLine){
      this.formObject.qtyAvailable = this.part.partQuantityAvailable;
    }else{
      this.formObject.qtyAvailable = this.part.qtyAvailable;
    }
     this.formObject.conditionCodeId=this.part.conditionId;
     this.formObject.itemMasterId=this.part.itemMasterId;
     this.formObject.unitCost=this.part.unitCost ? formatNumberAsGlobalSettingsModule(this.part.unitCost, 2) : '0.00';
     this.formObject.partNumber=this.part.partNumber;
     this.formObject.itemClassificationId=this.part.itemClassificationId;
     this.formObject.itemClassification=this.part.itemClassification;
     this.formObject.partDescription=this.part.description;
     this.formObject.workOrderId=this.part.workOrderId;
     this.formObject.workFlowWorkOrderId=this.part.workFlowWorkOrderId;
     this.formObject.qtyOnHand = this.part.qtyOnHand;
     if(this.isStockLine){
       this.formObject.qtyAvailable = this.part.partQuantityAvailable;
    }else{
      this.formObject.qtyAvailable = this.part.qtyAvailable;
    }
     this.formObject.materialMandatoriesId=this.formObject.materialMandatoriesId ? this.formObject.materialMandatoriesId :null;
     this.formObject.stockLineId= this.part.stockLineId ? this.part.stockLineId : null ;
 this.formObject.unitOfMeasure=this.part.unitOfMeasure;
     this.formObject.unitOfMeasureId=this.part.unitOfMeasureId;

     if(this.part.method=='ItemMaster'){
      if (Number(this.formObject.stocklineQuantity) != 0) {
        if ( Number(this.formObject.stocklineQuantity) > Number(this.formObject.quantity)) {
          this.formObject.stocklineQuantity=this.formObject.quantity;
        } 
      } 
    }else{
      if (Number(this.formObject.stocklineQuantity) != 0) {
        if ( Number(this.formObject.stocklineQuantity) > Number(this.formObject.quantity)) {
         this.formObject.stocklineQuantity=this.formObject.quantity;
          this.disableUpdateButton=true;
        }
      } 
    }


this.onChangeQuantityFromThis(); 
    if(this.editData){
      console.log("edit Data",this.editData);
     this.formObject.partNumberObj={'partId': this.editData.partItem.partId,'partNumber': this.editData.partItem.partName};
     this.formObject.partDescription=this.editData.partDescription;
     this.formObject.conditionIds=[this.editData.conditionCodeId];
    //  this.formObject.qtyOnHand=this.editData.qtyOnHand;
     if(this.isStockLine){
      this.formObject.qtyAvailable = this.part.partQuantityAvailable;
      this.formObject.unitCost= this.editData.stocklineUnitCost ? formatNumberAsGlobalSettingsModule(this.editData.stocklineUnitCost, 2) : '0.00';
      this.formObject.quantity=this.editData.quantity;
    }else{
      this.formObject.qtyAvailable=this.editData.qtyAvail;
      this.formObject.unitCost= this.part.unitCost ? formatNumberAsGlobalSettingsModule(this.part.unitCost, 2) : '0.00';
      //this.formObject.unitCost= this.editData.unitCost ? formatNumberAsGlobalSettingsModule(this.editData.unitCost, 2) : '0.00';
    }
    this.formObject.totalStocklineQtyReq=this.editData.totalStocklineQtyReq;
     this.formObject.taskId=this.editData.taskId;
     this.formObject.provisionId=this.editData.provisionId;
     this.formObject.isDeferred=this.editData.isDeferred;
     this.formObject.memo=this.editData.memo;
     this.formObject.workOrderMaterialsId=this.editData.workOrderMaterialsId;
     this.formObject.materialMandatoriesId=this.editData.materialMandatoriesId;
     
     this.formObject.extendedCost= this.editData.extendedCost ? formatNumberAsGlobalSettingsModule(this.editData.extendedCost, 2) : '0.00';
      this.getTaskList();
      this.provisionList();
      this.getMaterailMandatories();
     }else{
      this.formObject.provisionId=0;
      this.getTaskList();
      this.provisionList();
      this.getMaterailMandatories();
     }
     this.enableUpdateBtn=this.enableUpdateBtn;
     if(this.enableUpdateBtn==true){
       this.disableUpdateButton=false;
     }
     this.calculateExtendedCost();
  }

  get masterCompanyId(): number {
    return this.authService.currentUser ? this.authService.currentUser.masterCompanyId : 1;
  }
  provisionList() {
    this.isSpinnerVisible = true;
    let provisionIds = []; 
    if(this.editData){
      this.setEditArray.push(this.editData.provisionId ? this.editData.provisionId :0);
    }else{
      this.setEditArray.push(0);
    }
    this.isSpinnerVisible = true;
    this.commonService.autoSuggestionSmartDropDownList('Provision', 'ProvisionId', 'Description', '', true, 0, provisionIds,this.masterCompanyId)
        .subscribe(res => {
            this.isSpinnerVisible = false;
            this.provisionListData = [];
                // this.provisionListData = res;


                if (this.isSubWorkOrder) {
                  res.forEach(element => {
                      if (element.label != "Sub Work Order") {
                          this.provisionListData.push(element);
                      }
                  });
              } else {
                  this.provisionListData = res;
              }

        }, error => {
            this.isSpinnerVisible = false;
        });
  } 

  getTaskList() {  
  this.setEditArray=[];

  if(this.editData){
    this.setEditArray.push(this.editData.taskId ? this.editData.taskId :0);
  }else{
    this.setEditArray.push(0);
  }
  const strText = '';
  this.commonService.autoSuggestionSmartDropDownList('Task', 'TaskId', 'Description', strText, true, 0, this.setEditArray.join(),this.authService.currentUser.masterCompanyId).subscribe(res => {
   this.taskList = res.map(x => {
          return {
              id: x.value,
              description: x.label.toLowerCase(),
              taskId: x.value,
              label:x.label.toLowerCase(),
          }
      });
      if (this.taskList) {
        this.taskList.forEach(
            task => {
              if(!this.isEdit){
                if (task.description == "Assemble" || task.description == "assemble") {
                  this.formObject.taskId = task.taskId;
              }
              }
            }
        )
    }
  },
      err => {
      })
}
editorgetmemo(ev) {
  this.disableEditor = false;
}
getMaterailMandatories() {
  let materialMandatoriesIds = [];
  materialMandatoriesIds.push(0)
  if(this.editData){
    materialMandatoriesIds.push(this.editData.materialMandatoriesId ? this.editData.materialMandatoriesId :0);
  }else{
   materialMandatoriesIds.push(0);
  }
  this.isSpinnerVisible = true;
  this.commonService.autoSuggestionSmartDropDownList('MaterialMandatories', 'Id', 'Name', '', true, 0, materialMandatoriesIds,this.masterCompanyId)
      .subscribe(res => {
          this.isSpinnerVisible = false;
          this.materialMandatory = res.map(x => {
              return {
                  ...x,
                  materialMandatoriesId: x.value,
                  materialMandatoriesName: x.label
              }
          });
          if(!this.isEdit){
          this.materialMandatory.forEach(element => {
            if (element.materialMandatoriesName == 'Mandatory') {
               this.formObject.materialMandatoriesId = element.materialMandatoriesId;
               this.formObject.materialMandatoriesName = element.materialMandatoriesName;
            }
        });
      }
      }, error => {
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
disableEditor:boolean=false;
textAreaInfo:any;
onAddTextAreaInfo(material) {
  this.disableEditor = true;
  this.textAreaInfo = material.memo;
}

onSaveTextAreaInfo(memo) {
  if (memo) {
      this.textAreaInfo = memo;
      this.formObject.memo = this.textAreaInfo;
  }
  this.disableEditor = true;
  $("#textarea-popup2").modal("hide");
  if(this.isEdit==true){
    this.disableUpdateButton = false;
  }
}
onClose() {
  this.close.emit(true);
}
onCloseTextAreaInfo() {
  this.disableEditor = true;
  $("#textarea-popup2").modal("hide");
}
calculateExtendedCost(): void {
  debugger;
  this.formObject.unitCost = this.formObject.unitCost ? formatNumberAsGlobalSettingsModule(this.formObject.unitCost, 2) : '0.00';
  this.formObject.stocklineQuantity = this.formObject.stocklineQuantity ? this.formObject.stocklineQuantity.toString().replace(/\,/g, '') : 0;
  if (this.formObject.stocklineQuantity != 0 && this.formObject.unitCost) {
      this.formObject.extendedCost = formatNumberAsGlobalSettingsModule((this.formObject.stocklineQuantity * this.formObject.unitCost.toString().replace(/\,/g, '')), 2);
  }
  else {
      this.formObject.extendedCost = "";
  }
  // this.calculateExtendedCostSummation();
}
// errorMessage:any;
onChangeQuantityFromThis() {
  // this.errorMessage=''; 
  this.invalidQuantityenteredForQuantityFromThis =false;
  if(this.part.method=='ItemMaster'){
    if (Number(this.formObject.stocklineQuantity) != 0) {
      if ( Number(this.formObject.stocklineQuantity) > Number(this.formObject.quantity)) {
        this.invalidQuantityenteredForQuantityFromThis =true;
        this.disableUpdateButton=true;
        // this.formObject.stocklineQuantity=this.formObject.quantity;
      }
      else   if ( Number(this.formObject.stocklineQuantity + this.formObject.totalStocklineQtyReq ) > Number(this.formObject.quantity)) {
        this.invalidQuantityenteredForQuantityFromThis =true;
        this.disableUpdateButton=true;
        // this.formObject.stocklineQuantity=this.formObject.quantity;
      }
      else if (Number(this.formObject.stocklineQuantity) < 0)
      {
        this.invalidQuantityenteredForQuantityFromThis = true;
        this.disableUpdateButton=true;
      } 
    } else {
      this.invalidQuantityenteredForQuantityFromThis = true;
      this.disableUpdateButton=true;
    }
  }else{
    if (Number(this.formObject.stocklineQuantity) != 0) {
      if ( Number(this.formObject.stocklineQuantity) > Number(this.formObject.quantity)) {
        this.invalidQuantityenteredForQuantityFromThis =true;
        // this.formObject.stocklineQuantity=this.formObject.quantity;
        this.disableUpdateButton=true;
      }
      else if ( Number(this.formObject.stocklineQuantity + this.formObject.totalStocklineQtyReq ) > Number(this.formObject.quantity)) {
        this.invalidQuantityenteredForQuantityFromThis =true;
        this.disableUpdateButton=true;
        // this.formObject.stocklineQuantity=this.formObject.quantity;
      }
      else if (Number(this.formObject.stocklineQuantity) < 0)
      {
        this.invalidQuantityenteredForQuantityFromThis = true;
        this.disableUpdateButton=true;
      }
      // else if (  Number(this.formObject.stocklineQuantity) > Number(this.formObject.qtyAvailable)) {
      //   this.invalidQuantityenteredForQuantityFromThis = true;
      //   this.disableUpdateButton=true;
      // } 
    } else {
      this.invalidQuantityenteredForQuantityFromThis = true;
      this.disableUpdateButton=true;
    }
  }
 

  // qtyAvailable
}


materialCreateObject:any={};
savePart(){ 
  this.materialCreateObject={...this.formObject}
  this.provisionListData.forEach(element => {
    if(element.value==this.formObject.provisionId){
      this.materialCreateObject.provision=element.label;
    }
    });
 this.materialCreateObject.unitCost=this.materialCreateObject.unitCost ? formatNumberAsGlobalSettingsModule(this.materialCreateObject.unitCost, 2) : '0.00';
 this.materialCreateObject.extendedCost=this.materialCreateObject.extendedCost ? formatNumberAsGlobalSettingsModule(this.materialCreateObject.extendedCost, 2) : '0.00';
 this.materialCreateObject.memo=this.materialCreateObject.memo;
 

 this.materialCreateObject.isDeferred=this.formObject.isDeferred;
 this.materialCreateObject.materialMandatoriesId=this.formObject.materialMandatoriesId;
  this.saveFinalMaterialListData.emit(this.materialCreateObject);
  this.close.emit(true);
  // $("#showMarginDetails").modal("hide");
}

getActive(){
  this.disableUpdateButton=false;
}
upDatePart(){ 
  if(this.isEdit){
    // this.part= this.editData
    // this.part.workOrderMaterialsId=this.editData.workOrderMaterialsId;
  } 
  this.materialCreateObject={...this.formObject}
  this.materialCreateObject.mandatorySupplementalId=this.materialCreateObject.materialMandatoriesId;
  this.materialCreateObject.provisionId=this.materialCreateObject.provisionId;
  this.materialCreateObject.materialMandatoriesId=this.materialCreateObject.materialMandatoriesId ? this.materialCreateObject.materialMandatoriesId :null;
  this.materialCreateObject.taskId=this.materialCreateObject.taskId;
  this.materialCreateObject.isDeferred=this.materialCreateObject.isDeferred;
  this.materialCreateObject.memo=this.materialCreateObject.memo;
  this.materialCreateObject.unitCost=this.materialCreateObject.unitCost ? formatNumberAsGlobalSettingsModule(this.materialCreateObject.unitCost, 2) : '0.00';
  this.materialCreateObject.extendedCost=this.materialCreateObject.extendedCost ? formatNumberAsGlobalSettingsModule(this.materialCreateObject.extendedCost, 2) : '0.00';
  // this.materialCreateObject.quantity=this.materialCreateObject.quantity;
  this.materialCreateObject.quantity=this.part.quantity;
if(this.isStockLine==true){
  this.materialCreateObject.conditionCodeId=this.materialCreateObject.conditionIds[0];
  this.materialCreateObject.conditionId=this.materialCreateObject.conditionIds[0];
  this.setmaterialListForUpdate.emit(this.materialCreateObject)
}else{
  this.updateFinalMaterialListData.emit(this.materialCreateObject)
}
  this.disableUpdateButton=true;
  // $("#showMarginDetails").modal("hide");
  this.close.emit(true);
}



  }

  

 