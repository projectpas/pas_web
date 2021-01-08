import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { EndpointFactory } from '../../../app/services/endpoint-factory.service';
import { ConfigurationService } from '../../../app/services/configuration.service';
@Injectable()
export class CommunicationService extends EndpointFactory {
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }

    //Save phone
    savePhone(data): Observable<any>{
        return this.http.post(`${this.configurations.baseUrl}/api/Communication/createcommunicationphone`, data);
    }
    //Save & Update email
    saveAndUpdateEmail(data): Observable<any>{
        return this.http.post(`${this.configurations.baseUrl}/api/Communication/EmailPost`, data);
    }
//Delete Email

    //saveAndUpdateEmailOfSalesQuote
    saveAndUpdateEmailOfSalesQuote(data): Observable<any>{
        return this.http.post(`${this.configurations.baseUrl}/api/salesquote/emailpost`, data);
    }

    //get PDF preview of Quote
    soqsendmailpdfpreview(salesQuoteId){
        return this.http.get(`${this.configurations.baseUrl}/api/SalesQuote/soqsendmailpdfpreview/${salesQuoteId}`);

    }
    //get PDF preview of Quote
    sosendmailpdfpreview(salesQuoteId) {
        return this.http.get(`${this.configurations.baseUrl}/api/SalesOrder/sosendmailpdfpreview/${salesQuoteId}`);

    }
    //saveAndUpdateEmailOfSalesOrder
    saveAndUpdateEmailOfSalesOrder(data): Observable<any> {
        return this.http.post(`${this.configurations.baseUrl}/api/SalesOrder/EmailPost`, data);
    }

    //getEmailDataForView
    getEmailDataByEmailId(id){
        return this.http.get(`${this.configurations.baseUrl}/api/Communication/emailbyid?emailId=${id}`);
    }

    //Save Text
    saveText(data): Observable<any>{
        return this.http.post(`${this.configurations.baseUrl}/api/Communication/createcommunicationtext`, data);
    }
    //Save memo
    saveMemo(data): Observable<any>{
        return this.http.post(`${this.configurations.baseUrl}/api/Communication/creatememo`, data);
    }
    
    //Update phone
    updatePhone(data): Observable<any>{
        return this.http.post(`${this.configurations.baseUrl}/api/Communication/updatecommunicationphone`, data);
    }
    //Update Text
    updateText(data): Observable<any>{
        return this.http.post(`${this.configurations.baseUrl}/api/Communication/updatecommunicationtext`, data);
    }
    //Update memo
    updateMemo(data): Observable<any>{
        return this.http.post(`${this.configurations.baseUrl}/api/Communication/updatememo`, data);
    }

    //Get phone List
    getPhoneList(referenceId, moduleId, partNoId): Observable<any>{
        return this.http.get(`${this.configurations.baseUrl}/api/Communication/communicationphonelist?referenceId=${referenceId}&moduleId=${moduleId}&workOrderPartNo=${partNoId}`);
    }
    //Get email List
    getEmailList(referenceId, moduleId, partNoId): Observable<any>{
        return this.http.get(`${this.configurations.baseUrl}/api/Communication/emailList?referenceId=${referenceId}&moduleId=${moduleId}&workOrderPartNo=${partNoId}`);
    }
    //Get Text List
    getTextList(referenceId, moduleId, partNoId): Observable<any>{
        return this.http.get(`${this.configurations.baseUrl}/api/Communication/communicationtextlist?referenceId=${referenceId}&moduleId=${moduleId}&workOrderPartNo=${partNoId}`);
    }
    //Get memo List
    getMemoList(referenceId, moduleId, partNoId): Observable<any>{
        return this.http.get(`${this.configurations.baseUrl}/api/Communication/memoList?referenceId=${referenceId}&moduleId=${moduleId}&workOrderPartNo=${partNoId}`);
    }

    //Delete phone List
    deletePhoneList(phoneId): Observable<any>{
        return this.http.get(`${this.configurations.baseUrl}/api/Communication/deletecommunicationphone?communicationPhoneId=${phoneId}&updatedBy=admin`);
    }
    //Delete email List
    deleteEmailList(emailId): Observable<any>{
        return this.http.get(`${this.configurations.baseUrl}/api/Communication/deleteemail?emailId=${emailId}&updatedBy=admin`);
    }
    //Delete Text List
    deleteTextList(textId): Observable<any>{
        return this.http.get(`${this.configurations.baseUrl}/api/Communication/deletecommunicationtext?communicationTextId=${textId}&updatedBy=admin`);
    }
    //Delete memo List
    deleteMemoList(memoId): Observable<any>{
        return this.http.get(`${this.configurations.baseUrl}/api/Communication/deletememo?memoId=${memoId}&updatedBy=admin`);
    }

    //get phone data
    getPhoneData(woId, woPartNum, moduleId, phoneNo): Observable<any>{
        return this.http.get(`${this.configurations.baseUrl}/api/Communication/communicationphoneview?workOrderId=${woId}&workOrderPartNo=${woPartNum}&moduleId=${moduleId}&phoneNo=${phoneNo}`)
    }

    //get text data
    getTextData(woId, woPartNum,moduleId, phoneNo): Observable<any>{
        return this.http.get(`${this.configurations.baseUrl}/api/communication/communicationtextview?workOrderId=${woId}&workOrderPartNo=${woPartNum}&moduleId=${moduleId}&phoneNo=${phoneNo}`)
    }
}