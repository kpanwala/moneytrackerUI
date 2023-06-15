import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import * as echarts from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HomeComponent } from './components/home/home.component';
import { BookingsComponent } from './components/bookings/bookings.component';
import { ExpensesComponent } from './components/expenses/expenses.component';
import { AppRoutingModule } from './app-routing.module';
import { ChartModule } from 'primeng/chart';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    NgxEchartsModule.forRoot({ echarts }),
    ChartModule,
    HttpClientModule,
  ],
  declarations: [
    AppComponent,
    SidebarComponent,
    HomeComponent,
    BookingsComponent,
    ExpensesComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
