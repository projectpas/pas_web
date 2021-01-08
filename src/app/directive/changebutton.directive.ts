import { Directive, HostListener } from '@angular/core';


@Directive({ selector: 'changeButtonStatus' })

export class ChangeButtonStatus {
    @HostListener('mouseover', ['$event']) changeEventDetected(event) {
        console.log('Text');

        alert(`You clicked on `);
    };
}

