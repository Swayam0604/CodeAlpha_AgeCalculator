//  PREVENT FUTURE DATES ONCE THE PAGE LOADS
document.addEventListener('DOMContentLoaded', () => {
    const todayISO = new Date().toISOString().split('T')[0];
    document.getElementById('dob').setAttribute('max', todayISO);
});


// MAIN ENTRY POINT - CALLED BY THE BUTTON IN index.html
function calculateAge() {
    clearError();                      // RESET ANY OLD ERROR

    const dobInput = document.getElementById('dob');
    if (!dobInput.value) return showError('Please select your date of birth');          // EMPTY GUARD

    const dob = new Date(dobInput.value);
    const today = new Date();
    if (dob > today) return showError('Date of birth cannot be in the future');         // FUTURE GUARD


    // AGE IN YEARS-MONTHS-DAYS
    const { years, months, days } = getAgeBreakdown(dob,today);            // CORE CALC
    

    // NEXT BIRTHDAY COUNTDOWN
    const { nextBirthdayLabel, daysUntil } = getNextBirthday(dob, today);       // COUNTDOWN


    // UPDATE EXISTING DOM ELEMENTS
    document.querySelector('.age-big-number').textContent = years;
    const ageNums = document.querySelectorAll('.age-display .age-number');
    ageNums[0].textContent = years;
    ageNums[1].textContent = months;
    ageNums[2].textContent = days;

    document.querySelector('.next-birthday').textContent = nextBirthdayLabel;
    document.querySelector('.countdown-number').textContent = daysUntil;

    animateUpdate();        // SUBTLE PULSE EFFECT ON REFRESH

}


// ACCURATE BREAKDOWN IN Y-M-D (HANDLES MONTH/DAY BORROWING)
function getAgeBreakdown(dob, today) {                   
    let y = today.getFullYear() - dob.getFullYear();
    let m = today.getMonth() - dob.getMonth();
    let d = today.getDate() - dob.getDate();

    if (d < 0) {           // BORROW DAYS FROM PREVIOUS MONTH
        m--;       
        const prevMonthDAys = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
        d += prevMonthDAys;
    }

    if (m < 0) {          // BORROW MONTHS FROM PREVIOUS YEAR
        y--;
        m += 12;
    }

    return {years: y, months: m, days: d };

}


// HUMAN-READABLE NEXT BIRTHDAY + DAYS LEFT
function getNextBirthday (dob, today) {
    let next = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
    if (next < today) next.setFullYear(next.getFullYear() + 1);

    const msPerDay = 1000 * 60 * 60 * 24;
    const daysLeft = Math.ceil((next - today) / msPerDay);
    const formatted = next.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'});
    return {nextBirthdayLabel: formatted, daysUntil: daysLeft };

}


// SMALL UTILITY HELPERS
function showError(msg)  { const e = document.getElementById('error'); e.textContent = msg; e.classList.add('show'); }
function clearError()    { document.getElementById('error').classList.remove('show'); }

// ADDS / REMOVES A CLASS FOR THE "PULSE" ANIMATION WHEN RESULTS CHANGE
function animateUpdate() {
  const r = document.getElementById('result');
  r.classList.add('updated');
  setTimeout(() => r.classList.remove('updated'), 600);
}