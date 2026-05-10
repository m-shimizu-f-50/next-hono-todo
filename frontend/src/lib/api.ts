import { Todo } from '../types/todo';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// 一覧取得
export const getTodos = async (): Promise<Todo[]> => {
	const res = await fetch(`${API_URL}/todos`);
	return res.json();
};

// 新規作成
export const createTodo = async (title: string): Promise<Todo> => {
	const res = await fetch(`${API_URL}/todos`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ title }),
	});
	return res.json();
};

// 更新
export const updateTodo = async (
	id: number,
	completed: boolean,
): Promise<Todo> => {
	const res = await fetch(`${API_URL}/todos/${id}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ completed }),
	});
	return res.json();
};

// 削除
export const deleteTodo = async (id: number): Promise<void> => {
	await fetch(`${API_URL}/todos/${id}`, {
		method: 'DELETE',
	});
};
