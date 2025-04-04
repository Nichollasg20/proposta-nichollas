
import PDFDocument from "pdfkit";
import { Buffer } from "buffer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Método não permitido");

  const { imovel, vendedor, comprador, valor, formaPagamento, observacoes } = req.body;

  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const buffers = [];
  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {
    const pdfData = Buffer.concat(buffers);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=proposta_house55.pdf");
    res.send(pdfData);
  });

  // Cabeçalho
  doc.fontSize(18).fillColor("#a97d36").text("HOUSE55 IMOBILIÁRIA", { align: "center" });
  doc.moveDown(1);
  doc.fontSize(14).fillColor("#000").text("Proposta de Compra de Imóvel", { align: "center", underline: true });
  doc.moveDown(2);

  // Corpo da proposta
  doc.fontSize(12);
  doc.text("Imóvel:", { continued: true }).font("Helvetica-Bold").text(` ${imovel}`);
  doc.font("Helvetica").text("Vendedor:", { continued: true }).font("Helvetica-Bold").text(` ${vendedor}`);
  doc.font("Helvetica").text("Comprador:", { continued: true }).font("Helvetica-Bold").text(` ${comprador}`);
  doc.font("Helvetica").text("Valor da Proposta:", { continued: true }).font("Helvetica-Bold").text(` R$ ${valor}`);
  doc.font("Helvetica").text("Forma de Pagamento:", { continued: true }).font("Helvetica-Bold").text(` ${formaPagamento}`);

  if (observacoes && observacoes.trim() !== "") {
    doc.moveDown();
    doc.font("Helvetica").text("Observações:");
    doc.font("Helvetica-Oblique").text(observacoes);
  }

  doc.moveDown(4);

  // Assinaturas
  doc.text("_________________________", 72, doc.y);
  doc.text("_________________________", 330, doc.y);
  doc.text("Assinatura do Vendedor", 95, doc.y + 5);
  doc.text("Assinatura do Comprador", 355, doc.y + 5);

  doc.end();
}
