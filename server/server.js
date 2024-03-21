import express from 'express';
import cors from 'cors';
import pool from './db.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const PORT = process.env.PORT || 8000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// get all todos
app.get('/todos/:userEmail', async(req, res)=>{
    const { userEmail } = req.params;
    try {
        const todos = await pool.query("select * from todos where user_email = $1", [userEmail]);
        res.json(todos.rows);
    } catch (err) {
        console.error(err.message);
    }
})

// create a new todo
app.post('/todos', async(req, res)=>{
    const {user_email, title, progress, date} = req.body;
    console.log(user_email, title, progress, date);
    const id = uuidv4();
    try {
        const newTodo = await pool.query("insert into todos (id, user_email, title, progress, date) values ($1, $2, $3, $4, $5)", [id, user_email, title, progress, date]);
        res.json(newTodo);
    } catch (error) {
        console.error(error.message);
    }
})

// edit a todo
app.put('/todos/:id', async(req, res)=>{
    const{ id } = req.params;
    const{ user_email, title, progress, date} = req.body;
    try {
        const editTodo = await pool.query('update todos set user_email=$1, title=$2, progress=$3, date=$4 where id=$5;', [user_email, title, progress, date, id]);
        res.json(editTodo);
    } catch (error) {
        console.error(error.message);
    }
})

// delete a todo
app.delete('/todos/:id', async(req, res)=>{
    const { id } = req.params;
    try {
        const deleteTodo = await pool.query('delete from todos where id=$1;', [id]);
        res.json(deleteTodo);
    } catch (error) {
        console.error(error.message);
    }
})

// signup
app.post('/signup', async(req, res)=>{
    const {email, password} = req.body;
    // hashing the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    try {
        const signUp = await pool.query('insert into users (email, hashed_password) values ($1, $2)', [email, hashedPassword]);

        const token = jwt.sign({ email }, 'secret', {expiresIn: '1hr'});
        res.json({email, token});

    } catch (error) {
        console.error(error.message);
        if(error){
            res.json({ detail: error.detail });
        }
    }
})

// login
app.post('/login', async(req, res)=>{
    const { email, password } = req.body;
    try {
        const users = await pool.query('select * from users where email=$1', [email]);
        if(!users.rows.length)  return res.json({ detail: 'User does not exist!' });

        const success = await bcrypt.compare(password, users.rows[0].hashed_password);
        const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr' });

        if(success)  return res.json({ 'email': users.rows[0].email, 'token': token});
        else    return res.json({ detail: 'Password is incorrect!' });
    } catch (error) {
        console.error(error.message);
    }
})

app.listen(PORT, ()=>console.log(`Server is running on port ${PORT}`))