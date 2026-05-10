import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import todos from './routes/todos';

const app = new Hono();

// CORS設定
app.use(
	'*',
	cors({
		origin: 'http://localhost:3000',
	}),
);

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
