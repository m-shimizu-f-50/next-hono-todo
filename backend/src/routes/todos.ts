import { Hono } from 'hono';

const todos = new Hono();

// Todoの型
type Todo = {
	id: number;
	title: string;
	completed: boolean;
};

// ダミーデータ
let todoList: Todo[] = [
	{ id: 1, title: 'Hono.jsを学ぶ', completed: false },
	{ id: 2, title: 'Hono.jsでTodoアプリを作る', completed: false },
];

// Todoの一覧を取得
todos.get('/', (c) => {
	return c.json(todoList);
});

// Todoの新規作成
todos.post('/', async (c) => {
	const body = await c.req.json();
	const newTodo: Todo = {
		id: todoList.length + 1,
		title: body.title,
		completed: false,
	};
	todoList.push(newTodo);
	return c.json(newTodo);
});

// Todoの更新
todos.patch('/:id', async (c) => {
	const id = Number(c.req.param('id'));
	const body = await c.req.json();

	todoList = todoList.map(
		(todo): Todo => (todo.id === id ? { ...todo, ...body } : todo),
	);

	const updatedTodo = todoList.find((todo) => todo.id === id);
	if (!updatedTodo) {
		return c.json({ error: 'Todo not found' }, 404);
	}

	return c.json(updatedTodo);
});

// Todoの削除
todos.delete('/:id', (c) => {
	const id = Number(c.req.param('id'));
	const todo = todoList.find((todo) => todo.id === id);

	if (!todo) {
		return c.json({ error: 'Todo not found' }, 404);
	}
	// 配列から削除
	todoList = todoList.filter((todo) => todo.id !== id);
	return c.json({ message: 'Todo deleted' });
});

export default todos;
