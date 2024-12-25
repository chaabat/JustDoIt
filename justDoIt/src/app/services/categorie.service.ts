import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Categorie } from '../models/categorie.model';

@Injectable({
  providedIn: 'root',
})
export class CategorieService {
  private readonly STORAGE_KEY = 'categories';
  private categoriesSubject = new BehaviorSubject<Categorie[]>([]);
  categories$ = this.categoriesSubject.asObservable();

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage(): void {
    const storedCategories = localStorage.getItem(this.STORAGE_KEY);
    if (storedCategories) {
      const categories = JSON.parse(storedCategories);
      this.categoriesSubject.next(categories);
    }
  }

  private saveToLocalStorage(categories: Categorie[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(categories));
    this.categoriesSubject.next(categories);
  }

  getCategories(): Observable<Categorie[]> {
    return this.categories$;
  }

  getCategoryById(id: string): Categorie | undefined {
    return this.categoriesSubject.value.find((cat) => cat.id === id);
  }

  addCategory(name: string): void {
    const categories = this.categoriesSubject.value;

    // Check for duplicates
    if (
      categories.some((cat) => cat.name.toLowerCase() === name.toLowerCase())
    ) {
      throw new Error('Une catégorie avec ce nom existe déjà');
    }

    const newCategory: Categorie = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.saveToLocalStorage([...categories, newCategory]);
  }

  updateCategory(id: string, name: string): void {
    const categories = this.categoriesSubject.value;
    const index = categories.findIndex((cat) => cat.id === id);

    if (index === -1) {
      throw new Error('Catégorie non trouvée');
    }

    // Check for duplicates excluding current category
    if (
      categories.some(
        (cat) => cat.id !== id && cat.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      throw new Error('Une catégorie avec ce nom existe déjà');
    }

    categories[index] = {
      ...categories[index],
      name,
      updatedAt: new Date(),
    };

    this.saveToLocalStorage(categories);
  }

  deleteCategory(id: string): void {
    const categories = this.categoriesSubject.value.filter(
      (cat) => cat.id !== id
    );
    this.saveToLocalStorage(categories);
  }
}
