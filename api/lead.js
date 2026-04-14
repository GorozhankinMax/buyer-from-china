import { readJsonBody, sendLeadToTelegram } from "../lib/leadHandler.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const payload = await readJsonBody(req);
    const result = await sendLeadToTelegram(payload, process.env);

    res.status(result.status).json(result.body);
  } catch {
    res.status(500).json({ error: "Не удалось обработать заявку." });
  }
}
