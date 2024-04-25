import { rs } from "@dirigible/http"
const cardDao = require("dirigible-bank-server/gen/dao/cards/Cards.js");
const userDao = require("dirigible-bank-server/gen/dao/users/Users.js");

rs.service({
    "getCards": {
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

                    const allCards = cardDao.list();

                    const userCards = [];

                    allCards.forEach(card => {
                        if (card.Users == body.Id) {
                            userCards.push(card);
                        }
                    })

                    response.setStatus(200);
                    response.setContentType("application/json");
                    response.println(JSON.stringify(userCards));
                },

                "catch": (_ctx, err, _request, response) => {
                    response.println(err);
                }
            },
        ],
    }
}).execute();