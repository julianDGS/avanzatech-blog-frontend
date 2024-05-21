import { Routes } from '@angular/router';

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
        loadChildren: () => import('./pages/auth/auth.routes')
    },    
];


