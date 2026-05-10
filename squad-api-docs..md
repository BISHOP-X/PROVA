Skip to main content
My Site Logo
Support
Create Account
Sign In

Home
Payments
Payments
Initiate Payment
Verify Transaction
Squad Payment Modal
Test Cards
Direct API Integration
Direct Debit
Squad Woo Commerce Plugin
Aggregator and Sub-merchants
POS Remote Request
Webhook & Redirect URL
Virtual Accounts
Transfer API
Others
Value Added Services (VAS)
PaymentsPayments
Payments
Learn to receive Payments on Squad
Squad helps you create any type of payment flow for your particular use case, from online collections to payouts and everything in between. You can integrate our payment system on:


On your website

Mobile Apps

On your e-Commerce Store
Help/Support Channel
For non -integration related enquiries, kindly visit our robust FAQ page or send an email to help@squadco.com.
For all enquiries/support with regards to integrations, kindly join our dedicated Integration Support Channel on Teams via the link: Squad Integration Channel
Edit this page
Home
Initiate Payment
Help/Support Channel


Initiate Payment
This API lets you initiate transactions by making server calls that return a checkout URL. When visited, this URL will display our payment modal.
info
Environment base URL:

Test: https://sandbox-api-d.squadco.com

Production: https://api-d.squadco.com

Authorization keys are to be passed via Headers as a Bearer token.

Example: Authorization: Bearer sandbox_sk_94f2b798466408ef4d19e848ee1a4d1a3e93f104046f.

The transaction reference used to initiate transactions must be unique.

POST

sandbox-api.squadco.com/transaction/Initiate

cURL

Enter Payment details
Help us send transactions receipts to the customers

Charge Amount (₦)
e.g 10000
Customer Email Address
e.g example@email.com
Merchant key
e.g sandbox_sk_ec8d24ec25...
Send Request

  curl --location 'https://sandbox-api.squadco.com/transaction/initiate' 
  --header 'Authorization: 47M3DMZD'
  --header 'Content-Type: application/json'
  --data-raw '{
    "amount":_ ,
    "email":_ ,
    "key":_ ,
      "currency":"NGN",
      "initiate_type": "inline",
      "CallBack_URL" : "https://www.linkedin.com/",
  }



POST
https://sandbox-api-d.squadco.com/transaction/initiate





































Responses
200:OK
Successful




































401:Unauthorized
Invalid/No Authorization Key






400:Bad Request
Bad Request







Sample Request
{
    "amount":43000,
    "email":"henimastic@gmail.com",
    "currency":"NGN",
    "initiate_type": "inline",
    "transaction_ref":"4678388588350909090AH",
    "callback_url":"http://squadco.com"
}

Simulate Test Payment (Transfer)
In the test environment, when the transfer option is selected on the payment modal, a dynamic virtual account is created. To complete the transaction, a simulated payment is required. This API allows you to simulate a payment into the dynamic virtual account.

POST
https://sandbox-api-d.squadco.com/virtual-account/simulate/payment










Responses
200:OK
Successful








400:Bad Request
Bad Request







Sample Request Simulate Payment
{
    "virtual_account_number": "9279755518",
    "amount": "20000"
}

Recurring Payment (Charge Authorization on Card)
This allows you charge a card without collecting the card information each time.

tip
For recurring Payments test on Sandbox, ensure to use the test card: 5200000000000007

Card Tokenization
Our system utilizes card tokenization, a security technique that replaces the customer's sensitive details with a unique, randomly generated token. This token can be safely stored and used for future transactions, eliminating the need to request the customer's card details again.

To tokenize a card, just add a flag to the initiate payload when calling the initiate endpoint and the card will automatically be tokenized. The unique token code will automatically be added to the webhook notification that will be received after payment.

"is_recurring":true

Sample Request for Card Tokenization
{
    "amount":43000,
    "email":"henimastic@gmail.com",
    "currency":"NGN",
    "initiate_type": "inline",
    "transaction_ref":"bchs4678388588350909090AH",
    "callback_url":"http://squadco.com",
    "is_recurring":true
}

Sample Webhook Response For Tokenized Card
{
  "Event": "charge_successful",
  "TransactionRef": "SQTECH6389058547434300003",
  "Body": {
    "amount": 11000,
    "transaction_ref": "SQTECH6389058547434300003",
    "gateway_ref": "SQTECH6389058547434300003_1_6_1",
    "transaction_status": "Success",
    "email": "william@gmail.com",
    "merchant_id": "SBSJ3KMH",
    "currency": "NGN",
    "transaction_type": "Card",
    "merchant_amount": 868,
    "created_at": "2025-08-12T10:51:14.368",
    "meta": {
      "details": "level1",
      "location": "Lagos"
    },
    "payment_information": {
      "payment_type": "card",
      "pan": "509983******3911|1027",
      "card_type": "mastercard",
      "token_id": "AUTH_lBlGESHDLMX_60049043"
    },
    "is_recurring": true
  }
}

Charge Card
This allows you charge a card using the token_id (The token_id is sent as part of the webhook on the first call).

POST
https://sandbox-api-d.squadco.com/transaction/charge_card










Responses
200:OK
Successful





















400:Bad Request
Bad Request







Sample Request
{
    "amount":10000,
    "token_id":"tJlYMKcwPd",
}

Cancel Charge Card
This endpoint allows you to cancel a card which was previously tokenised.

PATCH
https://sandbox-api-d.squadco.com/transaction/cancel/recurring




Responses
200:OK
Successful












400:Bad Request
Bad Request







Sample Request
{
  "auth_code": [
    "AUTH_SlYtufQzy_452037"
  ]
}

Query All Transactions
This endpoint allows you to query all transactions and filter using multiple parameters like transaction ref, start and end dates, amount, etc

caution
The date parameters are compulsory and should be a maximum of one month gap. Requests without date parameters will fail with error 400: Bad request.

GET
https://sandbox-api-d.squadco.com/transaction


















Responses
200:OK
Success
















































400:Bad request
Bad Request







Go Live
To go live, simply:

Change the base URL of your endpoints from sandbox-api-d.squadco.com to api-d.squadco.com
Sign up on our Live Environment
Complete your KYC
Use the secret key provided on the dashboard to replace the test keys gotten from the sandbox environment to authenticate your live transactions.
Edit this page
Payments

Verify Transaction
This is an endpoint that allows you to query the status of a particular transaction using the unique transaction reference attached to the transaction.

info
Environment base URL:

Test: https://sandbox-api-d.squadco.com

Production: https://api-d.squadco.com

Authorization keys are to be passed via Headers as a Bearer token.

Example: Authorization: Bearer sandbox_sk_94f2b798466408ef4d19e848ee1a4d1a3e93f104046f.

Response Data Object
The data object returned in the response is null when the status code is 400 and populated when the status code is 200.

The data object contains a parameter known as the transaction_status which differentiates the transaction type.

Transaction status can either be Success, Failed, Abandoned or Pending

GET
https://sandbox-api-d.squadco.com/transaction/verify/{{transaction_ref}}




Responses
200:OK
Valid Transaction Reference





















400:Bad Request
Invalid Transaction Reference







401:Unauthorized
Unauthorized Request






403:Forbidden
Invalid API Key







Verify POS Transaction
To verify the validity of a POS transaction, kindly query the endpoint above, passing the transaction_reference as the value in the path variable

GET
https://api-d.squadco.com/softpos/transaction/verify/:transaction_reference

Responses
Edit this page
Initiate Payment


Squad Payment Modal
Payment Modal
Squad Payment Modal provides an easy and convenient payment flow. It is the simplest way to securely collect payments from your customers without them leaving your website. The customer will be shown all the payment methods you have selected.

Integration is quick and seamless —simply copy the code from the embed section and paste it into your page, providing the easiest way to start accepting payments.

Parameters
To initialize a transaction, you need to pass details such as email, first name, last name, amount, transaction reference, etc. Email, amount, and currency are required. You can also pass any other additional information in the metadata object field. The following is a complete list of parameters that you can pass:

PARAMETERS	REQUIRED?	DESCRIPTION
key	Yes	Your Squad public key. Use the test key found in your Sandbox account in test mode, and use the live key found in your Squad dashboard in live mode.
email	Yes	Customer's email address.
amount	Yes	The amount you are debiting customer (expressed in the lowest currency value - kobo & cent).
transaction_ref	No	Unique case-sensitive transaction reference. If you do not pass this parameter, Squad will generate a unique reference for you.
currency_code	Yes	The currency you want the amount to be charged in. Allowed value is NGN or USD.
payment_channels	No	An array of payment channels to control what channels you want to make available for the user to make a payment with. Available channels include; ['card', 'bank' , 'ussd', 'transfer']
customer_name	No	Name of Customer
callback_url	No	Sample: https://squadco.com
metadata	No	Object that contains any additional information that you want to record with the transaction. The custom fields in the object will be returned via webhook and the payment verification endpoint.
pass_charge	No	It takes two possible values: True or False. It is set to False by default. When set to True, the charges on the transaction is computed and passed on to the customer(payer). But when set to False, the charge is passed to the merchant and will be deducted from the amount to be settled to the merchant.
info
The customer information can either be retrieved from a form, or from your database if you already have it stored. (Example below)

Code Glossary
HTML
JavaScript
<!DOCTYPE html>
<html lang="en">
<HEAD>
<TITLE>SQUAD</TITLE>
<!-- bootstrap -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">

</HEAD>
<BODY>
  <form style="padding-left: 30px;" class="text-center">
      <div class="text-left" style="color:red; font-family: Verdana; font-size: 30px;">SAMPLE CHECKOUT</div>
      <h6>Note: Amount should be between $1 to $10,000 (USD), NGN100 to NGN5,000,000 and KSH100 to KSH5,000,000</h6>
      <div class="row text-center">
        <div class="col-lg-4">
            <label for="email">Email Address</label>
            <input type="email" id="email-address" class="form-control" required /><br>
        </div>
        <div class="col-lg-4">
            <label for="amount">Amount</label>
            <input type="tel" id="amount" class="form-control" required /><br>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-4">
            <label for="first-name">First Name</label>
            <input type="text" id="first-name" class="form-control" /><br>
        </div>
        <div class="col-lg-4">
            <label for="last-name">Last Name</label>
            <input type="text" id="last-name" class="form-control" /><br>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="form-submit">
          <button type="button" onclick="SquadPay()" class="btn btn-danger">Check Out</button><br><br>
        </div>
      </div>
    </div>
  </form>
</BODY>
</HTML>


Initiate transaction
When the customer clicks the submit button, use the provided JavaScript function to initiate a transaction by passing the required parameters (such as email, amount, and any additional fields).

function SquadPay() {
  const squadInstance = new squad({
    onClose: () => console.log("Widget closed"),
    onLoad: () => console.log("Widget loaded successfully"),
    onSuccess: () => console.log(`Linked successfully`),
    key: "test_pk_sample-public-key-1",
    //Change key (test_pk_sample-public-key-1) to the key on your Squad Dashboard
    email: document.getElementById("email-address").value,
    amount: document.getElementById("amount").value * 100,
    //Enter amount in Naira or Dollar (Base value Kobo/cent already multiplied by 100)
    currency_code: "NGN",
  });
  squadInstance.setup();
  squadInstance.open();
}


A checkout modal will pop-up with different payment options for the customer to choose and input their payment information to complete the transaction.

Checkout Demo
POST

sandbox-api.squadco.com/transaction/Initiate

cURL

Enter Payment details
Help us send transactions receipts to the customers

Charge Amount (₦)
e.g 10000
Customer Email Address
e.g example@email.com
Merchant key
e.g sandbox_sk_ec8d24ec25...
Send Request

  curl --location 'https://sandbox-api.squadco.com/transaction/initiate' 
  --header 'Authorization: 47M3DMZD'
  --header 'Content-Type: application/json'
  --data-raw '{
    "amount":_ ,
    "email":_ ,
    "key":_ ,
      "currency":"NGN",
      "initiate_type": "inline",
      "CallBack_URL" : "https://www.linkedin.com/",
  }



Key Information
The key field takes your Squad key.
By default, the amount field is already set in the lowest currency unit (kobo, cent). That is, to pay NGN100, you have to enter 10000 in the amount field. To convert amount to the base currency (Naira, Dollar), multiply the amount parameter by 100 in your code, amount: document.getElementById("amount").value * 100, This will allow you enter the amount in Naira or Dollar as the case may be.
Payment channels
After initialization, there are a couple of payment channels available to the customer to complete the transaction.

USSD
The USSD channel allows your Nigerian customers to pay you by dialing the USSD code on their mobile devices. Nigerian banks provide USSD services for customers to use for transactions, and we have integrated with some of these banks to allow your customers to complete payments.




After dialing the USSD code displayed, the system will prompt the user to input the USSD PIN to authenticate the transaction and then confirm it. All that is needed to initiate USSD payment is the customer's email and the amount to be charged. When the user makes a payment, the response will be sent to your webhook.

info
Therefore, to make it work as expected, webhooks must be configured on your Squad dashboard.

Banks Supported
Here is a list of all the Banks USSD shortcodes we currently support:

Bank	USSD Shortcode
Access (Diamond) Bank	426
Access Bank	901
EcoBank	326
First City Monument Bank (FCMB)	329
Fidelity Bank	770
First Bank	894
Guaranty Trust	737
Heritage Bank	745
Keystone Bank	7111
Rubies (Highstreet) MFB	779
Stanbic IBTC Bank	909
Sterling Bank	822
United Bank for Africa (UBA)	919
Union Bank	826
Unity Bank	7799
VFD Bank	5037
Wema Bank	945
Zenith Bank	966
Bank Transfer
Squad provides a payment method that makes it possible for customers to pay you through a direct bank account transfer. The customer provides their name, phone number, and email address. Then a preset account number is displayed along with the preregistered bank name.




Card
With Squad, customers can pay with Card provided their card details are correct and updated. The customer provides their card number, card expiry date, and CVV.

How To Test
Create a free Squad sandbox account and get your test keys from the dashboard.
Copy the code sample from the Code Glossary of this documentation unto a text editor of your choice.
Save the document as .html file. For example index.html
With an internet-enabled device, view the .html file (index.html) using any web server of your choice either local (WAMP, XAMPP, etc) or online.
Go live
To go live with the payment modal, simply replace the test public key with the live public key found in your Squad dashboard. Your platform must be hosted online for the live environment to function correctly.

Edit this page


Direct API Integration
This suite of APIs allows you to directly initiate CARD, BANK and USSD transactions without using the Squad Modal.
info
Environment base URL:

Test: https://sandbox-api-d.squadco.com

Production: https://api-d.squadco.com

Authorization keys are to be passed via Headers as a Bearer token.

Example: Authorization: Bearer sandbox_sk_94f2b798466408ef4d19e848ee1a4d1a3e93f104046f.

The transaction reference used to initiate transactions must be unique.

Direct CARD
This suite of API's allows merchants to directly collect customer card details and charge the cards following the expected steps. Only PCI-DSS-certified and profiled merchants will be able to make use of the service

note
Due to the nature of payment systems around cards, several possible scenarios may play out, which are broadly classified as:

Payments requiring only PIN for completion

Payments requiring only OTP for completion

Payments requiring a combination of both PIN and OTP for completion

Payments requiring a challenge (3DS) for completion

The Expected next step to take will be based on the transaction_status in the response body after the Step 1 (Charge Card)

info
Test Cards for Different Scenarios

4242424242424242 >> Direct OTP validation (Use Amount < ₦7,500)

5200000000001096 >> 3DS authentication

5555555555554444 >> PIN + OTP (Two-step validation: PIN verification → OTP validation)

Step #1: Charge Card
This endpoint allows you to pass collected card details and other required fields

POST
https://sandbox-api-squadco.com/transaction/initiate/process-payment































Sample Request
{
    // "transaction_reference": "hell333o123",
    "amount": 1000000,
    "pass_charge": true,
    "currency": "NGN",
    "webhook_url": "https://webhook.site/50733ce1-f957-4900-9f4a-3eddf0a1f270",
    "card": {
        "number": "5555555555554444",
        "cvv": "121",
        "expiry_month": "12",
        "expiry_year": "50"
    },
    "payment_method": "card",
    "customer": {
        "name": "Tams Bills",
        "email": "50733ce1-f957-4900-9f4a-3eddf0a1f270@emailhook.site"
    },
    "redirect_url": "https://www.squadco.com/"
}

Responses
200:ValidatePin
Successful
















200:ValidateOTP
Successful















200:3DS
Successful


















403:Forbidden
Forbidden







401:Unauthorized
Unauthorized






Step #2: Authorize Payment
This endpoint allows you to authorize a payment based on the transaction_status from the charge card process

POST
https://sandbox-api-squadco.com/transaction/payment/authorize











note
For ValidatePin, use PIN: 1234

For ValidateOTP, use OTP: 123456

3DS (ThreeDSecure)
Where transaction_status is "ThreeDSecure", the challenge is to be completed by following the URL specified in the auth_url field. When executed, a challenge page is initiated and once the challenge is completed, a payment successful page is displayed and then redirected to redirect_url provided.

Sample Request for ValidatePin
   {
    "transaction_reference": "SQDEMO6388591221547800002",
    "authorization": {
        "pin": "1234"
    }
}

Sample Request for ValidateOTP
{
    "transaction_reference": "SQDEMO6388591221547800002",
    "authorization": {
        "otp": "123456"
    }
}

Responses
200:ValidatePin + OTP
Successful
















200:ValidateOTP
Successful















403:Forbidden
Forbidden







401:Unauthorized
Unauthorized






Direct GTBank account debit
This endpoint allows you to initiate the direct debit of a GTBank account by passing the account number. After initiating the request using this endpoint you are then to call the validate endpoint to complete the transaction.

POST
https://sandbox-api-squadco.com/transaction/initiate/process-payment





































Sample Request
{
  "transaction_reference": "test001",
  "amount": 51800,
  "pass_charge": false,
  "currency": "NGN",
  "webhook_url": "www.sampleurl.com",
  "bank": {
    "bank_code": "058",
    "account_or_phoneno": "08146663666"
  },
  "payment_method": "bank",
  "customer": {
     "name": "William Udousoro",
   "email": "squadtest@gmail.com"
  }
}

Responses
200:OK
Successful
















401:Unauthorized
Invalid/No Authorization Key






400:Bad Request
Bad Request







Validate Payment for Direct Bank API Payment
Once an account debit is initiated using the Direct Bank API, the transaction must be authenticated. This is done using this endpoint to receive details from the user.

info
For the auth_model, the value can be either "ValidateTOKEN" or "ValidateOTP." If "ValidateTOKEN" is received, the payee must input the OTP from 7377#, a hardware token, or an e-token to complete the transaction. If "ValidateOTP" is returned, an OTP will be sent to the phone number linked to the customer account number, which the payee will then input to finalize the transaction.

POST
https://sandbox-api-squadco.com/transaction/validate-payment













Sample Request
{
  "transaction_reference": "SQDEMO6386363261862600002",
  "authorization": {
    "otp_token": "123456"
  }
}

Responses
ValidateTOKEN















ValidateOTP















403:Forbidden
Forbidden







401:Unauthorized
Unauthorized






Initiate USSD payment
This API allows you to directly process USSD transactions, with the same param details as direct bank payment.

POST
https://sandbox-api-squadco.com/transaction/initiate/process-payment










USSD SUPPORTED BANKS AND BANK CODES
Bank Name	Bank Code
Access (Diamond)	063
Access	044
Ecobank	050
FCMB	214
Fidelity Bank	070
First Bank	011
Guaranty Trust Bank	058
Heritage Bank	030
Keystone Bank	082
Rubies (Highstreet) MFB	125
Stanbic Bank	221
Sterling Bank	232
UBA	033
Union Bank	032
Unity Bank	215
VFD Bank	566
Wema Bank	035
Zenith Bank	057
Globus Bank	00103
Premium Trust Bank	105
LOTUS Bank	303
Optimum Trust Bank	107
Kuda MFB	50211
The bank code provided is what should be populated in the bank_code parameter.	
Sample Request
{
  "transaction_reference": "testussd",
  "amount": 56800,
  "pass_charge": false,
  "currency": "NGN",
  "webhook_url": "www.sampleurl.com",
  "ussd": {
    "bank_code": "058"
  },
  "payment_method": "ussd",
  "customer": {
    "name": "Test User",
    "email": "TestUser@gmail.com"
  }
}


200:OK
Successful
{
    "status": 200,
    "success": true,
    "message": "Success",
    "data": {
        "amount": 56800,
        "transaction_ref": "SQDEMO6386363261862600002",
        "transaction_type": "Ussd",
        "gateway_ref": "SQDEMO6386363261862600002_3_3_1",
        "merchant_amount": 51118.4,
        "message": "USSD Payment Reference Generated",
        "auth_model": "USSDCodeGenerated",
        "ussd_details": {
            "ussd_reference": "*737*000*1914",
            "expiresAt": "2024-10-04T11:01:59.8888866"
        }
    }
}

403:Forbidden
Forbidden
{
    "success": false,
    "message": "API key is empty or invalid. Key must start with sandbox_sk_",
    "data": {}
}


401:Unauthorized
Unauthorized
{
    "success": false,
    "message": "",
    "data": {}
}





Go Live
To go live, simply:

Change the base URL of your endpoints from sandbox-api-d.squadco.com to api-d.squadco.com
Sign up on our Live Environment
Complete your KYC
Use the secret key provided on the dashboard to replace the test keys gotten from the sandbox environment to authenticate your live transactions.
Edit this page


Direct Debit
This API set enables direct debits from an account number up to a pre-set amount over a defined timeframe without requiring further approval from the account owner.
info
Environment base URL:

Test: https://sandbox-api-d.squadco.com

Production: https://api-d.squadco.com

Authorization keys are to be passed via Headers as a Bearer token.

Example: Authorization: Bearer sandbox_sk_94f2b798466408ef4d19e848ee1a4d1a3e93f104046f.

The transaction reference used to initiate transactions must be unique.

Direct Debit Flow
The direct debit service works by applying Mandates to an account. A mandate is an authorized instruction that permits an account to be debited up to a specific amount within a defined duration.

info
Flow Summary

Creating a Mandate on an account

Account Holder approving the mandate on the account

Debiting the account using the created mandate

Get Bank List
POST
https://sandbox-api-d.squadco.com/transaction/mandate/banklists

Sample BankList Response
{
    "status": 200,
    "success": true,
    "message": "Success",
    "data": [
        {
            "bank_name": "ACCESS BANK PLC",
            "bank_code": "044",
            "isActive": true
        },
        {
            "bank_name": "ECOBANK NIGERIA PLC",
            "bank_code": "050",
            "isActive": true
        },
        {
            "bank_name": "FIDELITY BANK PLC",
            "bank_code": "070",
            "isActive": true
        },
        {
            "bank_name": "FIRST BANK OF NIGERIA PLC",
            "bank_code": "011",
            "isActive": true
        },
        {
            "bank_name": "GUARANTY TRUST BANK PLC",
            "bank_code": "058",
            "isActive": true
        },
        {
            "bank_name": "Kuda Microfinance Bank",
            "bank_code": "672",
            "isActive": true
        }
    
    ]
}

Create Mandate
POST
https://sandbox-api-d.squadco.com/transaction/mandate/create














































Responses
200:Success
Mandate Created



































400:Bad Request
Bad Request









Sample Request
{
    "mandate_type": "emandate",
    "amount": "2000000",
    "account_number": "2473064070",
    "bank_code": "050",
    "description": "20kish pilot slive",
    "start_date": "2025-08-27",
    "end_date": "2026-01-20",
    "customer_email": "willia@gmail.com",
    "transaction_reference": "livepilot0260118",
    "customerInformation": {
        "identity": {
            "type": "bvn",
            "number": "22984135000"
        },
        "firstName": "william",
        "lastName": "udousoro",
        "address": "no 11 claytus street sabo yaba",
        "phone": "08132448008"
    }
}

Webhook Notification For Mandate Creation
{
  "Event": "mandates.approved",
  "TransactionRef": "livepilot0260118",
  "Body": {
    "status": "approved",
    "mandate_type": "emandate",
    "debit_type": "variable",
    "ready_to_debit": false,
    "approved": true,
    "reference": "livepilot0260118",
    "account_name": "william udousoro",
    "account_number": "0179088393",
    "bank": "GTB TESTING",
    "message": "Mandate approved",
    "start_date": "2025-08-27T00:00:00Z",
    "end_date": "2026-01-20T22:59:59.999Z",
    "date": "2025-08-06T12:01:40.416Z",
    "amount": 2000000,
    "business": "673c6efe9c0a66056f27b19a",
    "merchantId": "SBBWRX1Z3S",
    "mandate_id": "sqaudDDa27chviz8nwhv3d6w4gy"
  }
}

info
Due to the limitations of the Sandbox environment, 24hours must be allowed to pass after creating the mandate before the Mandate can be debitted. Another Webhook will be sent once the account can be debitted

Webhook Notification for Approved Mandate
{
  "Event": "mandates.ready",
  "TransactionRef": "livepilot0260118",
  "Body": {
    "status": "approved",
    "mandate_type": "emandate",
    "debit_type": "variable",
    "ready_to_debit": true,
    "approved": true,
    "reference": "livepilot0260118",
    "account_name": "william udousoro",
    "account_number": "0179088393",
    "bank": "GTB TESTING",
    "message": "Mandate is now ready for debiting",
    "start_date": "2025-08-27T00:00:00Z",
    "end_date": "2026-01-22T22:59:59.999Z",
    "date": "2025-08-04T13:45:28.1Z",
    "amount": 20000000,
    "business": "673c6efe9c0a66056f27b19a",
    "merchantId": "SBBWRX1Z3S",
    "mandate_id": "sqaudDD39cf95ohb3702mre87tj23"
  }
}

Debit Mandate
POST
https://sandbox-api-d.squadco.com/transaction/mandate/debit
















info
Debits can only occur once a day

Responses
200:Success
Debit Successfull



















400:Mandate Not Ready
Mandate Not Ready









400:Limit Reached
Daily Limit Reached










400:Over Debit
Over Debit










Sample Request
{
    "amount": 50000,
    "mandate_id": "sqaudDDa27chviz8nwhv3d6w4gy",
    "transaction_reference": "super32333",
    "narration": "test2004",
    "pass_charge": false,
    "customer_email" : "willia@gmail.com"
}

Webhook Notification
{
  "Event": "charge_successful",
  "TransactionRef": "super32333",
  "Body": {
    "amount": 50000,
    "transaction_ref": "super32333",
    "gateway_ref": "super32333_2_2_1",
    "transaction_status": "Success",
    "email": "williamudousoro@gmail.com",
    "merchant_id": "SBBWRX1Z3S",
    "currency": "NGN",
    "transaction_type": "Bank",
    "merchant_amount": 49500,
    "created_at": "2025-08-06T13:00:37.128",
    "meta": {},
    "is_recurring": false
  }
}

Cancel Mandate
POST
https://sandbox-api-d.squadco.com/transaction/mandate/cancel




Responses
Success
Mandate Cancelled













Failed
Failed

















Sample Request
{
    "mandateIds": [
        "sqaudDD657al1hrep7m4bc",
        "sqaudDD5c9elxp61u3sju",
        "sqaudDD5c9elxp61u3sju"
    ]
}

Get Mandate By Ref
GET
https://sandbox-api-d.squadco.com/transaction/mandate/get-mandates/:Ref

Responses
Success
Mandate Ref Details
{
    "status": 200,
    "success": true,
    "message": "Success",
    "data": [
        {
            "start_date": "2025-08-31T00:00:00",
            "end_date": "2026-01-22T00:00:00",
            "account_number": "0179088393",
            "account_name": "william udousoro",
            "bankName": "Standard Chartered",
            "bank": "068",
            "ready_to_debit": true,
            "is_approved": true,
            "status": "approved",
            "merchant_reference": "workinornot242",
            "mandate_type": "emandate",
            "debit_type": "variable",
            "merchant_id": "SBBWRX1Z3S",
            "amount": 20000000,
            "balance": 20000000,
            "total_debited": 0
        }
    ]
}

404:Not Found
Reference Not Found
{
      "status": 400,
      "success": false,
      "message": "No mandate found for reference workinornot242",
      "data": {}
}

403:Forbidden
Forbidden
{
    "success": false,
    "message": "API key is empty or invalid. Key must start with sandbox_sk_",
    "data": {}
}


401:Unauthorized
Unauthorized
{
    "success": false,
    "message": "",
    "data": {}
}

Go Live
To go live, simply:

Change the base URL of your endpoints from sandbox-api-d.squadco.com to api-d.squadco.com
Sign up on our Live Environment
Complete your KYC
Use the secret key provided on the dashboard to replace the test keys gotten from the sandbox environment to authenticate your live transactions
Edit this page



Squad Woo Commerce Plugin
This plugin allows you collect payments on your Word press site using Squad Payment Gateway:
Overview
Squad helps thousands of businesses in Nigeria to receive secure payments globally. Our goal is to make accepting payments from around the world as easy as possible. Get started by integrating our easy-to-use payment gateway directly on your WooCommerce website to receive local and USD payments quickly and efficiently.

Squad enables you to accept payments via multiple methods such as:

Card payments
Bank transfers
USSD
Direct bank account debit
Benefits of using Squad payment gateway:
Seamless and easy to use: Squad offers you zero complexities with receiving payments anytime, anywhere.
Suited for one-time, recurring payments and donations.
Layered with advanced fraud detection to secure your customers’ data.
Offers simplified transactions data retrieval.
Offers you periodic intuitive reports to help you understand your customers better.
Access to 24/7 dedicated customer support
Plugin Configuration
To configure the plugin:
go to WooCommerce > Settings from the left menu, click Payments tab. Click on Squad.
Enable/Disable – check the box to enable Squad Payment Gateway. • Mode – check the box to enable Live Mode.
Webhook Instruction – please ensure that you copied the url displayed in red into your Squad dashboard as described.
Enter Secret Hash – ensure that secret hash entered is the same with the one on your Squad dashboard.
Squad Test Public Key – enter your test public key.
Squad Test Secret Key – enter your test secret key.
Squad Live Public Key – enter your live public key.
Squad Live Secret Key – enter your live secret key.
Click Save Changes to save your changes.
Image Descriptions

1/3 - Squad Settings


2/3 - Sample Order Page


3/3 - Squad Payment Modal

Download
Click here to download the plugin

Edit this page


Aggregator and Sub-merchants
This API allows you to be profiled as an aggregator and also create sub-merchants dynamically under your account.
With this, you are able to initiate transactions from a central point for all businesses or sub merchants under you using the same API keys.
info
Environment base URL:

Test: https://sandbox-api-d.squadco.com

Production: https://api-d.squadco.com

Authorization keys are to be passed via Headers as a Bearer token.

Example: Authorization: Bearer sandbox_sk_94f2b798466408ef4d19e848ee1a4d1a3e93f104046f.

Create Sub-merchants.
This API is used to create a sub-merchant, the sub-merchant will have its own ID and will automatically have its own view on the dashboard.

POST
https://sandbox-api-d.squadco.com/merchant/create-sub-users















Responses
200:OK
Success
{
      "status": 200,
      "success": true,
      "message": "Success",
      "data": {
          "account_id": "AGGERYG8WF34"
      }
}

400:Bad Request
Error in request payload
{
      "status": 400,
      "success": false,
      "message": ""account_number" is required",
      "data": {}
}

401:Unauthorized
No Authorization
{
      "success": false,
      "message": "",
      "data": {}
}

403:Forbidden
Wrong/Invalid API Keys
{
      "success": false,
      "message": "Merchant authentication failed",
      "data": {}
}

Edit this page




POS Remote Request
The POS Remote Request suite of APIs allows you to remotely invoke a payment on a POS terminal and requery for the status of the transaction.
info
Environment base URL:

Base URL: https://api-d.squadco.com/softpos/

Authorization keys are to be passed via Headers as a Bearer token.

Example: Authorization: Bearer sandbox_sk_94f2b798466408ef4d19e848ee1a4d1a3e93f104046f.

Create Payment Request
This endpoint enables you to send a payment request to a POS terminal. The terminal receives the request and processes the card payment.

POST
https://api-d.squadco.com/softpos/pos/remote-request













Sample POS Remote Request
{
  "terminal_id": "2035AB01",
  "amount": 350000,
  "account_type": "default"
}

Responses
200:OK
Successful










400:Validation Error
Validation Error






401:Invalid Token
Invalid Token






Requery Payment Status
This endpoint allows you to requery the terminal using the request reference to confirm if payment is completed or not.

GET
https://api-d.squadco.com/softpos/pos/remote-request/{request_ref}







Sample Request
GET https://api-d.squadco.com/softpos/pos/remote-request/prq_01HV8M3K5R7XM6QEGG1YAEVF


Responses
200 Success
Success
{
  "status": 200,
  "success": true,
  "message": "Success",
  "data": {
    "status": "success",
    "id": 12345,
    "merchant_request_ref": "prq_01HV8M3K5R7XM6QEGG1YAEVF",
    "merchant_id": "MER_001",
    "terminal_id": "2035AB01",
    "amount": 350000,
    "currency": "NGN",
    "payment_method": "card",
    "transaction_type": "Purchase",
    "payment_info": {
      "card_pan": "506100******1234",
      "card_exp": "2512",
      "card_type": "visa",
      "cardholder_name": "JOHN DOE"
    },
    "transaction_reference": "TXN_REF_001",
    "virtual_account_number": null,
    "rrn": "123456789012",
    "stan": "019283",
    "aid": "A0000000041010",
    "response_code": "00",
    "response_message": "Approved",
    "processor": null,
    "meta": "{}",
    "pc_code": "PC001",
    "created_at": "2026-02-20T09:15:48.901Z"
  }
}


200 Pending
Success
{
  "status": 200,
  "success": true,
  "message": "Success",
  "data": {
    "status": "pending"
  }
}

200 Failed
Success
{
  "status": 200,
  "success": true,
  "message": "Success",
  "data": {
    "status": "failed",
    "id": 12345,
    "merchant_request_ref": "prq_01HV8M3K5R7XM6QEGG1YAEVF",
    "merchant_id": "MER_001",
    "terminal_id": "2035AB01",
    "amount": 350000,
    "currency": "NGN",
    "payment_method": "card",
    "transaction_type": "Purchase",
    "payment_info": {
      "card_pan": "506100******1234",
      "card_exp": "2512",
      "card_type": "visa",
      "cardholder_name": "JOHN DOE"
    },
    "transaction_reference": "TXN_REF_002",
    "virtual_account_number": null,
    "rrn": "123456789013",
    "stan": "019284",
    "aid": "A0000000041010",
    "response_code": "51",
    "response_message": "Insufficient funds",
    "processor": null,
    "meta": "{}",
    "pc_code": "PC001",
    "created_at": "2026-02-20T09:15:48.901Z"
  }
}

404 Expired/Not Found
false
{
  "status": 404,
  "success": false,
  "message": "Request not found or expired",
  "data": {}
}


401:Invalid Token
Invalid Token
{
    "status": "401",
    "message": "Invalid or missing token",
    "data": {}
  }

info
Response — Expired / Not Found (404) Returned when the request_ref does not exist or has expired. Payment requests are stored with a 5-minute Time To Live (TTL). Once the TTL expires, the record is automatically deleted, as such the system returns a 404 response. Which can mean:

i.The request_ref was never valid

ii.The request expired because the POS terminal did not complete the payment within 5 minutes

Best Practises/Notes
The request_ref expires after 5 minutes.

If the terminal does not process the payment within that window, requery will return 404.

Call the requery endpoint every 2-3 seconds until you get a final status (success or failed) or a 404.

When status is pending, only status is returned. When success or failed, the full transaction fields are flattened into the response.

POS Webhook
POS Merchants can now recive webhook notifications sent directly from their terminals to their systems.

Login to Squad Dashboard
Go to API and Webhook under Merchant Settings
Scroll Down and input endpoint to recieve the notification in the Webhook URL tab
Click Save Changes
Once done, any successful payment made to the terminal will be automatcally fired to the webhook url.

Sample webhook for webhook notifications (From POS to merchant system)
{
  "amount": 1000,
  "merchant_id": "AABBCCDDEEFFGGHHJJKK",
  "payment_info": {
    "card_pan": "539983****5128",
    "card_type": "MasterCard",
    "cardholder_name": "MARTINS OLARINDE"
  },
  "status": "success",
  "payment_method": "card",
  "transaction_type": "Purchase",
  "response_code": "00",
  "transaction_reference": "SQDEMO080830159201",
  "terminal_id": "2058ZUTK",
  "response_message": "Transaction Successful",
  "rrn": "080830159201",
  "stan": "159201",
  "currency": "NGN",
  "aid": "4F07A0000000041010",
  "merchant_request_ref": null,
  "updated_at": "2026-05-05T13:47:22.458Z",
  "created_at": "2026-05-05T13:47:22.458Z",
  "virtual_account_number": null,
  "receipt_no": "0025145374",
  "settlement_type": "normal",
  "instant_settlement_account_no": null,
  "mcc": {
    "mcc_code": "5411",
    "percentage_charge": 0.5,
    "capped_at_kobo": 100000
  }
}

Edit this page



Webhook & Redirect URL
Webhooks are used so that anytime an event occurs on your account, your application can be notified with instant, real-time notifications by Squad.

Squad webhooks are HTTP calls that are triggered by specific events. It is necessary only for behind-the-scenes transactions.

This can be set up on your Squad Dashboard by specifying a URL we would send POST requests to whenever a successful transaction occurs.

To process notifications, you need to:

Paste your redirect and Callback/Webhook URL in the space provided on your dashboard by following the steps below:

Login to your Squad dashboard.
Go to Profile > API & Webhook.
In the Webhook URL field, enter your Notification URL.
In the redirect URL field, enter your redirect URL- and on completion of payment, the customer will be redirected to the URL with the transaction reference passed as a query param.
Enter a redirect URL for your customers to be redirected after they complete payment.
NB:The Redirect URL is optional.

caution
KINDLY ENSURE YOU HAVE A TRANSACTION REFERENCE CHECKER WHEN IMPLEMENTING WEBHOOKS TO AVOID GIVING DOUBLE VALUE ON TRANSACTIONS.

note
Sending IP: 18.133.63.109

Webhook Validation
To configure webhook notifications: go to dashboard > profile > Api & Webhooks.

POST
https://api.gitbook.com/v1/users







Sample POST request to be sent via webhook upon successful transaction

Sample Webhook for Card Transactions
{
  "Event": "charge_successful",
  "TransactionRef": "SQTEST6389164239897900003",
  "Body": {
    "amount": 10000,
    "transaction_ref": "SQTEST6389164239897900003",
    "gateway_ref": "SQTEST6389164239897900003_1_18_1",
    "transaction_status": "Success",
    "email": "williamudousoro@gmail.com",
    "merchant_id": "SBBWRX1Z3S",
    "currency": "NGN",
    "transaction_type": "Card",
    "merchant_amount": 10000,
    "created_at": "2025-08-24T15:26:38.994",
    "meta": {
      "location": "gtbank test test"
    },
    "payment_information": {
      "payment_type": "card",
      "pan": "424242******4242|0825",
      "card_type": "verve"
    },
    "is_recurring": false
  }
}

Sample Webhook for Transfers
{
  "Event": "charge_successful",
  "TransactionRef": "SQTECH6389179925109400004",
  "Body": {
    "amount": 10000,
    "transaction_ref": "SQTECH6389179925109400004",
    "gateway_ref": "SQTECH6389179925109400004_5_5_1",
    "transaction_status": "Success",
    "email": "williamudousoro@gmail.com",
    "merchant_id": "P7SJ3KMH",
    "currency": "NGN",
    "transaction_type": "Transfer",
    "merchant_amount": 10000,
    "created_at": "2025-08-26T12:00:51.1",
    "meta": {
      "location": "gtbank bank test"
    },
    "is_recurring": false
  }
}


Sample Webhook for Bank
{
  "Event": "charge_successful",
  "TransactionRef": "SQTECH6389179913199300001",
  "Body": {
    "amount": 10000,
    "transaction_ref": "SQTECH6389179913199300001",
    "gateway_ref": "SQTECH6389179913199300001_2_2_1",
    "transaction_status": "Success",
    "email": "williamudousoro@gmail.com",
    "merchant_id": "P7SJ3KMH",
    "currency": "NGN",
    "transaction_type": "Bank",
    "merchant_amount": 10000,
    "created_at": "2025-08-26T11:58:52.013",
    "meta": {
      "location": "Bank option extra data"
    },
    "is_recurring": false
  }
}


SAMPLE WEBHOOK FOR USSD PAYMENT OPTION
{
      "Event": "charge_successful",
      "TransactionRef": "SQCHIZ6035872641857",
      "Body": {
        "amount": 20000,
        "transaction_ref": "SQCHIZ6035872641857",
        "gateway_ref": "SQCHIZ6035872641857_3_1",
        "transaction_status": "Success",
        "email": "maaa@h.com",
        "currency": "NGN",
        "transaction_type": "Ussd",
        "merchant_amount": 19800,
        "created_at": "2023-01-25T13:41:16.223",
        "customer_mobile": "0803***7205",
        "meta": {
          "plan": "premium"
        },
        "is_recurring": false
      }
}

Sample Webhook for Merchant USSD (USSD CODE ON THE DASHBOARD)
{
      "Event": "charge_successful",
      "TransactionRef": "SQCHIZ410708",
      "Body": {
        "amount": 10000,
        "transaction_ref": "SQCHIZ410708",
        "gateway_ref": "f7c810f4-b53e-4970-a3f6",
        "transaction_status": "Success",
        "email": "0803***0000",
        "merchant_id": "********",
        "currency": "NGN",
        "transaction_type": "MerchantUssd",
        "merchant_amount": 10000,
        "created_at": "2022-11-30T16:21:52.8850061+00:00",
        "customer_mobile": "0803***0000",
        "meta": {},
        "payment_information": {
          "payment_type": "merchantussd",
          "customer_ref": "123456"
        },
        "is_recurring": false
      }
}


note
Please Note that the encrypted body (x-squad-encrypted-body) is usually sent via the header

Edit this page


Signature validation
The webhook notification sent carry the x-squad-encrypted-body in the header. The hash value (x-squad-encrypted-body) is an HMAC SHA512 signature of the event payload signed using your secret key.
Sample Function (C#)
using System;
using System.Text;
using System.Security.Cryptography;
using Newtonsoft.Json;

public class Program
{
  public static void Main()
  {
	 var chargeResponse = new VirtualAccount_VM()
	 {
		 transaction_reference = "REFE52ARZHTS/1668421222619_1",
		 virtual_account_number = "2129125316",
		 principal_amount = "222.00",
		 settled_amount = "221.78",
		 fee_charged = "0.22",
		 transaction_date = "2022-11-14T10:20:22.619Z",
		 customer_identifier = "SBN1EBZEQ8",
		 transaction_indicator = "C",
		 remarks =  "Transfer FROM sandbox sandbox | [SBN1EBZEQ8] TO sandbox sandbox",
		 currency = "NGN",
		 channel =  "virtual-account",
		 meta =  new MetaBody_VM()
		 {
		 freeze_transaction_ref =  null,
		 reason_for_frozen_transaction =  null
		 },
		 encrypted_body = "ViASuHLhO+SP3KtmcdAOis+3Obg54d5SgCFPFMcguYfkkYs/i44jeT5Dbx52TcOvHRp9HlnCoFwbATkEihzv2C8UyPoC38sRb90S5Z9Fq7vRwjDQz/hYi/nKbWA0btPr3A+UXhX1Nu5ek+TL0ENUC8W1ZX/FrowX3HQaYiwe3tU/Kfr2XvAGwT7IAx5CQBhpzL34faHP4jbwSVmSgVYmW5rd2ClWQ7WWJjDMakrqYJva8qd0vhkqSpyz2KywOV9t9zSHRx3VpbvlDsBdkNGr+4Axh/7Gspu3xo9mMOIdv73OzjN4VA/qQP+fQMCjU1pbS8oh81HjwkHjzC5SBhzR8IU8bsmvFUyzJMfDoJuUB+fs09SLW7pdfODwK5vB8LtdKPnAuTPlv5dHVAPeMG/ubtl/HOqCZs4axjuO557srw0GpKk86bwaVKt4IQ17nY/QCJFC273HWU1CawP7d3nQasRZf/TU7ra+fOjQBHQ7Gtz2Pnfp3gLljBKenMT4Cabks1X2/6ZQpd/yGFkloYdS7ZW3kEvrorjcyma4WNDmJfhcdR9XGsom6Y/M/n/gMMa0z2KPbHDRoEBeRYbQHcnu5LnGWzBA4Y4RMSTDesD876PDB1bOnMzNPrWYam6ZVRHz"
		 };

		 String SerializedPayload = JsonConvert.SerializeObject(chargeResponse);
		 Console.WriteLine(SerializedPayload);
                 string result = "";
                 var secretKeyBytes = Encoding.UTF8.GetBytes("sandbox_sk_9ac9418e847972dd45f5fe845b5716ef305589808eda");
                 var inputBytes = Encoding.UTF8.GetBytes(SerializedPayload);
                 var hmac = new HMACSHA512(secretKeyBytes);
                 byte[] hashValue = hmac.ComputeHash(inputBytes);
                 result = BitConverter.ToString(hashValue).Replace("-", string.Empty);
                 Console.WriteLine(result);

                 Console.WriteLine(result.ToLower() == "18b9eb6ca68f92ca9f058da7bce6545efb12660cf75f960e552cf6098bb5ee8e71f20331dcfe0dfaea07439cc6629f901850291a39f374a1bd076c4eff1026c8");
	}
}

public class VirtualAccount_VM
{
  public string transaction_reference { get; set; }
  public string virtual_account_number { get; set; }
  public string principal_amount { get; set; }
  public string settled_amount { get; set; }
  public string fee_charged { get; set; }
  public string transaction_date { get; set; }
  public string customer_identifier { get; set; }
  public string transaction_indicator { get; set; }
  public string remarks { get; set; }
  public string currency { get; set; }
  public string channel { get; set; }
  public MetaBody_VM meta { get; set; }
  public string encrypted_body { get; set; }
}
public class MetaBody_VM
    {
        public string freeze_transaction_ref { get; set; }
        public string reason_for_frozen_transaction { get; set; }
    }


Sample Function (node)
const crypto = require("crypto");
const secret = "Your Squad Secret Key";
// Using Express
app.post("/MY-WEBHOOK-URL", function (req, res) {
  //validate event
  const hash = crypto
    .createHmac("sha512", secret)
    .update(JSON.stringify(body))
    .digest("hex")
    .toUpperCase();
  if (hash == req.headers["x-squad-encrypted-body"]) {
    // you can trust the event came from squad and so you can give value to customer
  } else {
    // this request didn't come from Squad, ignore it
  }
  res.send(200);
});


Sample Function (PHP)
<?php
​
if ((strtoupper($_SERVER['REQUEST_METHOD']) != 'POST' ) || !array_key_exists('x-squad-encrypted-body', $_SERVER) )
    exit();
// Retrieve the request's body
$input = @file_get_contents("php://input");
define('SQUAD_SECRET_KEY','YOUR_SECRET_KEY'); //ENTER YOUR SECRET KEY HERE
// validate event do all at once to avoid timing attack
if($_SERVER['x-squad-encrypted-body'] !== strtoupper(hash_hmac('sha512', $input, SQUAD_SECRET_KEY)))
// The Webhook request is not from SQUAD
    exit();
http_response_code(200);
// The Webhook request is from SQUAD
$body = json_decode($input);
exit();
?>


Sample Function (JAVA)
package hmacexample;
import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.json.JSONException;
import org.json.JSONObject;
public class HMacExample {
  public static void main(String[] args) throws UnsupportedEncodingException, InvalidKeyException, NoSuchAlgorithmException, JSONException {
    //This verifies that the request is from Squad

    String key = "YOUR_SECRET_KEY"; //replace with your squad secret_key

    String body = "BODY_OF_THE_WEBHOOK_PAYLOAD"; //Replace with body of the webhook payload

    String result = "";
    String HMAC_SHA512 = "HmacSHA512";
    String x-squad-encrypted-body = ""; //put in the request's header value for x-squad-encrypted-body

    byte [] byteKey = key.getBytes("UTF-8");
    SecretKeySpec keySpec = new SecretKeySpec(byteKey, HMAC_SHA512);
    Mac sha512_HMAC = Mac.getInstance(HMAC_SHA512);
    sha512_HMAC.init(keySpec);
    byte [] mac_data = sha512_HMAC.
    doFinal(body.toString().getBytes("UTF-8"));
    result = String.format("%040x", new BigInteger(1, mac_data));
    while (result.length() < 128)  result = "0"+ result;
    if(result.toUpperCase().equals(x-squad-encrypted-body)) {
      // you can trust that this is from squad
    }else{
      // this isn't from Squad, ignore it
    }
  }
}


Edit this page


Secure File Transfer Protocol (SFTP) Notification
SFTP Notification is an alternative to webhook notifications for securely receiving transaction confirmations. This service works by securely delivering a CSV file directly to the merchant’s server, containing all successful transactions processed within a specified period

To process notifications, you need to:

Login to your Squad dashboard.
Go to Profile > API & Webhook.
Scroll down and Select Advanced Options.
Enable the SFTP Status to live
Fill the required fields under the SFTP configurations
Click Update SFTP
note
Fields recieved in the file are same as found in Virtual Accounts Webhook Version 2
The webhook url field should be populated with a URL
File name sample
notifications_3Hwe2301_2026-05-07T16-33-22-491Z.csv.gpg


Edit this page




Virtual Accounts
The Squad Virtual Accounts API allows you to create customized fly-through accounts for receiving payments from your customers. The virtual accounts help businesses reserve their corporate bank account numbers.
caution
You must create a Sandbox account to test all integrations before going live.

Create an account on our sandbox environment
Retrieve keys from the Merchant settings Page, under the API & Webhook tab.
Authorization: Any request made without the authorization key will fail with a 401 (Service Not Authorized) response code.

info
Environment base URL:

Test: https://sandbox-api-d.squadco.com

Production: https://api-d.squadco.com

Authorization keys are to be passed via Headers as a Bearer token.

Example: Authorization: Bearer sandbox_sk_94f2b798466408ef4d19e848ee1a4d1a3e93f104046f

Explore
Virtual accounts serve as an additional payment channel for your business, allowing customers to pay directly to the account number assigned to them. Whenever money is sent to a dedicated virtual account, you will receive a notification through your webhook URL, and the amount will be instantly credited to your specified GTBank physical account.

These notifications will be sent to your webhook URL, enabling your servers to take the necessary actions related to the payment within your system.

To explore all the possibilities available with the Virtual Accounts API, please refer to our API documentation.

Edit this page

API Specifications
Specification For Virtual Accounts
The Squad Virtual Accounts API allows you to create customized fly-through accounts for receiving payments from your customers. The virtual accounts help businesses reserve their corporate bank account numbers.

Each account is assigned a unique customer identifier to facilitate the identification of payments and ensure smooth reconciliation.

caution
Please note that to create virtual accounts, your settlement account must be a GTBank Account.

Additionally, kindly provide your preferred prefix to your Technical Account Manager for account configuration before going live. The prefix should be a part or abbreviation of your business name written as one word.

Customer Model
This is a Business to Customer(B2C) model used to create virtual accounts for individuals or customers on your platform. It's important to note that there is a strict validation process for the Bank Verification Number (BVN) against the provided name, date of birth, gender, and phone number.

This means that if any of the details mentioned do not match what is registered on the BVN portal, an account will not be created.

POST
https://sandbox-api-d.squadco.com/virtual-account


































Sample Request
{
    "customer_identifier": "SQUAD_101",
    "first_name": "Joesph",
    "last_name": "Ayodele",
    "mobile_num": "08123456789",
    "email": "ayo@squadco.com",
    "bvn": "22343211654",
    "dob": "07/19/1990",
    "address": "22 Kota street, UK",
    "gender": "1",
    "beneficiary_account": "4920299492"
}

Responses
200:OK
Success Response















401:Validation Error
Validation Error







401:Unauthorized
No Authorization






403:Forbidden
Invalid/Wrong API keys






Business Model
The Business to Business(B2B) model enables you to create virtual accounts specifically for your business customers, rather than individual users. In other words, these customers are businesses (B2B) or other merchants.

Please be aware that, in accordance with the CBN's guidelines regarding validation prior to account creation, as well as concerns related to fraud, you must request profiling before you can create accounts for businesses.

Once you have completed the profiling process, you will be able to proceed with creating accounts for your business clients.

Sample Request
{
    "customer_identifier": "SQUAD_101,
    "business_name": "Habaripay Limited",
    "mobile_num": "08139011943",
    "bvn": "22110011001",
    "beneficiary_account": "4920299492"
}

POST
https://sandbox-api-d.squadco.com/virtual-account/business















Responses
200:OK
Success
















400:Bad Request
Bad Request







401:Unauthorized
No API key






403:Forbidden
Invalid Authorization key or token






424: Failed Dependency
Wrong Account Number

















Transaction Notification Service
After registering and verifying your account as a merchant, you need to create a POST Webhook endpoint. Then, enter the URL for this webhook in the "Webhook URL" field under the API & Webhook tab in the Merchant Settings of your Squad Dashboard. This will allow you to receive notifications about payments.

caution
Ensure that you have a duplicate transaction checker when implementing webhooks to prevent double transactions.

WEBHOOK: If a webhook is not provided, notifications won't be sent.

You are required to confirm receipt of the webhook request. If you do not respond, the notification will be logged in the error log service.

Expected webhook response
200: Successful
400: Validation Failure
500: System Malfunction
{
    response_code:200,
    transaction_reference: 'unique reference sent through the post',
    response_description: 'Success'
}


Webhook Validation --version 1
Method 1 (Hash Comparison)
The webhook notification sent includes the x-squad-signature in the header. This signature is an HMAC of the notification body, created using your secret key.

You need to generate a hash and compare it to the value of the hash included in the header of the POST request sent to your webhook URL.

To create the hash, use the entire notification body that is sent via the webhook.

Sample Implementations
C#
Javascript (Node)
PHP
Java
using System;
using System.Security.Cryptography;
using System.Text;
using Newtonsoft.Json.Linq;
namespace HMacExample
{
  class Program {
    static void Main(string[] args) {
      String key = "YOUR_SECRET_KEY"; //replace with your squad secret_key

      //Replace with the body of the notification received
      String webhookPayload = "THE_BODY_OF_THE_WEBHOOK_PAYLOAD YOU RECEIVED";
      String jsonInput = JsonConvert.SerializeObject(webhookPayload);
      String result = "";
      byte[] secretkeyBytes = Encoding.UTF8.GetBytes(key);
      byte[] inputBytes = Encoding.UTF8.GetBytes(jsonInput);
      using (var hmac = new HMACSHA512(secretkeyBytes))
      {
          byte[] hashValue = hmac.ComputeHash(inputBytes);
          result = BitConverter.ToString(hashValue).Replace("-", string.Empty);;
      }
      Console.WriteLine(result);
      String x-squad-signature = "Request's header value for x-squad-signature" //replace with the request's header value for x-squad-signature here
      if(result.Equals(x-squad-signature)) {
          // you can trust the event came from squad and so you can give value to customer
      } else {
          // this request didn't come from Squad, ignore it
      }
    }
  }
}


Method 2 (Decryption of Encrypted Body)
To validate the webhook you received, you need to decrypt the hashed body (encrypted_body) of the data sent via the webhook. To do this, use the Public and Secret Key found on your squad dashboard.

After decrypting the hashed body, compare the result with the original body of data sent from the webhook. If they match, you can trust that the notification is from Squad. If they do not match, it indicates that the notification did not originate from Squad, and you should disregard such notifications.

For assistance with decrypting the hashed body, please visit our encryption and decryption page, where you can find sample decryption functions in various programming languages.

Sample Webhook Notification
{
  "transaction_reference": "REF2023022815174720339_1",
  "virtual_account_number": "0733848693",
  "principal_amount": "0.20",
  "settled_amount": "0.20",
  "fee_charged": "0.00",
  "transaction_date": "2023-02-28T00:00:00.000Z",
  "customer_identifier": "5UMKKK3R",
  "transaction_indicator": "C",
  "remarks": "Transfer FROM WILLIAM JAMES | [5UM2B63R] TO CHIZOBA ANTHONY OKOYE",
  "currency": "NGN",
  "channel": "virtual-account",
  "sender_name": "WILLIAM JAMES",
  "meta": {
    "freeze_transaction_ref": null,
    "reason_for_frozen_transaction": null
  },
  "encrypted_body": "DiPEa8Z4Cbfiqulhs3Q8lVJXGjMIFzbWwI2g7utVGbiI96TjcbjW+64iQrDR+kbZBwisMLMfB5l+Bn0/9kchGjB+xj6bLc6SnyCaku3pCMKmiVSkr/US1lsk+dBBI53nkGcUFkhige35wBYtXC7IpB/N2DCrzXTW5kEGnr9lCvpEFvDhZzDIUVeUCxV14V92vYYP/8O8Zjj3WR9keUc7Qq0H+fl/jmm7VwCtKMSp0OXNGMVPk5TJkLR52hQ8Rap+oorORLoNau1FRLzA24AW0d+nQfqbI+B4hf5+RztP7F1PpiRlo5qR7EthNpaHW6EMYp9fFUQdJRzsQNLbU/IfnH5oK9zFjHaOfKAa5rnoWP3N5IQjz6wobLq9T2KHei3UpCioFMcKYoigtJxple26auq0vCDkDoalPF6+YaqpuKFWdjX0mLz9+Xh5OCq4AI4u3GhioYFbpAvkrzk/Eyh5OdrEvDDLsbSu8lnXymOoiYXuS1Y4Y5jVZpzAArJ7wX7rdi1KLawHu8/m6fBkQLq/82olUuGLtGdPKF1JZnbv3eAXa7+IMhF4QUvsd52uMRnBdEHXfij+WHp7mz4jMP4Gxsx19Xzt7gyWqBhyswEJobDMSZhk/9GRcETwnT0dlSlWxVOL2pVSzKhc73ASxEQCZCO3/5/i1Nq6qSTjsbplLKuwP2Qr/15rP6TvVWAIpxa8"
}



Webhook Validation --version 2
The Webhook Version 2 (V2) is an upgraded version of the existing webhook. It maintains the same structure but includes two critical updates:

Addition of a new field: Version Number.
Method of Hash Validation: Unlike previous versions that required hashing of the entire payload, Webhook V2 only requires hashing of six (6) specific fields. These fields should be separated by a pipe (|). The values to be hashed are:
  transaction_reference
  virtual_account_number
  currency
  principal_amount
  settled_amount
  customer_identifier

Webhook Validation --version 3
The Webhook Version 3 (V3) is an upgrade to the existing version, maintaining the same overall structure but introducing three critical updates:

The format of the Transaction Reference has changed. Please note that re-queries must still be performed using the previous format.

A new field, the Version Number, has been added.

The method of hash validation has also changed. Unlike previous versions, which required hashing the entire payload, Webhook V3 only requires hashing six specific fields, each separated by a pipe (|). The values to be hashed are as follows:

  transaction_reference
  virtual_account_number
  currency
  principal_amount
  settled_amount
  customer_identifier

Sample signature string
signature = `${payload.transaction_reference}|${payload.virtual_account_number}|${payload.currency}|${payload.principal_amount}|${payload.settled_amount}|${payload.customer_identifier}`;




The webhook notification you receive includes an x-squad-signature in the header. This signature is an HMAC (Hash-based Message Authentication Code) that is generated from the webhook payload using your secret key. To verify the integrity of the request, you need to create your own hash of the payload and compare it with the x-squad-signature sent in the header of the POST request to your webhook URL.

Version 2
Version 3
{
  "transaction_reference": "REF20260424S67978035_M01682015_9013151600",
  "virtual_account_number": "9013151600",
  "principal_amount": "1.00",
  "settled_amount": "1.00",
  "fee_charged": "0.00",
  "transaction_date": "2026-04-24T11:29:10+01:00",
  "customer_identifier": "newva1",
  "transaction_indicator": "C",
  "remarks": "000001260424112858828788701428-ONEBANK TRANSFER FROM AKINOLA MOBOLAJI NIFEMI TOTAM WILLIA M  UDOUSORO -STERLING-AKINOLAMOBOLAJI NIFEMI | [newva1]",
  "currency": "NGN",
  "channel": "virtual-account",
  "sender_name": "AKINOLA MOBOLAJI NIFEMI",
  "meta": {
    "freeze_transaction_ref": null,
    "reason_for_frozen_transaction": null
  },
  "first_name": "William",
  "last_name": "Udousoro",
  "prefix": "TAM",
  "session_id": "000001260424112858828788701400",
  "masked_sender_account_number": "009****919",
  "version": "v2",
  "transaction_uuid": "019DBF094ABEA366",
  "encrypted_body": "iJeFVV1hvWt2BjT/4wi3Rr0fMR7dlBkXM2I1hu/9ojZQdOAXH9trrSLgSNpMZ0Hx1iQtz6n/bMUjlGNZZGegIlJw69rPTvnsUi0I3pLgY9ix/lz9L6hdJ6DQ7X3E1AIRC3ZxyxlK/nuC4MtFex0bUKrSBnVMNE9zHQBXJMTA8NKNIGq/6bPnLeSe+36DHf01Pu1WiT0jL4fLhtB9QbAMOdk1tsp9wEsZgVQvPOPhc1xApVkfER/gBlDQdE7otfHhcfM6AugmmC7S1aJRNdsHwjdu86cmuOUycxLYByISt8w9QheW4rciUKOeatj7i7oHjkofnjLmut2s2ae2tA5sNsBY2N6rpv1ljturegkA8IHTTwMAkjew7qKjVC/XGwodgWUSa+ATJ5mGerbgYDtIgFXbjlL+D1mrHruQQOjzLz6rqrpWoti2brZniFMmiA+8VYKgwHpMLdKWLtLcmMgImRDlfXUSPARjHcrmCb+uk0FOzJnSErpvLqZ0C3nU/L0+Fyx/U7BSWXLzsZ6zZHWhwp5Tk4DBTtGWoDANmS2wk6OD8igaNUOECENxzcPSdpf6IwxNBBMHdTU0V1RcPJGias0ATsjbA0swRsnm9gowA+brOR4yNiC0Ksd3cPkON86TxIn6zBbCnWxz7ugfUcAwJWElp06J+xUVX1oEhqrhYJTo/w3/hy6GFI0ukgp9wSHB8OWq/lnx97m3J4kRXtGh12rI7ukpX5o3hj62HGFQy67NWgmtwME7KOfpjzm2NKSCkiFh7Jtv0cEaF5uJ/9j0N9H5kIQaPI1Qxh6ag8sIKrFt/ermGqDo2SQwi2KzRmt3rsoAhHVyi+QXzqVFIHBIzh0MXigCqrO/B2IobxbL7doRe9mPyWOhxioSG8TGZY5D3eiGovz5Tq+mI/UtCvZFwJrg2KC3Dw0H8rvcElSsFQKnwZN0qov5eUJS3oBl+XQghjDQopiTEXsgyxUrCfigDa3AbnCWREmalIWhXRwpeCzVma6SlAedieRiU75VkByN5P+iZMbtpDpbgBn4Ip+dIUxzZ80U1G+bMX8GFaR2RFLXDbfZ90JpBCAvvvicFeHtj9CtAUo0tMUbnhULB5qfeA=="
}



Sample v2 and v3 notifications
C#
PHP
Javascript
using System;
using System.Text;
using System.Security.Cryptography;
using System.Text.Json;

// Expected signature from the header
const string ExpectedSignature = "64cab69cecb62ad24da041789847a070e93621071fcbd84ccf975150b820dcb1a1eaeae00bb9be976007cad4eeaa83e01d201b3fc28c7dfeb27834939a5bc755";

// Secret key for HMAC
const string SecretKey = "user_sk_sample-secret-key-1";

// Sample payload
var payload = new
{
    transaction_reference = "0196F220EA4148F3",
    virtual_account_number = "0712714141",
    principal_amount = "45000.00",
    settled_amount = "44955.00",
    fee_charged = "45.00",
    transaction_date = "2025-05-21T10:16:05+01:00",
    customer_identifier = "RRRR",
    transaction_indicator = "C",
    remarks = "100004230823134654105988596264|090701365374||EUSTACE UGOCHUKWU NJOKU || REF:989898999888998898989899 | [RRRR]",
    currency = "NGN",
    channel = "virtual-account",
    sender_name = "Transfer",
    meta = new
    {
        freeze_transaction_ref = (string)null,
        reason_for_frozen_transaction = (string)null
    },
    version = "v3",
    encrypted_body = "4eDIvGkwNhH+u0HgAJB2c3GKIKnweltSZso1o/otX3x+8LXQti6+FtCqbHhrSy8RNk1wB3oWswWbY1qq5+C2QN2kA9ogIM4P0uGqciTClxQVtKaAZCaAGjWr0vmqt928oyop6WJ3jzqTGnQwheAm9ITNAnbXgShfPtmOMtJyWAKwR+QNQyoZjdArQKqJzm5RxbI/iHp2ZmJpgr0229AREiahdIhy80sRO7ztHD4M1QmYBXrzElrcJ85ZtAFM41DsUtqojeW0eR8kWw8ghTHmL5rmCD0sselidmC7NFpiIpn3RuHOBNYXfcVU38+LVdBPmNygFd9iX2n0kxxLMBX9X4ngQDiaR6faKo2rOJ0/KXg44YM/y/dYVHsjBHqZXuB252FoZk7bUKbW6ebPXIuEkgjB63El/BcbLXtbjrw0w3ybXqY6pVahi8SuURJe7DcglS8IITacYybcjfoZYsiKCJKZqlb2pkLCCoNpaEEEqa8dP0b3QdisDiTy3vvWB1nGuxPjk9kPWr/IxqP9/NbPoWN4MRVU6PsmPHhHyd3tiUWfPCMBAT9EB7ldjHl8tpVGjKRkGzvVuuc9tm8c6gPPotW9/M3SnKgm23becDp/hGMaA0PbFwVs7h+JjWMu3UcHlujFUqHRDA/TZ5Vvp8uT2ZDc5y+wisUntKW3F+gBv0mL+ifagi/PJRXOYXdG4oIEUw/Jy7bdY+JrGbBmsS8RhOkbIcFf4ClU2cnHB5h/6TA="
};

// formatted string with pipe separators
string dataToHash = $"{payload.transaction_reference}|{payload.virtual_account_number}|{payload.currency}|{payload.principal_amount}|{payload.settled_amount}|{payload.customer_identifier}";

Console.WriteLine($"Data to hash (with pipe separators): {dataToHash}");

// hash using HMAC-SHA512 with the secret key
string generatedHash = GenerateHmacSHA512(dataToHash, SecretKey);

Console.WriteLine($"Generated hash: {generatedHash}");
Console.WriteLine($"Expected hash:  {ExpectedSignature}");
Console.WriteLine($"Hashes match: {generatedHash == ExpectedSignature}");


// HMAC-SHA512 with secret key
static string GenerateHmacSHA512(string input, string key)
{
    byte[] keyBytes = Encoding.UTF8.GetBytes(key);
    byte[] inputBytes = Encoding.UTF8.GetBytes(input);

    using HMACSHA512 hmac = new HMACSHA512(keyBytes);
    byte[] hashBytes = hmac.ComputeHash(inputBytes);

    // Convert the byte array to a hexadecimal string
    StringBuilder sb = new StringBuilder();
    for (int i = 0; i < hashBytes.Length; i++)
    {
        sb.Append(hashBytes[i].ToString("x2"));
    }

    return sb.ToString();
}



Webhook Error Log
This API allows you to retrieve all your missed webhook notifications, enabling you to update your records without manual input.

By default, an array of the top 100 missed webhooks will always be returned.

The process involves the integration of two APIs. The first API fetches the missed notifications. Once you have updated the record for a specific transaction, you must use the second API to delete the record from the error log. If you fail to do this, the transaction notification will continue to appear in the first 100 transactions until it is deleted.

Additionally, ensure that you implement a transaction duplicate checker to avoid updating a record twice or modifying a record that has already been updated through the webhook or transaction API.

Get Webhook Error Log
GET
https://sandbox-api-d.squadco.com/virtual-account/webhook/logs






Responses
200:OK
Response description




































401:Unauthorized
No Authorization






Delete Webhook Error Log
DELETE
https://sandbox-api-d.squadco.com/virtual-account/webhook/logs/:transaction_ref




Responses
200:OK
Success







401:Unauthorized
No Authorization






403:Forbidden
Wrong/Invalid API Keys






Query Transactions Using Customer Identifier
This endpoint allows querying the transactions made by a customer using their identifier provided during the creation of the virtual account.

GET
https://sandbox-api-d.squadco.com/virtual-account/customer/transactions/{{customer_identifier}}





Response expected from the API to show queried Virtual Accounts.

200: Successful
400: Validation Failure
401: Restricted
404: Not Found
{
    "status": 200,
    "success": true,
    "message": "Success",
    "data": [
        {
            "transaction_reference": "74902084jjjfksoi93004891_1",
            "virtual_account_number": "2224449991",
            "principal_amount": "30000.00",
            "settled_amount": "0.00",
            "fee_charged": "0.00",
            "transaction_date": "2022-04-21T09:00:00.000Z",
            "transaction_indicator": "C",
            "remarks": "Payment from 10A2 to 2224449991",
            "currency": "NGN",
            "frozen_transaction": {
                "freeze_transaction_ref": "afbd9b7f-fb98-41c3-bfe8-dc351cfb45c7",
                "reason": "Amount above 20000 when BVN not set"
            },
            "customer": {
                "customer_identifier": "SBN1EBZEQ8"
            }
        },
{
            "transaction_reference": "676767_1",
            "virtual_account_number": "2224449991",
            "principal_amount": "1050.00",
            "settled_amount": "1037.00",
            "fee_charged": "13.00",
            "transaction_date": "2022-03-21T09:00:00.000Z",
            "transaction_indicator": "C",
            "remarks": "Payment from 10A2 to 2224449991",
            "currency": "NGN",
            "froze_transaction": null,
            "customer": {
                "customer_identifier": "SBN1EBZEQ8"
            }
        }
    ]
}

Query All Merchant's Transactions
This is an endpoint to query all the merchant transactions over a period of time.

GET
https://sandbox-api-d.squadco.com/virtual-account/merchant/transactions

200: Successful
400: Validation Failure
401: Restricted
404: Not Profiled

{
    "status": 200,
    "success": true,
    "message": "Success",
    "data": [
        {
            "transaction_reference": "4894fe1_1",
            "virtual_account_number": "2244441333",
            "principal_amount": "5000.00",
            "settled_amount": "0.00",
            "fee_charged": "0.00",
            "transaction_date": "2022-04-21T09:00:00.000Z",
            "transaction_indicator": "C",
            "remarks": "Payment from 15B8 to 2244441333",
            "currency": "NGN",
            "frozen_transaction": {
                "freeze_transaction_ref": "afbd9b7f-fb98-41c3-bfe8-dc351cfb45c7",
                "reason": "Amount above 20000 when BVN not set"
            },
            "customer": {
                "customer_identifier": "SBN1EBZEQ8"
            }
        },
{
            "transaction_reference": "676767_1",
            "virtual_account_number": "2224449991",
            "principal_amount": "30000.00",
            "settled_amount": "1037.00",
            "fee_charged": "13.00",
            "transaction_date": "2022-03-21T09:00:00.000Z",
            "transaction_indicator": "C",
            "remarks": "Payment from 10A2 to 2224449991",
            "currency": "NGN",
            "froze_transaction": null,
            "customer": {
                "customer_identifier": "SBN1EBZEQ8"
            }
        }
    ]
}


Query All Merchant Transactions with Multiple Filters
This endpoint allows querying all transactions with multiple filters, including virtual account number, start and end dates, and customer identifier.

GET
https://sandbox-api-d.squadco.com/virtual-account/merchant/transactions/all




























Responses
200:OK
Success

























































































































































































































400:Bad Request
Wrong/ Invalid Input







401:Unauthorized
No API Keys






403:Forbidden
Invalid Keys/Token






Get Customer Details by Virtual Account Number
This endpoint retrieves customer details using the Virtual Account Number.

GET
https://sandbox-api-d.squadco.com/virtual-account/customer/{{virtual_account_number}}




Responses
200:OK
Valid Virtual Account Number














404:Not Found
Invalid Virtual Account Number







Get Customer Details Using Customer Identifier
This endpoint retrieves customer details using the Virtual Account Number.

GET
https://sandbox-api-d.squadco.com/virtual-account/{{customer_identifier}}





200: Successful
400: Validation Failure
404: Not Profiled
{
    "status": 200,
    "success": true,
    "message": "Success",
    "data": {
        "first_name": "Wisdom",
        "last_name": "Trudea",
        "bank_code": "737",
        "virtual_account_number": "555666777",
        "customer_identifier": "10D2",
        "created_at": "2022-01-13T11:03:54.252Z",
        "updated_at": "2022-01-13T11:09:51.657Z"
    }
}


Query All Merchant's Virtual Accounts
This endpoint retrieves all virtual account numbers for a merchant.

GET
https://sandbox-api-d.squadco.com/virtual-account/merchant/accounts













200: Successful
404: Not Profiled
{
    "status": 200,
    "success": true,
    "message": "Success",
    "data": [
        {
            "bank_code": "058",
            "virtual_account_number": "2224449991",
            "beneficiary_account": "4829023412",
            "created_at": "2022-02-09T16:02:39.170Z",
            "updated_at": "2022-02-09T16:02:39.170Z",
            "customer": {
                "first_name": "Ifeanyi",
                "last_name": "Igweh",
                "customer_identifier": "10A2"
            }
        },
        {
            "bank_code": "058",
            "virtual_account_number": "111444999",
            "beneficiary_account": "9829023411",
            "created_at": "2022-02-09T16:02:39.170Z",
            "updated_at": "2022-02-09T16:02:39.170Z",
            "customer": {
                "first_name": "Paul",
                "last_name": "Aroso",
                "customer_identifier": "10B2"
            }
        }
    ]
}


Simulate Payment
This is an endpoint to simulate payments

POST
https://sandbox-api-d.squadco.com/virtual-account/simulate/payment
Simulate Payment
This is an endpoint to simulate payment *asterisks are required and mandatory.

Parameters
Header
content-type*

String

application/json

Authorization*

String

Private Key or Secret Key (Gotten from your dashboard)

Body
virtual_account_number*

String

Virtual Account number of customer that wants to make payment.

amount

String

Simulated Amount

Responses
200:OK
Successful
{
            "success": true,
            "message": "Success",
            "data": {}
}

Going Live
To go live, follow these steps:

Change the base URL for your endpoints from https://sandbox-api-d.squadco.com to https://api-d.squadco.com.
Sign up for our Live Environment.
Complete your Know Your Customer (KYC) process.
Share your Merchant ID with the Technical Account Manager for profiling.
Use the credentials provided on the live dashboard for authentication.
Edit this page



Virtual AccountsEncryption & Decryption
Encryption & Decryption
Encryption and Decryption function for decrypting merchant transaction

Javascript

Encryption
 let key = crypto.createHash('sha256').update(String(merchant_secret_key)).digest('base64').substr(0, 32);
                  let IV = crypto.createHash('sha256').update(String(merchant_public_key)).digest('base64').substr(0, 16);
                  const cipher = crypto.createCipheriv('aes256', key, IV);
                  let encrypted = cipher.update(JSON.stringify(body), 'utf8', 'base64');
                  return encrypted += cipher.final('base64');
                  


Decryption
 let key = crypto.createHash('sha256').update(String(merchant_secret_key)).digest('base64').substr(0, 32);
                  let IV = crypto.createHash('sha256').update(String(merchant_public_key)).digest('base64').substr(0, 16);
                  const decipher = crypto.createDecipheriv('aes256', key, IV);
                  let decrypted = decipher.update(body, 'base64', 'utf8');
                  decrypted += decipher.final('utf8');
                  return JSON.parse(decrypted);


Python

from Crypto.Cipher import AES
                  import base64
                  import hashlib
  
  
                  def _pad(s): return s + (AES.block_size - len(s) % AES.block_size) * chr(AES.block_size - len(s) % AES.block_size) 
                  def _cipher():
                      key = hashlib.md5(merchant_secret_key).hexdigest() # 32 character hexadecimal
                      iv = hashlib.md5(merchant_public_key).digest() # 16 byte binary
                      return AES.new(key=key, mode=AES.MODE_CBC, IV=iv)
  
                  def encrypt_token(data):
                      return _cipher().encrypt(_pad(data))
                      
                  def decrypt_token(data):
                      return _cipher().decrypt(data)
  
                  if __name__ == '__main__':
                      print('Python encrypt: ' + base64.b64encode(encrypt_token('dmyz.org')))
                      print('Python decrypt: ' + decrypt_token(base64.b64decode('FSfhJ/gk3iEJOPVLyFVc2Q==')))


PHP

 <?php
  
              class AES
              {
                  
                  function encryptToken($data, $merchant_secret_key, $merchant_public_key)
                  {
                      $key = substr(hash('sha256', $merchant_secret_key, true), 0, 32);
                      $iv = substr(hash('sha256', $merchant_public_key, true), 0, 16);
                      // use openssl:
                      return openssl_encrypt($data, 'aes256', $key, OPENSSL_RAW_DATA, $iv);
                  }
  
                  function decryptToken($data, $merchant_secret_key, $merchant_public_key)
                  {
                      $key = substr(hash('sha256', $merchant_secret_key, true), 0, 32);
                  $iv = substr(hash('sha256', $merchant_public_key, true), 0, 16);
                      // use openssl:
                      return openssl_decrypt(base64_decode($data), 'aes256', $key, OPENSSL_RAW_DATA, $iv);
                  
                  }
              }
  
              $aes = new AES();
              $arr = array(
              'transaction_reference'=>'49test_1',
              'virtual_account_number'=>'4899284992',
              'principal_amount'=> '2350.00',
              'settled_amount'=> '2338.25',
              'fee_charged'=> '11.75',
              'transaction_date'=> '2022-02-19T00:00:00.000Z',
              'customer_identifier'=> '10A2',
              'transaction_indicator'=> 'C',
              'remarks'=> 'Payment from 10A2 to 4899284992',
              'currency'=> 'NGN',
              'channel'=> 'virtual-account'
              );
  
              echo ('PHP encrypt: '.base64_encode($aes->encryptToken(json_encode($arr), 'staging_sk_sample-secret-key-1', 'staging_pk_sample-public-key-1')))."
";
              echo ('PHP decrypt: '.$aes->decryptToken('Ajc/9TOSwbz1lTReb7BTo4XjL7bzJ0GWIxuncvSXfK83ZsYFt4bOt5+QQRz0jFFNSf6+7Axuqp91rR7aD/YwYczQQgUM+7QrK7nTw1KJbwTvPSSk3/IEektOlUx7DK7uXHlBBN9eVmn8tfDLKrsgj7zhymQhCfCoUTcDou3UyYWbKitwGH0o2X3hZo7cVqqq6Khnb12EwlK2kVhZvAjnu5g+T7erI1+RSb3jjab0MguWO6I3oXs9OGsiQKmCqZn564/q3ojArjk5OR8r3jBFgH4d96FoXS536rS8Toh5KPIVSGUjXLthcsWdgQ2VNzqBJ2iktzftFNgQRMdxQFCpaE0JwTKVkAyX0n3JDXt7DC+cTY+cHvAHRtl0zYhhrqT0WX4x95h+/WCdT27FEIJJJqJPBPHS1VAXwPS/v5sPGqdkqgFngTrYPaExk3YWoTxhonzT2tkagsGCaDuk8eptSA==', 'staging_sk_sample-secret-key-1', 'staging_pk_sample-public-key-1'))."
";
  
              ?>
                  


C#

using System;  
                  using System.IO;  
                  using System.Security.Cryptography;  
                  class ManagedAesSample {  
                      public static void Main() {  
                          Console.WriteLine("Enter text that needs to be encrypted..");  
                          string data = Console.ReadLine();  
                          EncryptAesManaged(data);  
                          Console.ReadLine();  
                      }  
                      static void EncryptAesManaged(string raw) {  
                          try {  
                              // Create Aes that generates a new key and initialization vector (IV).    
                              // Same key must be used in encryption and decryption    
                              using(AesManaged aes = new AesManaged()) {  
                                  // Encrypt string    
                                  byte[] encrypted = Encrypt(raw, aes.Key, aes.IV);  
                                  // Print encrypted string    
                                  Console.WriteLine($ "Encrypted data: {System.Text.Encoding.UTF8.GetString(encrypted)}");  
                                  // Decrypt the bytes to a string.    
                                  string decrypted = Decrypt(encrypted, aes.Key, aes.IV);  
                                  // Print decrypted string. It should be same as raw data    
                                  Console.WriteLine($ "Decrypted data: {decrypted}");  
                              }  
                          } catch (Exception exp) {  
                              Console.WriteLine(exp.Message);  
                          }  
                          Console.ReadKey();  
                      }  
                      static byte[] Encrypt(string plainText, byte[] Key, byte[] IV) {  
                          byte[] encrypted;  
                          // Create a new AesManaged.    
                          using(AesManaged aes = new AesManaged()) {  
                              // Create encryptor    
                              ICryptoTransform encryptor = aes.CreateEncryptor(Key, IV);  
                              // Create MemoryStream    
                              using(MemoryStream ms = new MemoryStream()) {  
                                  // Create crypto stream using the CryptoStream class. This class is the key to encryption    
                                  // and encrypts and decrypts data from any given stream. In this case, we will pass a memory stream    
                                  // to encrypt    
                                  using(CryptoStream cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write)) {  
                                      // Create StreamWriter and write data to a stream    
                                      using(StreamWriter sw = new StreamWriter(cs))  
                                      sw.Write(plainText);  
                                      encrypted = ms.ToArray();  
                                  }  
                              }  
                          }  
                          // Return encrypted data    
                          return encrypted;  
                      }  
                      static string Decrypt(byte[] cipherText, byte[] Key, byte[] IV) {  
                          string plaintext = null;  
                          // Create AesManaged    
                          using(AesManaged aes = new AesManaged()) {  
                              // Create a decryptor    
                              ICryptoTransform decryptor = aes.CreateDecryptor(Key, IV);  
                              // Create the streams used for decryption.    
                              using(MemoryStream ms = new MemoryStream(cipherText)) {  
                                  // Create crypto stream    
                                  using(CryptoStream cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read)) {  
                                      // Read crypto stream    
                                      using(StreamReader reader = new StreamReader(cs))  
                                      plaintext = reader.ReadToEnd();  
                                  }  
                              }  
                          }  
                          return plaintext;  
                      }  
  }  


Edit this page





Dynamic Virtual Account Overview
This module provides APIs to generate a pool of Virtual Accounts that can be assigned on a transaction-by-transaction basis. You can set parameters such as expiry time, transaction reference, and the amount to be collected.

info
Please be aware that all newly created accounts will now show the merchant's business name instead of the previous standard, "SQUAD CHECKOUT." The new format will be "SQUAD_MERCHANT BUSINESS NAME." Existing accounts will remain unaffected by this change.

Once you create the pool of accounts, the system will automatically assign accounts from your pool on a transaction basis. It includes various webhook notifications for events such as mismatches, expirations, and successful transactions. There is also a re-query endpoint to check all transactions that have been queued for refunds and those that have already been refunded.

caution
Important: To create dynamic virtual accounts for your pool, your KYC account must be a GTB account number mapped to the provided BVN.

Process Flow
All accounts must be profiled before you can use this service, as it is restricted to selected businesses. Please send an email to help@squadco.com or growth@habaripay.com to request permission to use this service.

Each merchant is assigned a separate pool of accounts and is expected to create accounts based on their use case and anticipated transaction volume.

To initiate a transaction, the merchant should call the Generate Dynamic Virtual Account endpoint. An account from your specific pool will be assigned for the transaction, and it will be linked to the amount and duration you have specified.

Webhook notifications will be triggered for three events: SUCCESS, EXPIRED, and MISMATCH.

There is a re-query feature that provides all payment attempts for a single transaction reference, returning an array that includes the status of each attempt (SUCCESS, EXPIRED, or MISMATCH where applicable).

API KEYS (Test Environment)
Create an account in our sandbox environment.
Share your Merchant ID with the Technical Account Managers for profiling.
Retrieve authorization keys from the "API and WEBHOOKS" tab in the "Merchant Settings" page.
Create Dynamic VA Accounts
This feature allows you to create and assign dynamic virtual accounts to your pool. Note that only one account is generated per request.

POST
https://sandbox-api-d.squadco.com/virtual-account/create-dynamic-virtual-account









Responses
200:OK
Success







400:Bad Request
Bad Request








401:Unauthorized
No Authorization






403:Forbidden
Invalid/Wrong Authorization







Instant Settlement
For instant settlement to GTBank corporate account, please include the beneficiary_account key in the request body with a GTBank account number. Only GTBank accounts are acceptable.

Sample request
{
"beneficiary_account": "0147799000"
}

Custom DVA name
When you request a customized business name for your virtual accounts, please include the "first_name" and "last_name" fields along with their corresponding values in the request body. Note that only authorized merchants can access this feature. Additionally, ensure that all account names within a pool are identical, as the system will randomly select accounts from this pool.

Sample request
{
 "first_name": "Habaripay",
 "last_name": "Limited"
 }

Initiate Dynamic Virtual Account Transaction
This API allows you to retrieve a Dynamic Virtual Account from the pool of accounts to be assigned for collection. This is used to initiate a transaction.

POST
https://sandbox-api-d.squadco.com/virtual-account/initiate-dynamic-virtual-account













Responses
200:OK
Success
















401:Unauthorized
No Authorization






403:Forbidden
Wrong/Invalid API Keys






Sample Request
{
    "amount":100,
    "transaction_ref":"Aq1111BddCDqdddqdqqEw2",
    "duration":600,
    "email":"hittommyi02@gmail.com"
}

Re-query Transaction
This API facilitates the ability to re-query a transaction in order to ascertain its status. It presents a comprehensive array of all transaction attempts, encompassing those that resulted in MISMATCH, those that EXPIRED, and those that were SUCCESSFULLY completed. It is important to note that all EXPIRED and MISMATCH transactions will be subject to a refund by our system.

GET
https://sandbox-api-d.squadco.com/virtual-account/get-dynamic-virtual-account-transactions/:transaction_reference




Responses
200:OK
Success






























401:Unauthorized
No Authorization






403:Forbidden
Wrong/Invalid API Keys






Edit Amount/Duration
This API is used to modify the amount and duration of a dynamic transaction that has already been initiated. It takes the transaction reference, the amount, and the duration.

PATCH
https://sandbox-api-d.squadco.com/virtual-account/update-dynamic-virtual-account-time-and-amount









Responses
200:OK
Success













401:Unauthorized
No Authorization






403:Forbidden
Wrong/Invalid API Keys






404:Not Found
Invalid Transaction Ref







Sample Request
{
    "transaction_reference": "ify21",
    "amount": 5000
}

Simulate Payment Endpoint
This API is designed for the purpose of submitting test transactions. It is important to note that this API should only be utilized within the sandbox environment.

POST
https://sandbox-api-d.squadco.com/virtual-account/simulate/payment









Responses
200:OK
Success







401:Unauthorized
No Authorization






403:Forbidden
Wrong/Invalid API Keys






DVA Refunds
As previously mentioned in this documentation, customers are required to pay the exact amount specified for each initiated Dynamic Virtual Account (DVA) within the designated time frame. If a customer fails to do so (resulting in a mismatched or expired transaction), the default procedure is for the customer to receive an automatic refund.

However, in cases where merchants prefer to have the mismatched or expired funds settled directly to them and assume the responsibility of refunding their customers, this can now be arranged. Expired or mismatched DVA transactions will be processed to one of the following options:

Merchant's Dashboard
Merchant's GTBank Settlement Account
Sub-Merchant's Wallet
Process Flow
To initiate this process, a merchant must submit a written request via email for any of the profiling options. The email should include:
Merchant ID
The preferred settlement location for the mismatched or expired transactions (Merchant Dashboard, GTBank Settlement Account, or Sub-Merchant Wallet)
The email should be sent to the Key Account Manager, with growth@squadco.com copied on the correspondence.

If the request is approved, the merchant will be internally profiled and notified accordingly.

Webhooks
info
To set up your webhook, please visit your squad dashboard and navigate to the merchant settings page. There, you will find a field labeled 'Webhook URL' under the API & Webhook tab. Only accounts with a valid webhook URL will receive notifications.

Webhook notifications are sent for three different events/statuses:

Success: This occurs when the first transfer/transaction meets the expected/specified amount and is completed within the designated time frame.

Mismatch: This happens when a transfer occurs within the specified duration, but the transferred amount does not match the expected amount.

Expired: This status is triggered when a transaction occurs after the set duration, or after a successful transaction has already been recorded, regardless of whether the transferred amount is equal to the expected amount.

Sample Webhook Notification (Success)
{
  "transaction_status": "SUCCESS",
  "merchant_reference": "test55",
  "merchant_amount": "100.00",
  "amount_received": "100.00",
  "transaction_reference": "REF20250321S51557521_M01282553_0855445055",
  "email": "williamudousoro@gmail.com",
  "merchant_id": "P7SJ3KMH",
  "sub_merchant_id": null,
  "transaction_type": "dynamic_virtual_account",
  "date": "2025-03-21T08:52:42.729Z",
  "sender_name": "WILLIAM  JOSEPH UDOUSORO"
}

Sample Webhook Notification (Expired)
{
  "transaction_status": "EXPIRED",
  "merchant_reference": "test55",
  "merchant_amount": "100.00",
  "amount_received": "100.00",
  "transaction_reference": "REF20250321S51557521_M01282553_0855445055",
  "email": "williamudousoro@gmail.com",
  "merchant_id": "P7SJ3KMH",
  "sub_merchant_id": null,
  "transaction_type": "dynamic_virtual_account",
  "date": "2025-03-22T08:52:42.729Z",
  "sender_name": "WILLIAM  JOSEPH UDOUSORO"
}

Sample Webhook Notification (Mismatch)
{
  "transaction_status": "MISMATCH",
  "merchant_reference": "test55",
  "merchant_amount": "100.00",
  "amount_received": "102.00",
  "transaction_reference": "REF20250321S51557521_M01282553_0855445055",
  "email": "williamudousoro@gmail.com",
  "merchant_id": "P7SJ3KMH",
  "sub_merchant_id": null,
  "transaction_type": "dynamic_virtual_account",
  "date": "2025-03-21T08:52:42.729Z",
  "sender_name": "WILLIAM  JOSEPH UDOUSORO"
}

Hash Signature Validation
Every webhook request includes a hash signature in the request header. As a security measure, you are required to create a hash and compare it to the hash sent in the header. This hash is a SHA-512 hash generated from specific parameters in the payload, using your squad's secret/private key.

The signature in the header is identified by the key: x-squad-encrypted-body.

Webhook Payload to be hashed
Below are the parameters that need to be hashed from the webhook payload:

{
 transaction_reference: "REF202308010384993",
 amount_received: "3000",
 merchant_reference: "test_1",
}

Sample Implementation
C#
  using System;
  using System.Collections.Generic;
  using System.Security.Cryptography;
  using System.Text;
  using System.Text.Json;

  public class Program
  {
      public static void Main()
      {
          string secretKey = "sandbox_sk_1sfsdfa9c3b324241e19dfd25ac0c797193fd7cca";

  
          string receivedSignature = "16be3425345ccbd37b98b5e3983da18a1becf1d78e87cf3dc59b6f685fe2bfa07d9a5dc3830599c078e3199aa3a67dc39197b98b1fe386b493ab1ac970bdfd0d5";

          
          var verificationData = new
          {
              transaction_reference = "REF20250730S40083324_M1023327831_0900939602",
              amount_received = "200.00",
              merchant_reference = "sample101ssdxcvxxcs"
          };

        
          bool isValid = VerifyHashHelper(verificationData, receivedSignature, secretKey);

          Console.WriteLine("\n--- RESULT ---");
          Console.WriteLine("Signature Match: " + isValid);
      }

      private static bool VerifyHashHelper(object value, string authHeader, string secretKey)
      {
          if (string.IsNullOrEmpty(secretKey))
              throw new InvalidOperationException("Secret key is not configured");

          byte[] keyBytes = Encoding.UTF8.GetBytes(secretKey);

          
          var dict = new Dictionary<string, string>
          {
              { "transaction_reference", ((dynamic)value).transaction_reference },
              { "amount_received", ((dynamic)value).amount_received },
              { "merchant_reference", ((dynamic)value).merchant_reference }
          };

          var jsonOptions = new JsonSerializerOptions
          {
              WriteIndented = false,
  #if NET6_0_OR_GREATER
              DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
  #else
              IgnoreNullValues = true
  #endif
          };

          string jsonValue = JsonSerializer.Serialize(dict, jsonOptions);

          Console.WriteLine("JSON used for hashing:");
          Console.WriteLine(jsonValue);

          byte[] dataBytes = Encoding.UTF8.GetBytes(jsonValue);

          using (var hmac = new HMACSHA512(keyBytes))
          {
              byte[] hash = hmac.ComputeHash(dataBytes);
              string result = BitConverter.ToString(hash).Replace("-", "").ToLower();

              Console.WriteLine("\nGenerated Signature:");
              Console.WriteLine(result);

              return result.Equals(authHeader, StringComparison.OrdinalIgnoreCase);
          }
      }
  }


Webhook Error Log
This contains all missed webhook notifications that we didn't get a 200 response for. The aim of this is to mitigate against missed webhooks. Click to open API specifications

Sample Error Log Response for DVA
{
    "status": 200,
    "success": true,
    "message": "Success",
    "data": {
        "count": 2,
        "rows": [
            {
                "id": "2dc56eb3-d997-4e68-adf9-53b603c16a43",
                "payload": {
                    "date": "2023-08-09T15:09:54.958Z",
                    "email": "igwehifeanyi02@gmail.com",
                    "merchant_id": "SBN1EBZEQ8",
                    "amount_received": "100.00",
                    "merchant_amount": "100.00",
                    "transaction_type": "dynamic_virtual_account",
                    "merchant_reference": "C2",
                    "transaction_status": "SUCCESS",
                    "transaction_reference": "REF7VDV8JV25/1691593794798"
                },
                "transaction_ref": "REF7VDV8JV25/1691593794798"
            },
            {
                "id": "b7983af4-ad3e-40ef-91d4-55af04bb2173",
                "payload": {
                    "date": "2023-08-09T15:04:41.017Z",
                    "email": "igwehifeanyi02@gmail.com",
                    "merchant_id": "SBN1EBZEQ8",
                    "amount_received": "100.00",
                    "merchant_amount": "100.00",
                    "transaction_type": "dynamic_virtual_account",
                    "merchant_reference": "Cw2",
                    "transaction_status": "SUCCESS",
                    "transaction_reference": "REFANGDGNQ1N/1691593480709"
                },
                "transaction_ref": "REFANGDGNQ1N/1691593480709"
            }
        ]
    }
}

Edit this page

Transfer APITransfer API
Transfer API
These are suites of API that allows you move funds from your Squad Ledger to a bank Account.
info
Environment base URL:

Test: https://sandbox-api-d.squadco.com

Production: https://api-d.squadco.com

Authorization keys are to be passed via Headers as a Bearer token.

Example: Authorization: Bearer sandbox_sk_94f2b798466408ef4d19e848ee1a4d1a3e93f104046f

Account Lookup
This API allows you lookup/confirm the account name of the recipient you intend to credit. This should be done before initiating the transfer.

POST
https://sandbox-api-d.squadco.com/payout/account/lookup






Responses
200:OK
Success
{
            "status": 200,
            "success": true,
            "message": "Success",
            "data": {
                "account_name": "JENNY SQUAD",
                "account_number": "0123456789"
            }
}

401:Unathorized
No Authorization
{
            "success": false,
            "message": "",
            "data": {}
}

403:Forbidden
Invalid/Wrong API Keys
{
            "success": false,
            "message": "Merchant authentication failed",
            "data": {}
}

Available Bank Codes
000001       Sterling Bank
000002       Keystone Bank
000003       FCMB
000004       United Bank for Africa
000005       Diamond Bank
000006       JAIZ Bank
000007       Fidelity Bank
000008       Polaris  Bank
000009       Citi Bank
000010       Ecobank Bank
000011       Unity Bank
000012       StanbicIBTC Bank
000013       GTBank Plc
000014       Access Bank
000015       Zenith Bank Plc
000016       First Bank of Nigeria
000017       Wema Bank
000018       Union Bank
000019       Enterprise Bank
000020       Heritage
000021       Standard Chartered
000022       Suntrust Bank
000023       Providus Bank
000024       Rand Merchant Bank
000025       Titan Trust Bank
000026       Taj Bank
000027       Globus Bank
000028       Central Bank of Nigeria
000029       Lotus Bank
000031       Premium Trust Bank
000033       eNaira
000034       Signature Bank
000036       Optimus Bank
050002       FEWCHORE FINANCE COMPANY LIMITED
050003       SageGrey Finance Limited
050005       AAA Finance
050006       Branch International Financial Services
050007       Tekla Finance Limited
050009       Fast Credit
050010       Fundquest Financial Services Limited
050012       Enco Finance
050013       Dignity Finance
050013       Trinity Financial Services Limited
400001       FSDH Merchant Bank
060001       Coronation Merchant Bank
060002       FBNQUEST Merchant Bank
060003       Nova Merchant Bank
060004       Greenwich Merchant Bank
070007       Omoluabi savings and loans
090001       ASOSavings & Loans
090005       Trustbond Mortgage Bank
090006       SafeTrust
090107       FBN Mortgages Limited
100024       Imperial Homes Mortgage Bank
100028       AG Mortgage Bank
070009       Gateway Mortgage Bank
070010       Abbey Mortgage Bank
070011       Refuge Mortgage Bank
070012       Lagos Building Investment Company
070013       Platinum Mortgage Bank
070014       First Generation Mortgage Bank
070015       Brent Mortgage Bank
070016       Infinity Trust Mortgage Bank
070019       MayFresh Mortgage Bank
090003       Jubilee-Life Mortgage  Bank
070017       Haggai Mortgage Bank Limited
070021       Coop Mortgage Bank
070023       Delta Trust Microfinance Bank
070024       Homebase Mortgage Bank
070025       Akwa Savings & Loans Limited
070026       FHA Mortgage Bank
090108       New Prudential Bank
070001       NPF MicroFinance Bank
070002       Fortis Microfinance Bank
070006       Covenant MFB
070008       Page Financials
090004       Parralex Microfinance bank
090097       Ekondo MFB
090110       VFD MFB
090111       FinaTrust Microfinance Bank
090112       Seed Capital Microfinance Bank
090114       Empire trust MFB
090115       TCF MFB
090116       AMML MFB
090117       Boctrust Microfinance Bank
090118       IBILE Microfinance Bank
090119       Ohafia Microfinance Bank
090120       Wetland Microfinance Bank
090121       Hasal Microfinance Bank
090122       Gowans Microfinance Bank
090123       Verite Microfinance Bank
090124       Xslnce Microfinance Bank
090125       Regent Microfinance Bank
090126       Fidfund Microfinance Bank
090127       BC Kash Microfinance Bank
090128       Ndiorah Microfinance Bank
090129       Money Trust Microfinance Bank
090130       Consumer Microfinance Bank
090131       Allworkers Microfinance Bank
090132       Richway Microfinance Bank
090133       AL-Barakah Microfinance Bank
090134       Accion Microfinance Bank
090135       Personal Trust Microfinance Bank
090136       Microcred Microfinance Bank
090137       PecanTrust Microfinance Bank
090138       Royal Exchange Microfinance Bank
090139       Visa Microfinance Bank
090140       Sagamu Microfinance Bank
090141       Chikum Microfinance Bank
090142       Yes Microfinance Bank
090143       Apeks Microfinance Bank
090144       CIT Microfinance Bank
090145       Fullrange Microfinance Bank
090146       Trident Microfinance Bank
090147       Hackman Microfinance Bank
090148       Bowen Microfinance Bank
090149       IRL Microfinance Bank
090150       Virtue Microfinance Bank
090151       Mutual Trust Microfinance Bank
090152       Nagarta Microfinance Bank
090153       FFS Microfinance Bank
090154       CEMCS Microfinance Bank
090155       Advans La Fayette  Microfinance Bank
090156       e-Barcs Microfinance Bank
090157       Infinity Microfinance Bank
090158       Futo Microfinance Bank
090159       Credit Afrique Microfinance Bank
090160       Addosser Microfinance Bank
090161       Okpoga Microfinance Bank
090162       Stanford Microfinance Bak
090164       First Royal Microfinance Bank
090165       Petra Microfinance Bank
090166       Eso-E Microfinance Bank
090167       Daylight Microfinance Bank
090168       Gashua Microfinance Bank
090169       Alpha Kapital Microfinance Bank
090171       Mainstreet Microfinance Bank
090172       Astrapolaris Microfinance Bank
090173       Reliance Microfinance Bank
090174       Malachy Microfinance Bank
090175       HighStreet Microfinance Bank
090176       Bosak Microfinance Bank
090177       Lapo Microfinance Bank
090178       GreenBank Microfinance Bank
090179       FAST Microfinance Bank
090180       Amju Unique Microfinance Bank
090186       Girei Microfinance Bank
090188       Baines Credit Microfinance Bank
090189       Esan Microfinance Bank
090190       Mutual Benefits Microfinance Bank
090191       KCMB Microfinance Bank
090192       Midland Microfinance Bank
090193       Unical Microfinance Bank
090194       NIRSAL Microfinance Bank
090195       Grooming Microfinance Bank
090196       Pennywise Microfinance Bank
090197       ABU Microfinance Bank
090198       RenMoney Microfinance Bank
090205       New Dawn Microfinance Bank
090251       UNN MFB
090252       Yobe Microfinance Bank
090254       Coalcamp Microfinance Bank
090258       Imo State Microfinance Bank
090259       Alekun Microfinance Bank
090260       Above Only Microfinance Bank
090261       Quickfund Microfinance Bank
090262       Stellas Microfinance Bank
090263       Navy Microfinance Bank
090264       Auchi Microfinance Bank
090265       Lovonus Microfinance Bank
090266       Uniben Microfinance Bank
090267       Kuda Microfinance Bank
090268       Adeyemi College Staff Microfinance Bank
090269       Greenville Microfinance Bank
090270       AB Microfinance Bank
090271       Lavender Microfinance Bank
090272       Olabisi Onabanjo University Microfinance Bank
090273       Emeralds Microfinance Bank
090274       Prestige Microfinance Bank
090276       Trustfund Microfinance Bank
090277       Al-Hayat Microfinance Bank
090278       Glory Microfinance Bank
090279       Ikire Microfinance Bank
090280       Megapraise Microfinance Bank
090281       MintFinex Microfinance Bank
090282       Arise Microfinance Bank
090283       Nnew Women Microfinance Bank
090285       First Option Microfinance Bank
090286       Safe Haven Microfinance Bank
090287       AssetMatrix Microfinance Bank
090289       Pillar Microfinance Bank
090290       FCT Microfinance Bank
090291       Halal Credit Microfinance Bank
090292       Afekhafe Microfinance Bank
090293       Brethren Microfinance Bank
090294       Eagle Flight Microfinance Bank
090295       Omiye Microfinance Bank
090296       Polyunwana Microfinance Bank
090297       Alert Microfinance Bank
090298       FedPoly Nasarawa Microfinance Bank
090299       Kontagora Microfinance Bank
090303       Purplemoney Microfinance Bank
090304       Evangel Microfinance Bank
090305       Sulspap Microfinance Bank
090307       Aramoko Microfinance Bank
090308       Brightway Microfinance Bank
090310       EdFin Microfinance Bank
090315       U & C Microfinance Bank
090317       PatrickGold Microfinance Bank
090318       Federal University Dutse Microfinance Bank
090320       KadPoly Microfinance Bank
090321       MayFair Microfinance Bank
090322       Rephidim Microfinance Bank
090323       Mainland Microfinance Bank
090324       Ikenne Microfinance Bank
090325       Sparkle
090326       Balogun Gambari Microfinance Bank
090327       Trust Microfinance Bank
090328       Eyowo
090329       Neptune Microfinance Bank
090331       UNAAB Microfinance Bank
090332       Evergreen Microfinance Bank
090333       Oche Microfinance Bank
090337       Iyeru Okin Microfinance Bank
090352       Jessefield Microfinance Bank
090336       BIPC Microfinance Bank
090345       OAU Microfinance Bank
090349       Nassarawa Microfinance Bank
090360       CashConnect Microfinance Bank
090362       Molusi Microfinance Bank
090363       Headway Microfinance Bank
090364       Nuture Microfinance Bank
090365       Corestep Microfinance Bank
090366       Firmus Microfinance Bank
090369       Seedvest Microfinance Bank
090370       Ilisan Microfinance Bank
090372       Legend Microfinance Bank
090373       Think Finance Microfinance Bank
090374       Coastline Microfinance Bank
090376       Apple Microfinance Bank
090377       Isaleoyo Microfinance Bank
090378       New Golden Pastures Microfinance Bank
090385       GTI Microfinance Bank
090386       Interland Microfinance Bank
090389       EK-Reliable Microfinance Bank
090391       Davodani Microfinance Bank
090380       Conpro  Microfinance Bank
090393       Bridgeway Microfinance Bank
090394       Amac Microfinance Bank
090395       Borgu  Microfinance Bank
090396       Oscotech Microfinance Bank
090399       Nwannegadi Microfinance Bank
090398       Federal Polytechnic Nekede Microfinance Bank
090401       Shepherd Trust Microfinance Bank
090403       UDA Microfinance Bank
090404       Olowolagba Microfinance Bank
090405       Rolez Microfinance Bank
090406       Business Support Microfinance Bank
090409       FCMB BETA
090408       GMB Microfinance Bank
090410       Maritime Microfinance Bank
090411       Giginya Microfinance bank
090412       Preeminent Microfinance Bank
090444       BOI Microfinance Bank
090448       Moyofade Microfinance Bank
090455       Mkobo Microfinance Bank
090463       Rehoboth Microfinance Bank
090464       Unimaid Microfinance Bank
090468       OLOFIN OWENA Microfinance Bank
090473       Assets Microfinance Bank
090338       UniUyo Microfinance Bank
090466       YCT Microfinance Bank
090467       Good Neigbours Microfinance Bank
090471       Oluchukwu Microfinance Bank
090465       Maintrust Microfinance Bank
090469       Aniocha Microfinance bank
090472       Caretaker Microfinance Bank
090475       Giant Stride Microfinance Bank
090181       Balogun Fulani Microfinance Bank
090474       Verdant Microfinance Bank
090470       Changan RTS Microfinance Bank
090476       Anchorage  Microfinance Bank
090477       Light MFB
090480       Cintrust Microfinance Bank
090482       Fedeth Microfinance Bank
090483       Ada Microfinance Bank
090488       Ibu-Aje Microfinance Bank
090489       Alvana Microfinance Bank
090490       Chukwunenye MFB
090491       Nsuk MFB
090492       Oraukwu MFB
090494       Boji MFB
090495       Goodnews Microfinance Bank
090496       Randalpha Microfinance Bank
090499       Pristine Divitis Microfinance Bank
090502       Shalom Microfinance Bank
090503       Projects Microfinance Bank
090504       Zikora Microfinance Bank
090505       Nigerian Prisons Microfinance Bank
090506       Solid Allianze MFB
090507       FIMS MFB
090513       SEAP Microfinance Bank
090515       RIMA Growth Pathway Microfinance Bank
090469       Aniocha Microfinance bank
090516       Numo Microfinance Bank
090517       Uhuru Microfinance Bank
090518       Afemai Microfinance Bank
090519       Iboma Fadama Microfinance Bank
090523       Chase Microfinance Bank
090524       Solidrock microfinance Bank
090525       TripleA Microfinance Bank
090526       Crescent Microfinance Bank
090527       Ojokoro Microfinance Bank
090528       Mgbidi Microfinance Bank
090529       Ampersand Microfinance Bank
090530       Confidence MFB
090531       Aku Microfinance Bank
090534       Polybadan Microfinance Bank
090536       Ikoyi-Osun Microfinance Bank
090537       Lobrem Microfinance Bank
090538       BluePrint Investments Microfinance Bank
090539       Enrich Microfinance Bank
090540       Aztec Microfinance Bank
090541       Excellent Microfinance Bank
090542       Otuo Microfinance Bank
090543       Iwoama Microfinance Bank
090544       Aspire Microfinance Bank
090545       Abulesoro Microfinance Bank
090546       Ijebu-Ife Microfinance Bank
090547       Rockshield Microfinance Bank
090548       Ally Microfinance Bank
090549       KC Microfinance Bank
090550       Green Energy Microfinance Bank
090551       FairMoney Microfinance Bank
090553       Consistent Trust Microfinance Bank
090554       Kayvee Microfinance Bank
090555       BishopGate Microfinance Bank
090556       Egwafin Microfinance Bank
090557       Lifegate Microfinance Bank
090558       Shongom Microfinance Bank
090559       Shield Microfinance Bank
090560       Tanadi Microfinance Bank
090561       Akuchuckwu Microfinance Bank
090562       Cedar Microfinance Bank
090563       Balera Microfinance Bank
090564       Supreme Microfinance Bank
090565       Oke-Aro Oredegbe Microfinance Bank
090566       Okuku Microfinance Bank
090567       Orokam Microfinance Bank
090568       Broadview Microfinance Bank
090569       Qube Microfinance Bank
090570       Iyamoye Microfinance Bank
090571       Ilaro Poly Microfinance Bank
090572       EWT Microfinance Bank
090573       Snow MFB
090575       First Midas Microfinance Bank
090576       Octopus Microfinance Bank
090579       Gbede Microfinance Bank
090580       Otech Microfinance Bank
090583       Stateside Microfinance Bank
090574       GOLDMAN MFB
090535       Nkpolu-Ust MFB
090578       Iwade MFB Ltd
090587       Microbiz MFB
090588       Orisun MFB
090589       Mercury MFB
090591       Gabsyn Microfinance Bank Limited
090593       Tasued Microfinance Bank
090602       Kenechukwu Microfinance Bank
090950       Waya Microfinance Bank
090598       IBA Microfinance Bank
090584       Island Microfinance Bank
090600       Ave Maria Microfinance Bank
090608       Akpo Microfinance Bank
090609       Ummah  Microfinance Bank
090610       Amoye Microfinance Bank
090612       Medef Microfinance Bank
090532       IBOLO Microfinance Bank
090581       Banc Corp MFB
090614       Flourish MFB
090615       Beststar MFB
090616       Rayyan MFB
090603       Macrod MFB
090634       Cashbridge Microfinance Bank
090620       Iyin Ekiti MFB
090611       Creditville MFB
090623       MAB Allianz MFB
100001       FET
100002       Paga
100003       Parkway-ReadyCash
100004       Opay Digital Services LTD
100005       Cellulant
100006       eTranzact
100007       Stanbic IBTC @ease wallet
100008       Ecobank Xpress Account
100009       GTMobile
100010       TeasyMobile
100011       Mkudi
100012       VTNetworks
100013       AccessMobile
100014       FBNMobile
100036       Kegow (Chamsmobile)
100016       FortisMobile
100017       Hedonmark
100018       ZenithMobile
100019       Fidelity Mobile
100020       MoneyBox
100021       Eartholeum
100022       GoMoney
100023       TagPay
100025       Zinternet Nigera Limited
100026       One Finance
100029       Innovectives Kesh
100030       EcoMobile
100031       FCMB Easy Account
100032       Contec Global Infotech Limited (NowNow)
100033       PalmPay Limited
100034       Zenith Eazy Wallet
100052       Access Yello
100035       M36
100039       TitanPaystack
080002       Taj_Pinspay
100027       Intellifin
110001       PayAttitude Online
110002       Flutterwave Technology Solutions Limited
110003       Interswitch Limited
110004       First Apple Limited
110005       3line Card Management Limited
110006       Paystack Payment Limited
110007       Teamapt Limited
110014       Cyberspace Limited
110015       Vas2nets Limited
110017       Crowdforce
110032       Prophius
090202       Accelerex Network Limited
999999       NIP Virtual Bank
120001       9Payment Service Bank
120002       HopePSB
120003       MoMo PSB
120004       SmartCash PSB
090982       Ethica MFB
090645       Nombank MFB


Sample Request
{
    "bank_code":"000013",
    "account_number":"0123456789"
}

Sample Response
{
    "status": 200,
    "success": true,
    "message": "Success",
    "data": {
        "account_name": "JENNY SQUAD",
        "account_number": "0123456789"
    }
}

Fund Transfer
This API allows you to transfer funds from your Squad Wallet to the account you have looked up.

caution
Please be informed that we will not be held liable for mistake in transferring to a wrong account or an account that wasn't looked up.

Transaction Reference:
Transaction Reference used to initiate a transfer must be unique per transfer. Kindly ensure that you append your merchant ID to the transaction Reference you are creating. This is compulsory as it will throw an error if you don't append it.

For instance:
If my Squad Merchant ID is SBABCKDY and i want to create a transaction ref for my transfer, then I will have something like:

"transaction_reference":"SBABCKDY_12345".

ERROR CODE
These are the various error codes that you might get on the transfer API and the one you should re-query

ERROR CODES	DESCRIPTION
200	Success
400	Bad request
422	Unprocessed
424	Timeout/failed --- Should re-query
404	Not found
412	reversed
POST
https://sandbox-api-d.squadco.com/payout/transfer






















Sample Request
{
    "remark": "tEST013",
    "bank_code":"000013",
    "currency_id": "NGN",
    "amount": "10000",
    "account_number":"0933384111",
    "transaction_reference": "SBS5B8VU36_Test222",
    "account_name":"EZE SUNDAY"
}

Responses
200:OK
Success

















400:Bad Request
Bad Request







401:Unathorized
No Authorization






403:Forbidden
Invalid/Wrong API Keys






Re-query Transfer
This API allows you re-query the status of a transfer made to know if it was successful, failed, reversed or pending.

POST
https://sandbox-api-d.squadco.com/payout/requery



Sample Request
{
    "transaction_reference": "SBS5B8VU36_Test222"
}

Responses
200:OK
Success
{
        "remark": "tEST013",
        "bank_code":"000013",
        "currency_id": "NGN",
        "amount": "10000",
        "account_number":"0933384584",
        "transaction_reference": "SBS5B8VU36_Test222",
        "account_name":"EZE SUNDAY"
    }

404:Not Found
Not Found
{
        "status": 404,
        "success": false,
        "message": "Transaction not found",
        "data": {}
  }

401:Unathorized
No Authorization
{
            "success": false,
            "message": "",
            "data": {}
}

403:Forbidden
Invalid/Wrong API Keys
{
            "success": false,
            "message": "Merchant authentication failed",
            "data": {}
}

Get All Transfers
This API Allows you retrieve the details of all transfers you have done from your Squad Wallet using this transfer solution.

GET
https://sandbox-api-d.squadco.com/payout/list









Responses
200:OK
Success
{
            "status": 200,
            "success": true,
            "message": "Success",
            "data": [
                {
                    "account_number_credited": "0254896325",
                    "amount_debited": "2000",
                    "total_amount_debited": "3000",
                    "success": true,
                    "recipient": "Dummy Dummy",
                    "bank_code": "058",
                    "transaction_reference": "4d665e98-802d-4cd7-b76c-c77eaba9e394",
                    "transaction_status": "success",
                    "switch_transaction": null
                },
                {
                    "account_number_credited": "0254896325",
                    "amount_debited": "2000",
                    "total_amount_debited": "2500",
                    "success": true,
                    "recipient": "Dummy Dummy",
                    "bank_code": "058",
                    "transaction_reference": "bbf6ba99-07ae-463d-a8e5-8b11bd5702fa",
                    "transaction_status": "success",
                    "switch_transaction": null
                },
                {
                    "account_number_credited": "0254896325",
                    "amount_debited": "4000",
                    "total_amount_debited": "4500",
                    "success": true,
                    "recipient": "Dummy Dummy",
                    "bank_code": "058",
                    "transaction_reference": "e344ed1d-dd1a-4e46-b964-66587a4ad4d4",
                    "transaction_status": "success",
                    "switch_transaction": null
                },
                {
                    "account_number_credited": "0254896325",
                    "amount_debited": "300000",
                    "total_amount_debited": "300000",
                    "success": false,
                    "recipient": "Tee Fifi",
                    "bank_code": "058",
                    "transaction_reference": "03/13/2023_C15DBPRZ_Q2P8VPL9",
                    "transaction_status": "pending",
                    "switch_transaction": null
                },
                {
                    "account_number_credited": "0254896325",
                    "amount_debited": "300000",
                    "total_amount_debited": "300000",
                    "success": false,
                    "recipient": "Tee Fifi",
                    "bank_code": "058",
                    "transaction_reference": "optional-sample-unique-id",
                    "transaction_status": "pending",
                    "switch_transaction": null
                },
                {
                    "account_number_credited": "0254896325",
                    "amount_debited": "300000",
                    "total_amount_debited": "300000",
                    "success": true,
                    "recipient": "Hay Stack",
                    "bank_code": "058",
                    "transaction_reference": "e1f14484-b7dc-4528-8d79-d95fa66e8c69",
                    "transaction_status": "success",
                    "switch_transaction": null
                },
                {
                    "account_number_credited": "0254896325",
                    "amount_debited": "300000",
                    "total_amount_debited": "300000",
                    "success": true,
                    "recipient": "Jenny Squad",
                    "bank_code": "058",
                    "transaction_reference": "43eb10c0-57d9-42eb-b8a7-4db299c65ced",
                    "transaction_status": "success",
                    "switch_transaction": null
                }
            ]
}


401:Unathorized
No Authorization
{
            "success": false,
            "message": "",
            "data": {}
}

403:Forbidden
Invalid/Wrong API Keys
{
            "success": false,
            "message": "Merchant authentication failed",
            "data": {}
}

info
Best Practises
When fund Transfer is called, do not depend only on the status code returned, review the data returned an ensure the nip_transaction_reference returned a session ID
When in doubt requery to confirm final status
Where fund transfer is not successfull or requery shows the payment failed, do not re-initiate same transaction using the same reference, always use a unique reference
Edit this page



Transfer APILedger Balance
Ledger Balance
This endpoint allows you get your Squad Account Balance.
info
Environment base URL:

Test: https://sandbox-api-d.squadco.com

Production: https://api-d.squadco.com

Authorization keys are to be passed via Headers as a Bearer token.

Example: Authorization: Bearer sandbox_sk_94f2b798466408ef4d19e848ee1a4d1a3e93f104046f

Please be informed that the ledger balance is in KOBO. (Please note that you can't get ledger balance for Dollar transactions).

GET
https://sandbox-api-d.squadco.com/merchant/balance
This endpoint allows you get your Squad Ledger Balance. Amount is in KOBO
Parameters
Query
currency_id*

String

It only takes the value 'NGN'. (Please note that you can't get ledger balance for Dollar transactions)

Responses
200:OK
Success
{
            "status": 200,
            "success": true,
            "message": "Success",
            "data": {
                "balance": "2367013",
                "currency_id": "NGN",
                "merchant_id": "SBN1EBZEQ8"
            }
}

401:Unathorized
No Authorization
{
            "success": false,
            "message": "",
            "data": {}
}

403:Forbidden
Invalid/Wrong API Keys
{
            "success": false,
            "message": "Merchant authentication failed",
            "data": {}
}

Edit this page


Disputes & Chargebacks
This contains a list of APIs that allow you get all disputes raised on your transaction, reject the claim with an evidence or accept the claim and accept a charge back to be performed.
You have the option to either accept or reject a chargeback

Accepting a chargeback:
This means you received the customer’s payment but did not provide the service or product the customer requested for some reasons. When you accept a chargeback, you allow for the funds to be deducted from your payouts and reversed to the customer’s bank account.

Rejecting a chargeback:
This means you received the customer’s payment and have provided the service or delivered the product to the customer. To justify your claim you are required to provide an evidence to show that value has been given for payment made by the customer. If the evidence is not sufficient, we will automatically accept the chargeback.

info
Environment base URL:

Test: https://sandbox-api-d.squadco.com

Production: https://api-d.squadco.com

Authorization keys are to be passed via Headers as a Bearer token.

Example: Authorization: Bearer sandbox_sk_94f2b798466408ef4d19e848ee1a4d1a3e93f104046f

GET ALL DISPUTES
This API is used to get all disputes on your transactions raised by your customers.

GET
https://sandbox-api-d.squadco.com/dispute
Responses
200:OK
Success
{ // Response 
} 
            

401:Unathorized
No API Key
{ // Response 
}
            

Get Upload URL
This API is used to get a unique URL to upload an evidence(file) which is a proof or reason to reject a dispute. This is only necessary when we want to reject a dispute.

GET
https://sandbox-api-d.squadco.com/dispute/upload-url/:ticket_id/:file_name
All you need to do is make a get request with your private/secret key
Parameters
Path
ticket_id*

String

file_name*

String

Resolve Disputes
This API is used to resolve a dispute by either accepting or rejecting it.

GET
https://sandbox-api-d.squadco.com/dispute/:ticked_id/resolve
This API is used to resolve a dispute by either accepting or rejecting it.
Parameters
Path
ticket_id*

String

A unique ID that identifies the dispute you want to reject or accept

Body
action*

String

This is the action you want to be taken on the raised dispute. The value of this action can be either 'rejected' or 'accepted'

file_name

String

The name of the file uploaded

GO LIVE - Production
To Use this API on production:

Kindly change the base URL of the endpoint from https://sandbox-api-d.squadco.com to https://api-d.squadco.com
Get production keys from your live account and replace the test authorization keys.
Edit this page





Payments
Webhook & Redirect URL
Virtual Accounts
Transfer API
Others
Value Added Services (VAS)
Airtime and Data
SMS
Bucket
SMS Template
Messages
Utilities
Value Added Services (VAS)Airtime and Data
Airtime and Data
These are API suites that allow you to vend airtime and data. Please note that the equivalent value of all data and airtime vended will be deducted from your SQUAD account.
API KEYS (Test Environment)
Create an account on our sandbox environment
Retrieve keys from the "API and WEBHOOKS" tab in the merchant settings page for authorisation.
info
Environment base URL:

Test: https://sandbox-api-d.squadco.com

Production: https://api-d.squadco.com

Authorization keys are to be passed via Headers as a Bearer token.

Example: Authorization: Bearer sandbox_sk_94f2b798466408ef4d19e848ee1a4d1a3e93f104046f

Vend Airtime
This API allows you to vend airtime. The minimum amount that can be vended is 50 naira.

POST
https://sandbox-api-d.squadco.com/vending/purchase/airtime
This API vends Airtime
Parameters
Body
phone_number*

String

11 digit phone number. Format: : '08139011943'

amount*

Integer

Amount is in Naira.

Responses
200:OK
Success
{ 
            "status": 200, 
            "success": true, 
            "message": "Success", 
            "data": { 
                "reference": "app_08139011943_5000_1690387362399", 
                "amount": "5000.00", 
                "merchant_amount": "4900.00", 
                "phone_number": "08139011943", 
                "merchant_id": "T6AGJQEY", 
                "wallet_batch_id": "20230726160242715_490000_T6AGJQEY_AIRTIME_NGN", 
                "transaction_id": "app_08139011943_5000_1690387362399", 
                "type": "airtime", 
                "action": "debit", 
                "status": "pending", 
                "meta": "{"vending_status":"pending","status_code":"301","message":"pending confirmation","phonenumber":"08139011943","transaction_id":"app_08139011943_5000_1690387362399","network":"MTN"}", 
                "createdAt": "2023-07-26T16:02:43.341Z" 
            } 
}


401:Unathorized
No Authorization
{
            "success": false,
            "message": "",
            "data": {}
}

403:Forbidden
Invalid/Wrong API Keys
{
            "success": false,
            "message": "Merchant authentication failed",
            "data": {}
}

Sample Request
{
    "phone_number": "08139011943",
    "amount": 5000
}

Vend Data Bundles
POST
https://sandbox-api-d.squadco.com/vending/purchase/data
This is the data bundle vending endpoint.
Parameters
Body
phone_number*

String

11 digit phone number. Format: : '08139011943'

plan_code*

String

The plan code is gotten from the Get Plan Code endpoint and usually in the format: '1001'

Responses
200:OK
Success
{ 
            "status": 200, 
            "success": true, 
            "message": "Success", 
            "data": { 
                "reference": "app_7062918558_100_1001_1679914203047", 
                "amount": "100.00", 
                "merchant_amount": "98.00", 
                "phone_number": "+2347062918558", 
                "merchant_id": "AABBCCDDEEFFGGHHJJKK", 
                "wallet_batch_id": "BC8BE65JWG44ZW7AN9KG", 
                "transaction_id": "edf867fa-8ad6-4eac-bd87-6e5f8ec9b945", 
                "type": "data", 
                "action": "debit", 
                "status": "success", 
                "meta": "{"vending_status":"success","status_code":"200","message":"successfully submitted for processing","phonenumber":"07062918558","transaction_id":"edf867fa-8ad6-4eac-bd87-6e5f8ec9b945","network":"MTN"}", 
                "createdAt": "2023-03-27T10:50:04.073Z" 
            } 
}


401:Unathorized
No Authorization keys
{
            "success": false,
            "message": "",
            "data": {}
}

403:Forbidden
Invalid/Wrong Keys
{
            "success": false,
            "message": "Merchant authentication failed",
            "data": {}
}

Sample Request
{
    "phone_number": "07062918558",
    "amount": 100,
    "plan_code": "1001"
}

Get Data Bundles
This API returns all available data bundle plans for all telcos

GET
https://sandbox-api-d.squadco.com/vending/data-bundles?network=MTN
This API returns all available data bundle plans for all telcos
Parameters
Query
network*

String

Teleco ID: MTN, GLO, AIRTEL, 9MOBILE

Responses
200:OK
Success
{ 
            "status": 200, 
            "success": true, 
            "message": "Success", 
            "data": [ 
                { 
                    "plan_name": "MTN data_plan", 
                    "bundle_value": "100MB ", 
                    "bundle_validity": " Daily Plan", 
                    "bundle_description": " Daily Plan", 
                    "bundle_price": "100", 
                    "plan_code": "1001", 
                    "network": "MTN" 
                }, 
                { 
                    "plan_name": "MTN data_plan", 
                    "bundle_value": "200MB", 
                    "bundle_validity": " 2-day Plan", 
                    "bundle_description": " 2-day Plan", 
                    "bundle_price": "200", 
                    "plan_code": "1002", 
                    "network": "MTN" 
                }, 
                { 
                    "plan_name": "MTN data_plan", 
                    "bundle_value": "350MB", 
                    "bundle_validity": " Weekly Plan", 
                    "bundle_description": " Weekly Plan", 
                    "bundle_price": "300", 
                    "plan_code": "1003", 
                    "network": "MTN" 
                }, 
                { 
                    "plan_name": "MTN data_plan", 
                    "bundle_value": "750MB", 
                    "bundle_validity": " 2-Week plan", 
                    "bundle_description": " 2-Week plan", 
                    "bundle_price": "500", 
                    "plan_code": "1004", 
                    "network": "MTN" 
                }, 
                        { 
                    "plan_name": "MTN data_plan", 
                    "bundle_value": "1500GB", 
                    "bundle_validity": "365 days", 
                    "bundle_description": "365 days", 
                    "bundle_price": "450000", 
                    "plan_code": "1111", 
                    "network": "MTN" 
                } 
            ] 
} 

401:Unathorized
No Authorization
{
            "success": false,
            "message": "",
            "data": {}
}

403:Forbidden
Invalid/Wrong Keys
{
            "success": false,
            "message": "Merchant authentication failed",
            "data": {}
}

Retrieve Airtime and Data Transactions
This API provides details on airtime and data transactions conducted by a merchant, allowing for the use of multiple filters.

GET
https://api-d.squadco.com/vending/transactions?page=1&perPage=4&action=debit












Responses
200:OK
Response description
{ 
            "status": 200, 
            "success": true, 
            "message": "Success", 
            "data": { 
                "count": 5, 
                "rows": [ 
                    { 
                        "reference": "app_08139011943_5000_1690387362399", 
                        "amount": "5000.00", 
                        "merchant_amount": "4900.00", 
                        "phone_number": "08139011943", 
                        "merchant_id": "T6AGJQEY", 
                        "wallet_batch_id": "20230726160242715_490000_T6AGJQEY_AIRTIME_NGN", 
                        "transaction_id": "app_08139011943_5000_1690387362399", 
                        "type": "airtime", 
                        "action": "debit", 
                        "status": "pending", 
                        "meta": "{"vending_status":"pending","status_code":"301","message":"pending confirmation","phonenumber":"08139011943","transaction_id":"app_08139011943_5000_1690387362399","network":"MTN"}", 
                        "createdAt": "2023-07-26T16:02:43.341Z" 
                    }, 
                    { 
                        "reference": "app_08132448598_500_1001_1690387247434", 
                        "amount": "500.00", 
                        "merchant_amount": "490.00", 
                        "phone_number": "08132448598", 
                        "merchant_id": "T6AGJQEY", 
                        "wallet_batch_id": "20230726160047736_49000_T6AGJQEY_DATA__NGN", 
                        "transaction_id": null, 
                        "type": "data", 
                        "action": "debit", 
                        "status": "failed", 
                        "meta": null, 
                        "createdAt": "2023-07-26T16:00:48.212Z" 
                    }, 
                    { 
                        "reference": "app_08139011943_5000_1001_1690387152681", 
                        "amount": "5000.00", 
                        "merchant_amount": "4900.00", 
                        "phone_number": "08139011943", 
                        "merchant_id": "T6AGJQEY", 
                        "wallet_batch_id": "20230726155914250_490000_T6AGJQEY_DATA__NGN", 
                        "transaction_id": null, 
                        "type": "data", 
                        "action": "debit", 
                        "status": "failed", 
                        "meta": null, 
                        "createdAt": "2023-07-26T15:59:15.602Z" 
                    }, 
                    { 
                        "reference": "app_08139011943_5000_1690363943917", 
                        "amount": "5000.00", 
                        "merchant_amount": "4900.00", 
                        "phone_number": "08139011943", 
                        "merchant_id": "T6AGJQEY", 
                        "wallet_batch_id": "20230726093224159_490000_T6AGJQEY_AIRTIME_NGN", 
                        "transaction_id": "app_08139011943_5000_1690363943917", 
                        "type": "airtime", 
                        "action": "debit", 
                        "status": "pending", 
                        "meta": "{"vending_status":"pending","status_code":"301","message":"pending confirmation","phonenumber":"08139011943","transaction_id":"app_08139011943_5000_1690363943917","network":"MTN"}", 
                        "createdAt": "2023-07-26T09:32:24.638Z" 
                    } 
                ] 
            } 
}


401:Unathorized
Response description
{
            "success": false,
            "message": "",
            "data": {}
}

403:Forbidden
Response description
{
            "success": false,
            "message": "Merchant authentication failed",
            "data": {}
}

Going Live
To go live, follow these steps:

Change the base URL for your endpoints from https://sandbox-api-d.squadco.com to https://api-d.squadco.com.
Sign up for our Live Environment.
Complete your Know Your Customer (KYC) process.
Share your Merchant ID with the Technical Account Manager for profiling.
Use the credentials provided on the live dashboard for authentication.
Edit this page



Bucket
A bucket is a collection of phone numbers organized in Excel format.
Create Bucket
This endpoint allows you to create a bucket containing a group of phone numbers for SMS communication.

POST
https://sandbox-api-d.squadco.com/sms/bucket
This API creates SMS Bucket
Parameters
Body
name*

String

Name of Bucket

description*

String

Description of Bucket

file_name*

String

Name of the csv file to be uploaded

Sample Request
{
  "name": "file1234",
  "description": "baa baa black sheep",
  "file_name": "teest.csv"
}


info
After a successful bucket creation request, a file path (signed_url) will be provided in the response. Please follow the link in a browser and upload a CSV file containing the list of phone numbers.

Responses
200:OK
Success
{ 
    "status": 200,
    "success": true,
    "message": "Success",
    "data": {
        "uuid": "ec571a9a-0c78-4d98-9956-1e5ede72d344",
        "status": "pending",
        "name": "file1234",
        "description": "baa baa black sheep",
        "merchant_id": "AABBCCDDEEFFGGHHJJKK",
        "updatedAt": "2025-05-22T09:34:58.800Z",
        "createdAt": "2025-05-22T09:34:58.800Z",
        "size": null,
        "file_url": null,
        "estimated_cost": null,
        "headers": null,
        "meta": null,
        "signed_url": "https://s3.eu-west-2.amazonaws.com/squadinc.co-gateway-mobile-app-service-dev/bulk_sms/AABBCCDDEEFFGGHHJJKK/campaign/ec571a9a-0c78-4d98-9956-1e5ede72d344/teest.csv/1747906498860-523754.csv?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAYPHEQVFJHOQDZNU6%2F20250522%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250522T093458Z&X-Amz-Expires=300&X-Amz-Signature=1f1f0017519941522352b1e8496d41b7641d7a8dd800cc3948afaf8850f86e79&X-Amz-SignedHeaders=host%3Bx-amz-acl&x-amz-acl=public-read"
      }
}


Get All Created Bucket
This endpoint allows you to retrieve created buckets

GET
https://sandbox-api-d.squadco.com/sms/bucket
This API retrieves all Bucket
Responses
200:OK
Success
{ 
    "status": 200,
    "success": true,
    "message": "Success",
    "data": {
        "count": 2,
        "rows": [
            {
                "uuid": "ec571a9a-0c78-4d98-9956-1e5ede72d344",
                "merchant_id": "AABBCCDDEEFFGGHHJJKK",
                "name": "file1234",
                "description": "baa baa black sheep",
                "size": null,
                "file_url": null,
                "estimated_cost": null,
                "headers": null,
                "status": "pending",
                "meta": null,
                "createdAt": "2025-05-22T09:34:58.800Z",
                "updatedAt": "2025-05-22T09:34:58.800Z"
            },
            {
                "uuid": "0f704e13-7b52-4ceb-a3ee-a1a253d14d97",
                "merchant_id": "AABBCCDDEEFFGGHHJJKK",
                "name": "file123",
                "description": "baa baa black sheep",
                "size": null,
                "file_url": null,
                "estimated_cost": null,
                "headers": null,
                "status": "pending",
                "meta": null,
                "createdAt": "2025-05-21T16:03:17.357Z",
                "updatedAt": "2025-05-21T16:03:17.357Z"
            }
        ]
    }

}

Delete Created Bucket
This endpoint allows you to delete a bucket

POST
https://sandbox-api-d.squadco.com/sms/bucket/{{:uuid}}
This API deletes created Bucket
Responses
200:OK
Success
{ 
        "status": 200,
        "success": true,
        "message": "Success",
        "data": {
            "uuid": "c51dca18-0458-415d-b0d7-0a03754fb8a0",
            "merchant_id": "SBS5B8VU36",
            "name": "file12341",
            "description": "baa baa black sheep",
            "size": null,
            "file_url": null,
            "estimated_cost": null,
            "headers": null,
            "status": "pending",
            "meta": null,
            "createdAt": "2025-05-24T09:24:42.549Z",
            "updatedAt": "2025-05-24T09:24:42.549Z"
        }
}

Edit this page




Value Added Services (VAS)SMSSMS Template
SMS Template
An SMS template is a predefined message format that can be used repeatedly without needing to rewrite it each time.
Create Template
This endpoint allows you to create a bucket which contains all the phone numbers to be reached via sms.

POST
https://sandbox-api-d.squadco.com/sms/template
This API creates SMS Bucket
Parameters
Body
name*

String

Name of Template

description*

String

Description of template

message*

String

Actual template form to be used continuously

Sample Request
{
    "name": "First template",
    "description": "Used for new user onboarding",
    "message": "Welcome to our platform!"
}

Responses
200:OK
Success
















Get All Created Template
This endpoint allows you to retrieve all created templates

GET
https://sandbox-api-d.squadco.com/sms/template
This API retrieves all Template
Parameters
Body
page

Integer

Page number

perPage

Integer

Number of rows per page

sorted_by

String

Sorting by creation date

dir

String

DSC/ASC

date_from

date

Beginning date

date_to

date

Ending date

Responses
200:OK
Success
{
    "status": 200,
    "success": true,
    "message": "Success",
    "data": {
        "count": 1,
        "rows": [
            {
                "uuid": "a3795ac3-8252-4ce0-aa6c-def776570455",
                "merchant_id": "EAZMC2DZ",
                "name": "Test_002",
                "description": "Test template",
                "pages": 1,
                "message": "Hi, Get a life",
                "createdAt": "2025-05-16T14:19:44.380Z",
                "updatedAt": "2025-05-16T14:19:44.380Z"
            }
        ]
    }
    }

Update Created Template
This endpoint enables you to modify the content of a template.

PATCH
https://sandbox-api-d.squadco.com/sms/template/:id
This API update template
Sample Request
{
  {
  "name": "file123",
  "description": "baa baa black sheep",
  "file_name": "test.csv"
}
}

Responses
200:OK
Success
{
    "status": 200,
    "success": true,
    "message": "Success",
    "data": {
        "uuid": "edb720f0-6162-46f2-aafe-c52962bd56f8",
        "merchant_id": "EAZMC2DZ",
        "name": "Updated Template",
        "description": "Updated description here",
        "pages": 1,
        "message": "This is an updated message.",
        "createdAt": "2025-05-22T09:11:48.562Z",
        "updatedAt": "2025-05-22T09:13:40.273Z"
    }
}

Delete Created Template
This endpoint enables you to delete a template.

POST
https://sandbox-api-d.squadco.com/sms/template/{{:id}}
This API deletes created Template
Parameters
Path
id*

String

The uuid of the bucket to be deleted

Responses
200:OK
Success
{
    "message": "success"
}

Edit this page
Bucket

Messages
This set of endpoints allows you send messages, campaigns, statistics and status.

Send Message
This endpoint allows you to curate and send messages.

POST
https://sandbox-api-d.squadco.com/sms/send/instant
This API create and send Messages
Parameters
Body
sender_id*

String

Unique merchant sender id

message

String

Contains two parameters; phone_number message

Sample Request
{
  "sender_id": "S-Alert",
  "messages": [
    {
      "phone_number": "08064834011",
      "message": "Hello there"
    }
  ]
}

200: Success
{
  "status": 200,
  "success": true,
  "message": "Success",
  "data": {
      "success": true,
      "message": "submitted successfully",
      "data": {
          "batch_id": "20250522081746187_541_EAZMC2DZ_SQUADSMS_NGN",
          "sent": [
              {
                  "phone_number": "08064834011",
                  "status": "SENT",
                  "cost": 5.41,
                  "transaction_id": "20250522081746187_541_EAZMC2DZ_SQUADSMS_NGN_000"
              }
          ],
          "errors": [],
          "total_cost": 5.41,
          "currency": "NGN"
      }
  }
}


Create Campaign
This endpoint allows you to create campaigns

POST
https://sandbox-api-d.squadco.com/sms/campaign
This API create a message campaign
Parameters
Body
name*

String

Name of the campaign to be created

bucket_id*

String

The uuid of the bucket to be used for the campaign

sender_id*

String

Unique merchant sender id

is_scheduled*

Boolean

Boolean status to indicate if the campaign is a scheduled campaign or not

sscheduled_dor*

String

Unique merchant sender id

template_id*

String

Message template to be used for the campaign

Responses
200:OK
Success
{
    "status": 200,
    "success": true,
    "message": "Success",
    "data": {
        "uuid": "4c054f71-790f-4cab-9530-2b18ba243c27",
        "name": "Dianne Spencer",
        "cost": "0.00",
        "scheduled_for": "Wed Dec 31 2025 10:05:10 GMT+0100 (West Africa Standard Time)",
        "status": "pending",
        "merchant_id": "EAZMC2DZ",
        "createdAt": "2025-02-18T14:02:27.403Z",
        "updatedAt": "2025-02-18T14:02:27.418Z",
        "bucket_id": "3d27d03c-e14d-494f-822e-106946898daf",
        "sender_id": "S-Alert",
        "template_id": "cdbbc03e-1e0b-4c20-aacd-04eb11e702c2"
    }
}


Get All Campaign
This endpoint allows you to retrieve all campaigns

GET
https://sandbox-api-d.squadco.com/sms/campaign
This API retrieves all Campaigns
Parameters
Query Params
page

Integer

Page number

perPage

Integer

Number of rows per page

sorted_by

String

Sorting by creation date

status

String

pending, failed or success

name

String

Name of the campaign

dir

String

DSC/ASC

date_from

date

Beginning date

date_to

date

Ending date

Responses
200:OK
Success
{
        "status": "SUCCESS",
        "message": "campaigns retrieved successfully",
        "data": {
            "items": [
                {
                    "id": 1,
                    "name": "abc_123",
                    "client_id": 1,
                    "template_id": 1,
                    "bucket_id": 1,
                    "total": 2,
                    "created_at": "2024-02-29T11:27:13.000Z",
                    "created_by": null
                }
            ],
            "total": 1
        }
}

Delete Campaign
This endpoint enables you to delete a campaign.

POST
https://sandbox-api-d.squadco.com/sms/campaign/{{:id}}
This API deletes created Campaign
Parameters
Path
id*

String

The uuid of the campaign to be deleted

Edit this page
Electricity Vending
These Suit of APIs allow you vend electricity tokens.
Electricity Providers
Provider        Full Name                                      Region

IE              Ikeja Electricity                             Abule Egba, Akowonjo, Ikeja, Ikorodu, Oshodi and Shomolu in Lagos

EKEDC           Eko Electricity Distribution Company          Lekki, Ibeju, Islands, Ajah, Ajele, Orile, Ijora, Apapa, Mushin, Festac, Ojo, and Agbara in Lagos

AEDC            Abuja Electricity Distribution Company        FCT Abuja, Kogi, Niger, and Nasarawa States

YEDC            Yola Electricity Distribution Company         Adamawa, Taraba, Borno, and Yobe states

BEDC            Benin Electricity Distribution Company        Delta, Edo, Ekiti, and Ondo States

IBEDC           Ibadan Electricity Distribution Company       Oyo, Ibadan, Osun, Ogun & Kwara States

KEDCO           Kano Electricity Distribution Company         Kano, Katsina, and Jigawa States

KAEDC           Kaduna Electricity Distribution Company       Kaduna, Kebbi, Sokoto and Zamfara States

PHED            Port Harcourt Electricity Distribution Company Rivers, Bayelsa, Cross River and Akwa-Ibom States

EEDC            Enugu Electricity Distribution Company        Abia, Anambra, Ebonyi, Enugu and Imo States



Get List of Providers
This API allows you to retrieve the list of electricity providers.

GET
https://sandbox-api-d.squadco.com/vending/utilities/electricity/service-providers
Sample Request
{
    "status": 200,
    "success": true,
    "message": "Success",
    "data": [
        {
            "code": "EKEDC",
            "name": "Eko Electricity",
            "logo_url": "https://media.premiumtimesng.com/wp-content/files/2022/05/ekedcp_logo.jpg"
        },
        {
            "code": "IE",
            "name": "Ikeja Electricity",
            "logo_url": "https://www.insideojodu.com/wp-content/uploads/2022/11/Ikeja-Electric-Vacancy.png"
        },
        {
            "code": "PHED",
            "name": "Port Harcourt Electricity",
            "logo_url": null
        },
        {
            "code": "AEDC",
            "name": "Abuja Electricity",
            "logo_url": null
        },
        {
            "code": "JED",
            "name": "Jos Electricity",
            "logo_url": null
        }
      
    ]
}


Lookup Meter
This Endpoint allows you to look up and retrieve the details of a meter

POST
https://sandbox-api-d.squadco.com/vending/utilities/electricity/lookup
This API does a meter number lookup
Parameters
Body
meter_no*

Integer

The meter number to be looked up

meter_type*

String

Prepaid or Postpaid

provider*

String

Electricity provider

Sample Request
{
    "meter_type": "prepaid", 
    "meter_no": "45067198783",
    "provider":"IE"
}

200: Success
403: Unauthorized
{
  "status": 200,
  "success": true,
  "message": "Success",
  "data": {
      "reference": "IE-2505305db8e15f0ab62bb6",
      "customer_name": "GALADIMA SHEHU MALAMI",
      "minimum_vend": 12920.32,
      "account_type": "NMD",
      "outstanding_debt": "361257.12",
      "address": "9 ADEYEMO STREET MAFOLUKU",
      "meter_type": "prepaid",
      "provider": "IE"
  }
}

Electricity Purchase(vending)
This endpoint generates and sells electricity tokens.

POST
https://sandbox-api-d.squadco.com/vending/utilities/electricity












Sample Request
  {
      "phone_number": "+2347062918558",
      "amount": 13000.00,
      "email": "victor@gmail.com",
      "reference": "IE-250521ee7b7922e19965e7"
  }

200: Success
{
  "status": 200,
  "success": true,
  "message": "Success",
  "data": {
      "reference": "IE-2505305db8e15f0ab62bb6",
      "amount": "13000.00",
      "merchant_amount": "12883.00",
      "phone_number": "07062918558",
      "email": "victor@gmail.com",
      "merchant_id": "SBS5B8VU36",
      "wallet_batch_id": "EUMXBV9AURZKE3LDGJRRQBNGJSAP3ZU",
      "value_reference": "26832663990919393911",
      "network": null,
      "transaction_id": null,
      "type": "electricity",
      "action": "debit",
      "status": "success",
      "meta": "{\"reference\":\"IE-2505305db8e15f0ab62bb6\",\"token\":\"26832663990919393911\",\"total_units\":\"332.35\",\"account_name\":\"GALADIMA SHEHU MALAMI\",\"account_no\":\"0102016364\",\"outstanding_debt\":\"361257.12\",\"kct\":\"\",\"meter_number\":\"45067198783\",\"receipt_number\":\"250530971742\",\"address\":\"9 ADEYEMO STREET MAFOLUKU\",\"tariff_class\":\"C-Non MD\",\"tariff_rate\":\"45.8\",\"amount_paid\":13000,\"meter_type\":\"prepaid\",\"transaction_date\":\"20250530152931\",\"vat_rate\":\"0.075\",\"balance\":\"0.00\",\"fixed_charge\":\"0\",\"reconnection_fee\":\"00\",\"loss_of_revenue\":\"0\",\"vat\":\"-2221.83\",\"cost_of_unit\":\"15221.83\",\"administrative_charge\":\"0.00\",\"installation_fee\":\"0\",\"penalty\":\"0\",\"meter_cost\":\"0.00\",\"current_charge\":\"0.00\",\"meter_service_charge\":\"0.00\",\"hp_wallet_batch_id\":\"EUMXBV9AURZKE3LDGJRR1T112YJMVXG\",\"hp_profit\":39,\"provider\":\"IE\",\"provider_meta\":{\"code\":\"IE\",\"name\":\"Ikeja Electricity\",\"total_rate_percent\":1.2,\"total_rate_cap\":1500,\"third_party_rate_percent\":0.9,\"third_party_rate_cap\":1000,\"hb_income_percent\":0.3,\"logo_url\":\"https://www.insideojodu.com/wp-content/uploads/2022/11/Ikeja-Electric-Vacancy.png\",\"type\":\"electricity\"}}",
      "meta_json": {
          "kct": "",
          "vat": "-2221.83",
          "token": "26832663990919393911",
          "address": "9 ADEYEMO STREET MAFOLUKU",
          "balance": "0.00",
          "penalty": "0",
          "provider": "IE",
          "vat_rate": "0.075",
          "hp_profit": 39,
          "reference": "IE-2505305db8e15f0ab62bb6",
          "account_no": "0102016364",
          "meter_cost": "0.00",
          "meter_type": "prepaid",
          "amount_paid": 13000,
          "tariff_rate": "45.8",
          "total_units": "332.35",
          "account_name": "GALADIMA SHEHU MALAMI",
          "cost_of_unit": "15221.83",
          "fixed_charge": "0",
          "meter_number": "45067198783",
          "tariff_class": "C-Non MD",
          "provider_meta": {
              "code": "IE",
              "name": "Ikeja Electricity",
              "type": "electricity",
              "logo_url": "https://www.insideojodu.com/wp-content/uploads/2022/11/Ikeja-Electric-Vacancy.png",
              "total_rate_cap": 1500,
              "hb_income_percent": 0.3,
              "total_rate_percent": 1.2,
              "third_party_rate_cap": 1000,
              "third_party_rate_percent": 0.9
          },
          "current_charge": "0.00",
          "receipt_number": "250530971742",
          "loss_of_revenue": "0",
          "installation_fee": "0",
          "outstanding_debt": "361257.12",
          "reconnection_fee": "00",
          "transaction_date": "20250530152931",
          "hp_wallet_batch_id": "EUMXBV9AURZKE3LDGJRR1T112YJMVXG",
          "meter_service_charge": "0.00",
          "administrative_charge": "0.00"
      },
      "createdAt": "2025-05-30T15:29:28.557Z",
      "updatedAt": "2025-05-30T15:29:32.154Z"
  }
}


Retrieve Transactions
This endpoint allows you to retrieve and verify the details and status of your transactions.

GET
https://sandbox-api-d.squadco.com/vending/transactions
This API retrieves/verify vending
Parameters
Body
page

Integer

Page number

perPage

Integer

Number of rows per page

sorted_by

String

Sorting by creation date

date_from

date

Beginning date

date_to

date

Ending date

reference

String

Reference of specific electricity transaction


info
Please note that if you do not provide a reference value, the system will return an array of your VAS transactions.

200: Success
{
  "status": 200,
  "success": true,
  "message": "Success",
  "data": {
      "reference": "IE-2505305db8e15f0ab62bb6",
      "amount": "13000.00",
      "merchant_amount": "12883.00",
      "phone_number": "07062918558",
      "email": "victor@gmail.com",
      "merchant_id": "SBS5B8VU36",
      "wallet_batch_id": "EUMXBV9AURZKE3LDGJRRQBNGJSAP3ZU",
      "value_reference": "26832663990919393911",
      "network": null,
      "transaction_id": null,
      "type": "electricity",
      "action": "debit",
      "status": "success",
      "meta": "{\"reference\":\"IE-2505305db8e15f0ab62bb6\",\"token\":\"26832663990919393911\",\"total_units\":\"332.35\",\"account_name\":\"GALADIMA SHEHU MALAMI\",\"account_no\":\"0102016364\",\"outstanding_debt\":\"361257.12\",\"kct\":\"\",\"meter_number\":\"45067198783\",\"receipt_number\":\"250530971742\",\"address\":\"9 ADEYEMO STREET MAFOLUKU\",\"tariff_class\":\"C-Non MD\",\"tariff_rate\":\"45.8\",\"amount_paid\":13000,\"meter_type\":\"prepaid\",\"transaction_date\":\"20250530152931\",\"vat_rate\":\"0.075\",\"balance\":\"0.00\",\"fixed_charge\":\"0\",\"reconnection_fee\":\"00\",\"loss_of_revenue\":\"0\",\"vat\":\"-2221.83\",\"cost_of_unit\":\"15221.83\",\"administrative_charge\":\"0.00\",\"installation_fee\":\"0\",\"penalty\":\"0\",\"meter_cost\":\"0.00\",\"current_charge\":\"0.00\",\"meter_service_charge\":\"0.00\",\"hp_wallet_batch_id\":\"EUMXBV9AURZKE3LDGJRR1T112YJMVXG\",\"hp_profit\":39,\"provider\":\"IE\",\"provider_meta\":{\"code\":\"IE\",\"name\":\"Ikeja Electricity\",\"total_rate_percent\":1.2,\"total_rate_cap\":1500,\"third_party_rate_percent\":0.9,\"third_party_rate_cap\":1000,\"hb_income_percent\":0.3,\"logo_url\":\"https://www.insideojodu.com/wp-content/uploads/2022/11/Ikeja-Electric-Vacancy.png\",\"type\":\"electricity\"}}",
      "meta_json": {
          "kct": "",
          "vat": "-2221.83",
          "token": "26832663990919393911",
          "address": "9 ADEYEMO STREET MAFOLUKU",
          "balance": "0.00",
          "penalty": "0",
          "provider": "IE",
          "vat_rate": "0.075",
          "hp_profit": 39,
          "reference": "IE-2505305db8e15f0ab62bb6",
          "account_no": "0102016364",
          "meter_cost": "0.00",
          "meter_type": "prepaid",
          "amount_paid": 13000,
          "tariff_rate": "45.8",
          "total_units": "332.35",
          "account_name": "GALADIMA SHEHU MALAMI",
          "cost_of_unit": "15221.83",
          "fixed_charge": "0",
          "meter_number": "45067198783",
          "tariff_class": "C-Non MD",
          "provider_meta": {
              "code": "IE",
              "name": "Ikeja Electricity",
              "type": "electricity",
              "logo_url": "https://www.insideojodu.com/wp-content/uploads/2022/11/Ikeja-Electric-Vacancy.png",
              "total_rate_cap": 1500,
              "hb_income_percent": 0.3,
              "total_rate_percent": 1.2,
              "third_party_rate_cap": 1000,
              "third_party_rate_percent": 0.9
          },
          "current_charge": "0.00",
          "receipt_number": "250530971742",
          "loss_of_revenue": "0",
          "installation_fee": "0",
          "outstanding_debt": "361257.12",
          "reconnection_fee": "00",
          "transaction_date": "20250530152931",
          "hp_wallet_batch_id": "EUMXBV9AURZKE3LDGJRR1T112YJMVXG",
          "meter_service_charge": "0.00",
          "administrative_charge": "0.00"
      },
      "createdAt": "2025-05-30T15:29:28.557Z",
      "updatedAt": "2025-05-30T15:29:32.154Z"
  }
}


Edit this page
Messages







