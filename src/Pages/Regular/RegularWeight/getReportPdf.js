import jsPDF from "jspdf";
import moment from "moment";
import {autoTable} from "jspdf-autotable";
const GetReportPdf = (data) => {
  // Initialize jsPDF
  const doc = new jsPDF();

  // A4 page setup
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
  doc.text("Item wise Regular Order Report", pageWidth / 2, 20, {
    align: "center",
  });

  // Prepare data for table
  let PrintableRows = data?.map((item) => {
    return {
      Itemcode: item?.Itemcode || "",
      totwt: item?.totwt || "",
    };
  });

  const tablecol = [
    { header: "Product Code", key: "Itemcode" },
    { header: "Total Pending Weight", key: "totwt" },
  ];

  // Generate table with autoTable
  let startY = 18;
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
        0: { cellWidth: "50%", halign: "center" }, // Product Code
        1: { cellWidth: "50%", halign: "center" }, // Total Pending Weight
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

  // Open PDF in new tab
  window.open(doc.output("bloburl"), "_blank");
};


export default GetReportPdf;
