import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Task, Priority, Status } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly STORAGE_KEY = 'tasks';
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage(): void {
    const storedTasks = localStorage.getItem(this.STORAGE_KEY);
    if (storedTasks) {
      const tasks = JSON.parse(storedTasks, (key, value) => {
        if (key === 'dueDate' || key === 'createdAt' || key === 'updatedAt') {
          return new Date(value);
        }
        return value;
      });
      this.tasksSubject.next(tasks);
    }
  }

  private saveToLocalStorage(tasks: Task[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    this.tasksSubject.next(tasks);
  }

  getTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  getTasksByCategory(categoryId: string): Observable<Task[]> {
    return this.tasks$.pipe(
      map((tasks) => tasks.filter((task) => task.categoryId === categoryId))
    );
  }

  getTaskById(id: string): Task | undefined {
    return this.tasksSubject.value.find((task) => task.id === id);
  }

  addTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): void {
    // Validate due date
    if (taskData.dueDate < new Date()) {
      throw new Error("La date d'échéance ne peut pas être dans le passé");
    }

    // Validate title length
    if (taskData.title.length > 100) {
      throw new Error('Le titre ne peut pas dépasser 100 caractères');
    }

    // Validate description length if provided
    if (taskData.description && taskData.description.length > 500) {
      throw new Error('La description ne peut pas dépasser 500 caractères');
    }

    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const tasks = this.tasksSubject.value;
    this.saveToLocalStorage([...tasks, newTask]);
  }

  updateTask(
    id: string,
    taskData: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>
  ): void {
    const tasks = this.tasksSubject.value;
    const index = tasks.findIndex((task) => task.id === id);

    if (index === -1) {
      throw new Error('Tâche non trouvée');
    }

    // Validate due date if provided
    if (taskData.dueDate && taskData.dueDate < new Date()) {
      throw new Error("La date d'échéance ne peut pas être dans le passé");
    }

    // Validate title length if provided
    if (taskData.title && taskData.title.length > 100) {
      throw new Error('Le titre ne peut pas dépasser 100 caractères');
    }

    // Validate description length if provided
    if (taskData.description && taskData.description.length > 500) {
      throw new Error('La description ne peut pas dépasser 500 caractères');
    }

    tasks[index] = {
      ...tasks[index],
      ...taskData,
      updatedAt: new Date(),
    };

    this.saveToLocalStorage(tasks);
  }

  deleteTask(id: string): void {
    const tasks = this.tasksSubject.value.filter((task) => task.id !== id);
    this.saveToLocalStorage(tasks);
  }

  getStatistics(): Observable<{
    completedPercentage: number;
    pendingPercentage: number;
    overdueTasks: number;
  }> {
    return this.tasks$.pipe(
      map((tasks) => {
        const total = tasks.length;
        const completed = tasks.filter(
          (task) => task.status === Status.COMPLETED
        ).length;
        const overdue = tasks.filter(
          (task) =>
            task.status !== Status.COMPLETED && task.dueDate < new Date()
        ).length;

        return {
          completedPercentage: total ? (completed / total) * 100 : 0,
          pendingPercentage: total ? ((total - completed) / total) * 100 : 0,
          overdueTasks: overdue,
        };
      })
    );
  }

  searchTasks(query: string): Observable<Task[]> {
    return this.tasks$.pipe(
      map((tasks) =>
        tasks.filter(
          (task) =>
            task.title.toLowerCase().includes(query.toLowerCase()) ||
            (task.description &&
              task.description.toLowerCase().includes(query.toLowerCase()))
        )
      )
    );
  }
}
