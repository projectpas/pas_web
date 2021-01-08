import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable , Subject,forkJoin} from 'rxjs';



import { Role } from '../../models/role.model';
import { AuthService } from '../auth.service';
import { ShippingReference } from '../../models/shipping-reference';
import { ShippingVia } from '../../models/shipping-via';
import { ShippingAccount } from '../../models/shipping-account';
import { ShippingEndpoint } from './shipping-endpoint.service';
import { PurchaseOrderPart, PurchaseOrder, StockLine, ReceiveParts } from '../../components/receiving/po-ro/receivng-po/PurchaseOrder.model';

@Injectable()
export class ShippingService {
    
    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,
        private shippingService: ShippingEndpoint) { }
    
    getAllShippingReference() {
        return forkJoin(this.shippingService.getAllShippingReference<ShippingReference[]>());
    }
    
    getAllShippingVia() {
        return forkJoin(this.shippingService.getAllShippingVia<ShippingVia[]>());
    }

    getAllShippingAccount() {
        return forkJoin(this.shippingService.getAllShippingAccount<ShippingAccount[]>());
    }

    receiveParts(receiveParts: ReceiveParts[]) {
        return this.shippingService.receiveParts<any>(receiveParts);
    }

    updateStockLine(receiveParts: ReceiveParts[]) {
        return this.shippingService.updateStockLine<any>(receiveParts);
    }
    
}