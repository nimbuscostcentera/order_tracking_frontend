import jsPDF from "jspdf";
import moment from "moment";
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
//     totalTableWidth * 0.20, // 15% width for Order Date (smaller column)
//     totalTableWidth * 0.20, // 35% width for Order Number (larger column)
//     totalTableWidth * 0.20, // 35% width for Order Number (larger column)
//     totalTableWidth * 0.20, // 25% width for Customer Code
//     totalTableWidth * 0.20, // 25% width for Artisan Code
//   ];

//   // Add title
//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(8);
//   doc.text("Item wise Regular Order Report", pageWidth / 2, 20, {
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
//   const headers = ["OrderNo.", "Order Date","Product Code","Karigar Code", "Weight"];
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

//   // Draw data rows for each item in the array
//   data.forEach((item) => {
//     currentX = leftMargin;
//     const values = [
//       item?.Orderno || "",
//       item?.OrderDate || "",
//       item?.Itemcode || "",
//       item?.ArtisanCode,
//       item?.wt || "",
//     ];

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
  const margin = 20; // Uniform margin on both sides
  const colSpacing = 2; // Spacing inside cells
  const minRowHeight = 20; // Minimum row height
 
  // A6 paper size in points (105mm x 148mm)
  const a6Width = 105 * 2.83465; // 105mm in points
  let a6Height = 100 * 2.83465; // 148mm in points (default)

  // Create a temporary jsPDF instance to calculate dynamic height
  let doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const availableWidth = pageWidth - margin * 2; // Adjust width with margins

  // Define proportional widths for each column
  const colWidths = [
    availableWidth * 0.2, // Order Number
    availableWidth * 0.2, // Order Date
    availableWidth * 0.2, // Product Code
    availableWidth * 0.2, // Karigar Code
    availableWidth * 0.2, // Weight
  ];

  // Calculate required page height dynamically
  let contentHeight = 30; // Initial height for title & margin
  let maxHeaderHeight = 0;

  // Measure header row height
  const headers = [
    "Order No.",
    "Order Date",
    "Product Code",
    "Karigar Code",
    "Weight",
  ];
  headers.forEach((header, i) => {
    const textLines = doc.splitTextToSize(
      header,
      colWidths[i] - colSpacing * 2
    );
    maxHeaderHeight = Math.max(maxHeaderHeight, textLines.length * 10 + 6);
  });
  contentHeight += maxHeaderHeight;

  // Measure each row height dynamically
  data.forEach((item) => {
    let maxRowHeight = 0;
    const values = [
      item?.Orderno || "",
      moment(item?.OrderDate).format("DD/MM/YYYY") || "",
      item?.Itemcode || "",
      item?.ArtisanCode || "",
      item?.wt || "",
    ];

    values.forEach((value, i) => {
      const textLines = doc.splitTextToSize(
        value,
        colWidths[i] - colSpacing * 2
      );
      maxRowHeight = Math.max(
        maxRowHeight,
        textLines.length * 10 + 6,
        minRowHeight
      );
    });

    contentHeight += maxRowHeight;
  });

  // Adjust page height dynamically based on content
  const dynamicHeight = Math.max(contentHeight + margin * 2, a6Height);
  doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: [a6Width, dynamicHeight], // A6 width, dynamically calculated height
  });

  // Add title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("Item Wise Regular Order Report", pageWidth / 2, 20, {
    align: "center",
  });

  // Draw table header
  doc.setFontSize(8);
  let currentY = 30; // Adjust for title spacing
  let currentX = margin;

  headers.forEach((header, i) => {
    doc.setFont("helvetica", "bold");
    const textLines = doc.splitTextToSize(
      header,
      colWidths[i] - colSpacing * 2
    );
    doc.text(textLines, currentX + colSpacing, currentY + 10);
    doc.rect(currentX, currentY, colWidths[i], maxHeaderHeight);
    currentX += colWidths[i];
  });

  currentY += maxHeaderHeight;

  // Draw table rows
  data.forEach((item) => {
    currentX = margin;
    let maxRowHeight = 0;
    const values = [
      item?.Orderno || "",
      moment(item?.OrderDate).format("DD/MM/YYYY") || "",
      item?.Itemcode || "",
      item?.ArtisanCode || "",
      item?.wt || "",
    ];

    values.forEach((value, i) => {
      doc.setFont("helvetica", "normal");
      const textLines = doc.splitTextToSize(
        value,
        colWidths[i] - colSpacing * 2
      );
      doc.text(textLines, currentX + colSpacing, currentY + 10);
      const cellHeight = Math.max(textLines.length * 10 + 6, minRowHeight);
      maxRowHeight = Math.max(maxRowHeight, cellHeight);
      currentX += colWidths[i];
    });

    // Draw row rectangles
    currentX = margin;
    values.forEach((value, i) => {
      doc.rect(currentX, currentY, colWidths[i], maxRowHeight);
      currentX += colWidths[i];
    });

    currentY += maxRowHeight;
  });

  // Open PDF in a new tab
  window.open(doc.output("bloburl"), "_blank");
};


export default GetReportPdf;
