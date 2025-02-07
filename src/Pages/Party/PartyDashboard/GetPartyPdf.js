import jsPDF from "jspdf";
import moment from "moment";

const GetReportPdf = (data) => {
    console.log(data)
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: [288, 1440], // 4 inches width (288pt) and 20 inches height (1440pt)
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Define table dimensions dynamically
  const totalTableWidth = pageWidth - 40; // Account for 20pt margin on both sides
  const leftMargin = 20; // Set left margin
  const topMargin = 30;

  // Define proportional widths for each column
  const colWidths = [
    totalTableWidth * 0.20, // 15% width for Order Date (smaller column)
    totalTableWidth * 0.20, // 35% width for Order Number (larger column)
    totalTableWidth * 0.20, // 25% width for Customer Code
    totalTableWidth * 0.20, // 25% width for Artisan Code
    totalTableWidth * 0.20, // 25% width for Artisan Code
  ];

  // Add title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6);
  doc.text("Party Order Invoice", pageWidth / 2, 20, { align: "center" });

  // Set up table
  doc.setFontSize(6);
  const tableTop = topMargin;
  let currentY = tableTop;

  // Helper function to add cell and return its height
  const addCell = (text, x, y, width, isHeader = false) => {
    doc.setFont("helvetica", isHeader ? "bold" : "normal");

    const fontSize = doc.internal.getFontSize();
    const lineHeight = fontSize;
    const textLines = doc.splitTextToSize(text, width - 4);
    const lineCount = textLines.length;

    const cellHeight = Math.max(lineCount * lineHeight + 6, 20); // Minimum height of 20

    let yOffset = y + 3 + lineHeight / 2;

    textLines.forEach((line) => {
      doc.text(line, x + 2, yOffset, {
        align: "left",
        baseline: "middle",
      });
      yOffset += lineHeight;
    });

    return cellHeight;
  };

  // Draw header row
  const headers = ["OrderDate", "OrderNo", "Party Code", "DeliveryDate","Total Wt."];
  let currentX = leftMargin;
  let maxHeaderHeight = 0;
  headers.forEach((header, i) => {
    const cellHeight = addCell(header, currentX, currentY, colWidths[i], true);
    maxHeaderHeight = Math.max(maxHeaderHeight, cellHeight);
    currentX += colWidths[i];
  });

  // Adjust header row to have uniform height
  currentX = leftMargin;
  headers.forEach((header, i) => {
    doc.rect(currentX, currentY, colWidths[i], maxHeaderHeight);
    currentX += colWidths[i];
  });

  // Move to data rows
  currentY += maxHeaderHeight;

  // Draw data rows for each item in the array
//   console.log(data)
currentX = leftMargin;
const values = [
  data.OrderDate || "",
  data.Orderno || "",
  data.Party || "",
  data.Deliverydate || "",
  data.weight || ""
];

let maxDataHeight = 0;
values.forEach((value, i) => {
  const cellHeight = addCell(value, currentX, currentY, colWidths[i]);
  maxDataHeight = Math.max(maxDataHeight, cellHeight);
  currentX += colWidths[i];
});

// Adjust data row to have uniform height
currentX = leftMargin;
values.forEach((value, i) => {
  doc.rect(currentX, currentY, colWidths[i], maxDataHeight);
  currentX += colWidths[i];
});

currentY += maxDataHeight;

// Add new page if the content exceeds the page height
if (currentY + maxDataHeight > pageHeight) {
  doc.addPage();
  currentY = topMargin;
}


  // Open PDF in a new tab
  window.open(doc.output("bloburl"), "_blank");
};

export default GetReportPdf;