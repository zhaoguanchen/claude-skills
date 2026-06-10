# WA Camping Search

自动搜索 [Washington State Parks](https://washington.goingtocamp.com/) 露营地空位，使用 Playwright 浏览器自动化。

## 安装

```bash
npm install
npx playwright install chromium
```

## 使用

```bash
node camping.js
```

或通过环境变量自定义参数：

```bash
PARK="Deception Pass" ARRIVAL="June 13, 2026" DEPARTURE="June 14, 2026" PARTY_SIZE=2 EQUIPMENT="1 Tent" node camping.js
```

## 参数

| 环境变量 | 默认值 | 说明 |
|---|---|---|
| `PARK` | `Deception Pass` | 公园名称 |
| `ARRIVAL` | `June 13, 2026` | 入住日期（英文全称）|
| `DEPARTURE` | `June 14, 2026` | 离开日期（英文全称）|
| `PARTY_SIZE` | `2` | 人数 |
| `EQUIPMENT` | `1 Tent` | 装备类型 |

## Claude Code Skill

本项目包含 Claude Code `/camping-search` skill，可直接在 Claude Code 中调用：

```
/camping-search "Deception Pass" 6/13 6/14 2
```
