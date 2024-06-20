import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthFormComponent } from './auth-form.component';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('AuthFormComponent', () => {
  let component: AuthFormComponent;
  let fixture: ComponentFixture<AuthFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthFormComponent],
      providers: [
        provideRouter([]),
        provideAnimations()
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuthFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('with register component as parent', () => {
    const data = {
      email: 'user1@mail.com',
      name: 'user',
      last_name: 'one',
      password: '12345',
      confirm_password: '12345',
    }
    let submitBtn: DebugElement;

    beforeEach(() => {
      component.login = false;
      component.authForm.setValue(data);
      component.authForm.markAllAsTouched();
      submitBtn = fixture.debugElement.query(By.css("button[type='submit']"));
    })

    it('should be valid if form is valid', () => {
      expect(component.authForm.valid).toBeTruthy()
    })
  
    it('should require a email', () => {
      component.authForm.get('email')!.setValue(null);
      fixture.detectChanges();
      const errorDiv = fixture.debugElement.query(By.css('mat-error'));
      expect(component.authForm.valid).toBeFalsy();
      expect(submitBtn.attributes['disabled']).toEqual('true');
      expect(errorDiv).not.toBeNull();
      expect(errorDiv.children[0].properties['innerText']).toEqual('This field is mandatory.');
    })
  
    it('should require a valid email', () => {
      component.authForm.get('email')!.setValue('invalidemail@');
      fixture.detectChanges();
      const errorDiv = fixture.debugElement.query(By.css('mat-error'));
      expect(component.authForm.valid).toBeFalsy();
      expect(submitBtn.attributes['disabled']).toEqual('true');
      expect(errorDiv).not.toBeNull();
      expect(errorDiv.children[0].properties['innerText']).toEqual('This email is invalid.');
    })
  
    it('should require a name', () => {
      component.authForm.get('name')!.setValue(null);
      fixture.detectChanges();
      const errorDiv = fixture.debugElement.query(By.css('mat-error'));
      expect(component.authForm.valid).toBeFalsy();
      expect(submitBtn.attributes['disabled']).toEqual('true');
      expect(errorDiv).not.toBeNull();
      expect(errorDiv.children[0].properties['innerText']).toEqual('This field is mandatory.');
    })
  
    it('should require a name with min length', () => {
      component.authForm.get('name')!.setValue('us');
      fixture.detectChanges();
      const errorDiv = fixture.debugElement.query(By.css('mat-error'));
      expect(component.authForm.valid).toBeFalsy()
      expect(submitBtn.attributes['disabled']).toEqual('true');
      expect(errorDiv).not.toBeNull();
      expect(errorDiv.children[0].properties['tagName']).toEqual('SPAN');
    })
  
    it('should require a last name', () => {
      component.authForm.get('last_name')!.setValue(null);
      fixture.detectChanges();
      const errorDiv = fixture.debugElement.query(By.css('mat-error'));
      expect(component.authForm.valid).toBeFalsy()
      expect(submitBtn.attributes['disabled']).toEqual('true');
      expect(errorDiv).not.toBeNull();
      expect(errorDiv.children[0].properties['innerText']).toEqual('This field is mandatory.');
    })
  
    it('should require a last name with min length', () => {
      component.authForm.get('last_name')!.setValue('o');
      fixture.detectChanges();
      const errorDiv = fixture.debugElement.query(By.css('mat-error'));
      expect(component.authForm.valid).toBeFalsy()
      expect(submitBtn.attributes['disabled']).toEqual('true');
      expect(errorDiv).not.toBeNull();
      expect(errorDiv.children[0].properties['tagName']).toEqual('SPAN');
    })
  
    it('should require a password', () => {
      component.authForm.get('password')!.setValue(null);
      fixture.detectChanges();
      const errorDiv = fixture.debugElement.query(By.css('mat-error'));
      expect(component.authForm.valid).toBeFalsy()
      expect(submitBtn.attributes['disabled']).toEqual('true');
      expect(errorDiv).not.toBeNull();
      expect(errorDiv.children[0].properties['innerText']).toEqual('This field is mandatory.');
    })
  
    it('should require a password with min length', () => {
      component.authForm.get('password')!.setValue('pass');
      fixture.detectChanges();
      const errorDiv = fixture.debugElement.query(By.css('mat-error'));
      expect(component.authForm.valid).toBeFalsy();
      expect(submitBtn.attributes['disabled']).toEqual('true');
      expect(errorDiv).not.toBeNull();
      expect(errorDiv.children[0].properties['tagName']).toEqual('SPAN');
    })
  
    it('should require a confirm password', () => {
      component.authForm.get('confirm_password')!.setValue(null);
      fixture.detectChanges();
      const errorDiv = fixture.debugElement.query(By.css('mat-error'));
      expect(component.authForm.valid).toBeFalsy();
      expect(submitBtn.attributes['disabled']).toEqual('true');
      expect(errorDiv).not.toBeNull();
      expect(errorDiv.children[0].properties['innerText']).toEqual('This field is mandatory.');
    })
  
    it('should require a confirm password with min length', () => {
      component.authForm.get('confirm_password')?.setValue('pass');
      fixture.detectChanges();
      const errorDiv = fixture.debugElement.query(By.css('mat-error'));
      expect(component.authForm.valid).toBeFalsy();
      expect(submitBtn.attributes['disabled']).toEqual('true');
      expect(errorDiv).not.toBeNull();
      expect(errorDiv.children[0].properties['tagName']).toEqual('SPAN');
    })

    it('should match password and confirm password', () => {
      component.authForm.get('password')?.setValue('1234567');
      fixture.detectChanges();
      const errorDiv = fixture.debugElement.query(By.css('mat-error'))
      expect(component.authForm.valid).toBeFalsy();
      expect(submitBtn.attributes['disabled']).toEqual('true');
      expect(errorDiv).not.toBeNull();
      expect(errorDiv.children[0].attributes['id']).toEqual('not-match');
    })

    it('should emit formData with all properties', () => {
      spyOn(component.formData, 'emit').and.callThrough();
      component.authForm.markAsDirty();
      const form = fixture.debugElement.query(By.css("form"));
      form.triggerEventHandler('ngSubmit', null);
      fixture.detectChanges();
      expect(component.formData.emit).toHaveBeenCalledOnceWith(data);
      expect(submitBtn.attributes['disabled']).toBeUndefined()
    })

    it('should change visibility of password', () => {
      const preValue = component.hide();
      const passInput = fixture.debugElement.query(By.css("#password"));
      const prevInputVal = passInput.attributes['type']
      component.changeHide();
      fixture.detectChanges();
      expect(preValue).toBeTruthy();
      expect(prevInputVal).toEqual('password')
      expect(passInput.attributes['type']).toEqual('text')
      expect(component.hide()).toBeFalsy()
    })

    it('should change visibility of confirm password', () => {
      const prevValue = component.hideConfirm();
      const passInput = fixture.debugElement.query(By.css("#confirm_password"));
      const prevInputVal = passInput.attributes['type']
      component.changeHide(true);
      fixture.detectChanges();
      expect(prevValue).toBeTruthy();
      expect(prevInputVal).toEqual('password')
      expect(passInput.attributes['type']).toEqual('text')
      expect(component.hideConfirm()).toBeFalsy()
    })
  })


  describe('with login component as parent', () => {
    const data = {
      username: 'user1@mail.com',
      password: '12345',
    }
    let submitBtn: DebugElement;

    beforeEach(() => {
      component.login = true;
      component.ngOnInit();
      component.authForm.setValue({email: data.username, password: data.password, name: null, last_name: null, confirm_password: null});
      component.authForm.markAllAsTouched();
      submitBtn = fixture.debugElement.query(By.css("button[type='submit']"));
    })

    it('should not require a name, last name or confirm password to valid form', () => {
      fixture.detectChanges();
      expect(component.authForm.valid).toBeTruthy();
      expect(submitBtn.attributes['disabled']).toBeUndefined();
    })

    it('should require a email', () => {
      component.authForm.get('email')!.setValue(null);
      fixture.detectChanges();
      const errorDiv = fixture.debugElement.query(By.css('mat-error'));
      expect(component.authForm.valid).toBeFalsy();
      expect(submitBtn.attributes['disabled']).toEqual('true');
      expect(errorDiv).not.toBeNull();
      expect(errorDiv.children[0].properties['innerText']).toEqual('This field is mandatory.');
    })
  
    it('should require a valid email', () => {
      component.authForm.get('email')!.setValue('invalidemail@');
      fixture.detectChanges();
      const errorDiv = fixture.debugElement.query(By.css('mat-error'));
      expect(component.authForm.valid).toBeFalsy();
      expect(submitBtn.attributes['disabled']).toEqual('true');
      expect(errorDiv).not.toBeNull();
      expect(errorDiv.children[0].properties['tagName']).toEqual('SPAN');
    })
  
    it('should emit formData only with username and password', () => {
      spyOn(component.formData, 'emit').and.callThrough();
      component.authForm.markAsDirty();
      const form = fixture.debugElement.query(By.css("form"));
      form.triggerEventHandler('ngSubmit', null);
      fixture.detectChanges();
      expect(component.formData.emit).toHaveBeenCalledOnceWith(data);
      expect(submitBtn.attributes['disabled']).toBeUndefined()
    })

    it('should change visibility of password', () => {
      const preValue = component.hide();
      const passInput = fixture.debugElement.query(By.css("#password"));
      const prevInputVal = passInput.attributes['type']
      component.changeHide();
      fixture.detectChanges();
      expect(preValue).toBeTruthy();
      expect(prevInputVal).toEqual('password')
      expect(passInput.attributes['type']).toEqual('text')
      expect(component.hide()).toBeFalsy()
    })

  })

});
