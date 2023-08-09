(function ($) {
	
	// disable console.log
	if (window.location.hostname === 'freelegalreviews.com' ){
		console.log = function() {}
	}

	// collect serialized form data
	let partOneFormData = {}
	let partTwoFormData = {}
	let trackingData = {
		user_agent: navigator.userAgent,
		landing_page: window.location.href.split('?')[0],
		campaign_source: 'facebook'
	}
	let isPremiumLead = false

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


	// nice select fields
	$('.flr-select').niceSelect();
	// init phone formatting
	$("#phone").formatPhoneNumber({format: '(###) ###-####'});

	$( "#take-quiz-btn" ).on( "click", function() {
		$("#splash-screen").fadeOut();
		$("#quiz-header").fadeIn();
		$("#quiz-container").fadeIn();
		$("footer").fadeIn();
	});


	
	// Part One =========================
	$("#part-one .flr-select").change(function(){
		$('form#part-one').valid();
	});

	$("#continue-btn").on( "click", function(event) {
		event.preventDefault()
		const isPartOneValid = $('form#part-one').valid()
		if (isPartOneValid) {
			partOneFormData = $('form#part-one').serializeObject()
			$("#quiz-container").fadeOut();
			$("#user-data").fadeIn();
		}		
	});
	// end



	// Part Two =========================
	$("#check-quiz-btn").on( "click", function(event) {
		event.preventDefault()
		const isPartTwoValid = $('form#part-two').valid()
		partTwoFormData = $('form#part-two').serializeObject();
		if (isPartTwoValid) {
			beforeSubmitFormLogic()
		}	
	});
	// end

	// handle any logic before submit like if lead is premium
	const beforeSubmitFormLogic = () => {
		// combine all 3 objects into one object
		const formData = {...partOneFormData, ...partTwoFormData, ...trackingData}

		// premium lead rules
		if (formData.question2 === '2022') {
			isPremiumLead = true
		}

		// now we know if lead is premium or regular, lets send it off and make some money
		submitFormLogic(formData)
	}

	// submit lead 
	const submitFormLogic = (formData) => {
		console.log(`Submit form data for ${formData.firstname} with type of ${isPremiumLead ? 'Premium Lead' : 'Regular Lead' }`)
		jQuery.post("./submit-form.php", formData, function (data) {
			console.log("============================"); 
			console.log(data, '<<php-response');
			// trackLead();
		  });
	}

	const readUrlParms = () => {	
		const urlParams = new URLSearchParams(window.location.search)
		const keys = urlParams.keys()
		const allowedKeys = ['campaign_source', 'src', 'cid_itd', 'placement_itd', 'platform_itd', 'asid_itd', 'aid_itd'];
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

	// Setup form validation
	$('form').each(function() {   
		$(this).validate({
			onfocusout: function (element) {
				$(element).valid();
			},  
			ignore: [],
			rules: {
				question4: {
					required: true
				},
				select: {
					required: true
				},
				phone: {
					required: true,
					phoneUS: true
				}
			},
			errorPlacement: function (error, element) {
				if (element.is('select:hidden')) {
					error.insertAfter(element.next('.nice-select'));
				} else {
					error.insertAfter(element);
				}
			}
		});
	});
		
})(window.jQuery); 