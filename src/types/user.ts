// 用户相关类型定义

export interface User {
  userId: number
  username: string      // 后端返回 username
  nickname: string      // 后端返回 nickname
  email: string
  isAdmin: 0 | 1       // 后端使用 isAdmin
  createTime: string
  token?: string
}

export interface LoginForm {
  username: string  // 后端使用 username 字段
  password: string
}

export interface RegisterForm {
  username: string   // 后端使用 username 字段
  nickname: string   // 后端使用 nickname 字段
  email: string
  password: string
}

export interface UserProfile {
  nickName: string
  email: string
  introduceSign?: string
}
