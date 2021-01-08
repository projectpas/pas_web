import { Injectable } from "@angular/core";
import { ISalesOrder } from "../../../../models/sales/ISalesOrder.model";
import { Observable, BehaviorSubject, Observer } from "rxjs";
import { ISalesOrderPart } from "../../../../models/sales/ISalesOrderPart";
import { ISalesOrderView } from "../../../../models/sales/ISalesOrderView";
import { ISalesOrderApproverList } from "../../../../models/sales/ISalesOrderApproverList";
import { ISalesOrderShippingDetail } from "../../../../models/sales/ISalesOrderShippingDetail";
import { ISalesOrderBillingDetail } from "../../../../models/sales/ISalesOrderBillingDetail";
import { ISalesOrderConversionCritera } from "../../../../models/sales/ISalesOrderConversionCriteria";
import { SalesOrderService } from "../../../../services/salesorder.service";
import { SalesOrderView } from "../../../../models/sales/SalesOrderView";

@Injectable()
export class SalesOrderStoreService {

    private orderViewState$: BehaviorSubject<ISalesOrderView>;

    private orderState$: BehaviorSubject<ISalesOrder>;

    private partsState$: BehaviorSubject<ISalesOrderPart[]>;

    private approverListsState$: BehaviorSubject<ISalesOrderApproverList[]>;

    private shippingDetailState$: BehaviorSubject<ISalesOrderShippingDetail>;

    private billingDetailState$: BehaviorSubject<ISalesOrderBillingDetail>;

    private conversionCriteriaState$: BehaviorSubject<ISalesOrderConversionCritera>;

    private error$: BehaviorSubject<string>;

    constructor(public salesOrderService: SalesOrderService) {

        this.resetStore();

    }

    public getNewSalesOrderInstance(customerId: number): void {

        this.salesOrderService.getNewSalesOrderInstance(customerId).subscribe((data: ISalesOrderView[]) => {

            var salesOrderView: ISalesOrderView = data && data.length > 0 ? data[0] : new SalesOrderView();

            this.setSalesOrderViewState(salesOrderView);
        });
    }

    public getSalesOrder(salesOrderId: number): void {

        this.salesOrderService.getSalesOrder(salesOrderId).subscribe((data: ISalesOrderView[]) => {

            var salesOrderView: ISalesOrderView = data && data.length > 0 ? data[0] : null;

            if (salesOrderView) {

                this.setSalesOrderViewState(salesOrderView);

            }
        });
    }

    private setSalesOrderViewState(nextState: ISalesOrderView): void {

        this.orderViewState$.next({ ...nextState });

        this.orderState$.next({ ...nextState.salesOrder });

        this.shippingDetailState$.next({ ...nextState.salesOrder as ISalesOrderShippingDetail });

        this.billingDetailState$.next({ ...nextState.salesOrder as ISalesOrderBillingDetail });

        this.partsState$.next({ ...nextState.parts });

        // this.approverListsState$.next({ ...nextState.approverList });

        this.error$.next('');

    }

    public setOrderState(nextState: ISalesOrder): void {

        return this.orderState$.next({ ...nextState })

    }

    public setPartState(nextState: ISalesOrderPart[]): void {

        return this.partsState$.next({ ...nextState });

    }

    public setApproverListState(nextState: ISalesOrderApproverList[]): void {

        return this.approverListsState$.next({ ...nextState });

    }

    public setShippingDetailState(nextState: ISalesOrderShippingDetail): void {

        return this.shippingDetailState$.next({ ...nextState });

    }

    public setBillingDetailState(nextState: ISalesOrderBillingDetail): void {

        return this.billingDetailState$.next({ ...nextState });

    }

    public setConversionCriteriaState(nextState: ISalesOrderConversionCritera): void {

        return this.conversionCriteriaState$.next({ ...nextState });

    }

    public getOrderViewState(): Observable<ISalesOrderView> {

        return this.orderViewState$.asObservable();

    }

    public getOrderState(): Observable<ISalesOrder> {

        return this.orderState$.asObservable();

    }

    public getPartState(): Observable<ISalesOrderPart[]> {

        return this.partsState$.asObservable();

    }

    public getApproverListState(): Observable<ISalesOrderApproverList[]> {

        return this.approverListsState$.asObservable();

    }

    public getShippingDetailState(): Observable<ISalesOrderShippingDetail> {

        return this.shippingDetailState$.asObservable();

    }

    public getBillingDetailState(): Observable<ISalesOrderBillingDetail> {

        return this.billingDetailState$.asObservable();

    }

    public getConversionCriteriaState(): Observable<ISalesOrderConversionCritera> {

        return this.conversionCriteriaState$.asObservable();
    }

    public resetStore(): void {

        this.setSalesOrderViewState(new SalesOrderView());
    }
}