import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService, Employee } from './employee.service';  // Importer EmployeeService

@Component({
  standalone: true,  // Déclare le composant comme autonome
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, FormsModule],  // Importation des modules nécessaires
})
export class AppComponent implements OnInit {
  title = 'Gestion des employés';
  
  employeeData: Omit<Employee, 'id'> = { name: '', status: '' };
  employees: Employee[] = [];
  currentEmployee: Employee | null = null;

  constructor(private employeeService: EmployeeService) {}  // Injection de EmployeeService

  ngOnInit(): void {
    this.loadEmployees();  // Charger les employés lors de l'initialisation
  }

  // Charger les employés à partir du service
  loadEmployees() {
    this.employeeService.getEmployees()
      .subscribe((data) => {
        this.employees = data;
      });
  }

  // Ajouter un employé
  onAddEmployee() {
    if (!this.employeeData.name || !this.employeeData.status) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    const newEmployee: Employee = {
      id: this.employees.length > 0 ? Math.max(...this.employees.map(e => e.id)) + 1 : 1,
      ...this.employeeData,
    };

    this.employeeService.addEmployee(newEmployee)
      .subscribe((employee) => {
        this.employees.push(employee);
        this.resetForm();
      });
  }

  // Modifier un employé existant
  onEditEmployee(employee: Employee) {
    this.currentEmployee = employee;
    this.employeeData = { ...employee };
  }

  // Sauvegarder les modifications
  onEditEmployeeSubmit() {
    if (this.currentEmployee) {
      this.employeeService.updateEmployee({ ...this.currentEmployee, ...this.employeeData })
        .subscribe((updatedEmployee) => {
          const index = this.employees.findIndex(emp => emp.id === updatedEmployee.id);
          if (index > -1) {
            this.employees[index] = updatedEmployee;
            this.resetForm();
          }
        });
    }
  }

  // Supprimer un employé
  onDeleteEmployee(employee: Employee) {
    const confirmDelete = confirm('Êtes-vous sûr de vouloir supprimer cet employé ?');
    if (confirmDelete) {
      this.employeeService.deleteEmployee(employee.id)
        .subscribe(() => {
          this.employees = this.employees.filter(emp => emp.id !== employee.id);
        });
    }
  }

  // Réinitialiser le formulaire
  resetForm() {
    this.employeeData = { name: '', status: '' };
    this.currentEmployee = null;
  }
}
