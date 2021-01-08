import { Injectable } from '@angular/core';
import { SalesOrderReference } from '../../../models/sales/salesOrderReference';

@Injectable()

export class SalesOrderReferenceStorage {
    public salesOrderReferenceData: SalesOrderReference;
    public constructor(){
        
    }   
} 