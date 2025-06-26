import jsPDF from "jspdf";
import moment from "moment";
import { autoTable } from "jspdf-autotable";

// const GetReportPdf = (data) => {
//   let itemData = data?.Detail || [];
//   let totalWt = itemData.reduce((accum, item) => accum + (item?.wt || 0), 0);

//   const doc = new jsPDF({
//     orientation: "portrait",
//     unit: "pt",
//     format: [288, 300],
//   });

//   const pageWidth = doc.internal.pageSize.getWidth();
//   const totalTableWidth = pageWidth - 40;
//   const leftMargin = 20;
//   const topMargin = 30;

//   const colWidths = [
//     totalTableWidth * 0.3,
//     totalTableWidth * 0.3,
//     totalTableWidth * 0.2,
//     totalTableWidth * 0.2,
//   ];

//   const secondTableColWidths = [
//     totalTableWidth * 0.3,
//     totalTableWidth * 0.5,
//     totalTableWidth * 0.2,
//   ];

//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(12);
//   doc.text("Regular Order Invoice", pageWidth / 2, 20, { align: "center" });
//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(8);
//   let currentY = topMargin;

//   const addCell = (text, x, y, width, isHeader = false) => {
//     doc.setFont("helvetica", isHeader ? "bold" : "normal");
//     const fontSize = doc.internal.getFontSize();
//     const lineHeight = fontSize;
//     const textLines = doc.splitTextToSize(text, width - 4);
//     const cellHeight = Math.max(textLines.length * lineHeight + 6, 20);
//     let yOffset = y + 3 + lineHeight / 2;
//     textLines.forEach((line) => {
//       doc.text(line, x + 6, yOffset, { align: "left", baseline: "middle" });
//       yOffset += lineHeight;
//     });
//     return cellHeight;
//   };

//   const headers = ["Order No","Order Date", "Karigar Code", "Purity"];
//   let currentX = leftMargin;
//   let maxHeaderHeight = 0;
//   headers.forEach((header, i) => {
//     const cellHeight = addCell(header, currentX, currentY, colWidths[i], true);
//     maxHeaderHeight = Math.max(maxHeaderHeight, cellHeight);
//     currentX += colWidths[i];
//   });

//   currentX = leftMargin;
//   headers.forEach((_, i) => {
//     doc.rect(currentX, currentY, colWidths[i], maxHeaderHeight);
//     currentX += colWidths[i];
//   });

//   currentY += maxHeaderHeight;
//   currentX = leftMargin;
//   const values = [
//     data.Orderno || "",
//     data.OrderDate || "",
//     data.ArtisanCode || "",
//     data.PURITY || "",
//   ];

//   let maxDataHeight = 0;
//   values.forEach((value, i) => {
//     const cellHeight = addCell(value, currentX, currentY, colWidths[i]);
//     maxDataHeight = Math.max(maxDataHeight, cellHeight);
//     currentX += colWidths[i];
//   });

//   currentX = leftMargin;
//   values.forEach((_, i) => {
//     doc.rect(currentX, currentY, colWidths[i], maxDataHeight);
//     currentX += colWidths[i];
//   });

//   currentY += maxDataHeight + 10;
//   const secondHeaders = ["Item Code", "Description", "Weight"];
//   currentX = leftMargin;
//   let maxSecondHeaderHeight = 0;
//   secondHeaders.forEach((header, i) => {
//     const cellHeight = addCell(
//       header,
//       currentX,
//       currentY,
//       secondTableColWidths[i],
//       true
//     );
//     maxSecondHeaderHeight = Math.max(maxSecondHeaderHeight, cellHeight);
//     currentX += secondTableColWidths[i];
//   });

//   currentX = leftMargin;
//   secondHeaders.forEach((_, i) => {
//     doc.rect(
//       currentX,
//       currentY,
//       secondTableColWidths[i],
//       maxSecondHeaderHeight
//     );
//     currentX += secondTableColWidths[i];
//   });

//   currentY += maxSecondHeaderHeight;
//   itemData.forEach((item) => {
//     currentX = leftMargin;
//     const itemValues = [
//       item.Itemcode || "",
//       item.DESCRIPTION || "",
//       (item.wt || 0).toFixed(3),
//     ];

//     let maxItemHeight = 0;
//     itemValues.forEach((value, i) => {
//       const cellHeight = addCell(
//         value,
//         currentX,
//         currentY,
//         secondTableColWidths[i]
//       );
//       maxItemHeight = Math.max(maxItemHeight, cellHeight);
//       currentX += secondTableColWidths[i];
//     });

//     currentX = leftMargin;
//     itemValues.forEach((_, i) => {
//       doc.rect(currentX, currentY, secondTableColWidths[i], maxItemHeight);
//       currentX += secondTableColWidths[i];
//     });

//     currentY += maxItemHeight;
//   });

//    currentX = leftMargin + secondTableColWidths[0] + 10;
//   let totalWeightRowHeight = addCell(
//     "Total Weight",
//     currentX,
//     currentY,
//     secondTableColWidths[1] - 10,
//     true
//   );
//   addCell(
//     totalWt.toFixed(2),
//     leftMargin + secondTableColWidths[0] + secondTableColWidths[1] ,
//     currentY,
//     secondTableColWidths[2],
//     true,
//     "right"
//   );
//   doc.rect(
//     currentX - 10,
//     currentY,
//     secondTableColWidths[1] + secondTableColWidths[2],
//     totalWeightRowHeight
//   );

//   currentY += totalWeightRowHeight;
//   window.open(doc.output("bloburl"), "_blank");
// };

const GetReportPdf = (data) => {
  const doc = new jsPDF();
  const margin = 10;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const usableWidth = pageWidth - margin * 2;

  // Add border
  doc.setDrawColor(0);
  doc.setLineWidth(0.3);
  doc.rect(margin, margin, usableWidth, pageHeight - margin * 2);

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Item Wise Regular Order Report", pageWidth / 2, margin + 10, {
    align: "center",
  });

  // Prepare data
  const tableColumn = [
    { header: "Order No.", dataKey: "Orderno" },
    { header: "Order Date", dataKey: "OrderDate" },
    { header: "Karigar Code", dataKey: "ArtisanCode" },
    { header: "Purity", dataKey: "PURITY" },
  ];

  const tableRows =
    data?.map((item) => ({
      Orderno: item?.Orderno || "",
      OrderDate: moment(item?.OrderDate).format("DD/MM/YYYY") || "",
      ArtisanCode: item?.ArtisanCode || "",
      PURITY: item?.PURITY || "",
    })) || [];
  let startY = margin + 15;
  // Draw Table
  autoTable(doc, {
    head: [tableColumn.map((col) => col.header)],
    body: tableRows.map((row) => tableColumn.map((col) => row[col.dataKey])),
    startY: startY,
    margin: { left: margin + 2, right: margin + 2 },
    tableWidth: usableWidth - 4,
    theme: "grid",
    headStyles: {
      fillColor: [165, 165, 165],
      textColor: [0, 0, 0],
      fontSize: 10,
    },
    styles: {
      fontSize: 9,
      halign: "center",
    },
  });
  startY = startY + tableRows.length * 15;
  const printableDetailTable = (data[0]?.Detail).map((item) => ({ ...item }));
  const detailTableColumn = [
    { header: "Item Code", dataKey: "Itemcode" },
    { header: "Description", dataKey: "DESCRIPTION" },
    { header: "Weight", dataKey: "wt" },
  ];
  let totwt = 0;
  printableDetailTable?.forEach((item) => {
    totwt += parseFloat(item?.wt);
  });
  // Draw Table
  autoTable(doc, {
    head: [detailTableColumn.map((col) => col.header)],
    body: printableDetailTable.map((row) =>
      detailTableColumn.map((col) => row[col.dataKey])
    ),
    startY: startY + 5,
    margin: { left: margin + 2, right: margin + 2 },
    tableWidth: usableWidth - 4,
    theme: "grid",
    headStyles: {
      fillColor: [165, 165, 165],
      textColor: [0, 0, 0],
      fontSize: 10,
    },
    styles: {
      fontSize: 9,
      halign: "center",
    },
  });
  startY = startY + printableDetailTable?.length * 14;
  autoTable(doc, {
    startY: startY,
    head: [],
    body: [["Total Weight", totwt.toFixed(3)]],
    theme: "grid",
    margin: { left: margin + 2, right: margin + 2 },
    styles: {
      fontSize: 10,
      halign: "center",
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 149, fontStyle: "bold" },
      1: { halign: "center", cellWidth: 37 },
    },
  });

  // Open PDF
  window.open(doc.output("bloburl"), "_blank");
};

export default GetReportPdf;
