import jsPDF from "jspdf";
import moment from "moment";

const generateChalanPDF = (data) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a6", // 4 inches width (288pt) and 20 inches height (1440pt)
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Define table dimensions
  const colWidths = [48, 48, 44, 58, 35, 45];
  const totalTableWidth = colWidths.reduce((sum, width) => sum + width, 0);
  const leftMargin = (pageWidth - totalTableWidth) / 2;
  const topMargin = 30;

  // Add title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("Customer Order Invoice ", pageWidth / 2, 20, { align: "center" });

  // Set up table
  doc.setFontSize(8);
  const tableTop = topMargin;
  let currentY = tableTop;

  // Helper function to add cell and return its height
  const addCell = (text, x, y, width, isHeader = false) => {
    doc.setFont("helvetica", isHeader ? "bold" : "normal");

    const fontSize = doc.internal.getFontSize();
    const lineHeight = fontSize ;
    const textLines = doc.splitTextToSize(text, width - 4);
    const lineCount = textLines.length;

    const cellHeight = Math.max(lineCount * lineHeight + 6, 20); // Minimum height of 20

    // doc.rect(x, y, width, cellHeight);

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
  const headers = [
    "Customer Code",
    "Order No",
    "Date",
    "Description",
    "Weight",
    "Delivery Date",
  ];
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

  // Move to data row
  currentY += maxHeaderHeight;

  // Draw data row
  currentX = leftMargin;
  const values = [
    data.CUSTCode || "",
    data.Orderno || "",
    moment(data.OrderDate).format("DD/MM/YYYY") || "",
    data.Desc || "",
    `${data.Wt || 0} g`,
    moment(data.DeliveryDate).format("DD/MM/YYYY") || "",
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

  // Open PDF in a new tab
  window.open(doc.output("bloburl"), "_blank");
};

export default generateChalanPDF;
