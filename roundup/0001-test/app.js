!function(e){"use strict";let t={lead_type:"roundup"},n={},o={user_agent:navigator.userAgent,landing_page:window.location.href.split("?")[0],campaign_source:"facebook",cid_itd:"none",asid_itd:"none",aid_itd:"none",placement_itd:"none",platform_itd:"none",ip_address:"none",trustedform_cert_url:"none",trusted_form_cert_id:"none"},i=1,r=!1;e.fn.serializeObject=function(){var t={},n=this.serializeArray();return e.each(n,(function(){t[this.name]?(t[this.name].push||(t[this.name]=[t[this.name]]),t[this.name].push(this.value||"")):t[this.name]=this.value||""})),t},e("#phone").formatPhoneNumber({format:"(###) ###-####"}),e(".form-ul > li").click((function(t){e(this).parent().parent().find("#alert").hide()})),e("#q1-btn").click((function(n){e(this).parent().parent().parent().find(".alert").hide();const o=e("#q1_select option:selected").val();o?"No Cancer"===o?(e("#question-1").hide(),e("#failure").show()):(e("#question-1").hide(),e("#question-2").show(),t.round_up_cancer_diagnosed_itd=o,i=2):e(this).parent().parent().parent().find(".alert").show()})),e("#q2-btn").click((function(n){e(this).parent().parent().parent().find(".alert").hide();const o=e("#q2_select option:selected").val();o?(e("#question-2").hide(),e("#question-3").show(),t.round_up_cancer_diagnosis_date_itd=o,i=3):e(this).parent().parent().parent().find(".alert").show()})),e("#q3-btn").click((function(n){e(this).parent().parent().parent().find(".alert").hide();const o=e("#q3_select option:selected").val();o?(e("#question-3").hide(),e("#question-4").show(),t.lead_form_roundup_age_range_itd=o,i=4):e(this).parent().parent().parent().find(".alert").show()})),e("#q4-btn").click((function(n){const o=e("input[name='round_up_location_itd']:checked").val();o?(e("#question-4").hide(),e("#user-info").show(),t.round_up_location_itd=o,i=5):e(this).parent().parent().parent().find(".alert").show()})),e(".previous-btn").click((function(t){if(t.preventDefault(),e(".alert").hide(),3===i)e("#question-3").hide(),e("#question-2").show(),i=2;else if(2===i)e("#question-2").hide(),e("#question-1").show(),i=1;else{if(4!==i)return!1;e("#question-4").hide(),e("#question-3").show(),i=3}})),e("#submit-btn").click((function(i){i.preventDefault(),n=e("form#user-info-form").serializeObject();const r=e("#tcpa_text").text(),s=e("#tcpa_optin").is(":checked")?r:"No";t.consent_language_itd=s,o.ip_address=e(".myIP").text();e("form#user-info-form").valid()?a({...t,...n,...o}):e("html, body").animate({scrollTop:200},"slow")})),e("form").each((function(){e(this).validate({ignore:[],rules:{email:{required:!0},phone:{required:!0,phoneUS:!0},zipcode:{required:!0,zipcodeUS:!0}},errorPlacement:function(e,t){e.addClass("text-[#e50000] mt-1 text-sm text-red block"),e.insertAfter(t)}})}));const a=e=>{const t=e.phone.replace(/[()\s]/g,"").replace("-","");"No Cancer"==e.round_up_cancer_diagnosed_itd||"Other Lymphoma Cancer"==e.round_up_cancer_diagnosed_itd||"Testicular Cancer"==e.round_up_cancer_diagnosed_itd||"Mesothelioma"==e.round_up_cancer_diagnosed_itd||"Kidney Cancer"==e.round_up_cancer_diagnosed_itd||"Other Cancers"==e.round_up_cancer_diagnosed_itd||"Lung Cancer"==e.round_up_cancer_diagnosed_itd||"Hodgkins Lymphoma"==e.round_up_cancer_diagnosed_itd||"Multiple Myeloma"==e.round_up_cancer_diagnosed_itd||"Pre-2000"==e.round_up_cancer_diagnosis_date_itd?(console.log("Not Premium"),r=!1):(console.log("Premium"),r=!0),e.phone_1=t,e.postal_code=e.zipcode,e.round_up_notes_itd=e.description,delete e.description,delete e.zipcode,delete e.xxTrustedFormCertUrl,delete e.xxTrustedFormPingUrl,delete e.xxTrustedFormToken;const{isBlackListed:n}=l(e.email);"false"===n?s(e):(console.info("Email is blacklisted"),location.reload())},s=t=>{e("#submit-active-text").hide(),e("#submit-sending-text").show(),e("#submit-btn").attr("disabled"),u("PageView"),e.ajax({url:"form-request.php",type:"POST",data:t,dataType:"json",encode:!0,success:function(t){if("alreadySubmit"===t.reason){const n=`<div class="text-center p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 role="alert">${t.response}</div>`;return e(".submit-btn-wrapper").prepend(n),void e("#submit-btn").hide()}e("#user-info").hide(),e("#success").show(),"freelegalreviews.com"===window.location.hostname?(c(),d()):console.log("---[event tracking is disabled in dev mode]---")},error:function(e){console.log("errors",JSON.stringify(e))}})},c=()=>{console.log("Track Lead..."),ga("send","event","RoundUp","Lead"),fbq("track","Lead"),fbq("trackCustom","RoundUp Lead"),u("Lead"),u("RoundUp Lead"),window._conv_q=window._conv_q||[],_conv_q.push(["triggerConversion","100419480"]),r&&(console.log("Premium Lead..."),fbq("trackCustom","Premium"),u("CompleteRegistration"),fbq("track","CompleteRegistration",{currency:"USD",value:400}),ga("send","event","RoundUp","Premium Lead"),u("Premium"),window._conv_q=window._conv_q||[],_conv_q.push(["triggerConversion","100419261"]))},d=()=>{const e=document.createElement("script");e.async=!0,e.type="text/javascript";e.src="https://www.clickcease.com/monitor/cccontrack.js",document.head.appendChild(e)},u=e=>{const t={fname:n.first_name,lname:n.last_name,email:n.email,phone:n.phone,zipcode:n.zipcode,event:e,fbp:_("_fbp"),landing_page:window.location.href.split("?")[0],..._("_fbc")&&{fbc:_("_fbc")}},o=new URLSearchParams(t);jQuery.get("https://freelegalreviews.com/roundup/tracking/capi-2388567107996413.php?"+o.toString(),e=>{console.log("capi response:",e)})};(()=>{const e=new URLSearchParams(window.location.search),t=e.keys(),n=["campaign_source","src","cid_itd","placement_itd","platform_itd","asid_itd","aid_itd","test_lead"];for(const i of t)n.includes(i)&&("src"!==i&&"campaign_source"!==i||(o.campaign_source=e.get(i)),o[i]=e.get(i))})();const l=t=>{let n="null";return e.ajax({url:"https://freelegalreviews.com/api/email-blacklist.php?email="+t,type:"get",async:!1,success:e=>{n=e}}),n},p=()=>{setTimeout((function(){o.trustedform_cert_url=jQuery("#xxTrustedFormToken_0").val(),console.log("myTrustedID: "+o.trustedform_cert_url),null==o.trustedform_cert_url&&p()}),1e3)};p();const _=e=>{let t=e+"=",n=document.cookie.split(";");for(let e of n){for(;" "==e.charAt(0);)e=e.substring(1,e.length);if(0==e.indexOf(t))return e.substring(t.length,e.length)}}}(window.jQuery);