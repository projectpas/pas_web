/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { CreatePublicationComponent } from './create-publication.component';

let component: CreatePublicationComponent;
let fixture: ComponentFixture<CreatePublicationComponent>;

describe('Create-publication component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ CreatePublicationComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(CreatePublicationComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});