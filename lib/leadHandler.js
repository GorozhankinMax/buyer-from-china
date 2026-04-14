function normalize(value) {
  return String(value ?? "").trim();
}

function escapeText(value) {
  return normalize(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function formatLine(label, value) {
  const normalized = normalize(value);
  return normalized ? `<b>${label}:</b> ${escapeText(normalized)}` : null;
}

function createMessage(payload) {
  if (payload.type === "estimate") {
    const budgetValue = normalize(payload.budget);
    const currencyLabel = normalize(payload.currency).toUpperCase();
    const budgetLine = budgetValue ? `${budgetValue}${currencyLabel ? ` ${currencyLabel}` : ""}` : "";

    const lines = [
      "<b>Новая заявка на расчет</b>",
      formatLine("Категория товара", payload.productCategory),
      formatLine("Вес", payload.weight),
      formatLine("Объем", payload.volume),
      formatLine("Стоимость партии", budgetLine),
      formatLine("Отправить расчет на", payload.contactForEstimate),
    ].filter(Boolean);

    return lines.join("\n");
  }

  const lines = [
    "<b>Новая заявка</b>",
    formatLine("Имя", payload.name),
    formatLine("Телефон", payload.phone),
    formatLine("Почта", payload.email),
    formatLine("Предпочтительный канал связи", payload.contactChannel),
  ].filter(Boolean);

  return lines.join("\n");
}

function validatePayload(payload) {
  if (normalize(payload.website)) {
    return { ok: true, spam: true };
  }

  if (payload.type === "estimate") {
    if (!normalize(payload.contactForEstimate)) {
      return { ok: false, error: "Укажите, куда отправить расчет." };
    }

    return { ok: true, spam: false };
  }

  if (!normalize(payload.phone) && !normalize(payload.email)) {
    return { ok: false, error: "Укажите телефон или почту." };
  }

  return { ok: true, spam: false };
}

export async function sendLeadToTelegram(payload, env) {
  const botToken = normalize(env.TELEGRAM_BOT_TOKEN || env.botToken);
  const chatId = normalize(env.TELEGRAM_CHAT_ID || env.chatId);

  if (!botToken || !chatId) {
    return {
      status: 500,
      body: { error: "Не настроены TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID." },
    };
  }

  const validation = validatePayload(payload);

  if (!validation.ok) {
    return {
      status: 400,
      body: { error: validation.error },
    };
  }

  if (validation.spam) {
    return {
      status: 200,
      body: { ok: true },
    };
  }

  const message = createMessage(payload);
  const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });

  const telegramData = await telegramResponse.json().catch(() => ({}));

  if (!telegramResponse.ok || !telegramData.ok) {
    return {
      status: 502,
      body: { error: "Telegram не принял сообщение." },
    };
  }

  return {
    status: 200,
    body: { ok: true },
  };
}

export async function readJsonBody(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks).toString("utf8");

  if (!rawBody) {
    return {};
  }

  return JSON.parse(rawBody);
}
