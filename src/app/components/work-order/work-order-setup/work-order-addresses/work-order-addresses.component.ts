import { Component, OnInit, Input } from '@angular/core';
// import {
//   addressesForm,
//   Addresses
// } from '../../../../models/work-order-address.model';
@Component({
  selector: 'app-work-order-addresses',
  templateUrl: './work-order-addresses.component.html',
  styleUrls: ['./work-order-addresses.component.css']
})
export class WorkOrderAddressesComponent implements OnInit {
  @Input() addressesForm;
  siteDropdownMenu = [
    { label: 'Select Location', value: '' },
    { label: 'NewyorkLocation', value: 'NewyorkLocation' },
    { label: 'HyderabadLocation', value: 'HyderabadLocation' },
    { label: 'Chicago Location', value: 'Chicago Location' }
  ];

  ngOnInit(): void {}
  saveAddress() {
    console.log(this.addressesForm);
  }
}
