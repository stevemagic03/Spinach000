# Hollywood Cut - Jazz & Western Edition

![Version](https://img.shields.io/badge/version-2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

一个基于 Google Gemini API 的单页 Web 应用，用于生成超写实的电影幕后片场照。采用 "Klein Blue Jazz Western" 视觉风格，带来沉浸式电影创作体验。

![Preview](https://via.placeholder.com/800x400/002FA7/FFFFFF?text=Hollywood+Cut+Preview)

## ✨ 功能特性

### 核心功能
- 🎭 **AI 图像生成** - 利用 Google Gemini `gemini-3-pro-image-preview` 生成高质量片场照
- 📸 **人像参考上传** - 支持拖拽上传参考图片，保持人物面部一致性
- 🎬 **场景自定义** - 电影名称、画幅比例、镜头景深全方位调整
- ✨ **自动 Prompt 生成** - 智能构建专业级提示词模板
- 🎨 **Magic Edit 后期修图** - 使用 `gemini-2.5-flash-image` 进行二次创作
- 🎭 **动态背景氛围** - 根据电影名自动生成模糊海报印象图

### 交互体验
- 🎨 Klein Blue + Sunset Orange 配色方案
- 🎬 电影级视觉设计与动画效果
- 📱 响应式双栏布局，适配各种屏幕
- 💾 API Key 本地存储，自动登录

## 🚀 快速开始

### 前置要求
- 现代浏览器（Chrome、Firefox、Safari、Edge）
- Google Gemini API Key

### 运行项目

由于使用浏览器原生 ES Modules 和 CDN，无需构建步骤：

1. **克隆或下载项目**

```bash
git clone <repository-url>
cd hollywood-cut
```

2. **在浏览器中打开**

直接双击 `index.html` 或通过本地服务器打开：

```bash
# 使用 Python
python -m http.server 8000

# 使用 Node.js
npx serve
```

然后在浏览器访问 `http://localhost:8000`

3. **输入 API Key**

首次访问需要输入 Google Gemini API Key，获取地址：https://console.anthropic.com

## 📁 项目结构

```
hollywood-cut/
├── index.html                    # 入口 HTML (CDN 引入依赖)
├── README.md                     # 项目文档
├── src/
│   ├── App.tsx                   # 主应用组件
│   ├── components/
│   │   ├── index.tsx             # 组件导出
│   │   ├── WelcomeScreen.tsx     # 欢迎页 / API Key 认证
│   │   ├── Header.tsx            # 头部组件
│   │   ├── Footer.tsx            # 页脚组件
│   │   ├── DirectorConsole.tsx   # 导演控制台（左侧栏）
│   │   ├── Monitor.tsx           # 监视器（右侧栏）
│   │   ├── BackgroundAtmosphere.tsx  # 背景装饰元素
│   │   └── MoviePosterOverlay.tsx    # 电影海报氛围层
│   └── services/
│       └── geminiService.ts      # Gemini AI 服务层
```

## 🛠️ 技术栈

### 核心库
| 依赖 | 版本 | 用途 |
|------|------|------|
| React | ^19.2.3 | UI 框架 |
| React DOM | ^19.2.3 | DOM 渲染 |
| Framer Motion | ^12.23.26 | 动画交互 |
| Lucide React | ^0.562.0 | 图标库 |
| @google/genai | ^1.34.0 | Gemini SDK |

### 样式与字体
- **Tailwind CSS** - 通过 CDN 引入
- **Google Fonts**
  - `Playfair Display` - 电影感标题
  - `Rye` - 西部风格
  - `Inter` - 界面正文

## 🎨 设计系统

### 配色方案

| 颜色 | Hex | 用途 |
|------|-----|------|
| Canvas | `#FAF9F6` | 背景色 |
| Primary | `#002FA7` | 主色调（文本、边框） |
| Accent | `#FF4500` | 强调色（激活、悬停） |
| Secondary | `#8B4513` | 辅助色（标签、说明） |

### 字体排印

| 字体 | 应用场景 |
|------|----------|
| Playfair Display (Italic) | 欢迎页标题、Header 主标题 |
| Rye | "NO SIGNAL" 占位文字 |
| Inter | 输入框、按钮文字 |
| Monospace | 小标签、API Key 输入框 |

## 📖 使用指南

### 1. API Key 认证

首次使用需要输入 Google Gemini API Key，Key 会被安全地存储在浏览器的 localStorage 中，下次访问自动登录。

### 2. 上传人像参考

- 点击上传区域或拖拽图片文件
- 支持 JPEG、PNG 等常见图片格式
- 上传后可点击 × 按钮删除

### 3. 场景设定

- **电影名称** - 输入电影名，1.2秒后自动生成背景氛围图
- **画幅比例** - 选择 9:16、3:4、4:3 或 16:9
- **镜头景深** - 选择 f/1.2（浅）、f/4（标准）或 f/11（深）

### 4. 生成图片

- 点击 "自动生成 Prompt" 按钮构建提示词
- 可手动编辑提示词进行微调
- 选择生成数量 x1 或 x2
- 点击 "ACTION" 按钮开始生成

### 5. Magic Edit

生成图片后可使用 Magic Edit 功能进行后期修图：

1. 在输入框中输入修改指令（如 "变成黑白"、"增加颗粒感"）
2. 点击 "APPLY CUT" 按钮
3. 等待编辑完成

## 🔧 API 服务

### Gemini 模型使用

| 功能 | 模型 | 说明 |
|------|------|------|
| 生成片场照 | `gemini-3-pro-image-preview` | 高质量图像生成 |
| 后期编辑 | `gemini-2.5-flash-image` | 快速图像编辑 |
| 背景氛围 | `gemini-2.5-flash-image` | 生成模糊海报 |

## 📝 提示词模板

应用内置专业级提示词模板，包含以下模块：

- 人物与面容
- 镜头与构图
- 灯光与色彩
- 服装与造型
- 动作与场景
- 画面风格与细节
- 最终画面感受总结

## 🐛 常见问题

**Q: 生成的图片质量不理想？**
A: 尝试调整镜头景深参数，或在 Prompt 中添加更多细节描述。

**Q: Magic Edit 功能不工作？**
A: 确保编辑指令清晰明确，如 "将图片转为黑白风格"。

**Q: 如何清除 API Key？**
A: 点击右上角 "RESET" 按钮即可清除。

## 📄 License

MIT License - 详见 LICENSE 文件

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 GitHub Issue
- 发送邮件至项目维护者

---

**Hollywood Cut** ★ Jazz & Western Edition ★ Version 2.0 ★ 2026
