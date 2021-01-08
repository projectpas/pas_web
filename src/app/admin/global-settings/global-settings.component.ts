import { Component, OnInit } from "@angular/core";
import { MultiSelectModule } from 'primeng/multiselect';
import { AccountService } from "../../services/account.service";
import {MessageSeverity,  AlertService } from "../../services/alert.service";
import { MenuItem } from 'primeng/api';
import { AuthService } from "../../services/auth.service";

@Component({
    selector: "global-settings",
    templateUrl: './global-settings.component.html',
    styleUrls: ['./global-settings.component.scss']
})
export class GlobalSettingsComponent implements OnInit
{
    countriesList: any = [];
    countriesListFiltered: any = [];
    countryItem: any;
    countryData: any = {};
    breadcrumbs: MenuItem[];
    globalSettingsId: number = 0;
    
    constructor(private accountService: AccountService, private alertService: AlertService, private authService: AuthService){        
    }
    
    ngOnInit(){
        this.getCountriesList();
    }

    getCountriesList(){
        this.accountService.getCountriesList().subscribe(results => {
            this.countriesList = results;
            this.checkSavedCountryData();
            for(let i=0; i<results.length; i++){
                this.countriesListFiltered.push({
                    label: results[i].discplayName,
                    value: results[i].cultureName
                })
            }            
        },
        error => {
            console.log(error)
        });

    }

    checkSavedCountryData(){
        this.accountService.getSavedCountryData(1).subscribe(results => {
            if(results){
                if(results["cultureId"] != 0){
                    this.globalSettingsId = results.globalSettingId;
                    this.countryData = results;
                    for(let i = 0; i<this.countriesList.length; i++){
                        if(this.countriesList[i].cultureId == results.cultureId){
                            this.countryItem = this.countriesList[i].cultureName;
                        }
                    }        
                                
                    this.getCountrySpecificData()
                }  
            }                      
        },
        error => {
            console.log(error)
        });
    }

    getCountrySpecificData(){
        this.accountService.getCountrySpecificData(this.countryItem).subscribe(results => {
            this.countryData = results;    
        },
        error => {
            console.log(error)
        });
    }

    saveSettings(){        
        let countryObject = this.countriesList.find(x => x.cultureName === this.countryItem);
        let params = {
            GlobalSettingId:this.globalSettingsId,
            CompanyId:1,
            CultureId: countryObject.cultureId,
            CultureName: countryObject.cultureName,
            CurrencyFormat:this.countryData.currencyFormat,
            NumberFormat:this.countryData.numberFormat,
            DateFormat:this.countryData.dateFormat,
            PercentFormat:this.countryData.percentFormat,
            CreditLimtFormat:this.countryData.creditLimtFormat,
            CreatedBy:"admin",
            UpdatedBy:"admin",
            CreatedDate: new Date(),
            UpdatedDate: new Date(),
            IsActive:true,
            IsDeleted:false
            
        }
        this.accountService.saveCountryLevelGlobalSettings(params).subscribe(result => {
            this.alertService.showMessage("Success", `Action was updated successfully`, MessageSeverity.success);
            this.authService.loadGlobalSettings();
        })
    }

}