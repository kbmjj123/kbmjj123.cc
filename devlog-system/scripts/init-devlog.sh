#!/usr/bin/env bash
# init-devlog.sh — 在一个项目里接入 dev-log
#
# 用法（在项目根目录执行）：
#   ~/.workbuddy/skills/dev-log/scripts/init-devlog.sh <project-name>
#
# 做四件事：
#   1. 建全局采集目录 ~/.dev-log/projects/<project>/{log.md,shots,outputs}
#   2. 建项目内 .dev-log/ 并复制 config 模板
#   3. 建截图软链接（写路径短 + 物理集中）
#   4. 更新 ~/.dev-log/index.md

set -euo pipefail

PROJECT="${1:-}"
if [ -z "$PROJECT" ]; then
  echo "用法: init-devlog.sh <project-name>" >&2
  exit 1
fi

GLOBAL_ROOT="${HOME}/.dev-log"
PROJ_DIR="${GLOBAL_ROOT}/projects/${PROJECT}"
TEMPLATE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "→ 项目: ${PROJECT}"
echo "→ 本地: $(pwd)"

# 1. 全局采集目录
mkdir -p "${PROJ_DIR}/shots" "${PROJ_DIR}/outputs"
if [ ! -f "${PROJ_DIR}/log.md" ]; then
  printf '# Dev Log · %s\n\n> 自动生成，追加模式。手动补充说明请用「> 补充：」前缀。\n\n---\n' \
    "$PROJECT" > "${PROJ_DIR}/log.md"
  echo "  ✓ 建日志 ${PROJ_DIR}/log.md"
else
  echo "  · 日志已存在，跳过"
fi

# 2. 项目内配置目录
#    注意：生成的是「最小可解析配置」，不是那份说明文档。
#    config-template.md 只是给人看的参考，放在 skill 目录里，不复制进项目。
mkdir -p .dev-log
if [ ! -f .dev-log/config.md ]; then
  cat > .dev-log/config.md <<EOF
# .dev-log/config.md

project: ${PROJECT}
desc: <一句话说明这个项目在做什么 —— 会附加到每条日志，跨项目时能自解释>
template_version: 1

tags: []
focus: []
ignore: []

settings:
  screenshot_daily_limit: 5
  min_signals_to_aggregate: 3
EOF
  echo "  ✓ 建配置 .dev-log/config.md（请填 desc / tags / focus / ignore）"
  echo "    参考字段说明: ${TEMPLATE_DIR}/config-template.md"
else
  echo "  · 配置已存在，跳过"
fi

# 3. 截图软链接
if [ ! -e .dev-log/shots ]; then
  ln -s "${PROJ_DIR}/shots" .dev-log/shots
  echo "  ✓ 软链接 .dev-log/shots -> ${PROJ_DIR}/shots"
else
  echo "  · .dev-log/shots 已存在，跳过"
fi

# 4. gitignore
#    config.md 是唯一应该提交的文件（它跟着项目走，换机器重装也还在）。
#    其余（尤其是 shots 软链接，指向本机的绝对路径）一律忽略。
if [ -f .gitignore ] && ! grep -q "dev-log" .gitignore; then
  printf '\n# dev-log：只提交配置，忽略其余\n.dev-log/*\n!.dev-log/config.md\n' >> .gitignore
  echo "  ✓ .gitignore 已追加（忽略 .dev-log/* 但保留 config.md）"
fi

# 5. 全局项目清单（自动生成，不要手工维护）
INDEX="${GLOBAL_ROOT}/index.md"
mkdir -p "$GLOBAL_ROOT"
if [ ! -f "$INDEX" ]; then
  printf '# dev-log 项目清单\n\n> 由 init-devlog.sh 自动维护，请勿手工编辑。\n\n' > "$INDEX"
fi
if ! grep -q "^- ${PROJECT}:" "$INDEX"; then
  printf -- '- %s: %s\n' "$PROJECT" "$(pwd)" >> "$INDEX"
  echo "  ✓ 已登记到 ${INDEX}"
fi

echo
echo "完成。下一步：编辑 .dev-log/config.md 里的 desc / tags / focus / ignore"
