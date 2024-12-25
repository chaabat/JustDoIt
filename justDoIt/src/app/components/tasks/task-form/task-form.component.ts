import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task, Priority, Status } from '../../../models/task.model';
import { CategorieService } from '../../../services/categorie.service';
import { AsyncPipe, NgIf, NgFor } from '@angular/common';
import { Observable } from 'rxjs';
import { Categorie } from '../../../models/categorie.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule, AsyncPipe, NgIf, NgFor],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
})
export class TaskFormComponent implements OnInit {
  @Input() editMode = false;
  @Input() task: Task | null = null;
  @Output() formSubmit = new EventEmitter<
    Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
  >();
  @Output() formCancel = new EventEmitter<void>();

  categories$: Observable<Categorie[]>;
  Priority = Priority;
  Status = Status;

  formData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
    title: '',
    description: '',
    dueDate: new Date(),
    priority: Priority.MEDIUM,
    status: Status.NOT_STARTED,
    categoryId: '',
  };

  constructor(private categorieService: CategorieService) {
    this.categories$ = this.categorieService.getCategories();
  }

  ngOnInit(): void {
    if (this.editMode && this.task) {
      this.formData = {
        title: this.task.title,
        description: this.task.description,
        dueDate: this.task.dueDate,
        priority: this.task.priority,
        status: this.task.status,
        categoryId: this.task.categoryId,
      };
    }
  }

  isFormValid(): boolean {
    return !!(
      this.formData.title &&
      this.formData.categoryId &&
      this.formData.dueDate &&
      this.formData.priority &&
      this.formData.status
    );
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      this.formSubmit.emit(this.formData);
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }
}
