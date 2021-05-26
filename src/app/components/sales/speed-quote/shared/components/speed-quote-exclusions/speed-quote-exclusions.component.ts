import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter,ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { SpeedQuoteExclusion } from '../../models/speed-quote-exclusion';
import { CommonService } from '../../../../../../services/common.service';
import { AuthService } from '../../../../../../services/auth.service';
import { getValueFromObjectByKey, getObjectByValue, getValueFromArrayOfObjectById, getObjectById, editValueAssignByCondition, getValueByFieldFromArrayofObject, formatNumberAsGlobalSettingsModule } from '../../../../../../generic/autocomplete';
import { ISpeedQuote } from "../../../../../../models/sales/ISpeedQuote.model";
import { ItemMasterService } from "../../../../../../services/itemMaster.service";
declare var $ : any;
import { Router, ActivatedRoute } from '@angular/router';
import { SpeedQuoteService } from "../../../../../../services/speedquote.service";
import { AlertService, MessageSeverity } from '../../../../../../services/alert.service';
@Component({
  selector: 'app-speed-quote-exclusions',
  templateUrl: './speed-quote-exclusions.component.html',
  styleUrls: ['./speed-quote-exclusions.component.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpeedQuoteExclusionsComponent implements OnInit {
  partListData: any[] = [];
  partDetailsList = [];
  partCollection: any[];
  @Input() salesQuote: ISpeedQuote;
  exclusionEstimatedOccurances: any = [];
  id:number;
  speedQuoteId:number;
  isSpinnerVisible:boolean=false;
  constructor(private commonService: CommonService,
    private authService: AuthService,private itemMasterService: ItemMasterService,
    private changeDetector: ChangeDetectorRef,private _actRoute: ActivatedRoute,
    private alertService: AlertService,private speedQuoteService: SpeedQuoteService,) { }

  ngOnInit() {
    this.loapartItems();
    this.getPercentage();
    this.id = this.speedQuoteId = this._actRoute.snapshot.params['id'];
    this.getExclusionList();
  }
  refresh(rowdata){
    
    
  }
  addPartNumber(rowdata) {
		let newParentObject = new SpeedQuoteExclusion();
		newParentObject = {
			...newParentObject,
			itemMasterId: rowdata.itemMasterId,
      //partNumber: rowdata.partNumber,
      pn: rowdata.partNumber,
      description: rowdata.description,
      speedQuotePartId: rowdata.speedQuotePartId,
		}
    this.partListData.push(newParentObject);
  }
  get userName(): string {
		return this.authService.currentUser ? this.authService.currentUser.userName : "";
	}
  get currentUserMasterCompanyId(): number {
		return this.authService.currentUser
			? this.authService.currentUser.masterCompanyId
			: null;
	}

  loapartItems(strvalue = '') {
		this.commonService.getStockpartnumbersAutoComplete(strvalue, false, 0, this.currentUserMasterCompanyId).subscribe(res => {
			this.partCollection = res.map(x => {
				return {
					value: x.itemMasterId,
					label: x.partNumber
				}
			});
		})
  }
  
  filterpartItems(event) {
		if (event.query !== undefined && event.query !== null) {
      //this.loapartItems(event.query);
      this.bindPartsDroppdown(event.query);
		}
  }
  
  onPartSelect(event,row_index){
    console.log("event",event);
    console.log("evenrow_indext",row_index);
    this.partListData[row_index].exitemMasterId = event.partId;
    this.partListData[row_index].exPartNumber = event.partNumber;
    this.partListData[row_index].exPartDescription = event.partDescription;
    this.partListData[row_index].exStockType = event.stockType;
    console.log("this.partListData",this.partListData);
  }

  bindPartsDroppdown(query) {
    let partSearchParamters = {
      'partNumber': query,
      "restrictPMA": false,
      "restrictDER": false,
      "customerId": this.salesQuote.customerId,
      "custRestrictDER": this.salesQuote.restrictDER,
      "custRestrictPMA": this.salesQuote.restrictPMA,
      "includeAlternatePartNumber": false,
      "includeEquivalentPartNumber": false,
      "idlist": '0',
      "masterCompanyId": this.currentUserMasterCompanyId
    };
    this.itemMasterService.searchPartNumberAdvanced(partSearchParamters).subscribe(
      (result: any) => {
        if (result && result.length > 0) {
          this.partDetailsList = result;
          this.partCollection = [...this.partDetailsList];
          // this.partCollection = result.map(x => {
          //   return {
          //     exPartDescription: x.partDescription,
          //     exPartNumber: x.partNumber
          //   }
          // });
        }
        else {
          this.partDetailsList = [];
          this.partCollection = [];
        }
        this.changeDetector.detectChanges();
      }
    )
  }

  getPercentage(){
    let probabilityId = 0;
    this.commonService.autoSuggestionSmartDropDownList("[Percent]", "PercentId", "PercentValue", '', true, 200, [probabilityId].join(), this.currentUserMasterCompanyId).subscribe(result => {
      this.exclusionEstimatedOccurances = result;
    }, error => {
      
    });
  }
  textAreaInfo: any;
  memoIndex;
  disabledMemo: boolean = false;
  onAddTextAreaInfo(material, index) {
    this.memoIndex = index;
    this.textAreaInfo = material.memo;
    this.disabledMemo = true;
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
  onCloseTextAreaInfo() {
    $("#textarea-popupexclusion").modal("hide");
    this.disabledMemo = true;
  }
  enableSaveMemo() {
    this.disabledMemo = false;
  }
  onSaveTextAreaInfo(memo) {
    if (memo) {
        this.textAreaInfo = memo;
        this.partListData[this.memoIndex].exNotes = this.textAreaInfo;
    }
    $("#textarea-popupexclusion").modal("hide");
    this.disabledMemo = true;
  }
  parentObject: any = {};
  parentObjectArray: any[] = [];
  saveSpeedQuoteExclusions(){
    this.isSpinnerVisible = true;
    console.log(this.partListData);
    for(let i=0;i<this.partListData.length;i++)
    {
      this.parentObject = {};
      this.parentObject = {
        speedQuoteId: this.speedQuoteId,
        speedQuotePartId: this.partListData[i].speedQuotePartId,
        exclusionPartId: this.partListData[i].exclusionPartId ? this.partListData[i].exclusionPartId : 0,
				itemMasterId: this.partListData[i].itemMasterId ? this.partListData[i].itemMasterId : 0,
        pn : this.partListData[i].pn ? this.partListData[i].pn : null,
        description : this.partListData[i].description,
        exitemMasterId : this.partListData[i].exitemMasterId,
        exPartNumber : this.partListData[i].exPartNumber,
        exPartDescription : this.partListData[i].exPartDescription,
        exStockType : this.partListData[i].exStockType,
        exQuantity : Number(this.partListData[i].exQuantity),
        exUnitPrice : this.formateCurrency(this.partListData[i].exUnitPrice),
        exExtPrice : this.formateCurrency(this.partListData[i].exExtPrice),
        exOccurance : Number(this.partListData[i].exOccurance),
				exNotes: this.partListData[i].exNotes,
				masterCompanyId: this.currentUserMasterCompanyId,
				//isDeleted: this.partListData[i].isDeleted,
				createdBy: this.userName,
        updatedBy: this.userName,
      }
      this.parentObjectArray.push(this.parentObject);
    }
    console.log(this.parentObjectArray);
    this.speedQuoteService.saveExclusionPart(this.parentObjectArray).subscribe(res => {
			// if (res) {
			// 	this.BindAllParts(res);
			// }
			 this.isSpinnerVisible = false;
			// this.enablePartSaveBtn = false;
			this.alertService.showMessage(
				'Success',
				`Saved Exclusion PartsList Successfully`,
				MessageSeverity.success
			);
		}, err => {
			this.isSpinnerVisible = false;
		});
  }
  formateCurrency(amount) {
    return amount ? formatNumberAsGlobalSettingsModule(amount, 2) : '0.00';
  }

  getExclusionList(){
    this.speedQuoteService.getExclusionList(this.speedQuoteId).subscribe(res => {
      //this.isSpinnerVisible = false;
      this.partListData = res;
    }, error => this.isSpinnerVisible = false);
  }
  calculateExtendedCost(exclusion): void {
    exclusion.exUnitPrice = exclusion.exUnitPrice ?   formatNumberAsGlobalSettingsModule(exclusion.exUnitPrice, 2) : '0.00';
    exclusion.exQuantity = exclusion.exQuantity ? formatNumberAsGlobalSettingsModule(exclusion.exQuantity, 0) : '0';

    var value: any = parseFloat(exclusion.exQuantity) * parseFloat(exclusion.exUnitPrice.toString().replace(/\,/g, ''));
    if (value > 0) {
        exclusion.exExtPrice = formatNumberAsGlobalSettingsModule(value, 2);
    }
    else {
        exclusion.exExtPrice = "";
    }
}
}