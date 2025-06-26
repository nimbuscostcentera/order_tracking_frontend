import jsPDF from "jspdf";
import moment from "moment";
import { autoTable } from "jspdf-autotable";

const GetReportPdf = (data) => {
  // Initialize jsPDF with autoTable
  const doc = new jsPDF();

  // Page setup for A4
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  const ROWS_PER_PAGE = 30;

  // Set default font
  doc.setFont("helvetica");
  doc.setFontSize(12);

  // Add border
  doc.setDrawColor(0);
  doc.setLineWidth(0.3);
  doc.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2);

  // Add title
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Item Wise Regular Order Report", pageWidth / 2, 20, {
    align: "center",
  });

  // Main Items Table
  let startY = 18;
  let PrintableRows = data?.map((item) => {
    return {
      Orderno: item?.Orderno || "",
      OrderDate: moment(item?.OrderDate).format("DD/MM/YYYY") || "",
      Itemcode: item?.Itemcode || "",
      ArtisanCode: item?.ArtisanCode || "",
      wt: item?.wt || "",
    };
  });

  const tablecol = [
    { header: "Order No.", key: "Orderno" },
    { header: "Order Date", key: "OrderDate" },
    { header: "Product Code", key: "Itemcode" },
    { header: "Karigar Code", key: "ArtisanCode" },
    { header: "Weight", key: "wt" },
  ];

  let rowsPerPage = ROWS_PER_PAGE;
  for (let i = 0; i < PrintableRows.length; i += rowsPerPage) {
    if (i !== 0) {
      doc.addPage();
      doc.setDrawColor(0);
      doc.setLineWidth(0.3);
      doc.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2);
      startY = 5;
    }
    rowsPerPage = i == 0 ? ROWS_PER_PAGE : 35;

    autoTable(doc, {
      startY: startY + 10,
      tableWidth: pageWidth - margin * 2 - 4,
      head: [tablecol?.map((col) => col?.header)],
      body: PrintableRows?.slice(i, i + rowsPerPage).map((row) =>
        tablecol.map((col) => row[col?.key])
      ),
      theme: "grid",
      headStyles: {
        fillColor: [165, 165, 165],
        textColor: [0, 0, 0],
        halign: "center",
      },
      margin: { left: margin + 2, right: margin + 2 },
      styles: { fontSize: 10 },
      columnStyles: {
        0: { cellWidth: "auto", halign: "center" }, // Order No.
        1: { cellWidth: "auto", halign: "center" }, // Order Date
        2: { cellWidth: "auto", halign: "center" }, // Product Code
        3: { cellWidth: "auto", halign: "center" }, // Karigar Code
        4: { cellWidth: "auto", halign: "center" }, // Weight
      },
    });
  }

  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 25, pageHeight - 5);
    doc.text(
      `Generated: ${moment().format("DD/MM/YYYY HH:mm")}`,
      5,
      pageHeight - 5
    );
  }

  // Save the PDF
  window.open(doc.output("bloburl"), "_blank");
};


export default GetReportPdf;
