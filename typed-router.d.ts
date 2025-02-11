/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// Generated by unplugin-vue-router. ‼️ DO NOT MODIFY THIS FILE ‼️
// It's recommended to commit this file.
// Make sure to add this file to your tsconfig.json file as an "includes" or "files" entry.

declare module 'vue-router/auto-routes' {
  import type {
    RouteRecordInfo,
    ParamValue,
    ParamValueOneOrMore,
    ParamValueZeroOrMore,
    ParamValueZeroOrOne,
  } from 'vue-router'

  /**
   * Route name map generated by unplugin-vue-router
   */
  export interface RouteNamedMap {
    '/About': RouteRecordInfo<'/About', '/About', Record<never, never>, Record<never, never>>,
    '/Home': RouteRecordInfo<'/Home', '/Home', Record<never, never>, Record<never, never>>,
    '/login': RouteRecordInfo<'/login', '/login', Record<never, never>, Record<never, never>>,
    '/register': RouteRecordInfo<'/register', '/register', Record<never, never>, Record<never, never>>,
    '/user/[uid]': RouteRecordInfo<'/user/[uid]', '/user/:uid', { uid: ParamValue<true> }, { uid: ParamValue<false> }>,
    '/video/[vid]': RouteRecordInfo<'/video/[vid]', '/video/:vid', { vid: ParamValue<true> }, { vid: ParamValue<false> }>,
  }
}
