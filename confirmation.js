const selectedSeatsElement = document.getElementById('selectedSeats');
const totalPriceElement = document.getElementById('totalPrice');
const selectedShowElement = document.getElementById('selectedShow');

const bookingSeatNumbers = JSON.parse(localStorage.getItem('bookingSeatNumbers'));
const bookingTotalPrice = localStorage.getItem('bookingTotalPrice');
let selectedShow = localStorage.getItem('selectedProductionName');

const nameInput = document.getElementById('name');
const phoneInput = document.getElementById('phone');
const emailInput = document.getElementById('email');
const addressInput = document.getElementById('address');

document.addEventListener('DOMContentLoaded', () => {
    selectedSeatsElement.innerText = bookingSeatNumbers.join(', ');
    totalPriceElement.innerText = bookingTotalPrice;
    selectedShowElement.innerText = selectedShow;
});

const confirmBookingButton = document.getElementById('confirm-booking');
const bookingForm = document.getElementById('booking-form');
const inputs = [nameInput, phoneInput, emailInput, addressInput];

inputs.forEach(input => {
    input.addEventListener('input', () => {
        const allInputsFilled = inputs.every(input => input.value !== '');
        confirmBookingButton.disabled = !allInputsFilled;
    });
});

confirmBookingButton.addEventListener('click', () => {
    bookingForm.submit();
});

bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "seats.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            // Generate QR code and download it
            const apiUrl = 'https://api.qrserver.com/v1/create-qr-code/';
            const data = {
                data: orderNumber,
                size: '200x200',
                format: 'png',
                margin: 0
            };
            const queryString = Object.keys(data).map(key => key + '=' + data[key]).join('&');
            const downloadUrl = apiUrl + '?' + queryString;
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `ticket_${orderNumber}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
    
            localStorage.removeItem('selectedSeats');
            localStorage.removeItem('bookingSeatNumbers');
            localStorage.removeItem('bookingTotalPrice');
            localStorage.removeItem('selectedProductionIndex');
            localStorage.removeItem('selectedProductionName');
            localStorage.removeItem('selectedProductionPrice');
            window.location.href = 'seats.html';
        }
    }
    

    function generateRandomOrderNumber() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 5; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    const orderNumber = generateRandomOrderNumber();

    const postData = {
        seatNumbers: JSON.stringify(bookingSeatNumbers),
        selectedShow: selectedShow,
        order: JSON.stringify({
            bookingSeatNumbers: bookingSeatNumbers,
            selectedShow: selectedShow,
            bookingTotalPrice: bookingTotalPrice,
            orderNumber: orderNumber
        }),
        name: nameInput.value,
        phone: phoneInput.value,
        email: emailInput.value,
        address: addressInput.value
    };

    const encodedData = Object.keys(postData)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(postData[key]))
        .join('&');

    xhr.send(encodedData);
});
