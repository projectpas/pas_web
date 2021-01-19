import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { CustomerInternationalShipVia } from '../../../models/customer-internationalshipping.model';
import { AuthService } from '../../../services/auth.service';
import { editValueAssignByCondition, getValueFromArrayOfObjectById, getObjectByValue, getObjectById, formatNumberAsGlobalSettingsModule, getValueFromObjectByKey } from '../../../generic/autocomplete';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
declare var $ : any;
import { ShipVia } from '../../../models/sales/ship-via';
@Component({
  selector: 'app-ship-via-create',
  templateUrl: './ship-via-create.component.html',
  styleUrls: ['./ship-via-create.component.scss']
})
export class ShipViaCreateComponent implements OnInit {
  allShipViaInfo: any = [];
  isSpinnerVisible: boolean = false;
  addShipViaFormForShipping = new CustomerInternationalShipVia()
  ShipViabutton: boolean = false;
  @Input() shipViaValue: any;
  @Input() ShipViaEditID: number;
  @Input() shipViaList: any;
  @Output('on-shipvia-save') Event = new EventEmitter();
  tempAddshipViaMemo: any = {};
  isEditModeShipVia:boolean = false;
  lstfilterShippVia: any[];
  addShipViaFormForFreight = new ShipVia()
  isShipViaNameAlreadyExists:boolean=false;
  MasterCompanyId = 1;
  constructor(private commonService: CommonService,
              private authService: AuthService,
              private alertService: AlertService,) { }

  ngOnInit() {
    this.loadShippingViaList();
    // this.isEditModeShipVia = this.shipViaValue.isEditModeShipVia;
    // if(this.ShipViaEditID != undefined && this.isEditModeShipVia){
    //this.EditShipVia();
    // }else{
    //   this.resetAddressShipViaForm();
    // }
  }

  get userName(): string {	
    return this.authService.currentUser ? this.authService.currentUser.userName : "";		
  }
  
  // get currentUserMasterCompanyId(): number {
  //   return this.authService.currentUser
  //     ? this.authService.currentUser.masterCompanyId
  //     : null;
  // }

  loadShippingViaList() {
    this.commonService.getShipVia().subscribe(res => {
      this.allShipViaInfo = res;
      console.log("res",res);
    },err => {
      this.isSpinnerVisible = false;	
    });
  }

  filterShippVia(event) {
    this.lstfilterShippVia = this.allShipViaInfo;
    if (event.query !== undefined && event.query !== null) {
      const shippingSite = [...this.allShipViaInfo.filter(x => {
        return x.name.toLowerCase().includes(event.query.toLowerCase())
      })]
      this.lstfilterShippVia = shippingSite;	
    }
  }

  checkShipViaNameExist(value) {
    this.isShipViaNameAlreadyExists = false;
    this.ShipViabutton = true;
    if (value != undefined && value != null) {
      if(this.allShipViaInfo && this.allShipViaInfo.length !=0){
      for (let i = 0; i < this.allShipViaInfo.length; i++) {
        if ((this.addShipViaFormForFreight.Name == this.allShipViaInfo[i].name 
          || value.toLowerCase() == this.allShipViaInfo[i].name.toLowerCase())
          &&  this.addShipViaFormForFreight.Name !=  '') {
          this.isShipViaNameAlreadyExists = true;
          this.ShipViabutton = false;
          return;
        }
      }
    }
  }
}

onAddShipMemo() {
	this.tempAddshipViaMemo = this.addShipViaFormForFreight.Memo;
}
onSaveTextAreaInfo() {
  this.addShipViaFormForFreight.Memo = this.tempAddshipViaMemo;
  this.ShipViabutton = true;
  $('#ship-via-memo').modal('hide');
}

saveShipVia() {
  const postData = [];
  //const mgmtStructure = []
  // const shipviaData = {
  //   ...this.addShipViaFormForFreight,
  //   IsActive : true,
  //   CreatedBy:this.userName,
  //   UpdatedBy:this.userName			

  // }
  postData.push(
    {fieldName: "Name", fieldValue: this.addShipViaFormForFreight.Name},
    {fieldName: "Memo", fieldValue: this.addShipViaFormForFreight.Memo},
    {fieldName: "MasterCompanyId", fieldValue: this.MasterCompanyId},
    {fieldName: "CreatedBy", fieldValue: this.userName},
    {fieldName: "UpdatedBy", fieldValue: this.userName},
  )
  const frmData = {
    table: 'ShippingVia',
    data: postData,
  };

  //if (!this.shipViaValue.isEditModeShipVia) {
    this.commonService.createShipViaForMaster(frmData).subscribe(response => {
      this.alertService.showMessage(
        'Success',
        `Saved Ship Via Information Sucessfully `,
        MessageSeverity.success
      );
      //this.Event.emit(false);
    },err => {
      this.isSpinnerVisible = false;
      //const errorLog = err;
      //this.errorMessageHandler(errorLog);		
    });
  // } else {
  //   this.commonService.createShipViaForMaster(frmData).subscribe(response => {
  //     //this.onShipToSelected(this.sourcePoApproval.shipToUserId,0,0,0,0,response.shipViaId);
  //     //this.enableAddSaveBtn = true;
  //     this.alertService.showMessage(
  //       'Success',
  //       `Updated Ship Via Information Sucessfully`,
  //       MessageSeverity.success
  //     );
  //     //this.Event.emit(response);
  //   },err => {
  //     this.isSpinnerVisible = false;		
  //   })
  // }


  $('#shipToShipVia').modal('hide');
}

shipAddChange(){
  this.ShipViabutton = true;
}

  EditShipVia(){
    if(this.allShipViaInfo && this.allShipViaInfo.length !=0){
			for(var i =0; i < this.allShipViaInfo.length; i++) {
          if (this.allShipViaInfo[i].shippingViaId == this.ShipViaEditID) {
					this.addShipViaFormForFreight.ShippingViaId = this.allShipViaInfo[i].shippingViaId;
					this.addShipViaFormForFreight.Name = this.allShipViaInfo[i].Name;
					this.addShipViaFormForFreight.Memo = this.allShipViaInfo[i].Memo;		
					// this.addShipViaFormForShipping.shippingAccountInfo = this.shipViaList[i].shippingAccountInfo;
					// this.addShipViaFormForShipping.shippingId = '';
					// this.addShipViaFormForShipping.shippingURL = '';
					// this.addShipViaFormForShipping.memo = this.shipViaList[i].memo;
					// this.addShipViaFormForShipping.isPrimary = this.shipViaList[i].isPrimary;
				}
			}
    }
  }

  shipViaChange(){
		this.ShipViabutton = true;
  }
  
  // onAddShipMemo() {
  //   this.tempAddshipViaMemo = this.addShipViaFormForShipping.memo;
  // }
  // onSaveTextAreaInfo() {
  //   this.addShipViaFormForShipping.memo = this.tempAddshipViaMemo;
  //   this.ShipViabutton = true;
  //   $('#ship-via-memo').modal('hide');
  // }

  async saveShipViaForShipTo() {
    const customerData = {
      ...this.shipViaValue,
			...this.addShipViaFormForShipping,			
			name: getValueFromArrayOfObjectById('label', 'value', this.addShipViaFormForShipping.shipViaId, this.allShipViaInfo),			
    }
    console.log("save",customerData);

    if (!this.shipViaValue.isEditModeShipVia) {
      await this.commonService.createShipVia(customerData).subscribe(response => {
        //this.onShipToSelected(this.sourcePoApproval.shipToUserId,0,0,0,0,response.shipViaId);
        //this.enableAddSaveBtn = true;					
        this.alertService.showMessage(
          'Success',
          `Saved Ship Via Information Sucessfully `,
          MessageSeverity.success
        );
        this.Event.emit(response);
      },err => {
        this.isSpinnerVisible = false;
        //const errorLog = err;
        //this.errorMessageHandler(errorLog);		
      });
    } else {
      await this.commonService.createShipVia(customerData).subscribe(response => {
        //this.onShipToSelected(this.sourcePoApproval.shipToUserId,0,0,0,0,response.shipViaId);
        //this.enableAddSaveBtn = true;
        this.alertService.showMessage(
          'Success',
          `Updated Ship Via Information Sucessfully`,
          MessageSeverity.success
        );
        this.Event.emit(response);
      },err => {
        this.isSpinnerVisible = false;
        //const errorLog = err;
        //this.errorMessageHandler(errorLog);		
      })
    }
  
  
    $('#shipToShipVia').modal('hide');
  }

  resetAddressShipViaForm() {
    this.addShipViaFormForShipping = new CustomerInternationalShipVia();
    this.isEditModeShipVia = false;
  }

  closeMemoModel()
  {
    this.isEditModeShipVia = false;
      $('#ship-via-memo').modal('hide');
  }
  closeModel(){
    this.Event.emit();
    $('#shipToShipVia').modal('hide');
  }
}
