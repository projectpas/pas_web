export class CustomerSearchQuery {
  CustomerCode: string;
  Name: string;
  Email: string;
  City: string;
  StateOrProvince: string;
  CustomerType: string;
  PrimarySalesPersonFirstName: string;
  first: number;
  page: number;
  pageCount: number;
  rows: number;
    limit: number;
    contact: any;
    Phone: any;
    pageLinks: any;
    selectedColumns: any;



  constructor() {
    this.init();
  }

  private init() {
    this.first = 0;
    this.rows = 10;
    this.limit = 5;
    this.pageCount = 10;
    this.page = 10;
  }

  public reset() {
    this.init();
  }
}
