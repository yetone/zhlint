const lint = require('../src')
const markdownParser = require('../src/parsers/md')

test.todo = test.skip

describe('parser with markdown', () => {
  test('single paragraph', () => {
    const text = 'X [xxx](xxx) X *y* __x__ `ss` _0_ ~~asd~~ *asf**asf**adsf*'
    const result = markdownParser(text)
    const marks = [
      { type: 'hyper', meta: 'link', startIndex: 2, startContent: '[', endIndex: 6, endContent: '](xxx)' },
      { type: 'hyper', meta: 'emphasis', startIndex: 15, startContent: '*', endIndex: 17, endContent: '*' },
      { type: 'hyper', meta: 'strong', startIndex: 19, startContent: '__', endIndex: 22, endContent: '__' },
      { type: 'raw', meta: 'inlineCode', startIndex: 25, endIndex: 29, startContent: '`ss`', endContent: '' },
      { type: 'hyper', meta: 'emphasis', startIndex: 30, startContent: '_', endIndex: 32, endContent: '_' },
      { type: 'hyper', meta: 'delete', startIndex: 34, startContent: '~~', endIndex: 39, endContent: '~~' },
      { type: 'hyper', meta: 'emphasis', startIndex: 42, startContent: '*', endIndex: 57, endContent: '*' },
      { type: 'hyper', meta: 'strong', startIndex: 46, startContent: '**', endIndex: 51, endContent: '**' }
    ]
    expect(result.length).toBe(1)
    expect(result[0].value).toBe(text)
    expect(result[0].marks).toEqual(marks)
  })
})

describe('lint', () => {
  test('single paragraph', () => {
    expect(lint('X[ xxx ](xxx)X`hello`world'))
      .toBe('X [xxx](xxx) X `hello` world')
  })
  test('frontmatter', () => {
    expect(lint('---\ntitle: 介绍\ntype: guide\norder: 2\n---\n## Vue 是什么\n'))
      .toBe('---\ntitle: 介绍\ntype: guide\norder: 2\n---\n## Vue 是什么\n')
  })
  test('space between raw content', () => {
    // 我们 <a id="modal-player" href="#"> 制作了一个视频 </a>
    expect(lint('我们<a id="modal-player" href="#">制作了一个视频</a>'))
      .toBe('我们<a id="modal-player" href="#">制作了一个视频</a>')
  })
  test('space between raw content 2', () => {
    // 我们 <a id="modal-player" href="#"> 制作了一个视频 </a>
    expect(lint('Hello<a id="modal-player" href="#">制作了一个视频</a>World'))
      .toBe('Hello <a id="modal-player" href="#">制作了一个视频</a> World')
  })
  test('space between raw content 3', () => {
    // 创建一个 <code>。 html</code> 文件<a/>
    expect(lint('创建一个 <code>.html</code> 文件'))
      .toBe('创建一个 <code>.html</code> 文件')
  })
  test('raw content', () => {
    // {% raw %}<div id="app" class="demo">...</div>{% raw %}
    expect(lint('{% raw %}\n<div id="app" class="demo">...</div>\n{% raw %}'))
      .toBe('{% raw %}\n<div id="app" class="demo">...</div>\n{% raw %}')
  })
  test('empty lines', () => {
    expect(lint('a\n\nb\n\nc'))
      .toBe('a\n\nb\n\nc')
  })
  test('inline code', () => {
    expect(lint(`改进 \`<todo-item>\` 组件`))
      .toBe(`改进 \`<todo-item>\` 组件`)
  })
  test('footnote + inline code at the end', () => {
    expect(lint('这样写将始终添加 `errorClass`，但是只有在 `isActive` 是 truthy<sup>[[1]](#footnote-1)</sup> 时才添加 `activeClass`。'))
      .toBe('这样写将始终添加 `errorClass`，但是只有在 `isActive` 是 truthy<sup>[[1]](#footnote-1)</sup> 时才添加 `activeClass`。')
  })
  test('space between "&" punctuation', () => {
    expect(lint('## 访问元素 & 组件'))
      .toBe('## 访问元素 & 组件')
  })
  test('duplicated space outside hyper content', () => {
    expect(lint('那么你可以通过 [`$forceUpdate`](../api/#vm-forceUpdate) 来做这件事。'))
      .toBe('那么你可以通过 [`$forceUpdate`](../api/#vm-forceUpdate) 来做这件事。')
  })
  test('opposite side of hyper mark and bracket mark', () => {
    expect(lint('注意 **`v-slot` 只能添加在 `<template>` 上** (只有[一种例外情况](#独占默认插槽的缩写语法))，这一点和已经废弃的 [`slot` 特性](#废弃了的语法)不同。'))
      .toBe('注意 **`v-slot` 只能添加在 `<template>` 上** (只有[一种例外情况](#独占默认插槽的缩写语法))，这一点和已经废弃的 [`slot` 特性](#废弃了的语法)不同。')
  })
  test('space before punctuation', () => {
    expect(lint('不过在需要时你也可以提供一个 setter ：'))
      .toBe('不过在需要时你也可以提供一个 setter：')
  })
})
