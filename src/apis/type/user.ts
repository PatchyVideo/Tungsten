/**
 * 登录接口返回的用户信息
 */
export interface LoginData {
  uid: string // 用户唯一 ID
  username: string // 用户名
  desc: string // 个人简介
  image: string // 头像标识，'default' 表示使用默认头像
  pubkey: string // 公钥，未绑定时为空字符串
  email: string // 邮箱
  bind_qq: boolean // 是否已绑定 QQ
  access_control_status: string // 权限状态，'admin' 表示管理员
  auth_token: string // 鉴权 Token（JWT）
}
