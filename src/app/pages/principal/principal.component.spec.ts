import { ComponentFixture, TestBed } from '@angular/core/testing';

import  PrincipalComponent  from './principal.component';
import { Component } from '@angular/core';
import { TopbarComponent } from '../../components/topbar/topbar.component';

@Component({
  selector: 'app-topbar',
  template: '',
  standalone: true
})
export class MockTopbar {
}

describe('PrincipalComponent', () => {
  let component: PrincipalComponent;
  let fixture: ComponentFixture<PrincipalComponent>;

  beforeEach(async () => {
    TestBed.overrideComponent(PrincipalComponent, {
      remove: {imports: [TopbarComponent]},
      add: {imports: [MockTopbar]}
    });
    await TestBed.configureTestingModule({
      imports: [PrincipalComponent],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
