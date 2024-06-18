import { User } from "./user.model";
import { faker } from "@faker-js/faker"

export const generateOneUser = (): User => {
    return {
      id: faker.number.int(100),
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