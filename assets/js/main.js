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
  문의폼 임시 접수 처리
  - 현재는 실제 서버 전송 없이 화면에서 완료 메시지만 보여줍니다.
  - 추후 Google Apps Script/Webhook을 붙일 경우 fetch()를 이 부분에 추가하면 됩니다.
========================================================= */
const form = document.getElementById("inquiryForm");
const formStatus = document.getElementById("formStatus");

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const submitButton = form.querySelector(".submit");
    if (submitButton) {
      submitButton.textContent = "문의 접수 완료";
      submitButton.disabled = true;
    }

    if (formStatus) {
      formStatus.textContent = "문의가 접수되었습니다. 확인 후 연락드리겠습니다.";
    }

    setTimeout(() => {
      if (submitButton) {
        submitButton.textContent = "문의 남기기";
        submitButton.disabled = false;
      }
    }, 1800);
  });
}
