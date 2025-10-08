const express = require('express');
const router = express.Router();
const TodoController = require('../controllers/TodoController');

const todoController = new TodoController();

// Home page - list all todos
router.get('/', (req, res) => {
    const selectedPriority = req.query.priority ? parseInt(req.query.priority) : undefined;
    todoController.getAllTodos(selectedPriority, (err, todos) => {
        if (err) {
            console.error('Error fetching todos:', err);
            return res.status(500).render('error', { error: 'Failed to fetch todos' });
        }
        // Format the todos for display
        const formattedTodos = todos.map(todo => ({
            ...todo,
            deadline: todo.deadline ? new Date(todo.deadline).toLocaleDateString() : null,
            priorityText: todo.priority === 3 ? 'High' : todo.priority === 2 ? 'Medium' : 'Low',
            priorityClass: todo.priority === 3 ? 'high' : todo.priority === 2 ? 'medium' : 'low'
        }));
        res.render('index', { todos: formattedTodos, selectedPriority });
    });
});

// Show create form
router.get('/create', (req, res) => {
    res.render('create');
});

// Create new todo
router.post('/create', (req, res) => {
    const { title, content, deadline, priority } = req.body;
    
    if (!title) {
        return res.status(400).render('create', { 
            error: 'Title is required',
            formData: req.body
        });
    }

    const todoData = {
        title,
        content: content || '',
        deadline: deadline || null,
        priority: parseInt(priority) || 1
    };

    todoController.createTodo(todoData, (err, todoId) => {
        if (err) {
            console.error('Error creating todo:', err);
            return res.status(500).render('create', { 
                error: 'Failed to create todo',
                formData: req.body
            });
        }
        res.redirect('/');
    });
});

// Show edit form
router.get('/edit/:id', (req, res) => {
    const id = req.params.id;
    todoController.getTodoById(id, (err, todo) => {
        if (err) {
            console.error('Error fetching todo:', err);
            return res.status(500).render('error', { error: 'Failed to fetch todo' });
        }
        if (!todo) {
            return res.status(404).render('error', { error: 'Todo not found' });
        }
        
        // Format deadline for HTML date input
        if (todo.deadline) {
            todo.deadline = new Date(todo.deadline).toISOString().split('T')[0];
        }
        
        res.render('edit', { todo });
    });
});

// Update todo
router.post('/edit/:id', (req, res) => {
    const id = req.params.id;
    const { title, content, deadline, priority, completed } = req.body;
    
    if (!title) {
        return res.status(400).render('edit', { 
            error: 'Title is required',
            todo: { id, ...req.body }
        });
    }

    const todoData = {
        title,
        content: content || '',
        deadline: deadline || null,
        priority: parseInt(priority) || 1,
        completed: completed === 'on' ? 1 : 0
    };

    todoController.updateTodo(id, todoData, (err) => {
        if (err) {
            console.error('Error updating todo:', err);
            return res.status(500).render('edit', { 
                error: 'Failed to update todo',
                todo: { id, ...req.body }
            });
        }
        res.redirect('/');
    });
});

// Toggle completion status
router.post('/toggle/:id', (req, res) => {
    const id = req.params.id;
    todoController.toggleComplete(id, (err) => {
        if (err) {
            console.error('Error toggling todo:', err);
            return res.status(500).json({ error: 'Failed to toggle todo' });
        }
        res.redirect('/');
    });
});

// Delete todo
router.post('/delete/:id', (req, res) => {
    const id = req.params.id;
    todoController.deleteTodo(id, (err) => {
        if (err) {
            console.error('Error deleting todo:', err);
            return res.status(500).json({ error: 'Failed to delete todo' });
        }
        res.redirect('/');
    });
});

module.exports = router;