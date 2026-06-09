import MarkdownIt from 'markdown-it'

import { facePlugin } from './parserCommon'

const markdownIt = new MarkdownIt({
  html: false,
  breaks: true,
  linkify: true,
}).use(facePlugin)

markdownIt.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  const token = tokens[idx]
  // 防止钓鱼和反射攻击
  if (!token.attrGet('rel')) {
    token.attrPush(['rel', 'noopener noreferrer'])
  }
  if (!token.attrGet('target') && options.linkify !== false) {
    token.attrPush(['target', '_blank'])
  }
  return self.renderToken(tokens, idx, options)
}

markdownIt.block.ruler.enableOnly(['paragraph'])

export function render(src: string): string {
  let res
  try {
    res = markdownIt.render(src.replace(/\[\[表情:(\p{L}+)\]\]/gu, '[[face' /* escape unocss */ + ':$1]]'), {
      last: [],
    })
  }
  catch (e) {
    console.error(e)
    res = `<div class="font-mono">Error throwed from Markdown parser: ${e}<br />${
      (e instanceof Error && e.stack) ? e.stack.split('\n').join('<br />') : String(e)
    }</div>`
  }
  return res
}
