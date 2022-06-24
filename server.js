const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        port: 5432,
        user: 'postgres',
        password: 'test',
        database: 'FacePlacementDB',

    }
});

knex.select('*').from('users').then(data => {
    console.log(data);
})

const app = express();


app.use(cors())
app.use(express.json());


// const database = {
//     users: [
//         {
//             id: '123',
//             name: 'John',
//             email: 'john@gmail.com',
//             password: 'dogs',
//             entries: 0,
//             joined: new Date()
//         },
//         {
//             id: '124',
//             name: 'Fedi',
//             email: 'Fedi@gmail.com',
//             password: 'cats',
//             entries: 0,
//             joined: new Date()
//         }
//     ]
// }

app.get('/', (req, res) => {
    res.send("success")
})

app.post('/signin', (req, res) => {
    knex.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
            if (isValid) {

                return knex.select('*').from('users')
                    .where('email', '=', req.body.email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('unable to get user'))
            }else{
                res.status(400).json('Wrong Credntials')
            }
        })
        .catch(err => res.status(400).json('Wrong Credentials'))

    // if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
    //     res.json(database.users[0]);
    // } else {
    //     res.status(400).json('Error logging in')
    // }

})
app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password);
    knex.transaction(trx => {               //we create a transaction when we want to do more thant 2 things at once
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginemail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginemail[0].email,
                        name: name,
                        joined: new Date()
                    }).then(response => {
                        res.json(response)
                    })
            })  //we can do the same syntax also the same syntax as below
            .then(trx.commit)
            .catch(trx.rollback)
    })

        .catch(err => res.status(400).json('Unable To Register :('))
    // database.users.push({
    //     id: '124',
    //     name: name,
    //     email: email,
    //     // password: password,
    //     entries: 0,
    //     joined: new Date()
    // })


})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    // let found = false;
    knex.select('*').from('users').where({ id: id })
        .then(response => {
            if (response.length) {            //To Check if user exists , we can change 'response' to 'user' for clarity
                res.json(response[0]);
            } else { res.status(400).json('User Not Found') }

        })
        .catch(err => res.status(400).json('User Not Found'))
    // database.users.forEach(user => {
    //     if (user.id === id) {
    //         found = true;
    //         return res.json(user);
    //     }

    // })
    // if (!found) {
    //     res.status(404).json("User Not Found")
    // }

})

app.put('/image', (req, res) => {
    const { id } = req.body;
    knex('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0]);
        })
        .catch(err => res.status(400).json('Unable To get Entries'))
    // let found = false;
    // database.users.forEach(user => {
    //     if (user.id === id) {
    //         found = true;
    //         user.entries++
    //         return res.json(user.entries);
    //     }

    // })
    // if (!found) {
    //     res.status(404).json("User Not Found")
    // }
})

app.listen(3001, () => {
    console.log("app is running on port 3001")
})