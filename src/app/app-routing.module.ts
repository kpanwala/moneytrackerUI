import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingsComponent } from './components/bookings/bookings.component';
import { ExpensesComponent } from './components/expenses/expenses.component';
import { HomeComponent } from './components/home/home.component';
import { ExpenseTrackingComponent } from './components/expense-track/expense-tracking.component';
import { CardTrackingComponent } from './components/card-tracking/card-tracking.component';

export const routes = [
  { path: '', pathMatch: 'full' as PathMatch, redirectTo: 'home' },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'bookings',
    component: BookingsComponent,
  },
  {
    path: 'expenses',
    component: ExpensesComponent,
  },
  {
    path: 'expenseTracking',
    component: ExpenseTrackingComponent,
  },
  {
    path: 'cardTracking',
    component: CardTrackingComponent,
  },
];
type PathMatch = 'full' | 'prefix' | undefined;
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      enableTracing: false,
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
