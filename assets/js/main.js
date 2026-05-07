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

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const button = item.querySelector(".faq-question");

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
