export default [
  {
    path: '',
    loadComponent: () => import('./principal.component'),
    // children: [
    //   { path: '', loadComponent: () => import('./pages/home/home.component').then(c => c.HomeComponent) },
    //   { path: 'login', loadComponent: () => import('./pages/auth/login/login.component').then(c => c.LoginComponent) },
    //   { path: 'register', loadComponent: () => import('./pages/auth/register/register.component').then(c => c.RegisterComponent) }
    // ]
  }
];