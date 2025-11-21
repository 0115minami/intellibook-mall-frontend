// 用户相关类型定义

export interface User {
  userId: number
  loginName: string
  nickName: string
  email: string
  introduceSign?: string
  lockedFlag: 0 | 1
  createTime: string
  token?: string
}

export interface LoginForm {
  loginName: string
  password: string
}

export interface RegisterForm {
  loginName: string
  nickName: string
  email: string
  password: string
  confirmPassword: string
}

export interface UserProfile {
  nickName: string
  email: string
  introduceSign?: string
}
