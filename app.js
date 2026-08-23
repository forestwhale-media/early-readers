/* romance_probe landing 공통 스크립트
 * 집행 전 채울 것 (집행_준비_가이드.md 참조):
 *  - ML_FORM_ACTION: MailerLite 공식 임베드 폼의 form action URL (프런트에 API키 금지)
 *  - PIXEL_ID: Meta 픽셀 ID (base 코드는 index.html <head>의 주석 슬롯에)
 * 전환 규칙: 폼 "성공 제출"만 Lead로 기록. 버튼 클릭은 전환 아님. */
var ML_FORM_ACTION = "";           // ← MailerLite 폼 action URL
var PIXEL_ID = "";                 // ← Meta Pixel ID (참고용; base 코드는 head 슬롯)

(function () {
  var qs = new URLSearchParams(location.search);
  ["cell", "utm_campaign", "utm_content"].forEach(function (k) {
    var el = document.querySelector('input[name="fields[' + k + ']"]');
    if (el) el.value = qs.get(k) || el.value || "";
  });
  var form = document.getElementById("list-form");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = form.querySelector('input[type="email"]').value.trim();
    if (!email) return;
    if (!ML_FORM_ACTION) {
      alert("Form is not connected yet (test build).");
      return;
    }
    var data = new FormData(form);
    fetch(ML_FORM_ACTION, { method: "POST", body: data, mode: "no-cors" })
      .then(function () {
        document.getElementById("signup").style.display = "none";
        document.getElementById("success").style.display = "flex";
        if (window.fbq) fbq("track", "Lead");   // 성공 제출시에만
      })
      .catch(function () {
        alert("Something went wrong. Please try again.");
      });
  });
})();
