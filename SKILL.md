---
name: glory-insurance-catalog
description: 查询公司保险产品库信息。当用户询问保险产品、保险计划、保险方案时，触发此 skill。
license: MIT
metadata:
  author: Glory
  version: "1.0.0"
  homepage: "https://github.com/sergio-wen/mcp-insurance"
  agent:
    requires:
      bins: ["gloryfham-mcp-insurance"]
    install:
      - id: npm
        kind: node
        package: "gloryfham-mcp-insurance"
        bins: ["gloryfham-mcp-insurance"]
        label: "Install Glory Insurance MCP Server"
---

# Glory Insurance Catalog — 保险产品查询

通过 MCP Server `gloryfham-mcp-insurance` 查询公司保险产品库数据。

---

## 可用工具

| 工具 | 参数 | 用途 |
|------|------|------|
| `listInsuranceProducts` | 无 | 获取所有保险产品列表 |
| `searchInsuranceProducts(keyword, productType?, region?)` | keyword(必填), productType(可选), region(可选) | 搜索保险产品 |
| `getInsuranceProductDetail(productCode)` | productCode(必填) | 获取产品详情 |

**产品类型对照**：
- `H01` — 分红险（Whole Life Participating）
- `H08` — 年金险（Annuity）
- `H09` — IUL（指数型万能寿险）

---

## 工作流程

```
1. 识别场景  →  2. 调用 MCP 工具  →  3. 结构化输出
```

### 场景一：产品搜索
调用 `searchInsuranceProducts(keyword)` 获取匹配产品列表。

### 场景二：产品详情
调用 `getInsuranceProductDetail(productCode)` 获取完整信息。

### 场景三：浏览全部
调用 `listInsuranceProducts()` 获取全量列表。

---

## 输出规范

1. **禁止直接输出 JSON** — 必须解析、格式化后呈现
2. **优先使用表格** 呈现可对比数据
3. **信息缺失标注** "数据暂未披露"
