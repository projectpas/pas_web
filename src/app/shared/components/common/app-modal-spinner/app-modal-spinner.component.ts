import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-modal-spinner',
    templateUrl: './app-modal-spinner.component.html',
    styleUrls: ['./app-modal-spinner.component.scss']
})

export class AppModalSpinnerComponent implements OnInit {
    @Input() loading: boolean;
    @Input() text: string;
    @Input() styles: any = {};

    ngOnInit() {
    }
}