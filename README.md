# Claude Skills

一个 [Claude Code](https://claude.ai/code) 自定义 skill 的集合，用于日常自动化任务。

## Skills

### `/camping-search` — Washington 露营地搜索

自动搜索 [Washington State Parks](https://washington.goingtocamp.com/) 的露营地空位，使用 Playwright 浏览器自动化。

**用法：**

```
/camping-search "Deception Pass" 6/13 6/14 2
/camping-search "Deception Pass" 7/4 7/5 2 "1 Tent"
```

**手动运行：**

```bash
npm install
npx playwright install chromium
node camping.js
```

或通过环境变量自定义参数：

```bash
PARK="Deception Pass" ARRIVAL="June 13, 2026" DEPARTURE="June 14, 2026" PARTY_SIZE=2 EQUIPMENT="1 Tent" node camping.js
```

| 环境变量 | 默认值 | 说明 |
|---|---|---|
| `PARK` | `Deception Pass` | 公园名称 |
| `ARRIVAL` | `June 13, 2026` | 入住日期（英文全称）|
| `DEPARTURE` | `June 14, 2026` | 离开日期（英文全称）|
| `PARTY_SIZE` | `2` | 人数 |
| `EQUIPMENT` | `1 Tent` | 装备类型 |

---

## 安装 Skills

将 `.md` 文件复制到 Claude Code 的 commands 目录即可：

```bash
cp camping-search.md ~/.claude/commands/
```
