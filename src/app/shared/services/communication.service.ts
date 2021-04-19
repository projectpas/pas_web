import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { EndpointFactory } from '../../../app/services/endpoint-factory.service';
import { ConfigurationService } from '../../../app/services/configuration.service';
@Injectable()
export class CommunicationService extends EndpointFactory {
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }

    //Save phone
    savePhone(data): Observable<any> {
        return this.http.post(`${this.configurations.baseUrl}/api/Communication/createcommunicationphone`, data).catch(error => {
            return this.handleErrorCommon(error, () => this.savePhone(data));
        });
    }
    //Save & Update email
    saveAndUpdateEmail(data): Observable<any> {
        return this.http.post(`${this.configurations.baseUrl}/api/Communication/EmailPost`, data).catch(error => {
            return this.handleErrorCommon(error, () => this.saveAndUpdateEmail(data));
        });
    }
    //Delete Email

    //saveAndUpdateEmailOfSalesQuote
    saveAndUpdateEmailOfSalesQuote(data): Observable<any> {
        return this.http.post(`${this.configurations.baseUrl}/api/salesquote/emailpost`, data).catch(error => {
            return this.handleErrorCommon(error, () => this.saveAndUpdateEmailOfSalesQuote(data));
        });
    }

    //get PDF preview of Quote
    soqsendmailpdfpreview(salesQuoteId) {
        return this.http.get(`${this.configurations.baseUrl}/api/SalesQuote/soqsendmailpdfpreview/${salesQuoteId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.soqsendmailpdfpreview(salesQuoteId));
        });

    }
    //get PDF preview of Quote
    sosendmailpdfpreview(salesQuoteId) {
        return this.http.get(`${this.configurations.baseUrl}/api/SalesOrder/sosendmailpdfpreview/${salesQuoteId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.sosendmailpdfpreview(salesQuoteId));
        });

    }
    //saveAndUpdateEmailOfSalesOrder
    saveAndUpdateEmailOfSalesOrder(data): Observable<any> {
        return this.http.post(`${this.configurations.baseUrl}/api/SalesOrder/EmailPost`, data).catch(error => {
            return this.handleErrorCommon(error, () => this.saveAndUpdateEmailOfSalesOrder(data));
        });
    }

    //getEmailDataForView
    getEmailDataByEmailId(id) {
        return this.http.get(`${this.configurations.baseUrl}/api/Communication/emailbyid?emailId=${id}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getEmailDataByEmailId(id));
        });
    }

    //Save Text
    saveText(data): Observable<any> {
        return this.http.post(`${this.configurations.baseUrl}/api/Communication/createcommunicationtext`, data).catch(error => {
            return this.handleErrorCommon(error, () => this.saveText(data));
        });
    }
    //Save memo
    saveMemo(data): Observable<any> {
        return this.http.post(`${this.configurations.baseUrl}/api/Communication/creatememo`, data).catch(error => {
            return this.handleErrorCommon(error, () => this.saveMemo(data));
        });
    }

    //Update phone
    updatePhone(data): Observable<any> {
        return this.http.post(`${this.configurations.baseUrl}/api/Communication/updatecommunicationphone`, data).catch(error => {
            return this.handleErrorCommon(error, () => this.updatePhone(data));
        });
    }
    //Update Text
    updateText(data): Observable<any> {
        return this.http.post(`${this.configurations.baseUrl}/api/Communication/updatecommunicationtext`, data).catch(error => {
            return this.handleErrorCommon(error, () => this.updateText(data));
        });
    }
    //Update memo
    updateMemo(data): Observable<any> {
        return this.http.post(`${this.configurations.baseUrl}/api/Communication/updatememo`, data).catch(error => {
            return this.handleErrorCommon(error, () => this.updateMemo(data));
        });
    }

    //Get phone List
    getPhoneList(referenceId, moduleId, partNoId,masterCompanyId): Observable<any> {
        return this.http.get(`${this.configurations.baseUrl}/api/Communication/communicationphonelist?referenceId=${referenceId}&moduleId=${moduleId}&workOrderPartNo=${partNoId}&masterCompanyId=${masterCompanyId !=undefined ? masterCompanyId :0}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getPhoneList(referenceId, moduleId, partNoId,masterCompanyId));
        });
    }
    //Get email List
    getEmailList(referenceId, moduleId, partNoId,masterCompanyId): Observable<any> {
        return this.http.get(`${this.configurations.baseUrl}/api/Communication/emailList?referenceId=${referenceId}&moduleId=${moduleId}&workOrderPartNo=${partNoId}&masterCompanyId=${masterCompanyId !=undefined ? masterCompanyId :0}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getEmailList(referenceId, moduleId, partNoId,masterCompanyId));
        });
    }
    //Get Text List
    getTextList(referenceId, moduleId, partNoId,masterCompanyId): Observable<any> {
        return this.http.get(`${this.configurations.baseUrl}/api/Communication/communicationtextlist?referenceId=${referenceId}&moduleId=${moduleId}&workOrderPartNo=${partNoId}&masterCompanyId=${masterCompanyId !=undefined ? masterCompanyId :0}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getTextList(referenceId, moduleId, partNoId,masterCompanyId));
        });
    }
    //Get memo List
    getMemoList(referenceId, moduleId, partNoId,masterCompanyId): Observable<any> {
        return this.http.get(`${this.configurations.baseUrl}/api/Communication/memoList?referenceId=${referenceId}&moduleId=${moduleId}&workOrderPartNo=${partNoId}&masterCompanyId=${masterCompanyId !=undefined ? masterCompanyId:0 }`).catch(error => {
            return this.handleErrorCommon(error, () => this.getMemoList(referenceId, moduleId, partNoId,masterCompanyId));
        });
    }

    //Delete phone List
    deletePhoneList(phoneId): Observable<any> {
        return this.http.get(`${this.configurations.baseUrl}/api/Communication/deletecommunicationphone?communicationPhoneId=${phoneId}&updatedBy=admin`).catch(error => {
            return this.handleErrorCommon(error, () => this.deletePhoneList(phoneId));
        });
    }
    //Delete email List
    deleteEmailList(emailId): Observable<any> {
        return this.http.get(`${this.configurations.baseUrl}/api/Communication/deleteemail?emailId=${emailId}&updatedBy=admin`).catch(error => {
            return this.handleErrorCommon(error, () => this.deleteEmailList(emailId));
        });
    }
    //Delete Text List
    deleteTextList(textId): Observable<any> {
        return this.http.get(`${this.configurations.baseUrl}/api/Communication/deletecommunicationtext?communicationTextId=${textId}&updatedBy=admin`).catch(error => {
            return this.handleErrorCommon(error, () => this.deleteTextList(textId));
        });
    }
    //Delete memo List
    deleteMemoList(memoId): Observable<any> {
        return this.http.get(`${this.configurations.baseUrl}/api/Communication/deletememo?memoId=${memoId}&updatedBy=admin`).catch(error => {
            return this.handleErrorCommon(error, () => this.deleteMemoList(memoId));
        });
    }

    //get phone data
    getPhoneData(woId, woPartNum, moduleId, phoneNo): Observable<any> {
        return this.http.get(`${this.configurations.baseUrl}/api/Communication/communicationphoneview?workOrderId=${woId}&workOrderPartNo=${woPartNum}&moduleId=${moduleId}&phoneNo=${phoneNo}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getPhoneData(woId, woPartNum, moduleId, phoneNo));
        });
    }

    //get text data
    getTextData(woId, woPartNum, moduleId, phoneNo): Observable<any> {
        return this.http.get(`${this.configurations.baseUrl}/api/communication/communicationtextview?workOrderId=${woId}&workOrderPartNo=${woPartNum}&moduleId=${moduleId}&phoneNo=${phoneNo}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getTextData(woId, woPartNum, moduleId, phoneNo));
        });
    }





    //common communication apis

    //memo
    getCommonMemoList(referenceId, moduleId, isDeleted,masterCompanyId): Observable<any> {
        return this.http.get(`${this.configurations.baseUrl}/api/Communication/memoList?referenceId=${referenceId}&moduleId=${moduleId}&isDeleted=${isDeleted}&masterCompanyId=${masterCompanyId !=undefined ?masterCompanyId :0}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getCommonMemoList(referenceId, moduleId, isDeleted,masterCompanyId));
        });
    }
    deleteCommonMemoList(memoId,updatedBy): Observable<any> {
        return this.http.get(`${this.configurations.baseUrl}/api/Communication/deletememo?memoId=${memoId}&updatedBy=${updatedBy}`).catch(error => {
            return this.handleErrorCommon(error, () => this.deleteCommonMemoList(memoId,updatedBy));
        });
    }
    updateCommonMemo(data): Observable<any> {
        return this.http.post(`${this.configurations.baseUrl}/api/Communication/updatememo`, data).catch(error => {
            return this.handleErrorCommon(error, () => this.updateCommonMemo(data));
        });
    }
    saveCommonMemo(data): Observable<any> {
        return this.http.post(`${this.configurations.baseUrl}/api/Communication/creatememo`, data).catch(error => {
            return this.handleErrorCommon(error, () => this.saveCommonMemo(data));
        });
    }
    getCOmmonMemoHistory(memoId) {
        return this.http.get(`${this.configurations.baseUrl}/api/Communication/memohistory?memoId=${memoId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getCOmmonMemoHistory(memoId));
        });
    }

    //text
    deleteCommonTextList(textId,updatedBy): Observable<any> {
        return this.http.delete(`${this.configurations.baseUrl}/api/Communication/deletecommunicationtext?communicationTextId=${textId}&updatedBy=${updatedBy}`).catch(error => {
            return this.handleErrorCommon(error, () => this.deleteCommonTextList(textId,updatedBy));
        });
    }
    getCOmmonTextList(referenceId, moduleId, isDeleted,masterCompanyId): Observable<any> {
        return this.http.get(`${this.configurations.baseUrl}/api/Communication/communicationtextlist?referenceId=${referenceId}&moduleId=${moduleId}&isDeleted=${isDeleted}&masterCompanyId=${masterCompanyId !=undefined ?masterCompanyId :0}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getCOmmonTextList(referenceId, moduleId, isDeleted,masterCompanyId));
        });
    }
    updateCommonText(data): Observable<any> {
        return this.http.post(`${this.configurations.baseUrl}/api/Communication/updatecommunicationtext`, data).catch(error => {
            return this.handleErrorCommon(error, () => this.updateCommonText(data));
        });
    }

    saveCommonText(data): Observable<any> {
        return this.http.post(`${this.configurations.baseUrl}/api/Communication/createcommunicationtext`, data).catch(error => {
            return this.handleErrorCommon(error, () => this.saveCommonText(data));
        });
    }
    getCOmmonTextHistory(communicationTextId) {
        return this.http.get(`${this.configurations.baseUrl}/api/Communication/communicationtexthistory?communicationTextId=${communicationTextId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getCOmmonTextHistory(communicationTextId));
        });
    }
    getTCommonextData(communicationTextId): Observable<any> {
        return this.http.get(`${this.configurations.baseUrl}/communicationtextbyid?communicationTextId=${communicationTextId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getTCommonextData(communicationTextId));
        });
    }
    //Phone
    getCommonPhoneData(referenceId, moduleId, isDeleted,type,masterCompanyId): Observable<any> {
        return this.http.get(`${this.configurations.baseUrl}/api/Communication/communicationphonelist?referenceId=${referenceId}&moduleId=${moduleId}&isDeleted=${isDeleted}&phonetype=${type}&masterCompanyId=${masterCompanyId !=undefined ?masterCompanyId :0}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getCommonPhoneData(referenceId, moduleId, isDeleted,type,masterCompanyId));
        });
    }



    saveCommonPhone(data): Observable<any> {
        return this.http.post(`${this.configurations.baseUrl}/api/Communication/createcommunicationphone`, data).catch(error => {
            return this.handleErrorCommon(error, () => this.saveCommonPhone(data));
        });
    }
    updateCommonPhone(data): Observable<any> {
        return this.http.post(`${this.configurations.baseUrl}/api/Communication/updatecommunicationphone`, data).catch(error => {
            return this.handleErrorCommon(error, () => this.updateCommonPhone(data));
        });
    }
    deleteCommonPhoneList(phoneId,updatedBy): Observable<any> {
        return this.http.delete(`${this.configurations.baseUrl}/api/Communication/deletecommunicationphone?communicationPhoneId=${phoneId}&updatedBy=${updatedBy}`).catch(error => {
            return this.handleErrorCommon(error, () => this.deleteCommonPhoneList(phoneId,updatedBy));
        });
    }
    getCOmmonPhoneHistory(communicationPhoneId,type) {
        return this.http.get(`${this.configurations.baseUrl}/api/Communication/communicationphonehistory?communicationPhoneId=${communicationPhoneId}&type=${type}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getCOmmonPhoneHistory(communicationPhoneId,type));
        });
    }

    //email
    getCOmmonEmailHistory(emailId) {
        return this.http.get(`${this.configurations.baseUrl}/api/Communication/emailhistory?emailId=${emailId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getCOmmonEmailHistory(emailId));
        });
    }
    deleteCommonEmailList(emailId, updatedBy): Observable<any> {
        return this.http.delete(`${this.configurations.baseUrl}/api/Communication/deleteemail?emailId=${emailId}&updatedBy=${updatedBy}`).catch(error => {
            return this.handleErrorCommon(error, () => this.deleteCommonEmailList(emailId, updatedBy));
        });
    }
    getCommonEmailList(referenceId, moduleId, isDeleted,type,masterCompanyId): Observable<any> {
        return this.http.get(`${this.configurations.baseUrl}/api/Communication/emailList?referenceId=${referenceId}&moduleId=${moduleId}&isDeleted=${isDeleted}&type=${type}&masterCompanyId=${masterCompanyId !=undefined ?masterCompanyId :0}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getCommonEmailList(referenceId, moduleId, isDeleted,type,masterCompanyId));
        });
    }

    restoreMemo(memoId, status, updatedBy): Observable<any> {
        return this.http.get(`${this.configurations.baseUrl}/api/Communication/restorememo?memoId=${memoId}&updatedBy=${updatedBy}`).catch(error => {
            return this.handleErrorCommon(error, () => this.restoreMemo(memoId, status, updatedBy));
        });
    }
    restoreEmail(emailId, status, updatedBy): Observable<any> {
        return this.http.delete(`${this.configurations.baseUrl}/api/Communication/restoreemail?emailId=${emailId}&updatedBy=${updatedBy}`).catch(error => {
            return this.handleErrorCommon(error, () => this.restoreEmail(emailId, status, updatedBy));
        });
    }
    restorePhone(communicationPhoneId, status, updatedBy): Observable<any> {
        return this.http.delete(`${this.configurations.baseUrl}/api/Communication/restorecommunicationphone?communicationPhoneId=${communicationPhoneId}&updatedBy=${updatedBy}`).catch(error => {
            return this.handleErrorCommon(error, () => this.restorePhone(communicationPhoneId, status, updatedBy));
        });
    }
    // api/Communication/restorecommunicationphone?communicationPhoneId=3&updatedBy=3

    restoreText(communicationTextId, status, updatedBy): Observable<any> {
        return this.http.delete(`${this.configurations.baseUrl}/api/Communication/restorecommunicationtext?communicationTextId=${communicationTextId}&updatedBy=${updatedBy}`).catch(error => {
            return this.handleErrorCommon(error, () => this.restoreText(communicationTextId, status, updatedBy));
        });
    }
}

