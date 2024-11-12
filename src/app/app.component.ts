import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient} from '@angular/common/http';  // Importer HttpClient et provideHttpClient

// Définition du type Employee
interface Employee {
  id: number;
  name: string;
  status: string;
}

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

  constructor(private http: HttpClient) {}  // Injection de HttpClient

  ngOnInit(): void {
    this.loadEmployees();  // Charger les employés lors de l'initialisation
  }

  // Charger les employés à partir de db.json via JSON Server
  loadEmployees() {
    this.http.get<Employee[]>('http://localhost:3000/employees')  // Effectuer la requête HTTP
      .subscribe((data) => {
        this.employees = data;  // Mettre à jour les employés avec la réponse
      });
  }

  // Ajouter un employé
  onAddEmployee() {
    if (!this.employeeData.name || !this.employeeData.status) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    // Générer un ID unique pour l'employé ajouté
    const newEmployee: Employee = {
      id: this.employees.length > 0 ? Math.max(...this.employees.map(e => e.id)) + 1 : 1,
      ...this.employeeData,
    };

    // Ajouter l'employé et réinitialiser le formulaire
    this.employees.push(newEmployee);
    this.resetForm();
  }

  // Modifier un employé existant
  onEditEmployee(employee: Employee) {
    this.currentEmployee = employee;
    this.employeeData = { ...employee };
  }

  // Sauvegarder les modifications
  onEditEmployeeSubmit() {
    const index = this.employees.findIndex(emp => emp.id === this.currentEmployee!.id);
    if (index > -1) {
      this.employees[index] = { ...this.currentEmployee!, ...this.employeeData };
      this.resetForm();
    }
  }

  // Supprimer un employé
  onDeleteEmployee(employee: Employee) {
    const confirmDelete = confirm('Êtes-vous sûr de vouloir supprimer cet employé ?');
    if (confirmDelete) {
      const index = this.employees.indexOf(employee);
      if (index > -1) this.employees.splice(index, 1);
    }
  }

  // Réinitialiser le formulaire
  resetForm() {
    this.employeeData = { name: '', status: '' };
    this.currentEmployee = null;
  }
}
