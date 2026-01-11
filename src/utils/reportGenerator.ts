import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { Transaction } from '../types';

export type ReportType = 'daily' | 'weekly' | 'yearly';

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

export async function generateReportPdf(transactions: Transaction[], reportType: ReportType) {
  const { start, end, label } = getDateRange(reportType);
  const filtered = transactions.filter(t => {
    const d = new Date(t.date);
    return d >= start && d <= end;
  });

  // Aggregate metrics
  const totalSales = filtered.reduce((s, t) => s + t.total, 0);
  const totalTransactions = filtered.length;
  const totalTax = filtered.reduce((s, t) => s + t.tax, 0);
  const avgSale = totalTransactions ? totalSales / totalTransactions : 0;

  const breakdown: Record<string, number> = {};
  filtered.forEach(t => {
    breakdown[t.paymentMethod] = (breakdown[t.paymentMethod] || 0) + t.total;
  });

  const perProduct: Record<string, { name: string; units: number; revenue: number }> = {};
  filtered.forEach(t => {
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
  page.drawText(`Total Tax: ${formatCurrency(totalTax)}`, { x: 60, y, size: 10, font });
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

  // Transactions list (id, date, total)
  page.drawText('Transactions', { x: 50, y, size: 12, font: bold });
  y -= 16;
  filtered.forEach(t => {
    const d = new Date(t.date).toLocaleString();
    const line = `${t.id} — ${d} — ${formatCurrency(t.total)}`;
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
