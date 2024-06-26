import { AuthRequest } from "../auth/login.model";
import { User } from "./user.model";
import { faker } from "@faker-js/faker"

export const generateOneUser = (): User => {
    return {
      id: faker.number.int(10),
      name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      nickname: faker.internet.userName(),
      team: {
        id: 1,
        name: 'Team 1'
      }
    };
  }

  export const generateRegisterRequest = (): AuthRequest => {
    return {
      password: '1234',
      email: 'user1@mail.com',
      name: 'user',
      last_name: 'one',
      confirm_password: '1234'
    }
  }