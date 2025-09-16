/**
 * 单个语言条目
 */
export interface AutocompleteLang {
  l: number // 语言代码（如 1=简体中文, 10=日语, 5=英文, 2=繁体中文等）
  w: string // 对应语言的显示文本
}

/**
 * 自动补全建议项
 */
export interface AutocompleteSuggestion {
  cat: number // 分类 ID（如 2=动画, 3=角色等，需根据业务定义）
  cnt: number // 相关结果计数 / 热度
  keyword: string // 原始关键词（用于匹配或跳转）
  id: number // 唯一资源 ID（可用于跳转详情页）
  langs: AutocompleteLang[] // 多语言显示名称
  alias: string[] // 别名列表（可用于模糊匹配）
}

/**
 * 自动补全接口返回的完整数组类型
 */
export type AutocompleteResponse = AutocompleteSuggestion[]
