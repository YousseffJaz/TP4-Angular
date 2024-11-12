import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export class Employee {
  public id: number;
  public name: string;
  public status: string;

  constructor(id: number, name: string, status: string) {
    this.id = id;
    this.name = name;
    this.status = status;
  }
}
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:3000/employees';  // URL de l'API

  constructor(private http: HttpClient) { }

  // Récupérer les employés
  getEmployees(): Observable<Employee[]> {
    const url = 'http://localhost:3000/employees';
    return this.http.get<Employee[]>(url);  // Récupérer les employés
  }
  
  // Ajouter un nouvel employé
  addEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  // Modifier un employé
  updateEmployee(employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${employee.id}`, employee);
  }

  // Supprimer un employé
  deleteEmployee(id: number): Observable<void> {
    const url = `http://localhost:3000/employees/${id}`;
    return this.http.delete<void>(url);
  }
  
  
}

