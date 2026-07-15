# Portfolio

许晓琨的个人 UI 设计作品集，使用 Next.js App Router 构建并部署到 Vercel。

## Requirements

- Node.js 22.x
- pnpm 10.28.0

## Development

```bash
pnpm install --frozen-lockfile
pnpm dev
```

首页源文件是 `reference-dino-preview.html`。开发和生产构建前，`prepare:home`
脚本会将它转换为 Next.js 可直接提供的静态首页，并修正 `public/` 资源路径。

## Validation

```bash
pnpm check
```

`pnpm check` 会运行 ESLint、原生 Next.js 生产构建，并启动生产服务器执行路由和页面测试。

## Routes

- `/`：作品集首页
- `/projects/[slug]`：项目详情
- `/other`：动态视觉作品

Vercel 使用标准 `.next` 输出目录，不需要自定义 Output Directory。
