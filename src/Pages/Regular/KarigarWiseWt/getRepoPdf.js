import jsPDF from "jspdf";
import moment from "moment";
import { autoTable } from "jspdf-autotable";

// const GetReportPdf = (data) => {
//   const doc = new jsPDF({
//     orientation: "portrait",
//     unit: "pt",
//     format: [288, 1440], // 4 inches width (288pt) and 20 inches height (1440pt)
//   });

//   const pageWidth = doc.internal.pageSize.getWidth();
//   const pageHeight = doc.internal.pageSize.getHeight();

//   // Define table dimensions dynamically
//   const totalTableWidth = pageWidth - 40; // Account for 20pt margin on both sides
//   const leftMargin = 20; // Set left margin
//   const topMargin = 30;

//   // Define proportional widths for each column
//   const colWidths = [
//     totalTableWidth * 0.5, // 15% width for Order Date (smaller column)
//     totalTableWidth * 0.5, // 35% width for Order Number (larger column)
//   ];

//   // Add title
//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(8);
//   doc.text("Artisan wise Regular Order Report", pageWidth / 2, 20, {
//     align: "center",
//   });

//   // Set up table
//   doc.setFontSize(8);
//   const tableTop = topMargin;
//   let currentY = tableTop;

//   // Helper function to add cell and return its height
//   const addCell = (text, x, y, width, isHeader = false) => {
//     doc.setFont("helvetica", isHeader ? "bold" : "normal");

//     const fontSize = doc.internal.getFontSize();
//     const lineHeight = fontSize;
//     const textLines = doc.splitTextToSize(text, width - 4);
//     const lineCount = textLines.length;

//     const cellHeight = Math.max(lineCount * lineHeight + 6, 20); // Minimum height of 20

//     let yOffset = y + 3 + lineHeight / 2;

//     textLines.forEach((line) => {
//       doc.text(line, x + 2, yOffset, {
//         align: "left",
//         baseline: "middle",
//       });
//       yOffset += lineHeight;
//     });

//     return cellHeight;
//   };

//   // Draw header row
//   const headers = ["Artisan Code", "Total pending Weight"];
//   let currentX = leftMargin;
//   let maxHeaderHeight = 0;
//   headers.forEach((header, i) => {
//     const cellHeight = addCell(header, currentX, currentY, colWidths[i], true);
//     maxHeaderHeight = Math.max(maxHeaderHeight, cellHeight);
//     currentX += colWidths[i];
//   });

//   // Adjust header row to have uniform height
//   currentX = leftMargin;
//   headers.forEach((header, i) => {
//     doc.rect(currentX, currentY, colWidths[i], maxHeaderHeight);
//     currentX += colWidths[i];
//   });

//   // Move to data rows
//   currentY += maxHeaderHeight;
//   //console.log(data);
//   // Draw data rows for each item in the array
//   data.forEach((item) => {
//     currentX = leftMargin;
//     //console.log(item)
//     const values = [item?.code || "", item?.totwt || ""];

//     let maxDataHeight = 0;
//     values.forEach((value, i) => {
//       const cellHeight = addCell(value, currentX, currentY, colWidths[i]);
//       maxDataHeight = Math.max(maxDataHeight, cellHeight);
//       currentX += colWidths[i];
//     });

//     // Adjust data row to have uniform height
//     currentX = leftMargin;
//     values.forEach((value, i) => {
//       doc.rect(currentX, currentY, colWidths[i], maxDataHeight);
//       currentX += colWidths[i];
//     });

//     currentY += maxDataHeight;

//     // Add new page if the content exceeds the page height
//     if (currentY + maxDataHeight > pageHeight) {
//       doc.addPage();
//       currentY = topMargin;
//     }
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
  doc.text("Artisan wise Regular Order Report", pageWidth / 2, 20, {
    align: "center",
  });

  // Prepare data for table
  let PrintableRows = data?.map((item) => {
    return {
      code: item?.code || "",
      name: item?.name || "",
      totwt: item?.totwt || "",
    };
  });

  const tablecol = [
    { header: "Karigar Code", key: "code" },
    { header: "Karigar Name", key: "name" },
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
        0: { cellWidth: "30%", halign: "center" }, // Artisan Code
        1: { cellWidth: "40%", halign: "center" }, // Artisan name
        2: { cellWidth: "30%", halign: "center" }, // Total Pending Weight
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
