import { Hono } from 'hono';

const todos = new Hono();

// Todoの型
type Todo = {
	id: string;
	title: string;
	completed: boolean;
};

// ダミーデータ
let todoList: Todo[] = [
	{ id: '1', title: 'Hono.jsを学ぶ', completed: false },
	{ id: '2', title: 'Hono.jsでTodoアプリを作る', completed: false },
];

// Todoの一覧を取得
todos.get('/', (c) => {
	return c.json(todoList);
});

// Todoの新規作成
todos.post('/', async (c) => {
	const body = await c.req.json();
	const newTodo: Todo = {
		id: (todoList.length + 1).toString(),
		title: body.title,
		completed: false,
	};
	todoList.push(newTodo);
	return c.json(newTodo);
});

export default todos;
