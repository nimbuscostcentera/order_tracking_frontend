import jsPDF from "jspdf";
import moment from "moment";
import { autoTable } from "jspdf-autotable";
const GetReportPdf = (data) => {
  // Initialize jsPDF with autoTable
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  // Constants
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Set default font
  doc.setFont("helvetica");
  doc.setFontSize(12);

  // Add border
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2);

  // Add title
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("Item Wise Regular Order Report", pageWidth / 2, 30, {
    align: "center",
  });

  // Prepare data
  const tableData = data.map((item) => ({
    Orderno: item?.Orderno || "-",
    OrderDate: item?.OrderDate
      ? moment(item.OrderDate).format("DD/MM/YYYY")
      : "-",
    Itemcode: item?.Itemcode || "-",
    ArtisanCode: item?.ArtisanCode || "-",
    wt: item?.wt || "-",
  }));

  // Column configuration
  const columns = [
    { header: "Order No.", dataKey: "Orderno" },
    { header: "Order Date", dataKey: "OrderDate" },
    { header: "Product Code", dataKey: "Itemcode" },
    { header: "Karigar Code", dataKey: "ArtisanCode" },
    { header: "Weight", dataKey: "wt" },
  ];

  // AutoTable configuration
  const tableConfig = {
    startY: 40,
    margin: { top: 40, right: margin, bottom: margin, left: margin },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: "bold",
      halign: "center",
    },
    bodyStyles: {
      halign: "center",
      valign: "middle",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    columnStyles: {
      Orderno: { cellWidth: "auto" },
      OrderDate: { cellWidth: "auto" },
      Itemcode: { cellWidth: "auto" },
      ArtisanCode: { cellWidth: "auto" },
      wt: { cellWidth: "auto" },
    },
    styles: {
      fontSize: 10,
      cellPadding: 6,
      overflow: "linebreak",
    },
    didDrawPage: function (data) {
      // Footer on each page
      doc.setFontSize(8);
      doc.setTextColor(100);
      const pageCount = doc.internal.getNumberOfPages();
      doc.text(
        `Page ${data.pageNumber} of ${pageCount}`,
        pageWidth - margin - 20,
        pageHeight - margin + 10
      );
      doc.text(
        `Generated: ${moment().format("DD/MM/YYYY HH:mm")}`,
        margin + 10,
        pageHeight - margin + 10
      );
    },
  };

  // Generate the table
  autoTable(columns, tableData, tableConfig);

  // Save the PDF
  window.open(doc.output("bloburl"), "_blank");
};

export default GetReportPdf;
