import { HttpContext, HttpContextToken, HttpInterceptorFn, HttpRequest } from '@angular/common/http';

const ADD_CREDENTIALS = new HttpContextToken<boolean>(() => true);

export function addCredentials() {
  return new HttpContext().set(ADD_CREDENTIALS, false);
}

export const credentialInterceptor: HttpInterceptorFn = (req, next) => {
  if(req.context.get(ADD_CREDENTIALS)){
    let clonedReq = req.clone({
      withCredentials: true
    });
    return next(clonedReq);
  }
  return next(req);
};


