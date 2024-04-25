import { rs } from "@dirigible/http"
const userDao = require("dirigible-bank-server/gen/dao/users/Users.js");
const bankAccountDao = require("dirigible-bank-server/gen/dao/bankAccount/BankAccounts.js");

rs.service({
    "getAccountByUser": {
        "post": [
            {
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

                    const allBankAccounts = bankAccountDao.list();

                    const userAccounts = [];

                    allBankAccounts.forEach(account => {
                        if (account.Users == body.Id) {
                            userAccounts.push(account);
                        }
                    })

                    response.setStatus(200);
                    response.setContentType("application/json");
                    response.println(JSON.stringify(userAccounts));
                },

                "catch": (_ctx, err, _request, response) => {
                    response.println(err);
                }
            },
        ],
    },
    "getAccountByIBAN": {
        "get": [
            {
                "serve": (_ctx, request, response) => {
                    const body = request.getJSON();

                    if (!('IBAN' in body)) {
                        response.setStatus(400);
                        response.println("Required more parameters");
                        return;
                    }

                    const allBankAccounts = bankAccountDao.list();

                    const iBANAccounts = [];

                    allBankAccounts.forEach(account => {
                        if (account.IBAN == body.IBAN) {
                            iBANAccounts.push(account);
                        }
                    })

                    response.setStatus(200);
                    response.setContentType("application/json");
                    response.println(JSON.stringify(iBANAccounts));
                },

                "catch": (_ctx, err, _request, response) => {
                    response.println(err);
                }
            },
        ],
    }
}).execute();