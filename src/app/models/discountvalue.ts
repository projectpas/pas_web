import { MasterCompany } from './mastercompany.model';

export class DiscountValue {


	constructor(discountId?: number, discontValue?: string) {

		this.discountId = discountId;
		this.discontValue = discontValue;

	}

	public discountId: number;
	public discontValue: string;
}