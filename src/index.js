import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 加载数据
const rawData = JSON.parse(readFileSync(join(__dirname, '..', 'data.json'), 'utf-8'));
const products = rawData.response?.r || [];

// 按 productCode 建立索引
const productMap = {};
products.forEach(p => {
  productMap[p.salesPlanCode] = p;
});

const server = new McpServer({
  name: 'glory-mcp-insurance',
  version: '1.0.0',
});

/**
 * 关键词匹配（产品名称、英文名、简称、标签）
 */
function matchesKeyword(product, keyword) {
  if (!keyword) return true;
  const kw = keyword.toLowerCase();
  return (
    (product.salesPlanName || '').toLowerCase().includes(kw) ||
    (product.salesPlanNameEn || '').toLowerCase().includes(kw) ||
    (product.salesPlanShortName || '').toLowerCase().includes(kw) ||
    (product.salesPlanLabel || '').toLowerCase().includes(kw) ||
    (product.companyCode || '').toLowerCase().includes(kw)
  );
}

// 工具 1: 列出所有保险产品
server.tool('listInsuranceProducts', '获取所有可用保险产品的列表概览', {}, async () => {
  return {
    content: [{
      type: 'text',
      text: JSON.stringify(products, null, 2),
    }],
  };
});

// 工具 2: 搜索保险产品
server.tool(
  'searchInsuranceProducts',
  '根据关键词、产品类型、地区搜索保险产品列表',
  {
    keyword: z.string().describe('搜索关键词，支持产品名称、简称、标签模糊匹配'),
    productType: z.string().optional().describe('产品类型筛选，如 H01/H08/H09'),
    region: z.string().optional().describe('产品地区筛选，如 HK/SG'),
  },
  async ({ keyword, productType, region }) => {
    const result = products.filter(p => {
      if (!matchesKeyword(p, keyword)) return false;
      if (productType && p.salesPlanType !== productType) return false;
      if (region && p.placeToBelong !== region) return false;
      return true;
    });

    return {
      content: [{
        type: 'text',
        text: JSON.stringify(result, null, 2),
      }],
    };
  }
);

// 工具 3: 获取保险产品详情
server.tool(
  'getInsuranceProductDetail',
  '根据产品编号获取保险产品的完整详细信息',
  {
    productCode: z.string().describe('产品编号，如 PRU_PACE'),
  },
  async ({ productCode }) => {
    const detail = productMap[productCode];
    if (!detail) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ error: `未找到保险产品: ${productCode}` }),
        }],
        isError: true,
      };
    }

    return {
      content: [{
        type: 'text',
        text: JSON.stringify(detail, null, 2),
      }],
    };
  }
);

// 启动服务器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Glory Insurance MCP Server running on stdio');
}

main().catch(console.error);
