export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum Status {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  priority: Priority;
  status: Status;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}