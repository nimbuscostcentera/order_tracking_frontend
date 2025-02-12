import jsPDF from "jspdf";
import moment from "moment";

const GetReportPdf = (data) => {
  console.log(data, "printdata");

  let itemData = data?.Detail;
  console.log(itemData, "itemdata");

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: [288, 1440],
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const totalTableWidth = pageWidth - 40;
  const leftMargin = 20;
  const topMargin = 30;

  const colWidths = [
    totalTableWidth * 0.4,
    totalTableWidth * 0.3,
    totalTableWidth * 0.3,
  ];

  const secondTableColWidths = [
    totalTableWidth * 0.3,
    totalTableWidth * 0.5,
    totalTableWidth * 0.2,
  ];

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6);
  doc.text("Party Order Invoice", pageWidth / 2, 20, { align: "center" });

  doc.setFontSize(6);
  const tableTop = topMargin;
  let currentY = tableTop;

  const addCell = (text, x, y, width, isHeader = false, align = "left") => {
    doc.setFont("helvetica", isHeader ? "bold" : "normal");
    const fontSize = doc.internal.getFontSize();
    const lineHeight = fontSize;
    const textLines = doc.splitTextToSize(text, width - 4);
    const lineCount = textLines.length;
    const cellHeight = Math.max(lineCount * lineHeight + 6, 20);
    let yOffset = y + 3 + lineHeight / 2;
    textLines.forEach((line) => {
      doc.text(line, x + 6, yOffset, { align, baseline: "middle" });
      yOffset += lineHeight;
    });
    return cellHeight;
  };

  const headers = ["OrderNo", "Karigar Code", "Purity"];
  let currentX = leftMargin;
  let maxHeaderHeight = 0;
  headers.forEach((header, i) => {
    const cellHeight = addCell(header, currentX, currentY, colWidths[i], true);
    maxHeaderHeight = Math.max(maxHeaderHeight, cellHeight);
    currentX += colWidths[i];
  });

  currentX = leftMargin;
  headers.forEach((header, i) => {
    doc.rect(currentX, currentY, colWidths[i], maxHeaderHeight);
    currentX += colWidths[i];
  });

  currentY += maxHeaderHeight;
  currentX = leftMargin;
  const values = [
    data.Orderno || "",
    data.ArtisanCode || "",
    data.PURITY || "",
  ];

  let maxDataHeight = 0;
  values.forEach((value, i) => {
    const cellHeight = addCell(value, currentX, currentY, colWidths[i]);
    maxDataHeight = Math.max(maxDataHeight, cellHeight);
    currentX += colWidths[i];
  });

  currentX = leftMargin;
  values.forEach((value, i) => {
    doc.rect(currentX, currentY, colWidths[i], maxDataHeight);
    currentX += colWidths[i];
  });

  currentY += maxDataHeight + 10;

  const secondHeaders = ["Item Code", "Description", "Weight"];
  currentX = leftMargin;
  let maxSecondHeaderHeight = 0;
  secondHeaders.forEach((header, i) => {
    const cellHeight = addCell(
      header,
      currentX,
      currentY,
      secondTableColWidths[i],
      true
    );
    maxSecondHeaderHeight = Math.max(maxSecondHeaderHeight, cellHeight);
    currentX += secondTableColWidths[i];
  });

  currentX = leftMargin;
  secondHeaders.forEach((header, i) => {
    doc.rect(
      currentX,
      currentY,
      secondTableColWidths[i],
      maxSecondHeaderHeight
    );
    currentX += secondTableColWidths[i];
  });

  currentY += maxSecondHeaderHeight;
  let totalWeight = 0;

  itemData.forEach((item) => {
    currentX = leftMargin;
    const rowValues = [
      item.itemcode || "",
      item.description || "",
      item.wt || "",
    ];

    let maxRowHeight = 0;
    rowValues.forEach((value, i) => {
      const cellHeight = addCell(
        value,
        currentX,
        currentY,
        secondTableColWidths[i]
      );
      maxRowHeight = Math.max(maxRowHeight, cellHeight);
      currentX += secondTableColWidths[i];
    });

    currentX = leftMargin;
    rowValues.forEach((value, i) => {
      doc.rect(currentX, currentY, secondTableColWidths[i], maxRowHeight);
      currentX += secondTableColWidths[i];
    });

    totalWeight += parseFloat(item.wt) || 0;
    currentY += maxRowHeight;
  });

  currentX = leftMargin + secondTableColWidths[0] + 10;
  let totalWeightRowHeight = addCell(
    " Total Weight",
    currentX,
    currentY,
    secondTableColWidths[1] - 10,
    true,
    "left"
  );
  addCell(
    totalWeight.toFixed(2),
    leftMargin + secondTableColWidths[0] + secondTableColWidths[1] + 15,
    currentY,
    secondTableColWidths[2],
    true,
    "right"
  );
  doc.rect(
    currentX - 10,
    currentY,
    secondTableColWidths[1] + secondTableColWidths[2],
    totalWeightRowHeight
  );

  currentY += totalWeightRowHeight;
  window.open(doc.output("bloburl"), "_blank");
};

export default GetReportPdf;
