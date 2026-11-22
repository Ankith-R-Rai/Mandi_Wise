export interface CsvExportRow {
  date: string;
  mandi: string;
  district: string;
  commodity: string;
  modalPrice: number;
  minPrice: number;
  maxPrice: number;
  unit: string;
  freshness: string;
}

export function exportHistoricalPricesToCsv(
  rows: CsvExportRow[],
  filename = 'mandiwise_price_trends.csv'
) {
  if (rows.length === 0) return;

  const headers = [
    'Observation Date',
    'APMC Mandi',
    'District',
    'Commodity',
    'Modal Price (INR)',
    'Min Price (INR)',
    'Max Price (INR)',
    'Unit',
    'Freshness Status',
  ];

  const csvContent = [
    headers.join(','),
    ...rows.map((r) =>
      [
        `"${r.date}"`,
        `"${r.mandi}"`,
        `"${r.district}"`,
        `"${r.commodity}"`,
        r.modalPrice,
        r.minPrice,
        r.maxPrice,
        `"${r.unit}"`,
        `"${r.freshness}"`,
      ].join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
