(() => {
  if (window.__davKaysLocaleInitialized) return;
  window.__davKaysLocaleInitialized = true;
  const languages = {
    en: { name: "English", locale: "en-GB", greeting: ["Good morning. Welcome to DavKays.", "Good afternoon. Welcome to DavKays.", "Good evening. Welcome to DavKays."], label: "Greeting language", open: "Open now for calls and WhatsApp.", emailOnly: "Email only today. Calls and WhatsApp are closed.", closed: "Closed now. You can still send an email." },
    sn: { name: "ChiShona", locale: "en-ZW", greeting: ["Mangwanani. Tikugashirei kuDavKays.", "Masikati. Tikugashirei kuDavKays.", "Manheru. Tikugashirei kuDavKays."], label: "Mutauro wekukwazisa", open: "Ndakavhurika parizvino. Munogona kufona kana kushandisa WhatsApp.", emailOnly: "Nhasi ndinongowanikwa paemail. Mafoni neWhatsApp zvakavharwa.", closed: "Ndakavhara parizvino. Munogona kutumira email." },
    nd: { name: "isiNdebele", locale: "en-ZW", greeting: ["Luvhuka njani? Wamukelekile eDavKays.", "Litshone njani? Wamukelekile eDavKays.", "Sawubona. Wamukelekile eDavKays."], label: "Ulimi lokubingelela", open: "Ngiyatholakala khathesi kumafoni leWhatsApp.", emailOnly: "Lamuhla ngitholakala ngeemail kuphela. Amafoni leWhatsApp avaliweyo.", closed: "Ngivalile khathesi. Ungathumela iemail." },
    zh: { name: "中文（简体）", locale: "zh-CN", greeting: ["早上好。欢迎来到 DavKays。", "下午好。欢迎来到 DavKays。", "晚上好。欢迎来到 DavKays。"], label: "问候语言", open: "现在可以电话或 WhatsApp 联系。", emailOnly: "今天仅可通过电子邮件联系。电话和 WhatsApp 暂停。", closed: "目前已关闭。仍可发送电子邮件。" },
    "zh-hant": { name: "中文（繁體）", locale: "zh-TW", greeting: ["早安。歡迎來到 DavKays。", "午安。歡迎來到 DavKays。", "晚安。歡迎來到 DavKays。"], label: "問候語言", open: "現在可以電話或 WhatsApp 聯絡。", emailOnly: "今天僅可透過電子郵件聯絡。電話和 WhatsApp 暫停。", closed: "目前已關閉。仍可寄送電子郵件。" },
    fr: { name: "Français", locale: "fr-FR", greeting: ["Bonjour. Bienvenue chez DavKays.", "Bon après-midi. Bienvenue chez DavKays.", "Bonsoir. Bienvenue chez DavKays."], label: "Langue de salutation", open: "Ouvert pour les appels et WhatsApp.", emailOnly: "Courriel uniquement aujourd’hui. Les appels sont fermés.", closed: "Fermé actuellement. Vous pouvez envoyer un courriel." },
    pt: { name: "Português", locale: "pt-PT", greeting: ["Bom dia. Boas-vindas à DavKays.", "Boa tarde. Boas-vindas à DavKays.", "Boa noite. Boas-vindas à DavKays."], label: "Idioma da saudação", open: "Aberto para chamadas e WhatsApp.", emailOnly: "Hoje, apenas por email. Chamadas e WhatsApp estão fechados.", closed: "Fechado agora. Pode enviar um email." },
    es: { name: "Español", locale: "es-ES", greeting: ["Buenos días. DavKays te da la bienvenida.", "Buenas tardes. DavKays te da la bienvenida.", "Buenas noches. DavKays te da la bienvenida."], label: "Idioma del saludo", open: "Abierto para llamadas y WhatsApp.", emailOnly: "Hoy solo por correo. Las llamadas están cerradas.", closed: "Cerrado ahora. Puedes enviar un correo." },
    ar: { name: "العربية", locale: "ar", greeting: ["صباح الخير. مرحبًا بك في DavKays.", "مساء الخير. مرحبًا بك في DavKays.", "مساء الخير. مرحبًا بك في DavKays."], label: "لغة التحية", open: "مفتوح الآن للمكالمات وواتساب.", emailOnly: "اليوم التواصل عبر البريد الإلكتروني فقط. المكالمات مغلقة.", closed: "مغلق الآن. يمكنك إرسال بريد إلكتروني." },
    hi: { name: "हिन्दी", locale: "hi-IN", greeting: ["सुप्रभात। DavKays में आपका स्वागत है।", "नमस्कार। DavKays में आपका स्वागत है।", "शुभ संध्या। DavKays में आपका स्वागत है।"], label: "अभिवादन की भाषा", open: "अभी फ़ोन और WhatsApp के लिए उपलब्ध।", emailOnly: "आज केवल ईमेल उपलब्ध है। फ़ोन और WhatsApp बंद हैं।", closed: "अभी बंद है। आप ईमेल भेज सकते हैं।" },
    sw: { name: "Kiswahili", locale: "sw", greeting: ["Habari za asubuhi. Karibu DavKays.", "Habari za mchana. Karibu DavKays.", "Habari za jioni. Karibu DavKays."], label: "Lugha ya salamu", open: "Tuko wazi kwa simu na WhatsApp.", emailOnly: "Leo tunapatikana kwa barua pepe pekee. Simu zimefungwa.", closed: "Tumefungwa kwa sasa. Unaweza kutuma barua pepe." },
    ja: { name: "日本語", locale: "ja-JP", greeting: ["おはようございます。DavKaysへようこそ。", "こんにちは。DavKaysへようこそ。", "こんばんは。DavKaysへようこそ。"], label: "挨拶の言語", open: "現在、電話とWhatsAppで対応しています。", emailOnly: "本日はメールのみ対応しています。電話は休業です。", closed: "現在は営業時間外です。メールは送信できます。" },
    ko: { name: "한국어", locale: "ko-KR", greeting: ["좋은 아침입니다. DavKays에 오신 것을 환영합니다.", "안녕하세요. DavKays에 오신 것을 환영합니다.", "안녕하세요. DavKays에 오신 것을 환영합니다."], label: "인사말 언어", open: "현재 전화와 WhatsApp으로 연락할 수 있습니다.", emailOnly: "오늘은 이메일로만 연락할 수 있습니다. 전화는 운영하지 않습니다.", closed: "현재 운영 시간이 아닙니다. 이메일은 보낼 수 있습니다." },
    de: { name: "Deutsch", locale: "de-DE", greeting: ["Guten Morgen. Willkommen bei DavKays.", "Guten Tag. Willkommen bei DavKays.", "Guten Abend. Willkommen bei DavKays."], label: "Sprache der Begrüßung", open: "Jetzt für Anrufe und WhatsApp erreichbar.", emailOnly: "Heute nur per E-Mail erreichbar. Anrufe sind geschlossen.", closed: "Jetzt geschlossen. Sie können weiterhin eine E-Mail senden." },
    it: { name: "Italiano", locale: "it-IT", greeting: ["Buongiorno. Benvenuti a DavKays.", "Buon pomeriggio. Benvenuti a DavKays.", "Buonasera. Benvenuti a DavKays."], label: "Lingua del saluto", open: "Disponibile ora per chiamate e WhatsApp.", emailOnly: "Oggi solo via email. Le chiamate sono chiuse.", closed: "Chiuso al momento. Puoi inviare un'email." },
    ru: { name: "Русский", locale: "ru-RU", greeting: ["Доброе утро. Добро пожаловать в DavKays.", "Добрый день. Добро пожаловать в DavKays.", "Добрый вечер. Добро пожаловать в DavKays."], label: "Язык приветствия", open: "Сейчас можно позвонить или написать в WhatsApp.", emailOnly: "Сегодня доступна только электронная почта. Звонки закрыты.", closed: "Сейчас закрыто. Вы можете отправить электронное письмо." }
  };

  const codes = Object.keys(languages);
  const options = ["en", "sn", "nd", "zh", "zh-hant", "fr", "pt", "es", "ar", "hi", "sw", "ja", "ko", "de", "it", "ru"];
  const timeLabels = { en: "DavKays time in Harare", sn: "Nguva yeDavKays muHarare", nd: "Isikhathi seDavKays eHarare", zh: "DavKays 哈拉雷当地时间", "zh-hant": "DavKays 哈拉雷當地時間", fr: "Heure locale de DavKays à Harare", pt: "Hora local de DavKays em Harare", es: "Hora local de DavKays en Harare", ar: "التوقيت المحلي في هراري", hi: "हरारे में DavKays का स्थानीय समय", sw: "Saa ya DavKays Harare", ja: "ハラレのDavKays現地時刻", ko: "하라레 DavKays 현지 시간", de: "DavKays Ortszeit in Harare", it: "Ora locale DavKays a Harare", ru: "Местное время DavKays в Хараре" };
  function normalizeLanguage(value) {
    const tag = (value || "en").toLowerCase();
    if (tag.startsWith("zh-") && (tag.includes("hant") || tag.includes("tw") || tag.includes("hk"))) return "zh-hant";
    const code = tag.split("-")[0];
    return codes.includes(code) ? code : "en";
  }
  function browserLanguage() {
    for (const value of navigator.languages || [navigator.language || "en"]) {
      const language = normalizeLanguage(value);
      if (language !== "en" || value.toLowerCase().startsWith("en")) return language;
    }
    return "en";
  }
  let language = browserLanguage();
  try {
    const saved = localStorage.getItem("davkays-greeting-language");
    if (saved && codes.includes(saved)) language = saved;
  } catch (_) {}

  function dayPeriod(hour) {
    if (hour < 12) return 0;
    if (hour < 17) return 1;
    return 2;
  }
  function visitorHour() {
    return new Date().getHours();
  }
  function updateGreeting() {
    const greeting = document.querySelector("[data-time-greeting]");
    if (greeting) {
      greeting.textContent = languages[language].greeting[dayPeriod(visitorHour())];
      greeting.setAttribute("lang", language === "zh-hant" ? "zh-Hant" : language);
      greeting.setAttribute("dir", language === "ar" ? "rtl" : "auto");
    }
  }
  function businessStatus(now) {
    const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Harare", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(now);
    const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
    const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(values.weekday);
    const minutes = Number(values.hour) * 60 + Number(values.minute);
    if (day === 0) return "emailOnly";
    if (day >= 1 && day <= 5 && minutes >= 480 && minutes < 960) return "open";
    if (day === 6 && minutes >= 540 && minutes < 780) return "open";
    return "closed";
  }
  function businessCountdownText(now) {
    const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Harare", weekday: "short", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }).formatToParts(now);
    const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
    const dayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(values.weekday);
    const minuteOfDay = Number(values.hour) * 60 + Number(values.minute);
    const state = businessStatus(now);
    if (state === "emailOnly") return { label: "Business status", value: "Email only today", state };
    if (state !== "open") return { label: "Business status", value: "Closed now", state };
    const closeHour = dayIndex === 6 ? 13 : 16;
    const closeTime = Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day), closeHour - 2, 0, 0);
    const secondsLeft = Math.max(0, Math.ceil((closeTime - now.getTime()) / 1000));
    const hours = String(Math.floor(secondsLeft / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, "0");
    const seconds = String(secondsLeft % 60).padStart(2, "0");
    return { label: "Time until closing", value: `${hours}:${minutes}:${seconds}`, state };
  }
  function updateBusinessClock() {
    const clock = document.querySelector("[data-business-time]");
    const status = document.querySelector("[data-business-status]");
    const label = document.querySelector("[data-business-label]");
    if (!clock || !status || !label) return;
    const now = new Date();
    const details = languages[language];
    label.textContent = timeLabels[language] || timeLabels.en;
    clock.textContent = new Intl.DateTimeFormat(details.locale, { timeZone: "Africa/Harare", weekday: "long", hour: "numeric", minute: "2-digit", timeZoneName: "short" }).format(now);
    const state = businessStatus(now);
    if (status.dataset.state !== state) {
      status.textContent = details[state];
      status.dataset.state = state;
    }
  }
  function updateBusinessCountdown() {
    const badge = document.querySelector("[data-business-countdown]");
    if (!badge) return;
    const result = businessCountdownText(new Date());
    badge.dataset.state = result.state;
    badge.querySelector("[data-countdown-label]").textContent = result.label;
    badge.querySelector("[data-countdown-value]").textContent = result.value;
  }

  const nav = document.querySelector(".navlinks");
  if (nav) {
    const label = document.createElement("label");
    label.className = "locale-picker";
    label.append(document.createTextNode("Greeting "));
    const select = document.createElement("select");
    select.setAttribute("aria-label", languages[language].label);
    for (const code of options) {
      const option = document.createElement("option");
      option.value = code;
      option.textContent = languages[code].name;
      option.selected = code === language;
      option.lang = code === "zh-hant" ? "zh-Hant" : code;
      select.append(option);
    }
    select.addEventListener("change", () => {
      language = select.value;
      try { localStorage.setItem("davkays-greeting-language", language); } catch (_) {}
      select.setAttribute("aria-label", languages[language].label);
      updateGreeting();
      updateBusinessClock();
      document.dispatchEvent(new CustomEvent("davkays:languagechange", { detail: { language } }));
    });
    label.append(select);
    const cta = nav.querySelector(".nav-cta");
    nav.insertBefore(label, cta || null);
  }

  if (!document.querySelector("[data-business-countdown]")) {
    const countdown = document.createElement("div");
    countdown.className = "business-countdown";
    countdown.dataset.businessCountdown = "";
    countdown.setAttribute("role", "timer");
    countdown.setAttribute("aria-live", "off");
    countdown.innerHTML = '<span class="business-countdown-label" data-countdown-label></span><strong class="business-countdown-value" data-countdown-value></strong>';
    document.body.append(countdown);
  }

  window.DavKaysLocale = {
    get language() { return language; },
    greeting() { return languages[language].greeting[dayPeriod(visitorHour())]; },
    helperGreeting() { return languages[language].greeting[dayPeriod(visitorHour())]; }
  };
  updateGreeting();
  updateBusinessClock();
  updateBusinessCountdown();
  window.setInterval(() => { updateGreeting(); updateBusinessClock(); }, 30_000);
  window.setInterval(updateBusinessCountdown, 1_000);
})();
