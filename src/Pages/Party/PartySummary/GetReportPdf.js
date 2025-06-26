import jsPDF from "jspdf";
import moment from "moment";
import { autoTable } from "jspdf-autotable";

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

  // Prepare data for table (maintaining all original fields)
  let PrintableRows = data?.map((item) => {
    return {
      Orderno: item?.Orderno || "",
      OrderDate: moment(item?.OrderDate).format("DD/MM/YYYY") || "",
      PartyCode: item?.PartyCode || "",
      ArtisanCode: item?.ArtisanCode || "",
      totwt: String(item?.totwt) || "",
    };
  });

  // Define all original columns
  const tablecol = [
    { header: "Order No", key: "Orderno" },
    { header: "Order Date", key: "OrderDate" },
    { header: "Party Code", key: "PartyCode" },
    { header: "Artisan Code", key: "ArtisanCode" },
    { header: "Weight", key: "totwt" },
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
      styles: { fontSize: 10, halign: "center" },
      columnStyles: {
        0: { cellWidth: "20%" }, // Order No
        1: { cellWidth: "20%" }, // Order Date
        2: { cellWidth: "20%" }, // Party Code
        3: { cellWidth: "20%" }, // Artisan Code
        4: { cellWidth: "20%" }, // Weight
      },
      didDrawPage: (data) => {
        // Add footer on each page
        doc.setFontSize(8);
        doc.setTextColor(0, 0, 0);
        doc.text(`Page ${data.pageNumber}`, pageWidth - 25, pageHeight - 5);
        doc.text(
          `Generated: ${moment().format("DD/MM/YYYY HH:mm")}`,
          5,
          pageHeight - 5
        );
      },
    });
  }

  // Open PDF in new tab
  window.open(doc.output("bloburl"), "_blank");
};

export default GetReportPdf;