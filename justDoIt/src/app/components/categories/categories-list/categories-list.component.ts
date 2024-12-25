import { Component, OnInit } from '@angular/core';
import { AsyncPipe, NgIf, NgFor } from '@angular/common';
import { CategorieService } from '../../../services/categorie.service';
import { Categorie } from '../../../models/categorie.model';
import { Observable } from 'rxjs';
import { CategoriesFormComponent } from '../categories-form/categories-form.component';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [AsyncPipe, NgIf, NgFor, CategoriesFormComponent],
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.css'],
})
export class CategoriesListComponent implements OnInit {
  categories$: Observable<Categorie[]>;
  showAddForm = false;
  editingCategory: Categorie | null = null;

  constructor(private categorieService: CategorieService) {
    this.categories$ = this.categorieService.getCategories();
  }

  ngOnInit(): void {}

  handleFormSubmit(name: string): void {
    try {
      if (this.editingCategory) {
        this.categorieService.updateCategory(this.editingCategory.id, name);
        this.editingCategory = null;
      } else {
        this.categorieService.addCategory(name);
      }
      this.showAddForm = false;
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  }

  editCategory(category: Categorie): void {
    this.editingCategory = category;
    this.showAddForm = true;
  }

  deleteCategory(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      this.categorieService.deleteCategory(id);
    }
  }

  cancelForm(): void {
    this.showAddForm = false;
    this.editingCategory = null;
  }
}
