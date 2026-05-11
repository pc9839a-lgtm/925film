document.documentElement.classList.add("js-ready");
// 925 FILM main.js v20260511-10

const params = new URLSearchParams(window.location.search);

function setHiddenValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value || "";
}

setHiddenValue("utm_source", params.get("utm_source"));
setHiddenValue("utm_medium", params.get("utm_medium"));
setHiddenValue("utm_campaign", params.get("utm_campaign"));
setHiddenValue("page_url", window.location.href);
setHiddenValue("referrer", document.referrer);

/* =========================================================
  상단 고정 메뉴 스크롤 효과
  - 스크롤을 조금 내리면 헤더 배경을 더 진하게 만듭니다.
========================================================= */
const siteHeader = document.getElementById("siteHeader");

function updateHeaderState() {
  if (!siteHeader) return;
  siteHeader.classList.toggle("is-scrolled", window.scrollY > 24);
}

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

/* =========================================================
  하단 제작문의 버튼 제어
  - 평소에는 제작문의 버튼을 보여줍니다.
  - 제작 문의폼 영역이 화면에 들어오면 즉시 숨깁니다.
  - IntersectionObserver가 안 먹는 환경도 대비해 scroll 계산을 같이 사용합니다.
========================================================= */
const floatingCta = document.querySelector(".floating");
const contactSection = document.getElementById("contact");

function setFloatingHidden(hidden) {
  if (!floatingCta) return;
  floatingCta.classList.toggle("is-hidden", Boolean(hidden));
  document.body.classList.toggle("is-contact-visible", Boolean(hidden));
}

function isContactInView() {
  if (!contactSection) return false;
  const rect = contactSection.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;

  // 문의 섹션 상단이 화면 하단 쪽에 들어오기 시작하면 바로 숨김
  return rect.top <= vh * 0.86 && rect.bottom >= vh * 0.08;
}

function updateFloatingState() {
  setFloatingHidden(isContactInView());
}

if (floatingCta && contactSection) {
  updateFloatingState();
  window.addEventListener("scroll", updateFloatingState, { passive: true });
  window.addEventListener("resize", updateFloatingState);
  window.addEventListener("load", updateFloatingState);

  if ("IntersectionObserver" in window) {
    const floatingObserver = new IntersectionObserver(
      () => updateFloatingState(),
      { threshold: [0, 0.05, 0.12, 0.22], rootMargin: "0px 0px -10% 0px" }
    );
    floatingObserver.observe(contactSection);
  }
}

/* =========================================================
  섹션 등장 애니메이션
  - HTML 요소에 reveal 또는 reveal-up 클래스를 붙이면 스크롤 시 나타납니다.
  - 애니메이션이 과하면 CSS의 .reveal transition 시간을 줄이면 됩니다.
========================================================= */
const revealTargets = document.querySelectorAll(".reveal, .reveal-up");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -60px 0px",
    }
  );

  revealTargets.forEach((target) => revealObserver.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

/* =========================================================
  FAQ 아코디언
  - 기존 로직 유지
  - 하나를 열면 나머지는 닫히는 방식입니다.
========================================================= */
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const button = item.querySelector(".faq-question");
  if (!button) return;

  button.addEventListener("click", () => {
    const isOpen = item.classList.contains("is-open");

    faqItems.forEach((target) => {
      target.classList.remove("is-open");
      const icon = target.querySelector(".faq-question i");
      if (icon) icon.textContent = "+";
    });

    if (!isOpen) {
      item.classList.add("is-open");
      const icon = item.querySelector(".faq-question i");
      if (icon) icon.textContent = "−";
    }
  });
});

/* =========================================================
  문의폼 Google Apps Script 연동
  - index.html 하단의 window.NINE25_FORM_ENDPOINT 값에 Apps Script Web App URL을 넣으면 작동합니다.
  - CORS 문제를 피하기 위해 no-cors 방식으로 전송합니다.
  - 필수 항목: 이름 / 연락처 / 촬영 예정일
========================================================= */
const form = document.getElementById("inquiryForm");
const formStatus = document.getElementById("formStatus");
const FORM_ENDPOINT = (window.NINE25_FORM_ENDPOINT || "").trim();

function setFormStatus(message, type) {
  if (!formStatus) return;
  formStatus.textContent = message || "";
  formStatus.classList.remove("is-success", "is-error");
  if (type) formStatus.classList.add(type);
}

function setSubmitState(button, isLoading) {
  if (!button) return;
  button.disabled = Boolean(isLoading);
  button.classList.toggle("is-loading", Boolean(isLoading));
  button.textContent = isLoading ? "문의 접수 중..." : "제작 문의 남기기";
}

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = form.querySelector(".submit");

    if (!FORM_ENDPOINT || FORM_ENDPOINT.includes("여기에")) {
      setFormStatus("Google Apps Script 연동 주소를 먼저 입력해주세요.", "is-error");
      return;
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    formData.set("page_url", window.location.href);
    formData.set("referrer", document.referrer || "");
    formData.set("user_agent", navigator.userAgent || "");
    formData.set("submitted_at_client", new Date().toISOString());

    setSubmitState(submitButton, true);
    setFormStatus("문의 내용을 전송하고 있습니다.", "");

    try {
      await fetch(FORM_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        body: formData,
      });

      setFormStatus("문의가 접수되었습니다. 확인 후 연락드리겠습니다.", "is-success");
      form.reset();
      setHiddenValue("utm_source", params.get("utm_source"));
      setHiddenValue("utm_medium", params.get("utm_medium"));
      setHiddenValue("utm_campaign", params.get("utm_campaign"));
      setHiddenValue("page_url", window.location.href);
      setHiddenValue("referrer", document.referrer);
    } catch (error) {
      console.error("Form submit error:", error);
      setFormStatus("전송 중 오류가 발생했습니다. 카카오톡 상담으로 문의해주세요.", "is-error");
    } finally {
      setSubmitState(submitButton, false);
    }
  });
}
