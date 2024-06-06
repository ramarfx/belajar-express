import { prismaClient } from "../app/database.js";
import { ResponseError } from "../error/response-error.js";
import { registerUserValidation } from "../validation/user-validation.js";
import { validate } from "../validation/validation.js";

const register = async (request) => {
  const user = validate(registerUserValidation, request);

  const countUser = await prismaClient.user.count({
    where: {
        username: user.username
    }
  })

  if (countUser === 1) {
    throw new ResponseError(400, 'Username already exist')
  }

  const result = await 
};
