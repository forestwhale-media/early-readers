/* romance_probe landing 공통 스크립트
 * 연결 상태 (집행_준비_가이드.md 참조):
 *  - ML_FORM_ACTIONS: 셀별 MailerLite 임베드 폼 action URL (프런트에 API키 금지)
 *  - PIXEL_ID: Meta 픽셀 ID (base 코드는 각 index.html <head>)
 * 전환 규칙: 폼 "성공 제출"만 Lead로 기록. 버튼 클릭은 전환 아님.
 * 셀 귀속 규칙: 셀은 페이지(히든필드 fields[cell] 기본값)가 결정. URL ?cell= 은 무시(오타 방어). utm_*만 URL에서 수신. */
var ML_FORM_ACTIONS = {
  A: "https://assets.mailerlite.com/jsonp/2591850/forms/196602609045341745/subscribe",
  B: "https://assets.mailerlite.com/jsonp/2591850/forms/196603138302543163/subscribe",
  C: "https://assets.mailerlite.com/jsonp/2591850/forms/196603247108031522/subscribe",
  D: "https://assets.mailerlite.com/jsonp/2591850/forms/196603312983770544/subscribe"
};
var PIXEL_ID = "2118679932365099";

(function () {
  var qs = new URLSearchParams(location.search);
  ["utm_campaign", "utm_content"].forEach(function (k) {
    var el = document.querySelector('input[name="fields[' + k + ']"]');
    if (el) el.value = qs.get(k) || el.value || "";
  });
  var cellEl = document.querySelector('input[name="fields[cell]"]');
  var cell = cellEl ? cellEl.value : "";
  var action = ML_FORM_ACTIONS[cell] || "";
  var form = document.getElementById("list-form");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = form.querySelector('input[type="email"]').value.trim();
    if (!email) return;
    if (!action) {
      alert("Form is not connected yet (test build).");
      return;
    }
    var data = new URLSearchParams(new FormData(form));
    data.append("ml-submit", "1");
    data.append("anticsrf", "true");
    fetch(action, { method: "POST", body: data, mode: "no-cors" })
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
