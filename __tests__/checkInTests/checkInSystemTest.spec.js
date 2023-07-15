const app = require('../../app')
const request = require('supertest')
const { describe, it, expect, beforeAll, afterAll} = require('@jest/globals')
const {execSync} = require("child_process");
const syncDatabase = require("../../src/models/Associations");
let createdUserResponse = {}
let expiredUserResponse = {}
let nonExistentMembershipUserResponse = {}
let noCreditsUserResponse = {}
async function tableExists(sequelize, tableName) {
    // Check if the table exists
    const tableExistsQuery = `
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = '${tableName}'
      );
    `;
    const [result] = await sequelize.query(tableExistsQuery);
    return result[0].exists
}
let sequelize = undefined

describe('System tests for checkIn feature', function () {
    beforeAll(async function () {
        // Run the Docker container using docker-compose up command
        execSync('docker-compose up -d applicationDB');
        await new Promise(resolve => setTimeout(resolve, 1000))
        sequelize = require('../../src/configs/db_connection')
        await expect(syncDatabase()).resolves.not.toThrow()
        await new Promise(resolve => setTimeout(resolve, 500))
        const newUser = {
            name: "Something",
            email: "something@something.com",
            phone: 12345678
        }
        createdUserResponse = await request(app).post('/user/create').send(newUser)
        await new Promise(resolve => setTimeout(resolve, 500))
        let createdMembershipResponse = await request(app).post('/membership/create').send({
            status: "Active",
            credits: 2000,
            start_date: Date.now(),
            end_date: Date.now() + 50,
            userId: createdUserResponse.body.id
        })
        expiredUserResponse = await request(app).post('/user/create').send(newUser)
        await new Promise(resolve => setTimeout(resolve, 500))
        let expiredMembershipResponse = await request(app).post('/membership/create').send({
            status: "Canceled",
            credits: 2000,
            start_date: Date.now(),
            end_date: Date.now() + 50,
            userId: expiredUserResponse.body.id
        })

        nonExistentMembershipUserResponse = await request(app).post('/user/create').send(newUser)
        await new Promise(resolve => setTimeout(resolve, 500))

        noCreditsUserResponse = await request(app).post('/user/create').send(newUser)
        await new Promise(resolve => setTimeout(resolve, 500))

        let noCreditsMembershipResponse = await request(app).post('/membership/create').send({
            status: "Active",
            credits: 0,
            start_date: Date.now(),
            end_date: Date.now() + 50,
            userId: noCreditsUserResponse.body.id
        })
    });

    afterAll(async () => {
        // Stop the PostgreSQL Docker container
        let deletedTestUser1 = await request(app).delete(`/user/deleteOne/${createdUserResponse.body.id}`)
        expect(deletedTestUser1.status).toBe(200)
        let deletedTestUser2 = await request(app).delete(`/user/deleteOne/${expiredUserResponse.body.id}`)
        expect(deletedTestUser2.status).toBe(200)
        let deletedTestUser3 = await request(app).delete(`/user/deleteOne/${nonExistentMembershipUserResponse.body.id}`)
        expect(deletedTestUser3.status).toBe(200)
        let deletedTestUser4 = await request(app).delete(`/user/deleteOne/${noCreditsUserResponse.body.id}`)
        expect(deletedTestUser4.status).toBe(200)
        await new Promise(resolve => setTimeout(resolve, 500))
        execSync('docker-compose down');
    });
    describe('Test connection and tables existing', function () {
        it('should not throw exception', async function () {
            expect(sequelize).not.toBe(undefined)
            expect(await tableExists(sequelize, 'invoices')).toBe(true)
            expect(await tableExists(sequelize, 'invoiceLines')).toBe(true)
            expect(await tableExists(sequelize, 'users')).toBe(true)
            expect(await tableExists(sequelize, 'memberships')).toBe(true)
        });
    });
    describe('Check in for invalid user id', function () {
        it('should return 404', async function () {
            let res = await request(app).post('/checkIn/-1').send({
                items:[]
            })
            expect(res.status).toBe(404)
        });
    });
    describe('Check in for invalid input', function () {
        it('should return 404', async function () {
            let res = await request(app).post('/checkIn/1').send()
            expect(res.status).toBe(404)
        });
    });
    describe('Check in for nonexistent user id', function () {
        it('should return 404', async function () {
            let res = await request(app).post('/checkIn/999999').send({
                items:[]
            })
            expect(res.status).toBe(404)
        });
    });
    describe('Check in for nonexistent membership', function () {
        it('should return 404', async function () {
            let res = await request(app)
                .post(`/checkIn/${nonExistentMembershipUserResponse.body.id}`)
                .send({
                    items:[]
                })
            expect(res.status).toBe(404)
        });
    });
    describe('Check in for valid user id and canceled membership', function () {
        it('should return 404', async function () {

            let res = await request(app)
                .post(`/checkIn/${expiredUserResponse.body.id}`)
                .send({
                    items:[]
                })
            expect(res.status).toBe(404)
        });
    });
    describe('Check in for valid user id and active membership, but 0 credits', function () {
        it('should return 404', async function () {
            let res = await request(app)
                .post(`/checkIn/${noCreditsUserResponse.body.id}`)
                .send({
                    items:[]
                })
            expect(res.status).toBe(404)
        });
    });
    describe('Check in for valid user id', function () {
        it('should return successful indication', async function () {
            await new Promise(resolve => setTimeout(resolve, 500))
            let res = await request(app).post(`/checkIn/${createdUserResponse.body.id}`).send({
                items:[]
            })
            expect(res.status).toBe(200)
            expect(res.text).toBe('Successful checkIn')
        });
    });
    describe('Check in for valid user id and with additional items', function () {
        it('should return successful indication', async function () {
            const items = [
                {
                    description: "protein bar",
                    amount: 3
                },
                {
                    description: "milk shake",
                    amount: 2
                }
            ]
            let res = await request(app).post(`/checkIn/${createdUserResponse.body.id}`).send({
                items: items
            })
            expect(res.status).toBe(200)
            expect(res.text).toBe('Successful checkIn')
            let invoiceLinesResponse = await request(app).get('/invoiceLine/getAll');
            let invoiceLines = invoiceLinesResponse.body
            expect(items[0].description).toStrictEqual(invoiceLines[2].description)
            expect(items[0].amount).toStrictEqual(invoiceLines[2].amount)
            expect(items[1].description).toStrictEqual(invoiceLines[3].description)
            expect(items[1].amount).toStrictEqual(invoiceLines[3].amount)
        });
    });
    describe('Check in for valid user id and with additional but one amount is not a number', function () {
        it('should return 404', async function () {
            const items = [
                {
                    description: "protein bar",
                    amount: 3
                },
                {
                    description: "milk shake",
                    amount: "not a number"
                }
            ]
            let res = await request(app).post(`/checkIn/${createdUserResponse.body.id}`).send({
                items: items
            })
            expect(res.status).toBe(404)
        });
    });
});