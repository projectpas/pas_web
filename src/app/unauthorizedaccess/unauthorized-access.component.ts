import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';

@Component({
	selector: 'unauthorized-access',
    templateUrl: './unauthorized-access.component.html'
})
export class UnauthorizedAccessComponent implements OnInit {

	constructor(private router: ActivatedRoute, private route: Router)
	{
		
	}

	ngOnInit() {

    }

}