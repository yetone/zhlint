// ::: xxx\nyyy\nzzz\n:::\n
// - `(?<=^|\n)` + `(\:\:\:.*)`
// - `\n`
// - `(.+)`
// - `\n`
// - `(\:\:\:)` + `(?=\n|$)`
const matcher = /(?<=^|\n)(\:\:\:.*)\n(.+)\n(\:\:\:)(?=\n|$)/g

module.exports = data => {
  data.content = data.content.replace(matcher, (raw, start, content, end, index) => {
    const { length } = raw
    const name = start.substr(3).trim()
    data.ignoredByParsers.push({
      name,
      index,
      length: start.length,
      raw: start,
      meta: `vuepress-${name}-start`
    })
    data.ignoredByParsers.push({
      name,
      index: index + length - 3,
      length: 3,
      raw: end,
      meta: `vuepress-${name}-end`
    })
    return '@'.repeat(start.length) + '\n' + content + '\n' + '@'.repeat(3)
  })
  return data
}
