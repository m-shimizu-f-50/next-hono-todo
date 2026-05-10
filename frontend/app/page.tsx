'use client';

import { createTodo, deleteTodo, getTodos, updateTodo } from '@/src/lib/api';
import { Todo } from '@/src/types/todo';
import { useEffect, useState } from 'react';

export default function Home() {
	const [title, setTitle] = useState('');
	const [todos, setTodos] = useState<Todo[]>([]);

	// Todoの新規作成
	const handleCreate = async () => {
		if (!title.trim()) return; // 空のタイトルは無視
		const newTodo = await createTodo(title);
		setTodos([...todos, newTodo]); // 新しいTodoを追加
		setTitle(''); // 入力フィールドをクリア
	};

	// Todoの完了・未完了の切り替え
	const handleUpdate = async (id: number, completed: boolean) => {
		const updatedTodo = await updateTodo(id, !completed);
		setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
	};

	// Todoの削除
	const handleDelete = async (id: number) => {
		await deleteTodo(id);
		setTodos(todos.filter((todo) => todo.id !== id));
	};

	// Todo一覧取得
	useEffect(() => {
		const fetchTodos = async () => {
			const data = await getTodos();
			setTodos(data);
		};
		fetchTodos();
	}, []);

	return (
		<main className='max-w-2xl mx-auto mt-10 p-4'>
			<h1 className='text-2xl font-bold mb-4'>Todo App</h1>

			{/* 入力フォーム */}
			<div className='flex gap-2 mb-6'>
				<input
					type='text'
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder='新しいTodoを入力'
					className='border rounded px-3 py-2 flex-1'
				/>

				<button
					onClick={handleCreate}
					className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
				>
					追加
				</button>
			</div>

			{/* Todo一覧 */}
			<ul className='space-y-2'>
				{todos.map((todo) => (
					<li
						key={todo.id}
						className='flex items-center justify-between border rounded px-4 py-3'
					>
						<div className='flex items-center gap-3'>
							<input
								type='checkbox'
								checked={todo.completed}
								onChange={() => handleUpdate(todo.id, todo.completed)}
							/>
							<span
								className={todo.completed ? 'line-through text-gray-400' : ''}
							>
								{todo.title}
							</span>
						</div>
						<button
							onClick={() => handleDelete(todo.id)}
							className='text-red-500 hover:text-red-700'
						>
							削除
						</button>
					</li>
				))}
			</ul>
		</main>
	);
}
