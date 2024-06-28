import { TestBed } from '@angular/core/testing';

import { ThemeService } from './theme.service';
import { StorageService } from './storage.service';
import { switchMap, take } from 'rxjs';

describe('ThemeService', () => {
  let service: ThemeService;
  let storageServiceMock: jasmine.SpyObj<StorageService>;

  beforeEach(() => {
    storageServiceMock = jasmine.createSpyObj('StorageService', ['set']);
    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        {provide: StorageService, useValue: storageServiceMock}
      ]
    });
  });

  it('should be created', () => {
    service = TestBed.inject(ThemeService);
    expect(service).toBeTruthy();
  });

  
  it('should load a defined value', (doneFn) => {
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify("light"))
    service = TestBed.inject(ThemeService);
    service.theme$.subscribe(resp => {
      expect(resp).toBeFalsy();
      doneFn();
    })
  });

  it('should toggle the value from light to dark', (done) => {
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify("light"));
    service = TestBed.inject(ThemeService);
    service.theme$
    .pipe(
      take(1),
      switchMap(value => {
        expect(value).toBeFalsy();
        service.toggleTheme();
        return service.theme$
      }),
      take(1)
    )
    .subscribe(newValue => {
      expect(newValue).toBeTruthy();
      expect(storageServiceMock.set).toHaveBeenCalledTimes(1);
      expect(storageServiceMock.set).toHaveBeenCalledWith('theme', 'dark');
      done();
    });
  });
  
  describe('', () => {
    
    beforeEach(() => {
      service = TestBed.inject(ThemeService);
    });

    it('should load default value if it is not defined', (doneFn) => {
      service.theme$.subscribe(resp => {
        expect(resp).toBeTruthy(); //It means dark theme will be setted
        doneFn();
      })
    });
  
    it('should toggle the value from dark to light', (done) => {
      service.theme$
      .pipe(
        take(1),
        switchMap(value => {
          expect(value).toBeTruthy();
          service.toggleTheme();
          return service.theme$
        }),
        take(1)
      )
      .subscribe(newValue => {
        expect(newValue).toBeFalsy();
        expect(storageServiceMock.set).toHaveBeenCalledTimes(1);
        expect(storageServiceMock.set).toHaveBeenCalledWith('theme', 'light');
        done();
      });
    });

  })

});
