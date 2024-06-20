import { TestBed } from '@angular/core/testing';

import { PermissionService } from './permission.service';
import { HttpService } from '../util/http.service';
import { PermissionResponse } from '../../models/post/permission.model';
import { of, throwError } from 'rxjs';

describe('PermissionService', () => {
  let service: PermissionService;
  let httpSvSpy: jasmine.SpyObj<HttpService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: HttpService, useValue: jasmine.createSpyObj('HttpService', ['get'])}
      ]
    });
    service = TestBed.inject(PermissionService);
    httpSvSpy = TestBed.inject(HttpService) as jasmine.SpyObj<HttpService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get permissions', (done) => {
    const mockPermission: PermissionResponse[] = [{id: 1, name: "name1"}, {id: 2, name: "name2"}]
    httpSvSpy.get.and.returnValue(of(mockPermission));

    service.getPermissions()
    .subscribe(resp => {
      expect(resp).toBe(mockPermission);
      done();
    })
    expect(httpSvSpy.get).toHaveBeenCalledOnceWith('permission/');
  })

  it('should get categories', (done) => {
    const mockPermission: PermissionResponse[] = [{id: 1, name: "name1"}, {id: 2, name: "name2"}]
    httpSvSpy.get.and.returnValue(of(mockPermission));

    service.getCategories()
    .subscribe(resp => {
      expect(resp).toBe(mockPermission);
      done();
    })
    expect(httpSvSpy.get).toHaveBeenCalledOnceWith('permission/category/');
  })

  it('should return error on fail getting categories', (done) => {
    const errorResponse = {error: 'invalid credentials'};
    httpSvSpy.get.and.returnValue(throwError(() => errorResponse));

    service.getPermissions()
    .subscribe({
      error: err => {
        expect(err).toBe(errorResponse);
        done();
      }
    })
    expect(httpSvSpy.get).toHaveBeenCalledOnceWith('permission/');
  })

  it('should return error on fail getting permissions', (done) => {
    const errorResponse = {error: 'invalid credentials'};
    httpSvSpy.get.and.returnValue(throwError(() => errorResponse));

    service.getCategories()
    .subscribe({
      error: err => {
        expect(err).toBe(errorResponse);
        done();
      }
    })
    expect(httpSvSpy.get).toHaveBeenCalledOnceWith('permission/category/');
  })

});
