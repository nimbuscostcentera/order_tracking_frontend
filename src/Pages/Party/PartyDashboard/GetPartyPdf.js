import jsPDF from "jspdf";
import moment from "moment";
import { autoTable } from "jspdf-autotable";
// const GetReportPdf = (data) => {
//   let itemData = data?.Detail;

//   const doc = new jsPDF({
//     orientation: "portrait",
//     unit: "pt",
//     format: [288,300],
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
//   doc.text("Party Order Invoice", pageWidth / 2, 20, { align: "center" });
//    doc.setFont("helvetica", "normal");
// doc.setFontSize(8);
//   let currentY = topMargin;

//   const addCell = (text, x, y, width, isHeader = false, align = "left") => {
//     doc.setFont("helvetica", isHeader ? "bold" : "normal");
//     const fontSize = doc.internal.getFontSize();
//     const lineHeight = fontSize;
//     const textLines = doc.splitTextToSize(text, width - 4);
//     const cellHeight = Math.max(textLines.length * lineHeight + 6, 20);
//     let yOffset = y + 3 + lineHeight / 2;
//     textLines.forEach((line) => {
//       doc.text(line, x + 6, yOffset, { align, baseline: "middle" });
//       yOffset += lineHeight;
//     });
//     return cellHeight;
//   };

//   const headers = ["Party Code", "OrderNo", "Karigar Code", "Purity"];
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
//     data.Party || "",
//     data.Orderno || "",
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
//   let totalWeight = 0;

//   itemData.forEach((item) => {
//     currentX = leftMargin;
//     const rowValues = [
//       item.itemcode || "",
//       item.description || "",
//       item.wt || "",
//     ];
//     let maxRowHeight = 0;
//     rowValues.forEach((value, i) => {
//       const cellHeight = addCell(
//         value,
//         currentX,
//         currentY,
//         secondTableColWidths[i]
//       );
//       maxRowHeight = Math.max(maxRowHeight, cellHeight);
//       currentX += secondTableColWidths[i];
//     });

//     currentX = leftMargin;
//     rowValues.forEach((_, i) => {
//       doc.rect(currentX, currentY, secondTableColWidths[i], maxRowHeight);
//       currentX += secondTableColWidths[i];
//     });

//     totalWeight += parseFloat(item.wt) || 0;
//     currentY += maxRowHeight;
//   });

//   currentX = leftMargin + secondTableColWidths[0] + 10;
//   let totalWeightRowHeight = addCell(
//     "Total Weight",
//     currentX,
//     currentY,
//     secondTableColWidths[1] - 10,
//     true
//   );
//   addCell(
//     totalWeight.toFixed(2),
//     leftMargin + secondTableColWidths[0] + secondTableColWidths[1] + 32,
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

  // Draw A4 Border
  doc.setDrawColor(0);
  doc.setLineWidth(0.3);
  doc.rect(margin, margin, usableWidth, pageHeight - margin * 2);

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Party Order Invoice", pageWidth / 2, margin + 15, {
    align: "center",
  });

  // Header Table (Top Summary Info)
  const headerTableColumn = [
    { header: "Party Code", dataKey: "Party" },
    { header: "Order No", dataKey: "Orderno" },
    { header: "Karigar Code", dataKey: "ArtisanCode" },
    { header: "Purity", dataKey: "PURITY" },
  ];

  const headerTableRows = [
    {
      Party: data[0]?.Party || "",
      Orderno: data[0]?.Orderno || "",
      ArtisanCode: data[0]?.ArtisanCode || "",
      PURITY: data[0]?.PURITY || "",
    },
  ];

  let startY = margin +12;

  autoTable(doc, {
    head: [headerTableColumn.map((col) => col.header)],
    body: headerTableRows.map((row) =>
      headerTableColumn.map((col) => row[col.dataKey])
    ),
    startY: startY + 10,
    margin: { left: margin + 2, right: margin + 2 },
    tableWidth: usableWidth - 4,
    theme: "grid",
    headStyles: {
      fillColor: [200, 200, 200],
      textColor: [0, 0, 0],
      fontSize: 10,
    },
    styles: {
      fontSize: 9,
      halign: "center",
    },
  });

  // Detail Table (Item-wise Info)
  const detailTableColumn = [
    { header: "Item Code", dataKey: "itemcode" },
    { header: "Description", dataKey: "description" },
    { header: "Weight", dataKey: "wt" },
  ];

  let detailTableRows =
    data[0]?.Detail?.map((item) => ({
      itemcode: item?.itemcode || "",
      description: item?.description || "",
      wt: item?.wt || "",
    })) || [];

  startY = startY + headerTableRows.length * 10 + 18;

  let totalWeight = 0;
  detailTableRows.forEach((row) => {
    totalWeight += parseFloat(row?.wt || 0);
  });
  //deatil
  autoTable(doc, {
    head: [detailTableColumn.map((col) => col.header)],
    body: detailTableRows.map((row) =>
      detailTableColumn.map((col) => row[col.dataKey])
    ),
    startY: startY + 5,
    margin: { left: margin + 2, right: margin + 2 },
    tableWidth: usableWidth - 4,
    theme: "grid",
    headStyles: {
      fillColor: [200, 200, 200],
      textColor: [0, 0, 0],
      fontSize: 10,
    },
    styles: {
      fontSize: 9,
      halign: "center",
    },
  });
  startY = startY + detailTableRows?.length * 10 + 3;
  // Total Weight Row
  autoTable(doc, {
    head: [],
    body: [["Total Weight", totalWeight.toFixed(3)]],
    theme: "grid",
    startY: startY + 5,
    margin: { left: margin + 2, right: margin + 2 },
    styles: {
      fontSize: 10,
      halign: "center",
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 143, fontStyle: "bold" },
      1: { halign: "center", cellWidth:43 },
    },
  });

  // Open PDF in new tab
  window.open(doc.output("bloburl"), "_blank");
};

export default GetReportPdf;
