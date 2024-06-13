import { HttpContext, HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { getCookie } from 'typescript-cookie';

const ADD_CREDENTIALS = new HttpContextToken<boolean>(() => true);

export function withoutCredentials() {
  return new HttpContext().set(ADD_CREDENTIALS, false);
}

export function credentialToken(){
  return ADD_CREDENTIALS;
}

export const credentialInterceptor: HttpInterceptorFn = (req, next) => {
  if(req.context.get(ADD_CREDENTIALS)){
    if(['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)){
      const csrf = getCookie('csrftoken')
      let headers = req.headers
      if (csrf){
        headers = headers.append('X-CSRFToken', csrf);
      }
      return next(req.clone({
        headers,
        withCredentials: true
      }))
    }
    return next(req.clone({
      withCredentials: true
    }));
  }
  return next(req);
};


