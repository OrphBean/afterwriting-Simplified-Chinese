# 'afterwriting - 中文本地化版本 (Chinese Localization)

这是 [afterwriting-labs](https://github.com/ifrost/afterwriting-labs) 的中文本地化分支版本。

This is a Chinese localization fork of [afterwriting-labs](https://github.com/ifrost/afterwriting-labs).

## 主要改动 (Key Modifications)

### 🇨🇳 中文支持 (Chinese Support)
- **完整的简体中文界面** - 所有UI元素已翻译为中文
- **中文 Fountain 解析器** (`aw-parser-cn.js`) - 支持中文字符名、场景标题和格式
- **中文字体支持** - 集成思源黑体 (Noto Sans SC) 用于 PDF 生成
- **中文语法指南** - 新增帮助页面，详细说明 Fountain 中文语法
- **中文示例剧本** - 包含完整的中文示例剧本

### 🪶 轻量级构建 (Lightweight Build)
- **移除云存储集成** - 删除 Dropbox 和 Google Drive 功能
- **移除分析追踪** - 不使用 Google Analytics 或其他第三方追踪
- **本地优先** - 所有数据存储在浏览器本地
- **隐私友好** - 无需注册，无广告，无数据收集

### 🎨 UI 改进 (UI Improvements)
- 增强的图标可见性（带阴影和背景）
- 改进的 logo 文字阴影效果
- 更新的隐私政策和服务条款（双语）
- 简化的欢迎页面

## 安装使用 (Installation)

### 在线使用 (Online)
直接访问部署的网站即可使用。

### 离线使用 (Offline)

**推荐方式 (Recommended):**
1. 下载 `afterwriting.zip` 文件
2. 解压 zip 文件
3. 打开 `afterwriting` 文件夹
4. 双击 `afterwriting.html` 或 `index.html`
5. 开始编写剧本！

**或者从源码 (Or from source):**
1. 克隆此仓库
2. 双击 `afterwriting.html` 或 `index.html`
3. 开始编写剧本！

### 开发环境 (Development)
```bash
npm install
npx grunt build
```

## 自定义背景图片 (Custom Background Images)

要使用您自己的背景图片：
1. 将 PNG 格式的图片放入 `gfx` 文件夹
2. 命名为 `bg0.png` 到 `bg5.png`
3. 应用会随机选择一张作为背景

## Fountain 中文语法 (Chinese Fountain Syntax)

此版本支持标准 Fountain 语法，并针对中文进行了优化：

- **场景标题**：支持中文场景描述
- **人物名**：支持中文字符名
- **对话**：完整支持中文对话和括注
- **双栏对话**：使用 `^` 标记
- **大纲**：支持 `#` 和 `=` 标记的章节

详见应用内的帮助页面（问号图标）。

## 技术栈 (Tech Stack)

- **解析器**: 自定义 Fountain 解析器（支持中文）
- **PDF 生成**: PDFKit
- **编辑器**: CodeMirror
- **字体**: Noto Sans SC (思源黑体), Courier Prime
- **构建工具**: Grunt

## 致谢 (Credits)

- **原始项目**: [afterwriting-labs](https://github.com/ifrost/afterwriting-labs) by Piotr Jamróz
- **中文本地化**: OrphBean
- **背景图片**: nano banana 2025
- **字体**: 
  - Noto Sans SC (Google Fonts)
  - Courier Prime (Quote-Unquote Apps)
  - Day Roman (Apostrophic Laboratories)

## 贡献 (Contributing)

欢迎提交问题和拉取请求！

Welcome to submit issues and pull requests!

## 联系方式 (Contact)

如有问题或建议，请通过 GitHub Issues 联系。

For questions or suggestions, please contact via GitHub Issues.

---

**注意**: 此分支独立于原始仓库维护，不会自动接收上游更新。

**Note**: This fork is maintained independently and does not automatically receive upstream updates.


# License: MIT

Copyright (c) 2015-2020 Piotr Jamróz

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
