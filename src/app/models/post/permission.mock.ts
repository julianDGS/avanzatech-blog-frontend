import { faker } from "@faker-js/faker"
import { PermissionResponse, Permissions } from "./permission.model";

const permissionName = ['read', 'edit', 'none'];

export const generatePostPermissions = (): Permissions => {
  const publicPerm = faker.number.int({min: 0, max: 2});
  const auth = faker.number.int({min: 0, max: 2});
  const team = faker.number.int({min: 0, max: 2});
  const author = faker.number.int({min: 0, max: 2});
  return {
    public: {
      id: publicPerm+1,
      name: permissionName[publicPerm]
    },
    auth:   {
      id: auth+1,
      name:  permissionName[auth]
    },
    team:   {
      id: team+1,
      name:  permissionName[team]
    },
    author: {
      id: author+1,
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
  return [{
      id: 1,
      name: permissionName[0] //read
    },
    {
      id: 2,
      name: permissionName[1] //edit
    },
    {
      id: 3,
      name: permissionName[2] //none
    },
  ]
}

export const categoryCopy = (categories: PermissionResponse[]): PermissionResponse[] => {
  return categories.map(category => {return {...category}})
}

export const permissionCopy = (permissions: PermissionResponse[]): PermissionResponse[] => {
  return permissions.map(permission => {return {...permission}})
}
