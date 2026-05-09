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

export default todos;
