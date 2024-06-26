import { faker } from "@faker-js/faker"
import { PermissionResponse, Permissions } from "./permission.model";

const permissionName = ['read', 'edit', 'none'];

export const generatePostPermissions = (): Permissions => {
  const publicPerm = faker.number.int(3);
  const auth = faker.number.int(3);
  const team = faker.number.int(3);
  const author = faker.number.int(3);
  return {
    public: {
      id: publicPerm,
      name: permissionName[publicPerm]
    },
    auth:   {
      id: auth,
      name:  permissionName[auth]
    },
    team:   {
      id: team,
      name:  permissionName[team]
    },
    author: {
      id: author,
      name:  permissionName[author]
    },
  }
}

export const generateCategories = (): PermissionResponse[] => {
  return [
    {
      id: 1,
      name: 'author'
    },
    {
      id: 2,
      name: 'team'
    },
    {
      id: 3,
      name: 'auth'
    },
    {
      id: 4,
      name: 'public'
    }
  ]
}

export const generatePermissions = (): PermissionResponse[] => {
  const posts: PermissionResponse[] = [];
    for (let i = 0; i < 4; i++) {
      posts.push(permResponse());
    }
    return posts;
}

export const permResponse = (): PermissionResponse => {
  const number = faker.number.int(3);
  return {
    id: number,
    name: permissionName[number]
  }
}
