import jsPDF from "jspdf";
import moment from "moment";

const GetReportPdf = (data) => {
  console.log(data)
  // console.log(data); // array ascha 
  //  if (!Array.isArray(data) || data.length === 0) {
  //    console.error("Invalid or empty data provided to GetReportPdf");
  //    return;
  //  }

  let totalWt = data?.Detail?.reduce((accum,item)=>{
    return accum+item?.wt
  },0)

  console.log(totalWt)
  
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
    totalTableWidth * 0.33, // 15% width for Order Date (smaller column)
    totalTableWidth * 0.33, // 35% width for Order Number (larger column)
    totalTableWidth * 0.33, // 25% width for Artisan Code
  ];

  // Add title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("Regular Order Invoice", pageWidth / 2, 20, { align: "center" });

  // Set up table
  doc.setFontSize(8);
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
  const headers = [
    "Order No",
    "Order Date",
    "Weight",
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

  // Move to data rows
  currentY += maxHeaderHeight;

  // Draw data rows for each item in the array

  if (data) {
  
    currentX = leftMargin;
    const values = [
      data.Orderno || "",
      moment(data.OrderDate).format("DD/MM/YYYY") || "",
      totalWt.toFixed(3) || "",
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
  } else {
    console.log("No data available.");
  }
  

  // Open PDF in a new tab
  window.open(doc.output("bloburl"), "_blank");
};

export default GetReportPdf;
