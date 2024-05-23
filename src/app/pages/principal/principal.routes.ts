import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./principal.component'),
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', loadComponent: () => import('./posts/post-list/post-list.component').then(c => c.PostListComponent) },
    ]
  }
];

export default routes;