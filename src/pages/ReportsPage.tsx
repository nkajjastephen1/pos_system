import { useState, useEffect } from 'react';
import { BarChart } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Dialog } from '../components/ui/Dialog';
import { usePOS } from '../context/POSContext';
import { useServiceSales } from '../context/ServiceSalesContext';
import { ReportType, generateReportPdf, getDateRange } from '../utils/reportGenerator';

export function ReportsPage() {
  const { transactions } = usePOS();
  const { transactions: serviceTransactions } = useServiceSales();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentReport, setCurrentReport] = useState<ReportType | null>(null);
  const [rangeLabel, setRangeLabel] = useState<string>('');

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  const handleGenerate = async (type: ReportType) => {
    setLoading(true);
    setCurrentReport(type);
    const { label } = getDateRange(type);
    setRangeLabel(label);
    try {
      const { blob } = await generateReportPdf({ transactions, serviceTransactions }, type);
      const url = URL.createObjectURL(blob);
      setPdfBlob(blob);
      setPdfUrl(url);
      setIsPreviewOpen(true);
    } catch (e) {
      console.error(e);
      alert('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!pdfBlob || !currentReport) return;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(pdfBlob);
    link.download = `nexuspos_${currentReport}_report.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BarChart className="h-6 w-6 text-emerald-600" />
          <h1 className="text-2xl font-semibold">Reports</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Generate Reports</CardTitle>
            <p className="text-sm text-slate-500">Create and preview daily, weekly, and yearly sales reports as PDF.</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button onClick={() => handleGenerate('daily')} disabled={loading} className="w-full">Daily Report</Button>
              <Button onClick={() => handleGenerate('weekly')} disabled={loading} className="w-full">Weekly Report</Button>
              <Button onClick={() => handleGenerate('yearly')} disabled={loading} className="w-full">Yearly Report</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Last Transactions</CardTitle>
            <p className="text-sm text-slate-500">A quick view of recent transactions used to build reports.</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto max-h-64">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-slate-100 dark:border-slate-800">
                    <th className="py-2">Type</th>
                    <th>ID</th>
                    <th>Date</th>
                    <th className="text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ...transactions.slice(0, 25).map(t => ({ ...t, type: 'Product' as const })),
                    ...serviceTransactions.slice(0, 25).map(t => ({ ...t, type: 'Service' as const }))
                  ]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 50)
                    .map((t, idx) => (
                      <tr key={`${t.type}-${t.id}`} className="border-b last:border-b-0 border-slate-100 dark:border-slate-800">
                        <td className="py-2 text-xs">
                          <span className={`px-2 py-1 rounded ${t.type === 'Service' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'}`}>
                            {t.type}
                          </span>
                        </td>
                        <td className="text-xs">{t.id}</td>
                        <td className="text-xs">{new Date(t.date).toLocaleString()}</td>
                        <td className="text-xs text-right">{t.total.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} title={`Preview — ${currentReport?.toUpperCase() ?? ''} Report`} maxWidth="2xl">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">{rangeLabel}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleDownload}>Download PDF</Button>
              <Button variant="ghost" onClick={() => setIsPreviewOpen(false)}>Close</Button>
            </div>
          </div>

          <div className="w-full h-[600px] bg-slate-100 dark:bg-slate-800 rounded overflow-hidden">
            {pdfUrl ? <iframe title="report-preview" src={pdfUrl} className="w-full h-full" /> : <div className="p-6">No preview available.</div>}
          </div>
        </div>
      </Dialog>
    </div>
  );
}
