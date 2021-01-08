import { JournalType } from "./journaltype.model";

export class InterCompanySetup {

    public interCompanySetupId: number;

    public affiliateCode: string;

    public affiliateName: string;

    public gLAccountToBeCredited: number;

    public gLAccountToBeDebited: number;

    public journalType: number;

    public discountFromCustomer: string;

    public fxGainAndLossFromCustomer: string;

    public discountToCustomer: string;

    public fxGainAndLossToCustomer: string;

    public objjournalType: JournalType;
}