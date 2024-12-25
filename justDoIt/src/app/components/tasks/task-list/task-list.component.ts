import { Component, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe, NgClass, NgIf, NgFor } from '@angular/common';
import { TaskService } from '../../../services/task.service';
import { Task, Priority, Status } from '../../../models/task.model';
import { Observable } from 'rxjs';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskSearchComponent } from '../task-search/task-search.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    NgClass,
    NgIf,
    NgFor,
    TaskFormComponent,
    TaskSearchComponent,
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit {
  Priority = Priority;
  tasks$: Observable<Task[]>;
  showAddForm = false;
  editingTask: Task | null = null;

  constructor(private taskService: TaskService) {
    this.tasks$ = this.taskService.getTasks();
  }

  ngOnInit(): void {}

  onSearch(query: string): void {
    this.tasks$ = this.taskService.searchTasks(query);
  }

  handleFormSubmit(
    taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
  ): void {
    try {
      if (this.editingTask) {
        this.taskService.updateTask(this.editingTask.id, taskData);
        this.editingTask = null;
      } else {
        this.taskService.addTask(taskData);
      }
      this.showAddForm = false;
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  }

  editTask(task: Task): void {
    this.editingTask = task;
    this.showAddForm = true;
  }

  deleteTask(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      this.taskService.deleteTask(id);
    }
  }
}
