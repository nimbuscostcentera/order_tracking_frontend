import jsPDF from "jspdf";
import moment from "moment";
import { autoTable } from "jspdf-autotable";

// const GetReportPdf = (data) => {
//   const margin = 20; // Uniform margin on both sides
//   const colSpacing = 2; // Spacing inside cells
//   const minRowHeight = 20; // Minimum row height
//   const baseHeight = 100 * 2.83465; // Minimum A6 height in points (100mm)

//   // A6 width remains fixed
//   const a6Width = 105 * 2.83465; // 105mm in points
//   let contentHeight = 30; // Initial height for title & margin

//   // Create a temporary jsPDF instance to calculate content height
//   const tempDoc = new jsPDF({
//     orientation: "portrait",
//     unit: "pt",
//     format: [a6Width, baseHeight], // Temporary format
//   });

//   const availableWidth = a6Width - margin * 2;

//   // Define table column widths
//   const colWidths = [
//     availableWidth * 0.2, // Order Number
//     availableWidth * 0.2, // Order Date
//     availableWidth * 0.2, // Product Code
//     availableWidth * 0.2, // Karigar Code
//     availableWidth * 0.2, // Weight
//   ];

//   const headers = [
//     "Order Date",
//     "Order No",
//     "Party Code",
//     "Artisan Code",
//     "Item Code",
//   ];
//   let maxHeaderHeight = 0;

//   headers.forEach((header, i) => {
//     const textLines = tempDoc.splitTextToSize(
//       header,
//       colWidths[i] - colSpacing * 2
//     );
//     maxHeaderHeight = Math.max(maxHeaderHeight, textLines.length * 10 + 6);
//   });

//   contentHeight += maxHeaderHeight; // Add header height

//   // Calculate total data height
//   data.forEach((item) => {
//     let maxRowHeight = minRowHeight;
//     const values = [
//       moment(item?.OrderDate).format("DD/MM/YYYY") || "",
//       item?.Orderno || "",
//       item?.Party || "",
//       item?.ArtisanCode || "",
//       item?.itemcode || "",
//     ];

//     values.forEach((value, i) => {
//       const textLines = tempDoc.splitTextToSize(
//         value,
//         colWidths[i] - colSpacing * 2
//       );
//       maxRowHeight = Math.max(
//         maxRowHeight,
//         textLines.length * 10 + 6,
//         minRowHeight
//       );
//     });

//     contentHeight += maxRowHeight;
//   });

//   // Ensure minimum height and adjust dynamically
//   let adjustedHeight = Math.max(baseHeight, contentHeight + margin * 2);

//   // Create final jsPDF instance with adjusted height
//   const doc = new jsPDF({
//     orientation: "portrait",
//     unit: "pt",
//     format: [a6Width, adjustedHeight], // Adjusted height
//   });

//   const pageWidth = doc.internal.pageSize.getWidth();
//   const pageHeight = doc.internal.pageSize.getHeight();
//   const leftMargin = (pageWidth - colWidths.reduce((sum, w) => sum + w, 0)) / 2;
//   let currentY = 30; // Starting Y position for content

//   // Add title
//   doc.setFont("helvetica", "bold");
//     doc.setFontSize(10);
//   doc.text("Party Order Report", pageWidth / 2, 20, { align: "center" });

//   // Set up table
//     doc.setFont("helvetica", "normal");
//   doc.setFontSize(8);

//   // Draw headers
//   let currentX = leftMargin;
//   headers.forEach((header, i) => {
//     doc.rect(currentX, currentY, colWidths[i], maxHeaderHeight);
//     doc.text(header, currentX + 2, currentY + 10);
//     currentX += colWidths[i];
//   });

//   currentY += maxHeaderHeight;

//   // Draw data rows
//   data.forEach((item) => {
//     let maxRowHeight = minRowHeight;
//     const values = [
//       moment(item?.OrderDate).format("DD/MM/YYYY") || "",
//       item?.Orderno || "",
//       item?.Party || "",
//       item?.ArtisanCode || "",
//       item?.itemcode || "",
//     ];

//     values.forEach((value, i) => {
//       const textLines = doc.splitTextToSize(
//         value,
//         colWidths[i] - colSpacing * 2
//       );
//       maxRowHeight = Math.max(
//         maxRowHeight,
//         textLines.length * 10 + 6,
//         minRowHeight
//       );
//     });

//     currentX = leftMargin;
//     values.forEach((value, i) => {
//       doc.rect(currentX, currentY, colWidths[i], maxRowHeight);
//       doc.text(value, currentX + 2, currentY + 10);
//       currentX += colWidths[i];
//     });

//     currentY += maxRowHeight;
//   });

//   // Open PDF in a new tab
//   window.open(doc.output("bloburl"), "_blank");
// };
const GetReportPdf = (data) => {
  // Initialize jsPDF with A4 size
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
  doc.text("Party Order Report", pageWidth / 2, 20, { align: "center" });

  // Prepare data for table
  let PrintableRows = data?.map((item) => {
    return {
      OrderDate: moment(item?.OrderDate).format("DD/MM/YYYY") || "",
      Orderno: item?.Orderno || "",
      Party: item?.Party || "",
      ArtisanCode: item?.ArtisanCode || "",
      itemcode: item?.itemcode || "",
      wt: item?.wt || "",
    };
  });

  const tablecol = [
    { header: "Order Date", key: "OrderDate" },
    { header: "Order No", key: "Orderno" },
    { header: "Party Code", key: "Party" },
    { header: "Artisan Code", key: "ArtisanCode" },
    { header: "Item Code", key: "itemcode" },
    { header: "Weight", key: "wt" },
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
      },
      margin: { left: margin + 2, right: margin + 2 },
      styles: { fontSize: 10 ,halign: "center"  },
      columnStyles: {
        0: { cellWidth: "20%" }, // Order Date
        1: { cellWidth: "20%" }, // Order No
        2: { cellWidth: "20%" }, // Party Code
        3: { cellWidth: "20%" }, // Artisan Code
        4: { cellWidth: "20%" }, // Item Code
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