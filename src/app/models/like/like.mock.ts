import { faker } from "@faker-js/faker"
import { Like, PaginatedLike } from "./like.model";

export const generatePaginatedLike = (): PaginatedLike => {
    return {
      next:         faker.internet.url(),
      previous:     faker.internet.url(),
      total_count:  40,
      current_page: 1,
      total_pages:  3,
      results:      generateManyLikes()
    };
  }

  export const generateOneLike = (): Like => {
    return {
      id: faker.number.int(100),
      post: {
        id: faker.number.int(100),
        title: faker.word.words(3)
      },
      user: {
        id: faker.number.int(100),
        email: faker.internet.email(),
        nickname: faker.internet.userName()
      }
    }
  }

  export const generateManyLikes = (): Like[] => {
    const likes: Like[] = [];
    for (let i = 0; i < 40; i++) {
      likes.push(generateOneLike());
    }
    return likes;
  }