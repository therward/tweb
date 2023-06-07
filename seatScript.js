const container = document.querySelector('.container');
let seats;
const count = document.getElementById('count');
const total = document.getElementById('total');
const productionSelect = document.getElementById('production');
const stage = document.querySelector('.stage');
const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];

let ticketPrice = +productionSelect.value;


// Save selected production index, name, and price
function setProductionData(productionIndex, productionName, productionPrice) {
    localStorage.setItem('selectedProductionIndex', productionIndex);
    localStorage.setItem('selectedProductionName', productionName);
    localStorage.setItem('selectedProductionPrice', productionPrice);
}
 

// Update total and count
function updateSelectedCount() {
    const selectedSeats = document.querySelectorAll('.row .seat.selected');

    const seatsIndex = [...selectedSeats].map(seat => [...seats].indexOf(seat));

    localStorage.setItem('selectedSeats', JSON.stringify(seatsIndex));

    const selectedSeatsCount = selectedSeats.length;

    count.innerText = selectedSeatsCount;
    total.innerText = (selectedSeatsCount * ticketPrice).toFixed(2);
}

async function getOccupiedSeats() {
    const selectedProduction = productionSelect.options[productionSelect.selectedIndex].text;
    const response = await fetch(`data/${selectedProduction}.txt`);
    const text = await response.text();
    const occupiedSeats = text.split(',').map(seat => seat.trim());
    return occupiedSeats;
  }
  


// Get data from localStorage and populate UI
async function populateUI() {
    const occupiedSeats = await getOccupiedSeats();
    
    seats.forEach((seat, index) => {
        if (occupiedSeats.indexOf(seat.getAttribute('data-seat-number')) > -1) {
            seat.classList.add('occupied');
            console.log(`Seat ${seat.getAttribute('data-seat-number')} marked as occupied`);
        } else {
            seat.classList.remove('occupied');
        }
    });
  
    const selectedProductionIndex = localStorage.getItem('selectedProductionIndex');
  
    if (selectedProductionIndex !== null) {
      productionSelect.selectedIndex = selectedProductionIndex;
    }
}


// Production select event
productionSelect.addEventListener('change', async e => {
    ticketPrice = +e.target.value;
    const selectedShow = e.target.options[e.target.selectedIndex].text;
    setProductionData(e.target.selectedIndex, selectedShow, e.target.value);
    updateSelectedCount();
    await populateUI(); // Call the populateUI() function after changing the production
});

// Seat click event
container.addEventListener('click', async e => {
    if (
        e.target.classList.contains('seat') &&
        !e.target.classList.contains('occupied')
    ) {
        e.target.classList.toggle('selected');

        updateSelectedCount();

        // Get a list of occupied seats and update the UI
        const occupiedSeats = await getOccupiedSeats();
        seats.forEach((seat, index) => {
            if (occupiedSeats.indexOf(seat.getAttribute('data-seat-number')) > -1) {
                seat.classList.add('occupied');
            } else {
                seat.classList.remove('occupied');
            }
        });
    }
});

// Initial count and total set
updateSelectedCount();

// Set stage height based on number of rows
const numRows = 15;
stage.style.height = numRows * 33 + 'px';

for (let i = 0; i < numRows; i++) {
    const row = document.createElement('div');
    row.className = 'row';
    container.appendChild(row);
  
    let numSeats = 33; // default number of seats per row
  
    // Add extra seats for certain rows
    if (i === 0) {
      numSeats = 17;
    } else if (i === 1) {
      numSeats = 19;
    } else if (i === 2) {
      numSeats = 21;
    } else if (i === 3) {
      numSeats = 21;
    } else if (i === 4) {
      numSeats = 23;
    } else if (i === 5) {
      numSeats = 25;
    } else if (i === 6) {
      numSeats = 25;
    } else if (i === 7) {
      numSeats = 28;
    } else if (i === 8) {
      numSeats = 28;
    } else if (i === 9) {
      numSeats = 29;
    } else if (i === 10) {
      numSeats = 31;
    }
  
    if (i === numRows - 3) {
        // Add a gap for the Grand Circle section
        const gap = document.createElement('div');
        gap.className = 'gap';
        row.appendChild(gap);
    }

    for (let j = 1; j <= numSeats; j++) {
        const seat = document.createElement('div');
        seat.className = 'seat';
        seat.setAttribute('data-seat-number', rows[i] + j);

        if (j === 1) {
            seat.style.marginLeft = '20px';
        } else if (j === numSeats) {
            seat.style.marginRight = '20px';
        }

        const seatNumber = document.createElement('span');
        seatNumber.className = 'seat-number';
        seatNumber.innerText = rows[i] + j;

        seat.appendChild(seatNumber);

        row.appendChild(seat);
    }
}

// Add extra 5 rows after the Grand Circle gap
for (let i = 0; i < 5; i++) {
    const row = document.createElement('div');
    row.className = 'row';
    container.appendChild(row);

    for (let j = 1; j <= 20; j++) {
        const seat = document.createElement('div');
        seat.className = 'seat';
        seat.setAttribute('data-seat-number', 'GC' + i + rows[11] + j);

        if (j === 1) {
            seat.style.marginLeft = '20px';
        } else if (j === 20) {
            seat.style.marginRight = '20px';
        }

        const seatNumber = document.createElement('span');
        seatNumber.className = 'seat-number';
        seatNumber.innerText = i + rows[11] + j;

        seat.appendChild(seatNumber);

        row.appendChild(seat);
    }
}



// Update the seats variable after adding seats to the page
seats = document.querySelectorAll('.row .seat:not(.occupied)');

// Call populateUI() after the loops
populateUI();

// book button
const bookButton = document.getElementById('bookButton');

bookButton.addEventListener('click', async () => {
const selectedSeats = document.querySelectorAll('.row .seat.selected');
if (selectedSeats.length === 0) {
alert('Please select at least one seat to book.');
return;
}
const seatNumbers = [...selectedSeats].map(seat => seat.getAttribute('data-seat-number'));
const totalPrice = parseFloat(total.innerText);

// AJAX request to save the selected seats to seats.php file
const xhr = new XMLHttpRequest();
xhr.open('POST', 'seats.php', true);
xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
xhr.onload = function () {
    if (xhr.status === 200) {
        console.log(xhr.responseText);
    }
}
const data = `seatNumbers=${JSON.stringify(seatNumbers)}&price=${totalPrice}`;
xhr.send(data);

localStorage.setItem('bookingSeatNumbers', JSON.stringify(seatNumbers));
localStorage.setItem('bookingTotalPrice', totalPrice);

// Get a list of occupied seats and update the UI
const occupiedSeats = await getOccupiedSeats();
seats.forEach((seat, index) => {
    if (occupiedSeats.indexOf(seat.getAttribute('data-seat-number')) > -1) {
        seat.classList.add('occupied');
    } else {
        seat.classList.remove('occupied');
    }
});

window.location.href = 'confirmation.html';
});

// confirm booking button
const confirmBookingButton = document.getElementById('confirmBookingButton');

if (confirmBookingButton) {
confirmBookingButton.addEventListener('click', async () => {
const occupiedSeats = await getOccupiedSeats();
const selectedSeats = JSON.parse(localStorage.getItem('bookingSeatNumbers'));
    // Merge occupied and selected seats and save them as occupied
    const newOccupiedSeats = [...occupiedSeats, ...selectedSeats];
    saveOccupiedSeats(newOccupiedSeats);

    // Clear selected seats from local storage
    localStorage.removeItem('bookingSeatNumbers');

    // Get a list of occupied seats and update the UI
    const updatedOccupiedSeats = await getOccupiedSeats();
    seats.forEach((seat, index) => {
        if (updatedOccupiedSeats.indexOf(seat.getAttribute('data-seat-number')) > -1) {
            seat.classList.add('occupied');
        } else {
            seat.classList.remove('occupied');
        }
    });

    // Redirect to the main page after confirming the booking
    window.location.href = 'index.html';
});
}