import { Routes } from '@angular/router';
import { MovieListComponent } from './pages/movie-list/movie-list.component';
import { MovieDetailComponent } from './pages/movie-detail/movie-detail.component';
import { MyMarathonsComponent } from './pages/my-marathon/my-marathon.component';

export const MOVIE_ROUTES: Routes = [
  {
    path: '',
    component: MovieListComponent,
  },
  {
    path: 'my-marathons',
    component: MyMarathonsComponent,
  },
  {
    path: ':id',
    component: MovieDetailComponent,
  },
];
