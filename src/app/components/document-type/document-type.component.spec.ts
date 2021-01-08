/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { DocumentTypeComponent } from './document-type.component';

let component: DocumentTypeComponent;
let fixture: ComponentFixture<DocumentTypeComponent>;

describe('document-type component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ DocumentTypeComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(DocumentTypeComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});