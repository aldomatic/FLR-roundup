(function ($) {
	"use strict";

    let formData = {
        lead_type: 'roundup'
    }
    let userInfo = {}
    let trackingData = {
		user_agent: navigator.userAgent,
		landing_page: window.location.href.split('?')[0],
		campaign_source: 'facebook',
		cid_itd: 'none',
		asid_itd: 'none',
		aid_itd: 'none',
		placement_itd: 'none',
		platform_itd: 'none',
        ip_address: 'none',
        trustedform_cert_url: 'none',
        trusted_form_cert_id: 'none'
	}
    let currentStep = 1
    let qualifiedLead = false
    
    // serializeObject helper method
	$.fn.serializeObject = function() {
		var o = {};
		var a = this.serializeArray();
		$.each(a, function() {
			if (o[this.name]) {
				if (!o[this.name].push) {
					o[this.name] = [o[this.name]];
				}
				o[this.name].push(this.value || '');
			} else {
				o[this.name] = this.value || '';
			}
		});
		return o;
	}; // end helper method

    // init phone formatting
	$("#phone").formatPhoneNumber({format: '(###) ###-####'});

    $('.form-ul > li').click(function(e) {
        // hide alert if visible
       $(this).parent().parent().find('#alert').hide();;
    });

    // Question 1
    $('#q1-btn').click(function(e) {
        $(this).parent().parent().parent().find('.alert').hide();
        const value = $("#q1_select option:selected").val();
        if (value) {
            if (value === "No Cancer") {
                $('#question-1').hide();
                $('#failure').show();
           } else {
                $('#question-1').hide();
                $('#question-2').show();
                formData.round_up_cancer_diagnosed_itd = value
                currentStep = 2
           }
        } else {
            // show required message
            $(this).parent().parent().parent().find('.alert').show();
        }
    });
    // Question 2
    $('#q2-btn').click(function(e) {
        $(this).parent().parent().parent().find('.alert').hide();
        const value = $("#q2_select option:selected").val();
        if (value) {
            $('#question-2').hide();
            $('#question-3').show();
            formData.round_up_cancer_diagnosis_date_itd = value
            currentStep = 3
        } else {
            // show required message
            $(this).parent().parent().parent().find('.alert').show();
        }
    });
    // Question 3
    $('#q3-btn').click(function(e) {
        $(this).parent().parent().parent().find('.alert').hide();
        const value = $("#q3_select option:selected").val();
        if (value) {
            $('#question-3').hide();
            $('#question-4').show();
            formData.lead_form_roundup_age_range_itd = value
            currentStep = 4
        } else {
            // show required message
            $(this).parent().parent().parent().find('.alert').show();
        }
    });
    // Question 4
    $('#q4-btn').click(function(e) {
        const question4 = $("input[name='round_up_location_itd']:checked").val();
        if (question4) {
            $('#question-4').hide();
            $('#user-info').show();
            formData.round_up_location_itd = question4
            currentStep = 5
        } else {
            // show required message
            $(this).parent().parent().parent().find('.alert').show();
        }
    });

    // previous button logic
    $('.previous-btn').click(function(e) {
        e.preventDefault()
        $('.alert').hide();
        if (currentStep === 3) {
            $('#question-3').hide()
            $('#question-2').show()
            currentStep = 2
        } else if (currentStep === 2) {
            $('#question-2').hide()
            $('#question-1').show()
            currentStep = 1
        } else if (currentStep === 4) {
            $('#question-4').hide()
            $('#question-3').show()
            currentStep = 3
        } else {
            return false
        }
    });

    // submit form
    $('#submit-btn').click(function(e) {
        e.preventDefault()
        userInfo =  $('form#user-info-form').serializeObject();
        const termsCopy = $("#tcpa_text").text();
	    const tcpa_text = $('#tcpa_optin').is(':checked') ? termsCopy : "No";

        // add consent param to user info object
        formData.consent_language_itd = tcpa_text

        trackingData.ip_address = $(".myIP").text()
        
		const isFormValid = $('form#user-info-form').valid();

        if (isFormValid) {
            beforeSubmitFormLogic({...formData, ...userInfo, ...trackingData})
        } else {
            $("html, body").animate({ scrollTop: 200 }, "slow")
        }
    });
    
    // Setup form validation
	$('form').each(function() {   
		$(this).validate({        
			ignore: [],
			rules: {
                email: {
					required: true
				},
				phone: {
					required: true,
					phoneUS: true
				},
				zipcode: {
					required: true,
            		zipcodeUS: true
				}
			},
            errorPlacement: function (error, element) {
                error.addClass('text-[#e50000] mt-1 text-sm text-red block')
				error.insertAfter(element);
			}
		});
	});
 
    const beforeSubmitFormLogic = (formData) => {
		// we clean up the phone before sending
		const stripParenthes = formData.phone.replace(/[()\s]/g, '');
		const stripDashes = stripParenthes.replace("-", '');

        if(
            formData.round_up_cancer_diagnosed_itd == "No Cancer" 
            || formData.round_up_cancer_diagnosed_itd == "Other Lymphoma Cancer"
            || formData.round_up_cancer_diagnosed_itd == "Testicular Cancer"
            || formData.round_up_cancer_diagnosed_itd == "Mesothelioma"
            || formData.round_up_cancer_diagnosed_itd == "Kidney Cancer"
            || formData.round_up_cancer_diagnosed_itd == "Other Cancers"
            || formData.round_up_cancer_diagnosed_itd  == "Lung Cancer" 
            || formData.round_up_cancer_diagnosed_itd == "Hodgkins Lymphoma" 
            ||  formData.round_up_cancer_diagnosed_itd == "Multiple Myeloma" 
            || formData.round_up_cancer_diagnosis_date_itd == "Pre-2000") {
            // LEAD IS NOT PREMIUM
            console.log("Not Premium")
            qualifiedLead = false
        } else {
          // LEAD IS PREMIUM
            console.log("Premium")
            qualifiedLead = true
        }

        // Below here we correct the field mappings before we submit
		formData.phone_1 = stripDashes;
        formData.postal_code = formData.zipcode
        formData.round_up_notes_itd = formData.description

        delete formData.description
        delete formData.zipcode
        delete formData.xxTrustedFormCertUrl
        delete formData.xxTrustedFormPingUrl
        delete formData.xxTrustedFormToken

        const { isBlackListed } = checkBlacklistEmail(formData.email)
        if (isBlackListed === 'false') {
		    submitFormLogic(formData)
        } else {
            console.info('Email is blacklisted')
            location.reload()
        }
	}

    const submitFormLogic = (leadData) => {
        $('#submit-active-text').hide();
        $('#submit-sending-text').show();
        $('#submit-btn').attr('disabled');

        // send meta pageview event via capi
        sendCapiEvent('PageView')
        
        $.ajax({
            url: 'form-request.php',        
            type: 'POST',
            data: leadData,
            dataType: 'json',
            encode: true,
            success: function(data) {

                if (data.reason === 'alreadySubmit') {
                    const htmlStr = `<div class="text-center p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 role="alert">${data.response}</div>`
                    $('.submit-btn-wrapper').prepend(htmlStr);
                    $('#submit-btn').hide();
                    return
                }

                $('#user-info').hide();
                $('#success').show();

                // Only fire tracking events if in production and not locally (dev mode)
                if (window.location.hostname === 'freelegalreviews.com') {
                    trackLead();
                    fireClickceaseConversion();
                } else {
                    console.log('---[event tracking is disabled in dev mode]---')
                }
            },           
            error: function(err){
                console.log("errors", JSON.stringify(err));
            }
        });
    }

    const trackLead = () => {
        console.log("Track Lead...");     
        ga('send', 'event', 'RoundUp', 'Lead'); 
        fbq('track', 'Lead');
        fbq('trackCustom', 'RoundUp Lead');
        sendCapiEvent('Lead')
        sendCapiEvent('RoundUp Lead')
        // TRACKING FOR A/B TESTS
        window._conv_q = window._conv_q || []; _conv_q.push(["triggerConversion", "100419480"]);
 
        if(qualifiedLead) {
          console.log("Premium Lead...");
          fbq('trackCustom', 'Premium');
          sendCapiEvent('CompleteRegistration');
          fbq('track', 'CompleteRegistration', { currency: 'USD', value: 400.00 });
          ga('send', 'event', 'RoundUp', 'Premium Lead'); 
          sendCapiEvent('Premium');
           // TRACKING FOR A/B TESTS
          window._conv_q = window._conv_q || [];  _conv_q.push(["triggerConversion", "100419261"]); 
        } 
      }
  
    // ClickCease.com Conversion tracking 
    const fireClickceaseConversion = () => {
        let ccConVal = 0;
        const script = document.createElement("script");
        script.async = true;
        script.type = "text/javascript";
        const target = 'https://www.clickcease.com/monitor/cccontrack.js';
        script.src = target; var elem = document.head; elem.appendChild(script);
    }
    
     // Send CAPI event
     const sendCapiEvent = (event_name) => {
        const capiUserData = {
            fname: userInfo.first_name,
            lname: userInfo.last_name,
            email: userInfo.email,
            phone: userInfo.phone,
            zipcode: userInfo.zipcode,
            event: event_name,
            fbp: getCookie('_fbp'),
            landing_page: window.location.href.split('?')[0],
            ...(getCookie('_fbc') && { fbc: getCookie('_fbc') })
        }
        const query = new URLSearchParams(capiUserData);
        // Send secondary pixel
        jQuery.get(`https://freelegalreviews.com/roundup/tracking/capi-2388567107996413.php?${query.toString()}`, (response) => {
            console.log('capi response:', response)
        })
    }

    const readUrlParms = () => {	
		const urlParams = new URLSearchParams(window.location.search)
		const keys = urlParams.keys()
		const allowedKeys = ['campaign_source', 'src', 'cid_itd', 'placement_itd', 'platform_itd', 'asid_itd', 'aid_itd', 'test_lead'];
		for (const key of keys) {
			if (allowedKeys.includes(key)) {
				// we set the campaign_source to be either campaign_source or src value from query string
				if (key === 'src' || key === 'campaign_source'){
					trackingData['campaign_source'] = urlParams.get(key)
				}
				trackingData[key] = urlParams.get(key)
			}
		}
	}
	// collect additional url params for tracking purpose
	readUrlParms();

    // check blacklist emails
    const checkBlacklistEmail = (email) => {
        let results = 'null'
        $.ajax({
            url: `https://freelegalreviews.com/api/email-blacklist.php?email=${email}`,
            type: 'get',
            async: false,
            success: (data) => {
                results = data
            } 
         });
         return results
    }

    // TRUSTED FORM CHECK
    const checkID = () => {
        setTimeout(function() {
            // console.log("trustedID: "+ jQuery("input[name=xxTrustedFormToken").val());
            trackingData.trustedform_cert_url = jQuery("#xxTrustedFormToken_0").val();
            console.log("myTrustedID: "+ trackingData.trustedform_cert_url);
            if(trackingData.trustedform_cert_url == undefined){
                checkID();
            }

        }, 1000);
    }
    checkID();

    // get cookie value
    const getCookie = (cookieKey) => {
        let cookieName = `${cookieKey}=`;
        let cookieArray = document.cookie.split(';');

        for (let cookie of cookieArray) {
            while (cookie.charAt(0) == ' ') {
                cookie = cookie.substring(1, cookie.length);
            }
            if (cookie.indexOf(cookieName) == 0) {
                return cookie.substring(cookieName.length, cookie.length);
            }
        }
    }


})(window.jQuery); 