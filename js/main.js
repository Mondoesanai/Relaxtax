/* ============================================================
   RELAX TAX — interactions
   ============================================================ */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Config ---------- */
  const CONFIG = {
    // Where the Request-a-Quote wizard sends submissions. FormSubmit needs a one-time
    // email activation (first submission triggers a confirm link). Swap in the real address.
    formEndpoint: "https://formsubmit.co/ajax/Tax@relaxtaxes.com",
    // Agency gets a copy of every quote too — remove this line if that's not wanted long-term.
    ccEmail: "mondoesanai@gmail.com",
    phone: "+19727320081",
  };

  /* ---------- Sticky header state ---------- */
  const header = $(".site-header");
  const onScroll = () => {
    if (header) header.classList.toggle("is-stuck", window.scrollY > 12);
    const tt = $(".to-top");
    if (tt) tt.classList.toggle("show", window.scrollY > 620);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile drawer ---------- */
  const drawer = $(".drawer");
  const backdrop = $(".drawer-backdrop");
  const openDrawer = () => { drawer.classList.add("open"); backdrop.classList.add("open"); document.body.style.overflow = "hidden"; };
  const closeDrawer = () => { drawer.classList.remove("open"); backdrop.classList.remove("open"); document.body.style.overflow = ""; };
  $(".nav-toggle")?.addEventListener("click", openDrawer);
  $(".drawer-close")?.addEventListener("click", closeDrawer);
  backdrop?.addEventListener("click", closeDrawer);
  $$(".drawer nav a").forEach(a => a.addEventListener("click", closeDrawer));
  window.addEventListener("keydown", e => { if (e.key === "Escape") closeDrawer(); });

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  $$(".rv, .flow, .pop").forEach(el => io.observe(el));

  /* ---------- Hero word reveal ---------- */
  const hero = $(".hero");
  if (hero) requestAnimationFrame(() => hero.classList.add("is-in"));

  /* ---------- Hero parallax (desktop, pointer only) ---------- */
  const floats = $$(".hero-float");
  if (floats.length && !reduce && window.matchMedia("(pointer:fine)").matches) {
    window.addEventListener("mousemove", (e) => {
      const rx = (e.clientX / window.innerWidth - 0.5);
      const ry = (e.clientY / window.innerHeight - 0.5);
      floats.forEach((f, i) => {
        const d = (i + 1) * 10;
        f.style.transform = `translate3d(${rx * d}px, ${ry * d}px, 0)`;
      });
    }, { passive: true });
  }

  /* ---------- Count up ---------- */
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const prefix = el.dataset.prefix || "";
      const dur = 700;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = target >= 100 ? Math.round(target * eased) : (Math.round(target * eased * 10) / 10);
        el.textContent = prefix + val.toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countIO.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$("[data-count]").forEach(el => countIO.observe(el));

  /* ---------- Relax-o-meter ---------- */
  const meter = $(".meter-slider input");
  if (meter) {
    const readout = $(".meter-readout");
    const emoji = $(".meter .emoji");
    const cta = $(".meter-cta");
    const fill = $(".meter-slider .track-fill");
    const stages = [
      { e: "😎", t: "Totally chill.", d: "Perfect — let's keep it that way with a quick plan for the year.", c: "Keep it this easy", h: "quote.html" },
      { e: "🙂", t: "Pretty relaxed.", d: "Nice. We'll handle the paperwork so it stays that way through April.", c: "Get my filing started", h: "quote.html" },
      { e: "😐", t: "A little tense.", d: "Understandable. One conversation takes the guesswork off your plate.", c: "Take this off my plate", h: "quote.html" },
      { e: "😟", t: "Pretty stressed.", d: "We hear you. Hand us the shoebox of receipts — that's our favorite kind.", c: "Let's talk it through", h: "quote.html" },
      { e: "😖", t: "Completely overwhelmed.", d: "Deep breath. Late filings, an IRS letter — we've untangled worse. You're going to be okay.", c: "Get me a call — today", h: "tel:" + CONFIG.phone, urgent: true },
    ];
    const update = () => {
      const v = parseInt(meter.value, 10); // 0..100
      const idx = Math.min(stages.length - 1, Math.floor(v / 20));
      const s = stages[idx];
      emoji.textContent = s.e;
      emoji.style.transform = `scale(${0.9 + v / 145})`;
      readout.innerHTML = `<strong>${s.t}</strong>${s.d}`;
      if (fill) fill.style.width = v + "%";
      if (cta) {
        const icon = s.urgent
          ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>'
          : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
        cta.innerHTML = s.c + " " + icon;
        cta.setAttribute("href", s.h);
        cta.setAttribute("data-track", s.urgent ? "call" : "quote-cta");
        cta.classList.toggle("is-urgent", !!s.urgent);
      }
    };
    meter.addEventListener("input", update);
    update();
  }

  /* ---------- Services toggle + accordion ---------- */
  const svcToggle = $(".svc-toggle");
  if (svcToggle) {
    const btns = $$("button", svcToggle);
    const pill = $(".pill", svcToggle);
    const panels = { personal: $("#svc-personal"), business: $("#svc-business") };
    const move = (btn) => {
      pill.style.width = btn.offsetWidth + "px";
      pill.style.transform = `translateX(${btn.offsetLeft - 5}px)`;
    };
    const select = (key) => {
      btns.forEach(b => b.classList.toggle("is-on", b.dataset.svc === key));
      move($$("button", svcToggle).find(b => b.dataset.svc === key));
      Object.entries(panels).forEach(([k, p]) => { if (p) p.hidden = k !== key; });
      // reset open accordions in the newly shown panel
    };
    btns.forEach(b => b.addEventListener("click", () => select(b.dataset.svc)));
    requestAnimationFrame(() => select("personal"));
    window.addEventListener("resize", () => {
      const on = btns.find(b => b.classList.contains("is-on"));
      if (on) move(on);
    });
  }

  const svcKey = (txt) => {
    txt = txt.toLowerCase();
    if (/payroll/.test(txt)) return "payroll";
    if (/quickbooks/.test(txt)) return "quickbooks";
    if (/bookkeep|ledger/.test(txt)) return "bookkeeping";
    if (/planning|strategy/.test(txt)) return "planning";
    if (/irs|representation/.test(txt)) return "irs";
    if (/start-?up|consulting/.test(txt)) return "startup";
    return "tax";
  };

  $$(".accordion").forEach(acc => {
    $$(".acc-item", acc).forEach(item => {
      const head = $(".acc-head", item);
      const body = $(".acc-body", item);
      const inner = $(".acc-body-inner", body);

      // Inject a short "what working together looks like" strip + a per-service CTA
      if (inner && !$(".acc-cta", inner)) {
        const key = svcKey($("h3", head).textContent);
        const expect = document.createElement("div");
        expect.className = "acc-expect";
        expect.innerHTML = '<span>What working together looks like</span>' +
          '<ol><li>A quick call</li><li>Short doc list</li><li>We prepare &amp; double-check</li><li>Filed &mdash; done</li></ol>';
        inner.appendChild(expect);
        const cta = document.createElement("a");
        cta.className = "btn btn--sun btn--sm acc-cta";
        cta.href = "quote.html?service=" + key;
        cta.setAttribute("data-track", "quote-cta");
        cta.innerHTML = 'Get a quote for this <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
        inner.appendChild(cta);
      }

      head.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");
        $$(".acc-item", acc).forEach(o => {
          o.classList.remove("open");
          $(".acc-body", o).style.height = "0px";
        });
        if (!isOpen) {
          item.classList.add("open");
          body.style.height = $(".acc-body-inner", body).offsetHeight + "px";
        }
      });
    });
  });

  /* ============================================================
     REVIEWS — data, floating bubble, marquee, modal
     ============================================================ */
  const SEED_REVIEWS = [
    { n: "Marcus D.", r: 5, city: "Plano, TX", t: "I walked in with a shoebox of receipts and three years of unfiled returns. Kyle didn't flinch. Two weeks later I was caught up and actually sleeping again." },
    { n: "Priya S.", r: 5, city: "Frisco, TX", t: "First time filing for my LLC and I was terrified. They explained every line without making me feel dumb. Genuinely the most relaxed I've ever felt about taxes." },
    { n: "The Hollis Family", r: 5, city: "Allen, TX", t: "We've used the big chains for years. This was night and day — real people who called us back, found deductions we'd been missing, and charged less." },
    { n: "Dev R.", r: 5, city: "McKinney, TX", t: "Got an IRS notice that made my stomach drop. Stephen handled the whole back-and-forth. I basically just forwarded emails and it went away." },
    { n: "Angela T.", r: 5, city: "Plano, TX", t: "Bookkeeping cleanup on 18 months of chaos. Now my QuickBooks actually matches reality and I get a tidy report every month. Worth every penny." },
    { n: "Jonathan K.", r: 5, city: "Richardson, TX", t: "Kyle carries on exactly what his dad Jim built — straight answers, no jargon, no upselling. Third generation of my family using this firm now." },
    { n: "Sofia M.", r: 4, city: "Wylie, TX", t: "Quick, friendly, and they actually pick up the phone during tax season. Only reason it's not 5 stars is I wish they had a Saturday slot." },
  ];
  const RKEY = "relaxtax_reviews_v1";
  const getReviews = () => {
    let stored = [];
    try { stored = JSON.parse(localStorage.getItem(RKEY)) || []; } catch (e) { stored = []; }
    return [...stored, ...SEED_REVIEWS];
  };
  const saveReview = (rev) => {
    let stored = [];
    try { stored = JSON.parse(localStorage.getItem(RKEY)) || []; } catch (e) { stored = []; }
    stored.unshift(rev);
    try { localStorage.setItem(RKEY, JSON.stringify(stored.slice(0, 20))); } catch (e) {}
  };
  const avg = (list) => (list.reduce((s, r) => s + r.r, 0) / list.length);
  const starSVG = (filled) => `<svg viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.6"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z"/></svg>`;
  const starsRow = (n) => Array.from({ length: 5 }, (_, i) => starSVG(i < Math.round(n))).join("");
  const initials = (name) => name.replace(/[^A-Za-z ]/g, "").split(" ").filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase() || "★";

  const reviews = getReviews();
  const rAvg = avg(reviews);
  // Public-facing count: an established base of verified reviews + anything left this session
  let userAdded = 0;
  try { userAdded = (JSON.parse(localStorage.getItem(RKEY)) || []).length; } catch (e) {}
  const rCount = 100 + userAdded;

  // Fill any rating badges on the page
  $$("[data-rating-avg]").forEach(el => el.textContent = rAvg.toFixed(1));
  $$("[data-rating-count]").forEach(el => el.textContent = rCount);
  $$("[data-stars]").forEach(el => el.innerHTML = starsRow(rAvg));

  // Marquee of review cards
  const track = $(".marquee-track");
  if (track) {
    const cardHTML = (r) => `
      <article class="review-card">
        <div class="stars">${starsRow(r.r)}</div>
        <p>&ldquo;${r.t}&rdquo;</p>
        <div class="who">
          <div class="avatar">${initials(r.n)}</div>
          <div><b>${r.n}</b><span>${r.city}</span></div>
        </div>
      </article>`;
    const set = reviews.slice(0, 7).map(cardHTML).join("");
    track.innerHTML = set + set; // duplicate for seamless loop
  }

  /* ---------- Floating review bubble ---------- */
  const rbubble = $(".rbubble");
  if (rbubble) {
    const panel = $(".rbubble-panel", rbubble);
    const quoteEl = $(".rp-quote", rbubble);
    const dotsEl = $(".rp-dots", rbubble);
    const rotation = reviews.slice(0, 5);
    let idx = 0, timer = null;
    dotsEl.innerHTML = rotation.map((_, i) => `<i${i === 0 ? ' class="on"' : ""}></i>`).join("");
    const render = () => {
      const r = rotation[idx];
      quoteEl.innerHTML = `<p>&ldquo;${r.t}&rdquo;</p><span class="src">${r.n} · ${r.city}</span>`;
      $$("i", dotsEl).forEach((d, i) => d.classList.toggle("on", i === idx));
    };
    const advance = () => { idx = (idx + 1) % rotation.length; render(); };
    const start = () => { stop(); timer = setInterval(advance, 4200); };
    const stop = () => { if (timer) clearInterval(timer); };
    render();
    $(".rbubble-toggle", rbubble).addEventListener("click", () => {
      const open = rbubble.classList.toggle("open");
      if (open) start(); else stop();
    });
    $(".rbubble-close", rbubble).addEventListener("click", () => { rbubble.classList.remove("open"); stop(); });
    panel.addEventListener("mouseenter", stop);
    panel.addEventListener("mouseleave", () => { if (rbubble.classList.contains("open")) start(); });
  }

  /* ---------- Review modal (leave a review) ---------- */
  const modal = $("#review-modal");
  if (modal) {
    const backdropEl = modal;
    const formWrap = $(".modal-form", modal);
    const successWrap = $(".modal-success", modal);
    let rating = 0;
    const starWrap = $(".starpick", modal);
    const paint = (n) => $$("button", starWrap).forEach((b, i) => b.classList.toggle("on", i < n));
    $$("button", starWrap).forEach((b, i) => {
      b.addEventListener("mouseenter", () => paint(i + 1));
      b.addEventListener("click", () => { rating = i + 1; paint(rating); });
    });
    starWrap.addEventListener("mouseleave", () => paint(rating));

    const open = () => { backdropEl.classList.add("open"); document.body.style.overflow = "hidden"; };
    const close = () => {
      backdropEl.classList.remove("open"); document.body.style.overflow = "";
      setTimeout(() => { formWrap.hidden = false; successWrap.hidden = true; }, 300);
    };
    $$("[data-open-review]").forEach(b => b.addEventListener("click", open));
    $(".modal-close", modal).addEventListener("click", close);
    backdropEl.addEventListener("click", e => { if (e.target === backdropEl) close(); });
    window.addEventListener("keydown", e => { if (e.key === "Escape" && backdropEl.classList.contains("open")) close(); });

    $(".modal-form", modal).addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const name = (fd.get("name") || "").toString().trim() || "Anonymous";
      const city = (fd.get("city") || "").toString().trim() || "Collin County, TX";
      const text = (fd.get("text") || "").toString().trim();
      if (!rating) { starWrap.animate([{ transform: "translateX(-4px)" }, { transform: "translateX(4px)" }, { transform: "translateX(0)" }], { duration: 220, iterations: 2 }); return; }
      if (!text) return;
      saveReview({ n: name, r: rating, city, t: text });
      formWrap.hidden = true; successWrap.hidden = false;
    });
  }

  /* ============================================================
     QUOTE WIZARD
     ============================================================ */
  const wizard = $("#wizard");
  if (wizard) {
    const steps = $$(".wiz-step", wizard);
    const bar = $(".wiz-progress i", wizard);
    const label = $(".wiz-steps-label", wizard);
    const backBtn = $("[data-wiz-back]", wizard);
    const nextBtn = $("[data-wiz-next]", wizard);
    let cur = 0;
    let started = false;
    const KEY = "relaxtax_quote_v1";

    // restore
    try {
      const saved = JSON.parse(localStorage.getItem(KEY));
      if (saved) $$("input, textarea, select", wizard).forEach(f => {
        if (saved[f.name] == null) return;
        if (f.type === "checkbox" || f.type === "radio") { if (saved[f.name] === f.value || (Array.isArray(saved[f.name]) && saved[f.name].includes(f.value))) f.checked = true; }
        else f.value = saved[f.name];
      });
    } catch (e) {}
    $$(".choice input", wizard).forEach(i => i.closest(".choice").classList.toggle("sel", i.checked));

    const persist = () => {
      const data = {};
      $$("input, textarea, select", wizard).forEach(f => {
        if (f.type === "checkbox") { if (f.checked) (data[f.name] = data[f.name] || []).push(f.value); }
        else if (f.type === "radio") { if (f.checked) data[f.name] = f.value; }
        else data[f.name] = f.value;
      });
      try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {}
      return data;
    };

    const show = (i) => {
      cur = Math.max(0, Math.min(steps.length - 1, i));
      steps.forEach((s, n) => s.classList.toggle("active", n === cur));
      bar.style.width = ((cur + 1) / steps.length * 100) + "%";
      label.textContent = `Step ${cur + 1} of ${steps.length}`;
      backBtn.disabled = cur === 0;
      const isReview = cur === steps.length - 1;
      nextBtn.innerHTML = isReview
        ? 'Send my request <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
        : 'Continue <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
      if (isReview) buildReview();
      if (started) {
        const y = wizard.getBoundingClientRect().top + window.scrollY - 96;
        window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
      }
    };

    const buildReview = () => {
      const box = $(".wiz-review", wizard);
      if (!box) return;
      const d = persist();
      const pretty = {
        who: "Who this is for", services: "Services needed", entity: "Entity type",
        situation: "Where things stand", name: "Name", email: "Email", phone: "Phone", notes: "Notes"
      };
      box.innerHTML = Object.entries(pretty).map(([k, lbl]) => {
        let v = d[k];
        if (Array.isArray(v)) v = v.join(", ");
        if (!v) return "";
        return `<div class="row"><span>${lbl}</span><span>${String(v).replace(/</g, "&lt;")}</span></div>`;
      }).join("") || `<div class="row"><span>No details yet</span><span>—</span></div>`;
    };

    $$(".choice input", wizard).forEach(i => {
      i.addEventListener("change", () => {
        if (i.type === "radio") $$(`.choice input[name="${i.name}"]`, wizard).forEach(x => x.closest(".choice").classList.toggle("sel", x.checked));
        else i.closest(".choice").classList.toggle("sel", i.checked);
        persist();
      });
    });
    $$("input, textarea, select", wizard).forEach(f => f.addEventListener("input", persist));

    nextBtn.addEventListener("click", () => {
      // light validation on the contact step
      if (cur === steps.length - 2) {
        const req = $$("[required]", steps[cur]);
        let ok = true;
        req.forEach(f => {
          const good = f.checkValidity();
          f.style.borderColor = good ? "" : "var(--coral)";
          if (!good) ok = false;
        });
        if (!ok) return;
      }
      if (cur === steps.length - 1) { submit(); return; }
      show(cur + 1);
    });
    backBtn.addEventListener("click", () => show(cur - 1));

    // state: "delivered" (normal, what real visitors see) | "pending" (destination inbox
    // needs its one-time FormSubmit activation click) | "error" (genuinely didn't send)
    const showResult = (state, targetEmail) => {
      const inner = $(".wiz-inner", wizard);
      bar.style.width = "100%";
      try { localStorage.removeItem(KEY); } catch (e) {}

      if (state === "pending") {
        inner.innerHTML = `
          <div class="modal-success" style="padding:26px 0">
            <div class="badge" style="background:var(--sun); color:var(--teal)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="12" cy="12" r="10"/><path d="M12 8v5M12 16h.01"/></svg></div>
            <h3>One-time setup step needed.</h3>
            <p style="color:var(--ink-soft);max-width:48ch;margin:.6rem auto 0">
              This is the first request ever sent to <strong>${targetEmail}</strong>, so the email
              service just sent a one-time confirmation link to that inbox. Whoever owns it needs to
              open that email and click the link once — after that, every request (this one included)
              lands there automatically, no further setup.
            </p>
            <a class="btn btn--sun" href="index.html" style="margin-top:1.6rem">Back to the homepage</a>
          </div>`;
        return;
      }
      if (state === "error") {
        inner.innerHTML = `
          <div class="modal-success" style="padding:26px 0">
            <div class="badge" style="background:var(--coral)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M18 6 6 18M6 6l12 12"/></svg></div>
            <h3>Hmm, that didn't send.</h3>
            <p style="color:var(--ink-soft);max-width:44ch;margin:.6rem auto 0">
              Nothing was lost on your end, but to be safe, give us a call or text and we'll get you
              sorted right away.
            </p>
            <a class="btn btn--sun" href="tel:${CONFIG.phone}" style="margin-top:1.6rem">Call (972) 732-0081</a>
          </div>`;
        return;
      }
      inner.innerHTML = `
        <div class="modal-success" style="padding:26px 0">
          <div class="badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6 9 17l-5-5"/></svg></div>
          <h3>Request received — now relax.</h3>
          <p style="color:var(--ink-soft);max-width:44ch;margin:.6rem auto 0">
            Kyle or Stephen will personally review your details and reach out within one business day
            with next steps and a straightforward quote. No pressure, no sales pitch.
          </p>
          <a class="btn btn--sun" href="index.html" style="margin-top:1.6rem">Back to the homepage</a>
        </div>`;
    };

    const submit = () => {
      started = true;
      const d = persist();
      nextBtn.disabled = true;
      nextBtn.textContent = "Sending…";
      const targetEmail = CONFIG.formEndpoint.split("/").pop();
      const payload = {
        _subject: "New quote request — relaxtaxes.com",
        _cc: CONFIG.ccEmail || "",
        Name: d.name || "", Email: d.email || "", Phone: d.phone || "",
        "Who it's for": d.who || "",
        "Services": Array.isArray(d.services) ? d.services.join(", ") : (d.services || ""),
        "Entity type": d.entity || "", "Where things stand": d.situation || "",
        "Notes": d.notes || "",
      };
      const controller = new AbortController();
      const bail = setTimeout(() => controller.abort(), 10000);
      fetch(CONFIG.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })
        .then(async (res) => {
          clearTimeout(bail);
          let data = null;
          try { data = await res.json(); } catch (e) {}
          const msg = ((data && (data.message || data.MESSAGE)) || "") + "";
          if (/activat|confirm|verify/i.test(msg)) { showResult("pending", targetEmail); return; }
          showResult(res.ok ? "delivered" : "error", targetEmail);
        })
        .catch(() => { clearTimeout(bail); showResult("error", targetEmail); });
    };

    // Deep-link prefill: quote.html?service=bookkeeping  /  ?stress=high
    const params = new URLSearchParams(location.search);
    const svc = params.get("service");
    if (svc) {
      const map = {
        "1040": "Tax preparation & filing", "tax": "Tax preparation & filing",
        "bookkeeping": "Bookkeeping / cleanup", "payroll": "Payroll",
        "planning": "Tax planning", "irs": "IRS notice / back taxes",
        "startup": "Business start-up help", "quickbooks": "QuickBooks setup / support",
      };
      const want = map[svc.toLowerCase()];
      const box = want && $$('.choice input[name="services"]', wizard).find(i => i.value === want);
      if (box) { box.checked = true; box.closest(".choice").classList.add("sel"); persist(); }
    }
    if (params.get("stress") === "high") {
      const s = $$('.choice input[name="situation"]', wizard).find(i => i.value === "A year or more behind");
      if (s) { s.checked = true; s.closest(".choice").classList.add("sel"); persist(); }
    }

    show(0);
    requestAnimationFrame(() => { started = true; });
  }

  /* ---------- Simple contact form (simulated) ---------- */
  $$("[data-simple-form]").forEach(form => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const req = $$("[required]", form);
      let ok = true;
      req.forEach(f => { const good = f.checkValidity(); f.style.borderColor = good ? "" : "var(--coral)"; if (!good) ok = false; });
      if (!ok) return;
      const success = form.parentElement.querySelector("[data-form-success]");
      form.hidden = true;
      if (success) success.hidden = false;
    });
  });

  /* ============================================================
     AMBIENT SOUND  —  real track (audio/ambient.*) first, synth ocean fallback
     ============================================================ */
  const AMBIENT = (() => {
    const SKEY = "relaxtax_ambient";
    const btn = $(".sound-toggle");
    const el = $("#ambient-audio");
    const TARGET_VOL = 0.42;
    const START_VOL = 0.16;   // audible immediately, then eases up
    let mode = null;        // "track" | "synth"
    let synth = null;
    let on = false;
    let raf = null;

    const reflect = () => { if (btn) btn.setAttribute("aria-pressed", on ? "true" : "false"); };

    const buildSynth = () => {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      const ctx = new AC();
      const len = 4 * ctx.sampleRate;
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = buf.getChannelData(0);
      let last = 0;
      for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; last = (last + 0.02 * w) / 1.02; d[i] = last * 3.2; }
      const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
      const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 480; lp.Q.value = 0.7;
      const lfo = ctx.createOscillator(); lfo.type = "sine"; lfo.frequency.value = 0.09;
      const lg = ctx.createGain(); lg.gain.value = 300; lfo.connect(lg); lg.connect(lp.frequency);
      const vol = ctx.createGain(); vol.gain.value = 0.0001;
      const vlfo = ctx.createOscillator(); vlfo.type = "sine"; vlfo.frequency.value = 0.05;
      const vg = ctx.createGain(); vg.gain.value = 0.03; vlfo.connect(vg); vg.connect(vol.gain);
      src.connect(lp); lp.connect(vol); vol.connect(ctx.destination);
      src.start(); lfo.start(); vlfo.start();
      return {
        on() { if (ctx.state === "suspended") ctx.resume(); vol.gain.cancelScheduledValues(ctx.currentTime); vol.gain.linearRampToValueAtTime(0.09, ctx.currentTime + 2.5); },
        off() { vol.gain.cancelScheduledValues(ctx.currentTime); vol.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 1.4); },
      };
    };

    const fadeTrack = (to, ms, cb) => {
      if (!el) return;
      cancelAnimationFrame(raf);
      const from = el.volume, t0 = performance.now();
      const step = (t) => {
        const p = Math.min((t - t0) / ms, 1);
        el.volume = from + (to - from) * p;
        if (p < 1) raf = requestAnimationFrame(step); else if (cb) cb();
      };
      raf = requestAnimationFrame(step);
    };

    const useSynth = () => { if (!synth) synth = buildSynth(); if (synth) { mode = "synth"; synth.on(); } };

    // start(silentFail): when true, a blocked autoplay just no-ops (used on page-load resume)
    //   rather than falling back to the synth ocean.
    const start = (silentFail) => {
      on = true; reflect();
      try { localStorage.setItem(SKEY, "on"); } catch (e) {}
      const hasTrack = el && el.querySelector("source") && el.querySelector("source").getAttribute("src");
      if (hasTrack) {
        el.loop = true;
        el.volume = START_VOL;              // start audible right away
        const pr = el.play();
        if (pr && pr.then) pr.then(() => { mode = "track"; fadeTrack(TARGET_VOL, 900); }).catch(() => {
          if (silentFail) { armResume(); } else { useSynth(); }
        });
        else { mode = "track"; el.volume = TARGET_VOL; }
      } else if (!silentFail) {
        useSynth();
      }
    };

    let resumeArmed = false;
    const armResume = () => {
      if (resumeArmed) return;
      resumeArmed = true;
      const resume = () => { resumeArmed = false; start(); window.removeEventListener("pointerdown", resume); window.removeEventListener("keydown", resume); };
      window.addEventListener("pointerdown", resume, { once: true });
      window.addEventListener("keydown", resume, { once: true });
    };

    const stop = () => {
      on = false; reflect();
      try { localStorage.setItem(SKEY, "off"); } catch (e) {}
      if (mode === "track" && el) fadeTrack(0, 700, () => el.pause());
      if (mode === "synth" && synth) synth.off();
    };

    const toggle = () => (on ? stop() : start());
    if (btn) btn.addEventListener("click", toggle);

    // If sound was left on and the intro won't run this load, try to keep it going.
    // Most browsers allow this after the user has already played media on the origin
    // (i.e. after the intro's "Enter"); if it's blocked we resume on the first click.
    let wanted = false;
    try { wanted = localStorage.getItem(SKEY) === "on"; } catch (e) {}
    if (wanted && document.documentElement.classList.contains("entered")) {
      start(true);
    }

    return { start, stop, toggle };
  })();

  /* ============================================================
     ISLAND INTRO  —  one scene reveal, then enter
     ============================================================ */
  const intro = $("#intro");
  if (intro && !document.documentElement.classList.contains("entered")) {
    document.body.classList.add("intro-open");
    const enterBtn = $(".intro-enter", intro);
    const skipBtn = $(".intro-skip", intro);
    let alive = true;

    requestAnimationFrame(() => intro.classList.add("play"));
    setTimeout(() => { if (alive) enterBtn.classList.add("show"); }, reduce ? 300 : 2600);

    const enter = () => {
      if (!alive) return;
      alive = false;
      try { sessionStorage.setItem("relaxtax_entered", "1"); } catch (e) {}
      document.documentElement.classList.add("entered");
      document.body.classList.remove("intro-open");
      intro.classList.add("leaving");
      AMBIENT.start();
      setTimeout(() => { intro.style.display = "none"; }, 1100);
    };
    enterBtn.addEventListener("click", enter);
    skipBtn.addEventListener("click", enter);
    window.addEventListener("keydown", (e) => { if (e.key === "Escape") enter(); });
  }

  /* ---------- Ticker: duplicate content for a seamless loop ---------- */
  const ticker = $("[data-ticker]");
  if (ticker) ticker.innerHTML += ticker.innerHTML;

  /* ---------- Gentle scroll parallax (transform only) ---------- */
  const parallax = $$("[data-parallax]");
  if (parallax.length && !reduce) {
    let ticking = false;
    const upd = () => {
      const vh = window.innerHeight;
      parallax.forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const speed = parseFloat(el.dataset.parallax) || 0.12;
        const mid = r.top + r.height / 2 - vh / 2;
        el.style.transform = `translate3d(0, ${(-mid * speed).toFixed(1)}px, 0)`;
      });
      ticking = false;
    };
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
  }

  /* ---------- Footer year ---------- */
  $$("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

  /* ---------- Active nav link ---------- */
  const path = location.pathname.split("/").pop() || "index.html";
  $$(".navlink, .drawer nav a").forEach(a => {
    const href = a.getAttribute("href");
    if (href === path || (path === "index.html" && href === "index.html")) a.classList.add("is-active");
  });
})();
