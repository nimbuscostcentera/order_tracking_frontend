
import { jsPDF } from "jspdf";
import {autoTable} from "jspdf-autotable";
import moment from "moment";

// const generateChalanPDF = (data) => {
//   console.log(data?.length);
//   // Initialize jsPDF with autoTable
//   const doc = new jsPDF();
  
//   // Page setup
//   const pageWidth = doc.internal.pageSize.getWidth();
//   const pageHeight = doc.internal.pageSize.getHeight();
//   const margin = 10;
//   const ROWS_PER_PAGE =35;

//   // Set default font
//   doc.setFont("helvetica");
//   doc.setFontSize(12);

//   // Add border
//   doc.setDrawColor(0);
//   doc.setLineWidth(0.3);
//   doc.rect(margin, margin, pageWidth - margin*2, pageHeight - margin*2);

//   doc.setTextColor(0, 0, 0);
//   doc.text("Customer Order Invoice", pageWidth / 2,15, { align: "center" });

//   // Main Items Table
//   let startY =20;
//   let PrintableRows = data?.map((item) => {
//     let odate = moment(item.OrderDate).format("DD/MM/YYYY");
//     let diff = moment().diff(moment(item.OrderDate), "days");
//     return {
//       Artisan: item?.Artisan || "",
//       CUSTCode: item.CUSTCode || "",
//       NAME: item.NAME || "",
//       SampleRcpVou: item.SampleRcpVou || "",
//       Desc: item.Desc || "",
//       OrderDate: odate || "",
//       Age: diff || "",
//     };
//   });
//   console.log(PrintableRows?.length,"Printable Lenght");
//   const tablecol = [
//     { header: "Artisan Code", key: "Artisan" },
//     { header: "Cust. Code", key: "CUSTCode" },
//     { header: "Cust Name", key: "NAME" },
//     { header: "Cust ref No.", key: "SampleRcpVou" },
//     { header: "Item Desc.", key: "Desc" },
//     { header: "Order Date", key: "OrderDate" },
//     { header: "Age", key: "Age" },
//   ];

//   let rowsPerPage = ROWS_PER_PAGE;

//   for (let i = 0; i < PrintableRows.length; i += rowsPerPage) {
//     if (i !== 0) {
//       doc.addPage();
//       doc.setDrawColor(0);
//       doc.setLineWidth(0.3);
//       doc.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2);
//       startY =5;
//     }
//     rowsPerPage = (i == 0 ? ROWS_PER_PAGE : 40);
//     autoTable(doc, {
//       startY: startY + 5,
//       tableWidth: pageWidth - margin * 2 - 4,
//       head: [tablecol?.map((col) => col?.header)],
//       body: PrintableRows?.slice(i, rowsPerPage + 1).map((row) =>
//         tablecol.map((col) => row[col?.key])
//       ),
//       theme: "grid",
//       headStyles: {
//         fillColor: [165, 165, 165],
//         textColor: [0, 0, 0],
//         halign: "center",
//         fontSize: 9,
//       },
//       columnStyles: {
//         4: { cellWidth:50},
//       },
//       margin: { left: margin + 2, right: margin + 2 },
//       styles: { fontSize: 8, halign: "center" },
//     });
//   }
//   // doc.text(data[0]?.ArtisanCode);

//   // Add footer
//   const pageCount = doc.internal.getNumberOfPages();
//   for (let i = 1; i <= pageCount; i++) {
//     doc.setPage(i);
//     doc.setFontSize(8);
//     doc.setTextColor(0, 0, 0);
//     doc.text(`Page ${i} of ${pageCount}`, pageWidth -25, pageHeight - 5);
//     doc.text(`Generated: ${moment().format("DD/MM/YYYY HH:mm")}`,5, pageHeight -5);
//   }

//   // Save the PDF
//   window.open(doc.output("bloburl"), "_blank");
//   // doc.save("customer_order_invoice.pdf");
// };


const generateChalanPDF = (data) => {
  // Initialize jsPDF with autoTable
  const doc = new jsPDF();
  console.log(data);
  // Page setup
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  const ROWS_PER_PAGE =30;

  // Set default font
  doc.setFont("helvetica");
  doc.setFontSize(12);

  // Add border
  doc.setDrawColor(0);
  doc.setLineWidth(0.3);
  doc.rect(margin, margin, pageWidth - margin*2, pageHeight - margin*2);

  doc.setTextColor(0, 0, 0);
  doc.text("Customer Order Invoice", pageWidth / 2, 20, { align: "center" });

  // Main Items Table
  let startY = 18;
  let PrintableRows = data?.map((item) => {
    let odate = moment(item.OrderDate).format("DD/MM/YYYY");
    let diff = moment().diff(moment(item.OrderDate), "days");
    return {
      Artisan: item?.Artisan || "",
      CUSTCode: item.CUSTCode || "",
      NAME: item.NAME || "",
      SampleRcpVou: item.SampleRcpVou || "",
      Desc: item.Desc || "",
      OrderDate: odate || "",
      Age: diff || "",
    };
  });

  const tablecol = [
    { header: "Artisan Code", key: "Artisan" },
    { header: "Cust. Code", key: "CUSTCode" },
    { header: "Cust Name", key: "NAME" },
    { header: "Cust ref No.", key: "SampleRcpVou" },
    { header: "Item Desc.", key: "Desc" },
    { header: "Order Date", key: "OrderDate" },
    { header: "Age", key: "Age" },
  ];

  // Fixed pagination logic
  let currentPage = 0;
  const totalRows = PrintableRows.length;
  
  while (currentPage * ROWS_PER_PAGE < totalRows) {
    if (currentPage > 0) {
      doc.addPage();
      doc.setDrawColor(0);
      doc.setLineWidth(0.3);
      doc.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2);
      startY = 5;
    }

    const startRow = currentPage * ROWS_PER_PAGE;
    const endRow = Math.min(startRow + ROWS_PER_PAGE, totalRows);
    const pageRows = PrintableRows.slice(startRow, endRow);

    autoTable(doc, {
      startY: startY + 10,
      tableWidth: pageWidth - margin * 2 - 4,
      head: [tablecol.map((col) => col.header)],
      body: pageRows.map((row) => tablecol.map((col) => row[col.key])),
      theme: "grid",
      headStyles: {
        fillColor: [165, 165, 165],
        textColor: [0, 0, 0],
        halign: "center",
        fontSize: 9,
      },
      columnStyles: {
        4: { cellWidth: 50 }, // Item Desc. column width
      },
      margin: { left: margin + 2, right: margin + 2 },
      styles: { 
        fontSize: 8, 
        halign: "center" 
      },
    });

    currentPage++;
  }

  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 25, pageHeight - 5);
    doc.text(`Generated: ${moment().format("DD/MM/YYYY HH:mm")}`, 5, pageHeight - 5);
  }

  // Save the PDF
  window.open(doc.output("bloburl"), "_blank");
};

export default generateChalanPDF;


