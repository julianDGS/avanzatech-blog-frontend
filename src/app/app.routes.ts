import { CanMatchFn, Routes } from '@angular/router';
import { AuthService } from './services/auth/auth.service';
import { inject } from '@angular/core';

const NoAuthenticationGuard: CanMatchFn = () => inject(AuthService).isNoAuthAction();

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'p',
        pathMatch: 'full'
    },
    {
        path: 'p',
        loadChildren: () => import('./pages/principal/principal.routes'),
    },
    {
        path: 'auth',
        loadChildren: () => import('./pages/auth/auth.routes'),
        canMatch: [NoAuthenticationGuard]
    },    
];


