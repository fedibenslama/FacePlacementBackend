const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(express.json());
const database ={
    users : [
    {
        id: '123',
        name: 'John',
        email: 'john@gmail.com',
        password: 'dogs',
        entries: 0,
        joined: new Date()
    },
    {
        id: '124',
        name: 'Fedi',
        email: 'Fedi@gmail.com',
        password: 'cats',
        entries: 0,
        joined: new Date()
    }
    ]
}

app.get('/', (req, res) => {
    res.send(database.users)
})

app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
        res.json('success')
    } else {
        res.status(400).json('Error logging in')
    }

})
app.post('/register',(req,res)=>{
    const {email,name,password} = req.body;
    database.users.push({
        id: '124',
        name: name,
        email: email,
        password: password,
        entries:0,
        joined : new Date()
    })
    res.json(database.users[database.users.length-1])

})

app.listen(3000, () => {
    console.log("app is running on port 3000")
})


/* Planning routes :
/ --> res=this is working
/signin --> most likely Post , res with Sucess/fail
/register --> POST , res with new user
/porfile/:userId --> Get , res with user
/image --> PUT : update the score , res with updated user or count
this might change
*/