import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { TopbarComponent } from './topbar.component';
import { ThemeService } from '../../services/util/theme.service';
import { StorageService } from '../../services/util/storage.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router, provideRouter } from '@angular/router';
import { generateOneUser } from '../../models/user/user.mock';
import { ToastrService } from 'ngx-toastr';
import { By } from '@angular/platform-browser';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('TopbarComponent', () => {
  let component: TopbarComponent;
  let fixture: ComponentFixture<TopbarComponent>;
  let themeSvSpy: jasmine.SpyObj<ThemeService>;
  let storageSvSpy: jasmine.SpyObj<StorageService>;
  let authSvSpy: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let toastrSvSpy: jasmine.SpyObj<ToastrService>;
  const user = generateOneUser();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopbarComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {provide: ThemeService, useValue: jasmine.createSpyObj('ThemeService', ['toggleTheme'])},
        {provide: StorageService, useValue: jasmine.createSpyObj('StorageService', ['get', 'delete'])},
        {provide: AuthService, useValue: jasmine.createSpyObj('AuthService', ['logout'])},
        {provide: ToastrService, useValue: jasmine.createSpyObj('ToastrService', ['success'])},
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TopbarComponent);
    themeSvSpy = TestBed.inject(ThemeService) as jasmine.SpyObj<ThemeService>;
    storageSvSpy = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    authSvSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    toastrSvSpy = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    storageSvSpy.get.withArgs('logged-user').and.resolveTo({id: user.id, nickname: user.name, teamId: user.team!.id});
    storageSvSpy.get.withArgs('theme').and.resolveTo('dark');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load logged user and light theme on init', fakeAsync(() => {
    storageSvSpy.get.withArgs('theme').and.resolveTo('light');
    component.ngOnInit();
    tick();
    expect(component.loggedUser()).toEqual({id: user.id, name: user.name});
    expect(component.dark_mode()).toBeFalse();
  }));

  it('should load logged user and dark theme', () => {
    expect(component.loggedUser()).toEqual({id: user.id, name: user.name});
    expect(component.dark_mode()).toBeTrue();
  });

  it('should show name and show log out if logged in user', () => {
    fixture.detectChanges();
    const welcomeDiv = fixture.debugElement.query(By.css('span[test-id="welcome-div"]'));
    const logBtn = fixture.debugElement.query(By.css('button[test-id="log-btn"]'));
    expect(welcomeDiv.properties['innerText']).toEqual(`Welcome, ${user.name}`);
    expect(welcomeDiv.children[0].properties['tagName']).toEqual('IMG');
    expect(logBtn.attributes['ng-reflect-message']).toEqual('Logout');
    expect(logBtn.children[1].attributes['svgIcon']).toEqual('logout');
    
  })

  it('should not show name and show log in if no logged in user', () => {
    component.loggedUser.set(null);
    fixture.detectChanges();
    const logBtn = fixture.debugElement.query(By.css('button[test-id="log-btn"]'));
    expect(logBtn.attributes['ng-reflect-message']).toEqual('Login');
    expect(logBtn.children[1].attributes['svgIcon']).toEqual('login');
  })

  it('should call toggle theme', () => {
    component.toggleTheme();
    expect(themeSvSpy.toggleTheme).toHaveBeenCalledTimes(1);
    expect(component.dark_mode()).toBeFalse();
  })

  it('should delete logged user from storage and call auth service when user is logged in', fakeAsync(() => {
    const mockDialogRef = jasmine.createSpyObj({afterClosed: of(true)})
    spyOn(router, 'navigate').and.resolveTo(true);
    spyOn(component.dialog, 'open').and.returnValue(mockDialogRef);
    authSvSpy.logout.and.returnValue(of({message: ''}));
    component.onLogAction();
    expect(component.dialog.open).toHaveBeenCalledTimes(1);
    expect(mockDialogRef.afterClosed).toHaveBeenCalled();
    tick();
    expect(authSvSpy.logout).toHaveBeenCalledTimes(1);
    expect(storageSvSpy.delete).toHaveBeenCalledOnceWith('logged-user');
    expect(toastrSvSpy.success).toHaveBeenCalledOnceWith('Successful logout', 'Success');
    expect(component.loggedUser()).toEqual(null);
    expect(router.navigate).toHaveBeenCalledTimes(2);
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  }))

  it('should call router when user is not logged in', () => {
    component.loggedUser.set(null);
    spyOn(router, 'navigate');
    component.onLogAction();
    expect(router.navigate).toHaveBeenCalledOnceWith(['auth']);
  })
});
