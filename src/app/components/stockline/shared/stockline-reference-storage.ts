import { Injectable } from '@angular/core';
import { StocklineReference } from '../../../models/stocklineReference';

@Injectable()

export class StocklineReferenceStorage {
    public stocklineReferenceData: StocklineReference;
    public constructor(){
        
    }
}