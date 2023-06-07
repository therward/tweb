<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['seatNumbers']) && isset($_POST['selectedShow'])) {
        $seatNumbers = json_decode($_POST['seatNumbers']);
        $selectedShow = $_POST['selectedShow'];

        $fileName = 'data/' . $selectedShow . ".txt";

        $seats_file = fopen($fileName, "a") or die("Unable to open file!");
        flock($seats_file, LOCK_EX);

        $seatNumbersString = "," . implode(",", $seatNumbers);
        fwrite($seats_file, $seatNumbersString);

        flock($seats_file, LOCK_UN);
        fclose($seats_file);
    }

    if (isset($_POST['order'])) {
        $orderData = json_decode($_POST['order'], true);

        $seatNumbers = $orderData['bookingSeatNumbers'];
        $selectedShow = $orderData['selectedShow'];
        $totalPrice = $orderData['bookingTotalPrice'];
        $orderNumber = $orderData['orderNumber'];
        $name = $_POST['name'];
        $phone = $_POST['phone'];
        $email = $_POST['email'];
        $address = $_POST['address'];

        $orderDataString = "Order Number: $orderNumber\nShow: $selectedShow\nSeats: " . implode(', ', $seatNumbers) . "\nTotal Price: $totalPrice\nName: $name\nPhone: $phone\nEmail: $email\nAddress: $address\n\n";

        $file = fopen('orders.txt', 'a') or die("Unable to open file!");
        fwrite($file, $orderDataString);
        fclose($file);
    }

    header('Content-Type: application/json');
    echo json_encode(array('success' => true));
} else {
    header("HTTP/1.0 404 Not Found");
}
?>
