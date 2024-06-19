import { faker } from "@faker-js/faker"
import { Comment, PaginatedComment } from "./comment.model";

export const generatePaginatedComment = (): PaginatedComment => {
    return {
      next:         faker.internet.url(),
      previous:     faker.internet.url(),
      total_count:  30,
      current_page: 1,
      total_pages:  3,
      results:      generateManyComments()
    };
  }

  export const generateOneComment = (): Comment => {
    return {
      id: faker.number.int(100),
      comment: faker.word.words(4),
      created_at: faker.date.anytime(),
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

  export const generateManyComments = (): Comment[] => {
    const comments: Comment[] = [];
    for (let i = 0; i < 30; i++) {
      comments.push(generateOneComment());
    }
    return comments;
  }