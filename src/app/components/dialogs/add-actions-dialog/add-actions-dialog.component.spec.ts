/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { AddActionsDialogComponent } from './add-actions-dialog.component';

let component: AddActionsDialogComponent;
let fixture: ComponentFixture<AddActionsDialogComponent>;

describe('add-actions-dialog component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AddActionsDialogComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(AddActionsDialogComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});