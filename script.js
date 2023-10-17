class Account {
  constructor(owner, movements, interestRate, pin, movementsDates, currency, locale) {
    this.owner = owner;
    this.movements = movements;
    this.interestRate = interestRate;
    this.pin = pin;
    this.movementsDates = movementsDates;
    this.currency = currency;
    this.locale = locale;
    this.username = owner.toLowerCase();
  }
  displayDate(date) {
    const gone = Math.floor(Math.abs(date - new Date()) / (1000 * 3600 * 24));
    if (gone === 0) return 'hoje';
    if (gone === 1) return 'ontem';
    if (gone < 7) return `${gone} dias atras`;
    return new Intl.DateTimeFormat(this.locale).format(date);
  }

  formatCurrency(value) {
    return new Intl.NumberFormat(this.locale, { style: 'currency', currency: this.currency }).format(value);
  }

  displayMovements(sort = false) {
    const moves = sort ? this.movements.slice().sort((a, b) => a - b) : this.movements;
    const containerMovements = document.querySelector('.movements');
    containerMovements.innerHTML = '';
    moves.forEach((e, i) => {
      const type = e > 0 ? 'deposito' : 'retirada';
      const date = new Date(this.movementsDates[i]);
      const currentDate = this.displayDate(date);
      const ftd = this.formatCurrency(e);
      const html = `<div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__date">${currentDate}</div>
        <div class="movements__value">${ftd}</div>
      </div>`;
      containerMovements.insertAdjacentHTML('afterbegin', html);
    });
  }

  calcDisplaySummary() {
    const incomes = this.movements
      .filter(mov => mov > 0)
      .reduce((acc, mov) => acc + mov, 0);
    const ftd = this.formatCurrency(incomes);
    document.querySelector('.summary__value--in').textContent = ftd;

    const out = this.movements
      .filter(mov => mov < 0)
      .reduce((acc, mov) => acc + mov, 0);
    const ftdOut = this.formatCurrency(Math.abs(out));
    labelSumOut.textContent = ftdOut;

    const interest = this.movements
      .filter(mov => mov > 0)
      .map(deposit => (deposit * this.interestRate) / 100)
      .filter((int, i, arr) => int >= 1)
      .reduce((acc, int) => acc + int, 0);
    const ftdInterest = this.formatCurrency(Math.abs(interest));
    labelSumInterest.textContent = ftdInterest;
  }

  calcDisplayBalance() {
    this.balance = this.movements.reduce((acc, mov) => acc + mov, 0);
    const ftd = this.formatCurrency(this.balance);
    labelBalance.textContent = ftd;
  }

  update() {
    this.displayMovements();
    this.calcDisplaySummary();
    this.calcDisplayBalance();
  }
}
const LocalAccounts=JSON.parse(localStorage.getItem('accounts'));
let movements1,movements2,movementDates1,movementDates2

if(LocalAccounts){
    movements1=LocalAccounts[0].movements
    movements2=LocalAccounts[1].movements
    movementDates1=LocalAccounts[0].movementsDates
    movementDates2=LocalAccounts[1].movementsDates

}
else{
  movements1=[200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300]
  movements2=[5000, 3400, -150, -790, -3210, -1000, 8500, -30]
  movementDates1 = [
    "2021-09-15T08:30:45.123Z",
    "2021-10-10T14:20:37.789Z",
    "2021-11-05T18:15:56.456Z",
    "2021-12-20T22:40:02.572Z",
    "2022-01-10T09:10:30.874Z",
    "2022-02-14T16:55:19.263Z",
    "2022-03-30T13:30:48.295Z",
    "2022-04-25T11:45:37.621Z",
  ];
  
  movementDates2 = [
    "2021-09-01T20:05:12.987Z",
    "2021-10-01T11:55:22.334Z",
    "2021-11-15T17:40:10.872Z",
    "2021-12-05T13:25:46.981Z",
    "2022-01-20T08:10:57.663Z",
    "2022-02-25T21:15:40.548Z",
    "2022-03-10T12:30:22.117Z",
    "2022-04-15T14:45:39.729Z",
  ];  
}

  const account1 = new Account(
    "gabriel",
    movements1,
    1.2,
    1111,
    movementDates1,
    "BRL",
    "pt-BR"
  );
  
  const account2 = new Account(
    "teste",
    movements2,
    1.5,
    2222,
    movementDates2,
    "USD",
    "en-US"
  );
  
const accounts = [account1, account2];

  

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


function timer() {
  let time = 300;
  const labelTimer = document.querySelector('.timer');
  const timerInt = setInterval(() => {
    let min = String(Math.floor(time / 60)).padStart(2, '0');
    let sec = String(time % 60).padStart(2, '0');
    labelTimer.textContent = `${min}:${sec}`;
    time--;
    if (time < 0) {
      clearInterval(timerInt);
      const labelWelcome = document.querySelector('.welcome');
      const containerApp = document.querySelector('.app');
      labelWelcome.textContent = 'Faça login para usar';
      containerApp.style.opacity = 0;
    }
  }, 1000);
}

function createUsername(users){
  users.forEach((user)=>{
    user.username=user.owner.toLowerCase()
  })
}
createUsername(accounts)

let currentacc,countdown
btnLogin.addEventListener('click',function(e){
  e.preventDefault()
  currentacc=accounts.find(acc=>
    acc.username==inputLoginUsername.value.toLowerCase()
  )
  if(currentacc?.pin==inputLoginPin.value){
    if(countdown) clearInterval(countdown)
    countdown=timer()
    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    }
    labelDate.textContent=`${new Intl.DateTimeFormat(currentacc.locale,options).format(new Date())}`
    labelWelcome.textContent=`Bem vindo ${currentacc.owner}`
    containerApp.style.opacity=100
    inputLoginUsername.value=inputLoginPin.value=''

    currentacc.update(); 

  }
})  

btnTransfer.addEventListener('click',function(e){
  e.preventDefault()
  const accounttf=accounts.find(acc=>acc.username==inputTransferTo.value)
  const val=+(inputTransferAmount.value)
  if(val>0 && accounttf  && val<currentacc.balance  && accounttf.username!=currentacc.username ){
    inputTransferAmount.value=inputTransferTo.value=''
    setTimeout(()=>{
    currentacc.movements.push(-val)
    accounttf.movements.push(val)
    currentacc.movementsDates.push(new Date().toISOString())
    accounttf.movementsDates.push(new Date().toISOString())
    localStorage.setItem('accounts', JSON.stringify(accounts));
    currentacc.update() },1000)
  }
})

btnClose.addEventListener('click',function(e){
  e.preventDefault()
  if(currentacc.username==inputCloseUsername.value && currentacc.pin==+(inputClosePin.value)){
    const i=accounts.findIndex(acc=>acc.username==currentacc.username)
    accounts.splice(i,1)
    containerApp.style.opacity=0 
    labelWelcome.textContent=`Faça login para usar`  
  }
})

btnLoan.addEventListener('click',function(e){
  e.preventDefault()
  const amount=+(inputLoanAmount.value)  
  currentacc.movementsDates.push(new Date().toISOString())
  if(currentacc.movements.some(mov=>mov>amount*0.1)){
    inputLoanAmount.value=''
    setTimeout(()=>{
    currentacc.movements.push(amount)
    localStorage.setItem('accounts', JSON.stringify(accounts));
    currentacc.update() 
    },1000)

  }
  
})
let sorted=true
btnSort.addEventListener('click',function(){
  currentacc.displayMovements(sorted);
  sorted=!sorted
}) 

currentacc=account1
currentacc.update() 
containerApp.style.opacity=100