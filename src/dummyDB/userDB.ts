export interface DbUser {
  id: number
  fullName: string
  email: string
  password: string
}

export const userDB: DbUser[] = [
  {
    id: 1,
    fullName: 'John Doe',
    email: 'john@doe.com',
    password: '123456',
  },
  {
    id: 2,
    fullName: 'Nghia',
    email: 'nghiakiu@gmail.com',
    password: '123456',
  },
]

