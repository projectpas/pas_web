import { Component, OnInit, Input } from '@angular/core';
import { ExchangeQuoteView } from "../../../../../models/exchange/ExchangeQuoteView";
import { ExchangequoteService } from "../../../../../services/exchangequote.service";
import { CustomerService } from "../../../../../services/customer.service";
import { AuthService } from "../../../../../services/auth.service";
import { formatNumberAsGlobalSettingsModule, editValueAssignByCondition, formatStringToNumber } from '../../../../../generic/autocomplete';
@Component({
  selector: 'app-exchange-quote-agreement-template',
  templateUrl: './exchange-quote-agreement-template.component.html',
  styleUrls: ['./exchange-quote-agreement-template.component.scss']
})
export class ExchangeQuoteAgreementTemplateComponent implements OnInit {
  @Input() exchangeQuoteView: ExchangeQuoteView;
  exchangeQuote: any = {};
  todayDate: Date = new Date();
  parts: any = [];
  sellerName:string;
  firstexchangefees:number=0;
  secondexchangefees:number=0;
  thirdexchangefees:number=0;
  constructor(private customerService: CustomerService, private exchangequoteService: ExchangequoteService,private authService: AuthService,) { }

  ngOnInit() {
    this.getleasingCompany();
    this.getExchangeQuoteView();
    console.log("exchangeQuoteView",this.exchangeQuoteView);
  }

  get masterCompanyId(): number {
    return this.authService.currentUser
      ? this.authService.currentUser.masterCompanyId
      : 1;
  }

  getExchangeQuoteView() {
    this.exchangequoteService.getview(this.exchangeQuoteView.exchangeOrderQuote.exchangeQuoteId).subscribe(res => {
      this.exchangeQuoteView = res[0];
      this.exchangeQuote = this.exchangeQuoteView.exchangeOrderQuote;
      this.parts = this.exchangeQuoteView.parts;
    })
  }

  getFirstExchangeFees(){
    this.firstexchangefees=0;
    if(this.parts.length > 0)
    {
      this.firstexchangefees = this.exchangeQuoteView.parts[0].exchangeListPrice * this.exchangeQuoteView.parts[0].estOfFeeBilling
    }
    return this.firstexchangefees;
  }
  getSecondExchangeFees(){
    this.secondexchangefees=0;
    if(this.parts.length > 0)
    {
      this.secondexchangefees = this.exchangeQuoteView.parts[0].exchangeListPrice * this.exchangeQuoteView.parts[0].estOfFeeBilling
    }
    return this.secondexchangefees;
  }
  getThirdExchangeFees(){
    this.thirdexchangefees=0;
    if(this.parts.length > 0)
    {
      this.thirdexchangefees = this.firstexchangefees + this.secondexchangefees + this.exchangeQuoteView.parts[0].exchangeOutrightPrice;
    }
    return this.thirdexchangefees;
  }
  formateCurrency(amount) {
    return amount ? formatNumberAsGlobalSettingsModule(amount, 2) : '0.00';
  }
  getleasingCompany() {
    this.exchangequoteService.getleasingCompany(this.masterCompanyId).subscribe((res) => {
     console.log(res);
     this.sellerName=res.companyName;
    }, error => { });
  }

}
