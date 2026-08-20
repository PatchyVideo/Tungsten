/**
 * API 错误码字典（全项目唯一数据源）
 *
 * 键名与后端返回的 `dataerr.reason` 一一对应，请勿改动。
 * 该字典由 `request.ts` 在构造错误对象时统一解析，UI 直接读取 `error.message`。
 * 文案种子来自项目根目录《错误码.md》参照表，其中登录/注册/账号相关
 * 文案吸收了原 `USER_AUTH_ERROR_MAP` 的定制措辞（更贴近用户）。
 * 剩余英文文案为参照表原文，后续可按需翻译。
 */

/** 后端全部错误码 -> 友好说明 */
export const API_ERROR_MAP: Record<string, string> = {
  // 通用
  UNKNOWN_ERROR: 'unknown error',
  FAILED_UNKNOWN: '未知失败',
  FAILED_NOT_OP: '操作失败',
  NOT_IMPLEMENTED: '功能未实现',
  NOT_FOUND: '未找到',
  OUT_OF_RANGE: '超出范围',
  NON_POSITIVE_K: '数量必须为正数',
  NEGATIVE_RANK: '排序值不能为负',
  POST_LIMIT_EXCEEDED: 'post limit exceeded',
  TOO_MANY_JOBS: 'too many jobs',
  EMPTY_LIST: 'empty list',
  EMPTY_QUERY: 'empty query',
  EMPTY_URL: 'empty url',
  EMPTY_TITLE: '标题为空',
  EMPTY_DESC: '简介为空',
  QUERY_TOO_LONG: '查询关键词过长',
  CONTENT_TOO_LONG: '内容过长',
  TITLE_TOO_LONG: '标题过长',
  URL_TOO_LONG: 'URL过长',
  ITEM_NOT_EXIST: '对象不存在',
  ITEM_NOT_FOUND: 'item not found',
  RECORD_ALREADY_EXISTS: 'record already exists',
  RECORD_NOT_FOUND: '记录不存在',
  SAME_NAME: '名称相同',
  NOT_ALIAS: '不是别名',
  ALIAS_ALREADY_EXIST: '别名已存在',
  ASSOCIATION_ALREADY_EXIST: '关联已存在',

  // 请求参数校验
  INCORRECT_REQUEST: '请求参数错误',
  INCORRECT_REQUEST_USER_SPACES: 'incorrect request user spaces',
  INCORRECT_QUERY: '查询参数错误',
  INCORRECT_QUERY_TYPE: '查询类型错误',
  INCORRECT_ORDER: '排序参数错误',
  INCORRECT_ACCESS_MODE: '访问模式参数错误',
  INCORRECT_ROLE: '角色参数错误',
  INCORRECT_AUTHOR_TYPE: '作者类型错误',
  INCORRECT_REPOST_TYPE: '转载类型参数错误',
  INCORRECT_BLACKLIST: 'incorrect blacklist',
  INCORRECT_CLEARENCE: 'incorrect clearence',
  INCORRECT_KEY: 'incorrect key',
  INCORRECT_STATUS: 'incorrect status',
  INCORRECT_IPFS_UPLOAD: 'IPFS上传参数错误',
  INCORRECT_edit_behaviour: 'incorrect edit behaviour',
  INCORRECT_non_found_behaviour: 'incorrect non found behaviour',
  INVALID_PATH: 'invalid path',
  INVALID_LANGUAGE: 'invalid language',
  UNRECOGNIZED_LANGUAGE: '语言不受支持',
  INVALID_SUBTITLE_FORMAT: 'invalid subtitle format',
  INVALID_TAG: 'invalid tag',
  ONLY_VTT_SUPPORTED: 'only vtt supported',

  // 会话 / 登录 / 权限
  INCORRECT_SESSION: '登录已过期，请重新登录',
  INCORRECT_SESSION_TYPE: '会话类型错误',
  INCORRECT_LOGIN: '用户名或密码错误',
  UNAUTHORISED_OPERATION: '未登录或权限不足',

  // 用户 / 账号
  USER_NOT_EXIST: '用户不存在',
  USER_EXIST: '用户名已被占用',
  USER_ALREADY_EXIST: '用户名已被占用',
  INCORRECT_USER: 'incorrect user',
  INCORRECT_PASSWORD: '原密码错误',
  USERNAME_TOO_LONG: '用户名过长',
  USERNAME_TOO_SHORT: '用户名过短',
  NAME_LENGTH: '用户名长度不合法',
  PASSWORD_TOO_LONG: '密码过长',
  PASSWORD_TOO_SHORT: '密码过短',
  PASSWORD_LENGTH: '密码长度不合法',
  EMAIL_EXIST: '该邮箱已被注册',
  EMAIL_NOT_EXIST: '邮箱未绑定或不存在',
  INCORRECT_EMAIL: '邮箱格式不正确',
  QQ_ALREADY_BIND: '该QQ号已绑定其他账号',
  NOT_QQ: 'not qq',
  DESC_TOO_LONG: '个人简介过长',
  NO_PHOTO: '未找到头像文件',
  NO_COVER: 'no cover',

  // 视频
  VIDEO_NOT_EXIST: '视频不存在',
  VIDEO_NOT_FOUND: '视频不存在',
  VIDEO_BEING_PROCESSED: 'video being processed',
  VIDEO_LIMIT_EXCEEDED: '视频数量超限',
  INCORRECT_VIDEO_ID: '视频ID格式错误',
  SAME_VIDEO: '视频相同',
  NOT_RATED: 'not rated',
  NOT_IPFS: 'not ipfs',

  // 评论
  COMMENT_NOT_EXIST: '评论不存在',
  COMMENT_TOO_LONG: '评论过长',
  PARENT_NOT_EXIST: '父评论不存在',

  // 标签
  TAG_NOT_EXIST: '标签不存在',
  TAG_NOT_FOUND: '标签不存在',
  TAG_ALREADY_EXIST: '标签已存在',
  TAG_TOO_LONG: 'tag too long',
  TAG_NOT_AUTHOR: 'tag not author',
  TOO_MANY_TAGS: 'too many tags',
  TAGS_LIMIT_EXCEEDED: '标签数量超限',
  SAME_TAG: '标签相同',
  AUTHOR_TAG_DELETION_DISABLED: 'author tag deletion disabled',
  INCORRECT_TAG_MERGE_BEHAVIOUR: '标签合并行为参数错误',

  // 分类
  CATEGORY_ALREADY_EXIST: '分类已存在',
  CATEGORY_NOT_EXIST: '分类不存在',

  // 播放列表
  PLAYLIST_NOT_EXIST: '播放列表不存在',
  EMPTY_PLAYLIST: '播放列表为空',
  VIDEO_NOT_EXIST_OR_NOT_IN_PLAYLIST: 'video not exist or not in playlist',
  UNSUPPORTED_PLAYLIST_URL: 'unsupported playlist url',

  // 分组 / 文件夹
  GROUP_EXIST: '分组已存在',
  GROUP_NOT_EXIST: '分组不存在',
  FOLDER_ALREADY_EXIST: 'folder already exist',
  FOLDER_NOT_EXIST: 'folder not exist',

  // 讨论版 / 帖子
  FORUM_NOT_EXIST: '讨论版不存在',
  THREAD_NOT_EXIST: '帖子不存在',

  // 站点 / 其他
  UNSUPPORTED_SITE: 'unsupported site',
  UNSUPPORTED_WEBSITE: 'unsupported website',
  UNSUPPORTED_TRANSLATOR: 'unsupported translator',
  SUB_NOT_EXIST: 'sub not exist',
}
