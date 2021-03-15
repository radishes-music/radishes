export interface AvatarBase {
  nickname: string
  userId: number
  userType: number
}

export interface Avatar extends AvatarBase {
  avatarUrl: string
  city: number
  birthday: number
  backgroundUrl: string
}

export interface Creator extends AvatarBase {
  authStatus: number
}
