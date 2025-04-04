import PDFDocument from "pdfkit";
import { Buffer } from "buffer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

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

  doc.fontSize(20).fillColor("#a97d36").text("Proposta de Compra - House55", { align: "center" });
  doc.moveDown(2);

  doc.fontSize(12).fillColor("#000000");
  doc.text(`📍 Imóvel: ${imovel}`);
  doc.text(`🤝 Vendedor: ${vendedor}`);
  doc.text(`🧑‍💼 Comprador: ${comprador}`);
  doc.text(`💰 Valor da Proposta: R$ ${valor}`);
  doc.text(`💳 Forma de Pagamento: ${formaPagamento}`);
  if (observacoes) doc.text(`📝 Observações: ${observacoes}`);
  doc.moveDown(4);

  doc.text("__________________________", 70);
  doc.text("__________________________", 350);
  doc.text("Assinatura do Vendedor", 85, doc.y + 5);
  doc.text("Assinatura do Comprador", 365, doc.y + 5);

  doc.end();
}
