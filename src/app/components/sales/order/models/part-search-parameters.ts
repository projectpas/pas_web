
import { ItemSearchType } from '../../quotes/models/item-search-type';

export class PartSearchParamters {

    public partId?: number = null;

    public partNumber: string = '';

    public partDescription: string = '';

    public partNumberObj: {};

    public conditionId?: number = null;

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

    constructor() {
        this.itemSearchType = ItemSearchType.ItemMaster;
    }


}