import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Check, CheckCheck, Circle, ListTodo, Plus, Sparkles, Trash2 } from 'lucide-react';

type Priority = 'low' | 'medium' | 'high';
type Task = {
  id: string;
  title: string;
  dueDate: string;
  priority: Priority;
  completed: boolean;
  createdAt: string;
};
type Filter = 'today' | 'upcoming' | 'completed';

const STORAGE_KEY = 'little-day-tasks-v1';
const today = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
const readTasks = (): Task[] => {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (!value) return [];
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((task): task is Task =>
      task && typeof task.id === 'string' && typeof task.title === 'string' &&
      typeof task.dueDate === 'string' && typeof task.createdAt === 'string' &&
      ['low', 'medium', 'high'].includes(task.priority) && typeof task.completed === 'boolean'
    ) : [];
  } catch {
    return [];
  }
};
const formatDate = (dateValue: string) => {
  if (dateValue === today()) return 'Today';
  const parsed = new Date(`${dateValue}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return dateValue;
  return new Intl.DateTimeFormat('en', { weekday: 'short', month: 'short', day: 'numeric' }).format(parsed);
};
const fullDate = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());

function App() {
  const [tasks, setTasks] = useState<Task[]>(readTasks);
  const [filter, setFilter] = useState<Filter>('today');
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState(today());
  const [priority, setPriority] = useState<Priority>('medium');
  const [message, setMessage] = useState('');
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [tasks]);

  useEffect(() => {
    if (!message) return;
    const timeout = window.setTimeout(() => setMessage(''), 2300);
    return () => window.clearTimeout(timeout);
  }, [message]);

  const openToday = tasks.filter((task) => !task.completed && task.dueDate <= today());
  const finishedToday = tasks.filter((task) => task.completed && task.dueDate <= today());
  const progressTotal = openToday.length + finishedToday.length;
  const progress = progressTotal ? Math.round((finishedToday.length / progressTotal) * 100) : 0;
  const counts = {
    today: openToday.length,
    upcoming: tasks.filter((task) => !task.completed && task.dueDate > today()).length,
    completed: tasks.filter((task) => task.completed).length,
  };
  const visibleTasks = useMemo(() => {
    const selected = tasks.filter((task) => {
      if (filter === 'today') return !task.completed && task.dueDate <= today();
      if (filter === 'upcoming') return !task.completed && task.dueDate > today();
      return task.completed;
    });
    return selected.sort((a, b) => a.dueDate.localeCompare(b.dueDate) || a.createdAt.localeCompare(b.createdAt));
  }, [tasks, filter]);

  const submitTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    const newTask: Task = {
      id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      title: cleanTitle,
      dueDate,
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((current) => [newTask, ...current]);
    setTitle('');
    setDueDate(today());
    setPriority('medium');
    setMessage('A little promise, written down.');
  };

  const toggleTask = (task: Task) => {
    setTasks((current) => current.map((item) => item.id === task.id ? { ...item, completed: !item.completed } : item));
    setMessage(task.completed ? 'Back on your list.' : 'One small thing, done.');
  };
  const removeTask = (task: Task) => {
    setTasks((current) => current.filter((item) => item.id !== task.id));
    setMessage('Task removed.');
  };

  const filterInfo: Record<Filter, { title: string; subtitle: string }> = {
    today: { title: 'For today', subtitle: 'One thing at a time.' },
    upcoming: { title: 'Coming up', subtitle: 'No rush. It’s on your list.' },
    completed: { title: 'Already done', subtitle: 'Look at you, showing up.' },
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand" data-testid="text-app-name">
          <span className="brand-mark"><Sparkles size={17} strokeWidth={1.8} /></span>
          <span>little day</span>
        </div>
        <div className="top-note">a softer way to get things done</div>
      </header>

      <main className="main-wrap">
        <section className="intro" aria-labelledby="page-title">
          <div>
            <span className="eyebrow">A fresh page, every day</span>
            <h1 id="page-title">Make room for<br /><em>what matters.</em></h1>
            <p className="intro-sub">Your day doesn’t need to be perfect. Just give the next small thing a place to land.</p>
          </div>
          <div className="date-stamp" data-testid="text-current-date">
            <div className="date-day">{new Intl.DateTimeFormat('en', { day: '2-digit' }).format(new Date())}</div>
            <div className="date-month">{new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(new Date())}</div>
          </div>
        </section>

        <div className="workspace">
          <aside className="side-panel">
            <section className="progress-note" aria-label="Today's progress">
              <div className="progress-top"><span>Your day, so far</span><CheckCheck size={15} /></div>
              <div className="progress-number" data-testid="text-progress-value">{progress}%</div>
              <div className="progress-copy" data-testid="status-progress-copy">
                {progressTotal ? `${finishedToday.length} of ${progressTotal} little things complete` : 'A clean slate is a lovely place to start'}
              </div>
              <div className="progress-track" aria-hidden="true"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
            </section>
            <div className="filter-label">Your list</div>
            <nav className="filter-list" aria-label="Task filters">
              {([
                { id: 'today' as const, label: 'Today', icon: <Circle size={15} /> },
                { id: 'upcoming' as const, label: 'Upcoming', icon: <ListTodo size={15} /> },
                { id: 'completed' as const, label: 'Completed', icon: <Check size={15} /> },
              ]).map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={`filter-button${filter === item.id ? ' active' : ''}`}
                  onClick={() => setFilter(item.id)}
                  aria-pressed={filter === item.id}
                  data-testid={`button-filter-${item.id}`}
                >
                  <span className="filter-icon">{item.icon}</span>
                  <span>{item.label}</span>
                  <span className="filter-count" data-testid={`text-count-${item.id}`}>{counts[item.id]}</span>
                </button>
              ))}
            </nav>
            <div className="side-quote">“Small steps still move you forward.”</div>
          </aside>

          <section className="task-area" aria-label="Daily tasks">
            <form className="composer" onSubmit={submitTask}>
              <div className="composer-row">
                <span className="composer-plus" aria-hidden="true"><Plus size={19} /></span>
                <label className="visually-hidden" htmlFor="task-title">What would you like to do?</label>
                <input
                  id="task-title"
                  className="task-input"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="What would you like to do?"
                  maxLength={180}
                  data-testid="input-task-title"
                />
                <button className="add-button" type="submit" data-testid="button-add-task"><Plus size={15} /> Add task</button>
              </div>
              <div className="composer-options">
                <label className="option-control">
                  <span>For</span>
                  <input
                    className="date-input"
                    type="date"
                    value={dueDate}
                    onChange={(event) => setDueDate(event.target.value || today())}
                    aria-label="Task due date"
                    data-testid="input-task-due-date"
                  />
                </label>
                <label className="option-control">
                  <span>Priority</span>
                  <select
                    className="priority-select"
                    value={priority}
                    onChange={(event) => setPriority(event.target.value as Priority)}
                    aria-label="Task priority"
                    data-testid="select-task-priority"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </label>
              </div>
              {storageError && <div className="error-note" role="alert" data-testid="status-storage-error">Couldn’t save changes on this device. Check your browser storage settings.</div>}
            </form>

            <div className="list-heading">
              <div>
                <div className="list-title" data-testid="text-list-heading">{filterInfo[filter].title}</div>
                <div className="list-subtitle">{filter === 'today' ? fullDate : filterInfo[filter].subtitle}</div>
              </div>
              <div className="list-count" data-testid="text-visible-count">{visibleTasks.length} {visibleTasks.length === 1 ? 'task' : 'tasks'}</div>
            </div>

            {visibleTasks.length > 0 ? (
              <div className="task-list" aria-label={`${filterInfo[filter].title} tasks`}>
                {visibleTasks.map((task) => (
                  <article className={`task-card${task.completed ? ' is-completed' : ''}`} key={task.id} data-testid={`task-item-${task.id}`}>
                    <button
                      type="button"
                      className={`check-button${task.completed ? ' checked' : ''}`}
                      onClick={() => toggleTask(task)}
                      aria-label={task.completed ? `Reopen ${task.title}` : `Complete ${task.title}`}
                      aria-pressed={task.completed}
                      data-testid={`button-toggle-task-${task.id}`}
                    >
                      {task.completed && <Check size={14} strokeWidth={3} />}
                    </button>
                    <div className="task-content">
                      <div className="task-title" data-testid={`text-task-title-${task.id}`}>{task.title}</div>
                      <div className="task-meta" data-testid={`status-task-meta-${task.id}`}>
                        <span className={`priority-dot priority-${task.priority}`} />
                        <span className="priority-label">{task.priority} priority</span>
                        <span className="meta-divider" />
                        <span>{formatDate(task.dueDate)}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => removeTask(task)}
                      aria-label={`Delete ${task.title}`}
                      data-testid={`button-delete-task-${task.id}`}
                    ><Trash2 size={16} /></button>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state" data-testid={`status-empty-${filter}`}>
                <div>
                  <div className="empty-mark"><Sparkles size={21} /></div>
                  <div className="empty-title">
                    {filter === 'today' ? 'Nothing pressing today.' : filter === 'upcoming' ? 'Nothing waiting in the wings.' : 'Your done list is waiting.'}
                  </div>
                  <p className="empty-copy">
                    {filter === 'today' ? 'Add a small thing you’d like to make time for.' : filter === 'upcoming' ? 'Choose a future date when you add a task, and it’ll show up here.' : 'When you finish something, it will find its way here.'}
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
      {message && <div className="toast-message" role="status" data-testid="status-feedback">{message}</div>}
    </div>
  );
}

export default App;
