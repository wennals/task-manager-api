const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {userOneId, userOne, setupDatabase} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'William',
        email: 'wennals@example.com',
        password: 'Mypass777!'
    }).expect(201)

    // Assert that the user was added to the database 
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about the response 
    expect(response.body).toMatchObject({
        user: {
            name: 'William',
            email: 'wennals@example.com'
        }, 
        token: user.tokens[0].token
    }) 
    expect(user.password).not.toBe('MyPass777!')
})
//
// User Test Ideas
//
// Should not signup user with invalid name/email/password
// Should not update user if unauthenticated
// Should not update user with invalid name/email/password
// Should not delete user if unauthenticated

test('Login an existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOneId)
    expect(user.tokens[1].token).toBe(response.body.token)
})

test('Prevent unregistered user login', async () => {
    await request(app)
        .post('/users/login')
        .send({
        email: 'bobsag@example.com',
        password: 'dogma34@'
    })
    .expect(400)
})

test('Fetch user profile', async () => {
    await request(app)
        .get('/users/myprofile')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Prevent unauthorized profile access', async () => {
    await request(app)
        .get('/users/myprofile')
        .send()
        .expect(401)
})

test('Delete authenticated user\'s account', async () => {
    await request(app)
        .delete('/users/myprofile')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Prevent unauthenticated user account deletion', async () => {
    await request(app)
        .delete('/users/myprofile')
        .send()
        .expect(401)
})

test('Upload avatar image', async () => {
    await request(app)
        .post('/users/myprofile/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Update existing user', async () => {
    const response = await request(app)
        .patch('/users/myprofile')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Bob Sagget',
            age: 55
        })
        .expect(200)

        const user = await User.findById(userOneId)
        expect(user.name).toBe('Bob Sagget')
        expect(user.age).toBe(55)
})  

test('Prevent updating invalid user fields', async () => {
    await request(app)
        .patch('/users/myprofile')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            birthPlace: 'Boston, MA',
            isFun: true
        })
        .expect(400)
})