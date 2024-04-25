import { rs } from "@dirigible/http"
const userDao = require("dirigible-bank-server/gen/dao/users/Users.js");

rs.service({
    "login": {
        "post": [
            {
                "serve": (_ctx, request, response) => {
                    const body = request.getJSON();

                    ["Username", "Password"].forEach((field) => {
                        if (!(field in body)) {
                            response.setStatus(400);
                            response.println("Required more parameters");
                            return;
                        }
                    });

                    const settings = {
                        where: {
                            property: 'Username',
                            operator: 'eq',
                            value: body.Username,
                        },
                    };

                    const users = userDao.list(settings);

                    if (users && users.length > 0) {
                        const user = users.find(user => user.Username === body.Username);

                        if (user) {
                            if (user.Password === body.Password) {

                                response.setStatus(200);
                                response.setContentType("application/json");
                                response.println(JSON.stringify(user));
                            } else {
                                response.setStatus(401);
                                response.println("Invalid password");
                                return;
                            }
                        }
                        else {
                            response.setStatus(404); // User not found
                            response.println("User not found");
                            return;
                        }
                    }
                },

                "catch": (_ctx, err, _request, response) => {
                    response.println(err);
                }
            },
        ],
    },
    "getById": {
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

                const user = userDao.get(body.Id);

                response.setStatus(200);
                response.setContentType("application/json");
                response.println(JSON.stringify(user));
            },

            "catch": (_ctx, err, _request, response) => {
                response.println(err);
            }
        }]
    }
}).execute();