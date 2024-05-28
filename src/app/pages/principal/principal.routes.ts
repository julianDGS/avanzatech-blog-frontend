import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./principal.component'),
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', loadComponent: () => import('./posts/post-list/post-list.component').then(c => c.PostListComponent) },
      { path: 'detail/:id', loadComponent: () => import('./posts/post-detail/post-detail.component').then(c => c.PostDetailComponent) },
    ]
  }
];

export default routes;