import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import todos from './routes/todos';

const app = new Hono();

app.route('/todos', todos);

serve(
	{
		fetch: app.fetch,
		port: 3001,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);

export default app;
