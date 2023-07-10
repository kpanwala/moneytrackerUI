import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  isSidebarPinned = false;
  isSidebarToggeled = false;
  private subject = new Subject<any>();

  constructor(private http: HttpClient) {}

  toggleSidebar() {
    this.isSidebarToggeled = !this.isSidebarToggeled;
  }

  toggleSidebarPin() {
    this.isSidebarPinned = !this.isSidebarPinned;
  }

  getSidebarStat() {
    return {
      isSidebarPinned: this.isSidebarPinned,
      isSidebarToggeled: this.isSidebarToggeled,
    };
  }

  getUserDetails(uname: string, pass: string): Observable<any> {
    let params = new HttpParams().set('uname', uname).set('pass', pass);
    return this.http.get(`http://localhost:8081/moneymanager/authenticate`, {
      params,
    });
  }

  getUserTransactions(id: number): Observable<any> {
    let params = new HttpParams().set('id', id);
    return this.http.get(
      `http://localhost:8081/moneymanager/getUserTransactions`,
      { params }
    );
  }

  getUserTransactionsYearWise(id: number, startYear: number): Observable<any> {
    let params = new HttpParams().set('id', id).set('startYear', startYear);

    return this.http.get(
      `http://localhost:8081/moneymanager/getUserTransactionsByYear`,
      { params }
    );
  }

  getUserTransactionsYearRange(
    id: number,
    startYear: number,
    endYear: number = new Date().getFullYear()
  ): Observable<any> {
    let params = new HttpParams()
      .set('id', id)
      .set('startYear', startYear)
      .set('endYear', endYear);

    return this.http.get(
      `http://localhost:8081/moneymanager/getUserTransactionsByYear`,
      { params }
    );
  }

  getUserTransactionsMonthWise(id: number, startYear: number): Observable<any> {
    let params = new HttpParams().set('id', id).set('startYear', startYear);

    return this.http.get(
      `http://localhost:8081/moneymanager/getUserTransactionsByMonths`,
      { params }
    );
  }

  getUserTransactionsMonthRange(
    id: number,
    startYear: number,
    endYear: number = new Date().getFullYear()
  ): Observable<any> {
    let params = new HttpParams()
      .set('id', id)
      .set('startYear', startYear)
      .set('endYear', endYear);

    return this.http.get(
      `http://localhost:8081/moneymanager/getUserTransactionsByMonths`,
      { params }
    );
  }

  sendData(message: string) {
    this.subject.next(message);
  }

  getData(): Observable<any> {
    return this.subject.asObservable();
  }
}
