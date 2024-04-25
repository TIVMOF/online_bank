import { rs } from "@dirigible/http"
const transactionDao = require("dirigible-bank-server/gen/dao/transactions/Transactions.js");
const bankAccountDao = require("dirigible-bank-server/gen/dao/bankAccount/BankAccounts.js");
const userDao = require("dirigible-bank-server/gen/dao/users/Users.js");

const dateRegex = '/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/'

const isValidDate = (date) => {
    var datePattern = new RegExp(
        '/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/'
    );

    return !datePattern.test(date);
};

rs.service({
    "create": {
        "put": [
            {
                "serve": (_ctx, request, response) => {
                    const body = request.getJSON();

                    ["Reciever", "Sender", "Amount", "Date"].forEach((field) => {
                        if (!(field in body)) {
                            response.setStatus(400);
                            response.println("Required more parameters");
                            return;
                        }
                    });

                    if (!bankAccountDao.get(body.Reciever)) {
                        response.setStatus(404);
                        response.println("Cannot find reciever!");
                        return;
                    }

                    if (!bankAccountDao.get(body.Sender)) {
                        response.setStatus(404);
                        response.println("Cannot find sender!");
                        return;
                    }

                    if (!isValidDate(body.Date)) {
                        response.setStatus(400);
                        response.println("Invalid Date!");
                        return;
                    }

                    if (typeof body.Amount == 'number' && !isNaN(body.Amount)) {
                        const reciever = bankAccountDao.get(body.Reciever);
                        const sender = bankAccountDao.get(body.Sender);

                        if (sender.Amount < body.Amount) {
                            response.setStatus(400);
                            response.println("Insufficient funds in sender's account!");
                            return;
                        }

                        sender.Amount = sender.Amount - body.Amount;
                        reciever.Amount = reciever.Amount + body.Amount;

                        bankAccountDao.update(sender);
                        bankAccountDao.update(reciever);

                        const newTransaction = transactionDao.create(body);

                        if (!transactionDao.get(newTransaction)) {
                            response.println("Failed transaction!");
                            response.setStatus(400);
                        }
                        else {
                            response.setStatus(200);
                        }
                    }
                    else {
                        response.setStatus(400);
                        response.println("Amount not a number!");
                        return;
                    }
                },

                "catch": (_ctx, err, _request, response) => {
                    response.println(err);
                }
            },
        ],
    },
    "getTransactionsByUser": {
        "post": [{
            "serve": (_ctx, request, response) => {
                const body = request.getJSON();

                if (!('Id' in body)) {
                    response.setStatus(400);
                    response.println("Required more parameters");
                    return;
                }

                if (!userDao.get(body.Id)) {
                    response.setStatus(404);
                    response.println("Cannot find user!");
                    return;
                }

                const allTransactions = transactionDao.list();

                const userTransactions = [];

                allTransactions.forEach(transaction => {
                    if (transaction.Reciever == body.Id || transaction.Sender == body.Id) {
                        userTransactions.push(transaction);
                    }
                })

                response.setStatus(200);
                response.setContentType("application/json");
                response.println(JSON.stringify(userTransactions));
            },

            "catch": (_ctx, err, _request, response) => {
                response.println(err);
            }
        }]
    }
}).execute();