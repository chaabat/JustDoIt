import { Routes } from '@angular/router';
import { CategoriesListComponent } from './components/categories/categories-list/categories-list.component';
import { TaskListComponent } from './components/tasks/task-list/task-list.component';
import { StatisticsComponent } from './components/statistics/statistics.component';

export const routes: Routes = [
  { path: '', component: TaskListComponent },
  { path: 'categories', component: CategoriesListComponent },
  { path: 'statistics', component: StatisticsComponent },
  { path: '**', redirectTo: '' },  
];
