<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
?>

<?php
// Razorpay webhook secret
$WEBHOOK_SECRET = "Rahul 1760";

// ✅ Include PHPMailer classes (path check karo)
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'src/PHPMailer.php';
require 'src/SMTP.php';
require 'src/Exception.php';

// Get Razorpay payload
$payload = file_get_contents('php://input');
$headers = getallheaders();

// Verify Razorpay signature
$expectedSignature = hash_hmac('sha256', $payload, $WEBHOOK_SECRET);
if ($expectedSignature === $headers['X-Razorpay-Signature']) {
    $data = json_decode($payload, true);
    $payment = $data['payload']['payment']['entity'];
    $customerEmail = $payment['email'];

    // ✅ Setup mailer
    try {
        $mail = new PHPMailer(true);   // yaha ab error nahi aayega

        $mail->isSMTP();
        $mail->Host       = 'smtp.hostinger.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'contact@webaddicted.in';
        $mail->Password   = 'Rahul@1760';
        $mail->SMTPSecure = 'ssl';
        $mail->Port       = 465;

        $mail->setFrom('contact@webaddicted.in', 'WebAddicted');
        $mail->addAddress($customerEmail);

        $mail->isHTML(true);
        $mail->Subject = 'Your Resources from WebAddicted..! ';
        $mail->Body    = "Hello,<br><br>
        Thank you for your payment! <br>
        Here’s your resource link:<br><br>
        👉 <a href='https://drive.google.com/drive/folders/153TJQTkJmgt53dwcH5WGRenWpIX3PVKF?usp=sharing'>Download Here</a><br><br>
        Regards,<br>
        Team WebAddicted";

        $mail->send();
        http_response_code(200);
    } catch (Exception $e) {
        error_log("❌ Mailer Error: {$e->getMessage()}"); // yaha sahi likha hai
        http_response_code(500);
    }
} else {
    error_log("❌ Signature mismatch!");
    http_response_code(400);
}
