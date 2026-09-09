/**
 * 互斥键类型：从 K 中任选一个键（值为 V），其余键必须不出现。
 *
 * K: 代表互斥的键（比如 'vid' | 'pid'）
 * V: 代表这些键对应的值的类型（比如 string）
 *
 * 适用范围：API 参数等纯 TS 类型（如 RateParams）。
 * 不能用于 defineProps —— @vue/compiler-sfc 无法对导入的映射索引类型
 * 求值，会报 "Unsupported type when resolving index type"。
 * 组件 props 的互斥请在组件文件内手写展开为联合类型（带 `?: never` 标记），
 * 参考 Comment.vue 的 PropsWithVideo / PropsWithPlaylist。
 *
 * @example
 * type RateParams = XOR<'vid' | 'pid', string> & { stars: RatingStars }
 * // 等价于：
 * // | { vid: string, pid?: never, ... }
 * // | { pid: string, vid?: never, ... }
 */
export type XOR<K extends string, V> = {
  [P in K]: Record<P, V> & { [Q in Exclude<K, P>]?: never };
}[K]
