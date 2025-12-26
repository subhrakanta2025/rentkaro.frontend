import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

interface ExportColumn {
  header: string;
  key: string;
  format?: (value: any) => string;
}

// CSV Export
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  columns: ExportColumn[],
  filename: string
) {
  if (data.length === 0) {
    return;
  }

  const headers = columns.map(col => col.header);
  const rows = data.map(item =>
    columns.map(col => {
      const value = item[col.key];
      return col.format ? col.format(value) : String(value ?? '');
    })
  );

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${format(new Date(), 'yyyy-MM-dd')}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

// PDF Export
export function exportToPDF<T extends Record<string, any>>(
  data: T[],
  columns: ExportColumn[],
  filename: string,
  title: string
) {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(18);
  doc.setTextColor(40);
  doc.text(title, 14, 22);
  
  // Generated date
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 14, 30);

  // Table
  const headers = columns.map(col => col.header);
  const rows = data.map(item =>
    columns.map(col => {
      const value = item[col.key];
      return col.format ? col.format(value) : String(value ?? '');
    })
  );

  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 40,
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });

  doc.save(`${filename}_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
}

// Booking export configurations
export const bookingColumns: ExportColumn[] = [
  { header: 'Customer Name', key: 'customer_name' },
  { header: 'Phone', key: 'customer_phone' },
  { header: 'Email', key: 'customer_email' },
  { header: 'Start Date', key: 'start_date', format: (v) => format(new Date(v), 'MMM dd, yyyy') },
  { header: 'End Date', key: 'end_date', format: (v) => format(new Date(v), 'MMM dd, yyyy') },
  { header: 'Amount', key: 'total_amount', format: (v) => `₹${Number(v).toLocaleString()}` },
  { header: 'Status', key: 'status', format: (v) => v?.charAt(0).toUpperCase() + v?.slice(1) },
  { header: 'Payment', key: 'payment_status', format: (v) => v?.charAt(0).toUpperCase() + v?.slice(1) },
];

// Transaction export configurations
export const transactionColumns: ExportColumn[] = [
  { header: 'Transaction ID', key: 'transaction_id', format: (v) => v || 'N/A' },
  { header: 'Amount', key: 'amount', format: (v) => `₹${Number(v).toLocaleString()}` },
  { header: 'Payment Method', key: 'payment_method', format: (v) => v || 'N/A' },
  { header: 'Status', key: 'status', format: (v) => v?.charAt(0).toUpperCase() + v?.slice(1) },
  { header: 'Date', key: 'created_at', format: (v) => format(new Date(v), 'MMM dd, yyyy HH:mm') },
];

// Analytics summary export
export function exportAnalyticsPDF(
  bookings: any[],
  transactions: any[],
  vehicles: any[],
  agencyName: string
) {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.setTextColor(40);
  doc.text('Analytics Report', 14, 22);
  
  // Agency name and date
  doc.setFontSize(12);
  doc.setTextColor(80);
  doc.text(agencyName, 14, 32);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated: ${format(new Date(), 'PPP')}`, 14, 40);

  let yPos = 55;

  // Summary Statistics
  doc.setFontSize(14);
  doc.setTextColor(40);
  doc.text('Summary Statistics', 14, yPos);
  yPos += 10;

  const totalRevenue = transactions
    .filter(t => t.status === 'success')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'completed').length;
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;

  const stats = [
    ['Total Vehicles', vehicles.length.toString()],
    ['Total Bookings', totalBookings.toString()],
    ['Confirmed/Completed', confirmedBookings.toString()],
    ['Cancelled', cancelledBookings.toString()],
    ['Total Revenue', `₹${totalRevenue.toLocaleString()}`],
  ];

  autoTable(doc, {
    body: stats,
    startY: yPos,
    theme: 'plain',
    styles: { fontSize: 11 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 60 },
      1: { cellWidth: 60 },
    },
  });

  yPos = (doc as any).lastAutoTable.finalY + 15;

  // Vehicle Performance
  doc.setFontSize(14);
  doc.setTextColor(40);
  doc.text('Vehicle Performance', 14, yPos);
  yPos += 10;

  const vehicleBookings: Record<string, number> = {};
  bookings.forEach(booking => {
    if (booking.status !== 'cancelled') {
      vehicleBookings[booking.vehicle_id] = (vehicleBookings[booking.vehicle_id] || 0) + 1;
    }
  });

  const vehiclePerformance = Object.entries(vehicleBookings)
    .map(([vehicleId, count]) => {
      const vehicle = vehicles.find(v => v.id === vehicleId);
      return [vehicle?.name || 'Unknown', count.toString()];
    })
    .sort((a, b) => Number(b[1]) - Number(a[1]))
    .slice(0, 10);

  if (vehiclePerformance.length > 0) {
    autoTable(doc, {
      head: [['Vehicle', 'Bookings']],
      body: vehiclePerformance,
      startY: yPos,
      styles: { fontSize: 10 },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
      },
    });
  }

  doc.save(`analytics_report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
}
