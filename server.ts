import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './server/db/connection.ts';
import * as store from './server/store.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());
app.use('/images', express.static(path.resolve(__dirname, 'public/images')));

// Initialize DB connection (attempts MongoDB if URI provided, else logs memory fallback)
connectDB().catch((err) => {
  console.log('[DB] Running with in-memory persistence:', err.message);
});

// REST API Endpoints

// 1. Products API
app.get('/api/products', async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string | undefined;
    const featured = req.query.featured !== undefined ? req.query.featured === 'true' : undefined;
    const search = req.query.search as string | undefined;
    const products = await store.getProducts({ category, featured, search });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
});

app.get('/api/products/:id', async (req: Request, res: Response) => {
  try {
    const product = await store.getProductById(req.params.id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve product' });
  }
});

app.post('/api/products', async (req: Request, res: Response) => {
  try {
    const { name, subtitle, description, price, category, image } = req.body;
    if (!name || !price || !category) {
      res.status(400).json({ error: 'Missing required product fields' });
      return;
    }
    const created = await store.createProduct(req.body);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

app.put('/api/products/:id', async (req: Request, res: Response) => {
  try {
    const updated = await store.updateProduct(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', async (req: Request, res: Response) => {
  try {
    const success = await store.deleteProduct(req.params.id);
    if (!success) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// 2. Orders API
app.get('/api/orders', async (_req: Request, res: Response) => {
  try {
    const orders = await store.getOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.get('/api/orders/:id', async (req: Request, res: Response) => {
  try {
    const order = await store.getOrderById(req.params.id);
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve order' });
  }
});

app.post('/api/orders', async (req: Request, res: Response) => {
  try {
    const { customer, items, total } = req.body;
    if (!customer?.name || !customer?.email || !items || !items.length) {
      res.status(400).json({ error: 'Missing customer or order items' });
      return;
    }
    const order = await store.createOrder(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.put('/api/orders/:id', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const updated = await store.updateOrderStatus(req.params.id, status);
    if (!updated) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// 3. Contact API
app.post('/api/contact', async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }
    const contact = await store.createContact(req.body);
    res.status(201).json({ message: 'Thank you for reaching out! We will be in touch shortly.', contact });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit contact message' });
  }
});

app.get('/api/contact', async (_req: Request, res: Response) => {
  try {
    const messages = await store.getContacts();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve contacts' });
  }
});

// 4. Newsletter API
app.post('/api/newsletter', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      res.status(400).json({ error: 'Please provide a valid email address' });
      return;
    }
    const subscriber = await store.subscribeNewsletter(email);
    res.status(201).json({ message: 'Subscribed to Coffeë newsletter successfully!', subscriber });
  } catch (error) {
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

app.get('/api/newsletter', async (_req: Request, res: Response) => {
  try {
    const subs = await store.getNewsletters();
    res.json(subs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch newsletter subscribers' });
  }
});

// 5. Reviews API
app.get('/api/reviews', async (_req: Request, res: Response) => {
  try {
    const reviews = await store.getReviews();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve reviews' });
  }
});

app.post('/api/reviews', async (req: Request, res: Response) => {
  try {
    const { author, rating, comment } = req.body;
    if (!author || !rating || !comment) {
      res.status(400).json({ error: 'Author, rating, and review comment are required' });
      return;
    }
    const review = await store.createReview(req.body);
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// 6. Admin Stats & Auth API
app.get('/api/admin/stats', async (_req: Request, res: Response) => {
  try {
    const stats = await store.getDashboardStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate stats' });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (email === 'admin@coffee.com' && password === 'coffee123') {
    res.json({
      success: true,
      token: 'jwt-coffee-admin-token-' + Date.now(),
      user: {
        name: 'Head Barista Admin',
        email: 'admin@coffee.com',
        role: 'admin',
      },
    });
  } else if (email && password) {
    // allow quick demo sign-in
    res.json({
      success: true,
      token: 'jwt-coffee-demo-token-' + Date.now(),
      user: {
        name: email.split('@')[0],
        email,
        role: 'admin',
      },
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials. Try admin@coffee.com / coffee123' });
  }
});

// Vite Middleware integration for development
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Coffeë Server] Running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Coffeë Server] Failed to start:', err);
});
