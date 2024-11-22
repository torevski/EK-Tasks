class Task {
  constructor(title, description, completed = false, priority = 'Low') {
    this.title = title;
    this.description = description;
    this.completed = completed;
    this.priority = priority;
    this.createdAt = new Date();
  }
}

export default Task;