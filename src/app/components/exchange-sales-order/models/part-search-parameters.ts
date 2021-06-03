
import { ItemSearchType } from './item-search-type';

export class PartSearchParamters {

    public partId?: number = null;

    public partNumber: string = '';

    public partDescription: string = '';

    public partNumberObj: {};

    public conditionId?: number = 0;

    public quantityRequired: number = 0;

    public quantityRequested: number = 0;

    public quantityToQuote: number = 0;

    public quantityAlreadyQuoted?: number = 0;

    public itemSearchType: ItemSearchType;

    public includeAlternatePartNumber: boolean = false;

    public includeEquivalentPartNumber: boolean = false;

    public includeMultiplePartNumber: boolean = false;

    public qtyAvailable: number = 0;

    public qtyOnHand: number = 0;

    public restrictPMA: boolean = false;

    public restrictDER: boolean = false;

    public customerId?: number = null;

    public custRestrictedDer: boolean = false;

    public custRestrictedPMA: boolean = false;
    public conditionIds: number[] = [];
    public itemMasterLoanExchId:number;
    public isLoan:boolean;
    public isExchange:boolean
    public exchangeCurrencyId:number;
    public loanCurrencyId:number;
    public exchangeListPrice:number;
    public exchangeCorePrice:number;
    public exchangeOverhaulPrice:number;
    public exchangeOutrightPrice:number;
    public exchangeCoreCost:number;
    public loanCorePrice:number;
    public loanOutrightPrice:number;
    public loanFees:number;
    public exchangeOverhaulCost:number;
    constructor() {
        this.itemSearchType = ItemSearchType.ItemMaster;
    }
}