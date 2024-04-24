import { rs } from "sdk/http";
// import { session } from "sdk/http";
import { UsersRepository } from "/dirigible-bank-server/gen/dao/users/UsersRepository.ts";

const usersRepo = new UsersRepository();

rs.service({
    "login": {
        "post": [
            {
                "serve": (_ctx, request, response) => {
                    const body = request.getJSON();

                    response.println(body);

                    ["Username", "Password"].forEach((field) => {
                        if (!(field in body)) {
                            response.setStatus(400);
                            response.println("Required more parameters");
                            return;
                        }
                    });

                    const filterOptions = {
                        $filter: {
                            equals: {
                                Username: body.Username,
                            },
                        },
                    };

                    response.println(filterOptions);

                    const existingUsers = usersRepo.findAll(filterOptions);

                    response.println(existingUsers);

                    if (existingUsers.length <= 0) {
                        response.setStatus(404); // User not found
                        response.println("User not found");
                        return;
                    } else {
                        const user = existingUsers[0];

                        if (user.Password === body.Password) {
                            // Set session attributes
                            // session.setAttribute("userId", user.Id); // Save user ID in the session
                            // session.setAttribute("username", user.Username);

                            // Return session-related data in the response
                            // const sessionData = {
                            //     userId: user.Id,
                            //     sessionId: session.getId(), // You can return the session ID
                            // };

                            response.setStatus(200);
                            response.setContentType("application/json");
                            response.println(JSON.stringify(user.Id));

                            // response.println(JSON.stringify(sessionData)); // Include session data in the response
                        } else {
                            response.setStatus(401);
                            response.println("Invalid password");
                            return;
                        }
                    }
                },

                "catch": (_ctx, err, _request, response) => {
                    response.println("Pesho");
                    response.println(err);
                }
            },
        ],
    }
}).execute()
