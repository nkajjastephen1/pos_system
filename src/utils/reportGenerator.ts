import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { Transaction, ServiceTransaction } from '../types';

export type ReportType = 'daily' | 'weekly' | 'yearly';

export interface ReportData {
  transactions: Transaction[];
  serviceTransactions: ServiceTransaction[];
}

export function getDateRange(reportType: ReportType) {
  const now = new Date();
  let start: Date;
  if (reportType === 'daily') {
    start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  } else if (reportType === 'weekly') {
    start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else {
    // yearly: last 365 days
    start = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
  }
  return {
    start,
    end: now,
    label: `${start.toLocaleString()} — ${now.toLocaleString()}`
  };
}

function formatCurrency(n: number) {
  return n.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2
  });
}

export async function generateReportPdf(reportData: ReportData, reportType: ReportType) {
  const { start, end, label } = getDateRange(reportType);
  
  // Filter both product and service transactions
  const productTransactions = reportData.transactions.filter(t => {
    const d = new Date(t.date);
    return d >= start && d <= end;
  });
  
  const serviceTransactions = reportData.serviceTransactions.filter(t => {
    const d = new Date(t.date);
    return d >= start && d <= end;
  });

  // Aggregate product metrics
  const productSales = productTransactions.reduce((s, t) => s + t.total, 0);
  const serviceSales = serviceTransactions.reduce((s, t) => s + t.total, 0);
  const totalSales = productSales + serviceSales;
  const totalTransactions = productTransactions.length + serviceTransactions.length;
  const avgSale = totalTransactions ? totalSales / totalTransactions : 0;

  // Payment breakdown for both
  const breakdown: Record<string, number> = {};
  productTransactions.forEach(t => {
    breakdown[t.paymentMethod] = (breakdown[t.paymentMethod] || 0) + t.total;
  });
  serviceTransactions.forEach(t => {
    breakdown[t.paymentMethod] = (breakdown[t.paymentMethod] || 0) + t.total;
  });

  // Per product totals
  const perProduct: Record<string, { name: string; units: number; revenue: number }> = {};
  productTransactions.forEach(t => {
    t.items.forEach(item => {
      const id = item.product.id;
      if (!perProduct[id]) perProduct[id] = {
        name: item.product.name,
        units: 0,
        revenue: 0
      };
      perProduct[id].units += item.quantity;
      perProduct[id].revenue += item.quantity * item.product.price;
    });
  });

  // Per service totals
  const perService: Record<string, { name: string; count: number; revenue: number }> = {};
  serviceTransactions.forEach(t => {
    t.items.forEach(item => {
      const id = item.service.id;
      if (!perService[id]) perService[id] = {
        name: item.service.name,
        count: 0,
        revenue: 0
      };
      perService[id].count += 1;
      perService[id].revenue += item.amountCharged;
    });
  });

  // Create PDF
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([595.28, 841.89]); // A4
  const { height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let y = height - 50;

  // Header
  page.drawText('NexusPOS — Sales Report', {
    x: 50,
    y,
    size: 18,
    font: bold,
    color: rgb(0, 0.5, 0.3)
  });
  y -= 24;
  page.drawText(reportType.toUpperCase() + ' REPORT', { x: 50, y, size: 12, font, color: rgb(0, 0, 0) });
  y -= 18;
  page.drawText(`Range: ${label}`, { x: 50, y, size: 10, font, color: rgb(0, 0, 0) });

  y -= 28;

  // Summary metrics
  page.drawText('Summary', { x: 50, y, size: 12, font: bold });
  y -= 16;
  page.drawText(`Total Sales: ${formatCurrency(totalSales)}`, { x: 60, y, size: 10, font });
  y -= 14;
  page.drawText(`Total Transactions: ${totalTransactions}`, { x: 60, y, size: 10, font });
  y -= 14;
  page.drawText(`Average Sale: ${formatCurrency(avgSale)}`, { x: 60, y, size: 10, font });

  y -= 22;

  // Payment breakdown
  page.drawText('Payment Breakdown', { x: 50, y, size: 12, font: bold });
  y -= 16;
  Object.entries(breakdown).forEach(([k, v]) => {
    page.drawText(`${k}: ${formatCurrency(v)}`, { x: 60, y, size: 10, font });
    y -= 14;
    if (y < 80) {
      page = pdfDoc.addPage([595.28, 841.89]);
      const h = page.getSize().height;
      y = h - 50;
    }
  });

  y -= 10;

  // Sales breakdown (products vs services)
  page.drawText('Sales Breakdown', { x: 50, y, size: 12, font: bold });
  y -= 16;
  page.drawText(`Product Sales: ${formatCurrency(productSales)}`, { x: 60, y, size: 10, font });
  y -= 14;
  page.drawText(`Service Sales: ${formatCurrency(serviceSales)}`, { x: 60, y, size: 10, font });
  y -= 14;

  y -= 10;

  // Per product totals
  page.drawText('Per-Product Totals', { x: 50, y, size: 12, font: bold });
  y -= 16;
  Object.values(perProduct).forEach(p => {
    const line = `${p.name} — ${p.units} units — ${formatCurrency(p.revenue)}`;
    page.drawText(line, { x: 60, y, size: 10, font });
    y -= 14;
    if (y < 80) {
      page = pdfDoc.addPage([595.28, 841.89]);
      const h = page.getSize().height;
      y = h - 50;
    }
  });

  y -= 10;

  // Per service totals
  page.drawText('Per-Service Totals', { x: 50, y, size: 12, font: bold });
  y -= 16;
  Object.values(perService).forEach(s => {
    const line = `${s.name} — ${s.count} transactions — ${formatCurrency(s.revenue)}`;
    page.drawText(line, { x: 60, y, size: 10, font });
    y -= 14;
    if (y < 80) {
      page = pdfDoc.addPage([595.28, 841.89]);
      const h = page.getSize().height;
      y = h - 50;
    }
  });

  y -= 10;

  // All transactions combined
  page.drawText('All Transactions', { x: 50, y, size: 12, font: bold });
  y -= 16;
  
  // Combine and sort transactions by date
  const allTransactions = [
    ...productTransactions.map(t => ({ ...t, type: 'product' as const })),
    ...serviceTransactions.map(t => ({ ...t, type: 'service' as const }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  allTransactions.forEach(t => {
    const d = new Date(t.date).toLocaleString();
    const typeLabel = t.type === 'service' ? '[SRV]' : '[PRD]';
    const line = `${typeLabel} ${t.id} — ${d} — ${formatCurrency(t.total)}`;
    page.drawText(line, { x: 60, y, size: 9, font });
    y -= 12;
    if (y < 60) {
      page = pdfDoc.addPage([595.28, 841.89]);
      const h = page.getSize().height;
      y = h - 50;
    }
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  return {
    blob,
    filename: `nexuspos_${reportType}_report_${new Date().toISOString().slice(0, 10)}.pdf`
  };
}
