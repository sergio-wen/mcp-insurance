# @gloryfham/mcp-insurance

Glory Insurance MCP Server — 保险产品库查询服务。

## 安装

```bash
npm install -g @gloryfham/mcp-insurance
```

## 使用

### 作为 Claude Code Skill

```bash
npx skills add gloryfham/agent-skills
```

### 作为独立 MCP Server

```bash
npx @gloryfham/mcp-insurance
```

## 可用工具

| 工具 | 参数 | 描述 |
|------|------|------|
| `listInsuranceProducts` | 无 | 获取所有保险产品列表 |
| `searchInsuranceProducts(keyword?, productType?, region?)` | keyword(可选), productType(可选), region(可选) | 搜索保险产品 |
| `getInsuranceProductDetail(productCode)` | productCode(必填) | 获取产品详情 |

## 产品类型

- `H01` — 分红险（Whole Life Participating）
- `H08` — 年金险（Annuity）
- `H09` — IUL（指数型万能寿险）

## 地区代码

- `HK` — 香港
- `SG` — 新加坡

## License

MIT
