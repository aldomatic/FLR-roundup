<?php

    ini_set('max_execution_time', 100); // 300 seconds = 5 minutes

    echo "<pre>";
    print_r($_POST['firstname']);
    print_r(urlencode($_POST['firstname']));
    echo "</pre>";

    // build POST Url string
    function postData(){
        $postUrl = 'https://app.leadconduit.com/flows/5ce6cdbd497e5274b08f405f/sources/61709e308758980799c360b3/submit'; 
        $fields = array(
            // info
            'first_name' => urlencode($_POST['firstname']),
            'last_name' => urlencode($_POST['lastname']),
            'email' => urlencode($_POST['email']),
            'phone_1' => urlencode($_POST['phone']),
            'postal_code' => urlencode($_POST['zipcode']),
            'round_up_cancer_diagnosed_itd' => urlencode($_POST['question1']),
            'round_up_cancer_diagnosis_date_itd' => urlencode($_POST['question2']),
            'round_up_location_itd' => urlencode($_POST['question3']),
            'lead_form_roundup_age_range_itd' => urlencode($_POST['question4']),
            'round_up_notes_itd' => urlencode($_POST['notes']),
            'cid_itd' => urlencode($_POST['cid_itd']),
            'asid_itd' => urlencode($_POST['asid_itd']),
            'aid_itd' => urlencode($_POST['aid_itd']),
            'placement_itd' => urlencode($_POST['placement_itd']),
            'platform_itd' => urlencode($_POST['platform_itd']),
            'campaign_source' => urlencode($_POST['campaign_source']),
            'user_agent' => urlencode($_POST['user_agent']),
            'ip_address' => urlencode($_SERVER['REMOTE_ADDR']),
            'landing_page' => urlencode($_POST['landing_page']),
        );

        foreach($fields as $key=>$value) { $fields_string .= $key.'='.$value.'&'; }
        rtrim($fields_string, '&');

        //open connection
        $ch = curl_init();

        //set the url, number of POST vars, POST data
        curl_setopt($ch,CURLOPT_URL, $postUrl);
        curl_setopt($ch,CURLOPT_POST, count($fields));
        curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);

        //execute post
        $result = curl_exec($ch);
        //close connection
        curl_close($ch);
        return $result;
    }

    $curl_result = postData();
    $xml = simplexml_load_string($curl_result, 'SimpleXMLElement', LIBXML_NOCDATA);

    $response = $xml->outcome;
    $reason = $xml->reason;

    $json = [
        'response'=>  (string)$outcome,
        'reason'=>  (string)$reason,
    ];
    header('Content-type: application/json');
    echo json_encode($json);

?>
