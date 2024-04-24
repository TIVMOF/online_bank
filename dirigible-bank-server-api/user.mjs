import { rs } from "@dirigible/http";
import { session } from "sdk/http";
import { UsersRepository } from "dirigible-bank-server/gen/dao/users/usersRepository";

const usersRepo = new UsersRepository();

rs.service({
    login: [
        {
            serve: (_ctx, request, response) => {
                const body = request.getJSON();

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

                const existingUsers = usersRepo.findAll(filterOptions);

                if (existingUsers.length <= 0) {
                    response.setStatus(404); // User not found
                    response.println("User not found");
                    return;
                } else {
                    const user = existingUsers[0];

                    if (user.Password === body.Password) {
                        // Set session attributes
                        session.setAttribute("userId", user.Id); // Save user ID in the session
                        session.setAttribute("username", user.Username);

                        response.setStatus(200);
                        response.setContentType("application/json");
                        response.println("Login successful");
                    } else {
                        response.setStatus(401);
                        response.println("Invalid password");
                        return;
                    }
                }
            },
        },
    ],
});
