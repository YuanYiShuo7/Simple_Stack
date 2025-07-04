import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use('/avatars', express.static(path.join(__dirname, '../uploads/avatars')));

app.use('/user', userRoutes);

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Simple Stack | 后端服务</title>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
            <style>
                :root {
                    --primary: #4f46e5;
                    --primary-light: #e0e7ff;
                    --gray-100: #f3f4f6;
                    --gray-700: #374151;
                }
                
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                    background-color: var(--gray-100);
                    color: var(--gray-700);
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    line-height: 1.6;
                    padding: 2rem;
                }
                
                .container {
                    max-width: 600px;
                    width: 100%;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    padding: 3rem;
                    text-align: center;
                }
                
                .logo {
                    font-size: 2.5rem;
                    font-weight: 600;
                    margin-bottom: 1.5rem;
                    color: var(--primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                }
                
                .logo-icon {
                    width: 2.5rem;
                    height: 2.5rem;
                    background-color: var(--primary-light);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--primary);
                    font-weight: bold;
                }
                
                h1 {
                    font-size: 1.75rem;
                    font-weight: 600;
                    margin-bottom: 1rem;
                }
                
                p {
                    margin-bottom: 1.5rem;
                    color: #6b7280;
                }
                
                .time {
                    background-color: var(--primary-light);
                    color: var(--primary);
                    padding: 0.5rem 1rem;
                    border-radius: 9999px;
                    font-weight: 500;
                    display: inline-block;
                    margin-top: 1rem;
                }
                
                .links {
                    margin-top: 2rem;
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                }
                
                .link {
                    text-decoration: none;
                    color: var(--primary);
                    font-weight: 500;
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    transition: all 0.2s;
                }
                
                .link:hover {
                    background-color: var(--primary-light);
                }
                
                @media (max-width: 640px) {
                    .container {
                        padding: 2rem 1.5rem;
                    }
                    
                    .logo {
                        font-size: 2rem;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="logo">
                    <div class="logo-icon">S</div>
                    Simple Stack
                </div>
                <h1>后端服务运行中</h1>
                <p>这是一个简洁高效的 Express 后端服务，为 Simple Stack 项目提供支持</p>
                <div class="time">${new Date().toLocaleString()}</div>
                <div class="links">
                    <a href="/api" class="link">API 文档</a>
                    <a href="https://github.com/your-repo" class="link" target="_blank">GitHub</a>
                </div>
            </div>
        </body>
        </html>
    `);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


export default app;