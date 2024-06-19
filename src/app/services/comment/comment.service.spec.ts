import { TestBed } from '@angular/core/testing';

import { CommentService } from './comment.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideToastr } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { HttpService } from '../util/http.service';
import { generateOneComment, generatePaginatedComment } from '../../models/comment/comment.mock';

describe('Commentservice', () => {
  let service: CommentService;
  let httpController: HttpTestingController;
  let httpSv: HttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideToastr(),
        HttpService,
      ]
    });
    service = TestBed.inject(CommentService);
    httpSv = TestBed.inject(HttpService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call http service to create a comment', (doneFn) => {
    const mockComment = generateOneComment()
    const mockRequest = {post_id: mockComment.post.id, comment: mockComment.comment};
    spyOn(httpSv, 'post').and.callThrough();

    service.createComment(mockRequest)
    .subscribe(resp => {
      expect(resp).toBe(mockComment);
      expect(httpSv.post).toHaveBeenCalledOnceWith('comment/', mockRequest);
      doneFn();
    })

    const req = httpController.expectOne(`${environment.api_url}/comment/`)
    expect(req.request.method).toEqual('POST');
    req.flush(mockComment);
  })

  it('should return error on failed comment creation', (done) => {
    const errorResponse = {error: 'invalid credentials'};
    const mockRequest = {post_id: 1, comment: 'commentary'};
    spyOn(httpSv, 'post').and.callThrough()

    service.createComment(mockRequest)
    .subscribe({
      error: err => {
        expect(err).toBe(errorResponse);
        expect(httpSv.post).toHaveBeenCalledOnceWith('comment/', mockRequest);
        done();
      }
    })

    const req = httpController.expectOne(`${environment.api_url}/comment/`)
    expect(req.request.method).toEqual('POST');
    req.flush(errorResponse, {status: 404, statusText: 'Not Found'});
  })

  it('should call http service to get paginated comments', (done) => {
    const mockPostId = '1';
    const mockPageNumber = '1';
    const url = `comment/?page=${mockPageNumber}&post=${mockPostId}&user=`
    const mockPagComment = generatePaginatedComment()
    spyOn(httpSv, 'get').and.callThrough();

    service.getComments(mockPageNumber, mockPostId)
    .subscribe(resp => {
      expect(resp.results.length).toEqual(mockPagComment.results.length);
      expect(httpSv.get).toHaveBeenCalledOnceWith(url);
      done();
    })

    const req = httpController.expectOne(`${environment.api_url}/${url}`);
    req.flush(mockPagComment);
    // const params = req.request.params;
    // expect(params.get('page')).toEqual(`${mockPostId}`);
    // expect(params.get('post')).toEqual(`${mockPageNumber}`);
  })

  it('should call http service to delete a comment', (doneFn) => {
    const mockCommentId = 1;
    const url = `comment/${mockCommentId}/`
    spyOn(httpSv, 'delete').and.callThrough();

    service.deleteComment(mockCommentId)
    .subscribe(() => {
      expect(httpSv.delete).toHaveBeenCalledOnceWith(url);
      doneFn();
    })

    const req = httpController.expectOne(`${environment.api_url}/${url}`)
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  })

  it('should return error on fail comment deletion', (done) => {
    const errorResponse = {error: 'invalid credentials'};
    const url = 'comment/1/'
    spyOn(httpSv, 'delete').and.callThrough()

    service.deleteComment(1)
    .subscribe({
      error: err => {
        expect(err).toBe(errorResponse);
        expect(httpSv.delete).toHaveBeenCalledOnceWith(url);
        done();
      }
    })

    const req = httpController.expectOne(`${environment.api_url}/${url}`)
    expect(req.request.method).toEqual('DELETE');
    req.flush(errorResponse, {status: 404, statusText: 'Not Found'});
  })
});
