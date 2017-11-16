var xhr;
var currentcount = 0;
var responseJSON = {}
var paymentJSON = 0

var style = {
  base: {
    color: '#32325d',
    lineHeight: '24px',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4'
    }
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
  }
};

function addtocart(event){
  var item_name = event.target
  var itemToAdd = {
    code: item_name.dataset.counter,
    name: item_name.dataset.name
  }

  xhr = new XMLHttpRequest();
  xhr.open("POST", '/addtocart');
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send(JSON.stringify(itemToAdd));
  console.log('Message sent to the server is HELLO', itemToAdd);

  xhr.onload = function() {
    console.log(this.responseText)
    responseJSON = JSON.parse(this.responseText)
    var divToast = document.getElementById("toast01")
    var successmsg = document.getElementById("successmsg01")
    successmsg.innerHTML = responseJSON.Message
    divToast.style.display="block"
    var cartmessage = document.getElementById("itemsincart")
    console.log('Text Content is', cartmessage.textContent)
    //currentcount = parseInt(cartmessage.textContent ? cartmessage.textContent : 0)
    //cartmessage.textContent = currentcount + 1
    cartmessage.textContent = responseJSON.Count
    showCart()
    //console.log('Final content', cartmessage.textContent, 'currentcount', currentcount);
  }
}

function closetoast(event){
  console.log('In the close event');
  var divToast1 = document.getElementById("toast01");
  var successmsg = document.getElementById("successmsg01");
  successmsg.innerHTML = "";
  divToast1.style.display="none";

}

function showCart(event){
  var divitemstable = document.getElementById("cartItems");
  var itemTable = document.getElementById('itemtable');

  // Show Div
  divitemstable.style.display = "block";
  itemTable.style.display = "block";

  // Remove all previous children
  while (divitemstable.firstChild) {
    divitemstable.removeChild(divitemstable.firstChild);
  }

  // Create element for each row
  var cartElements = responseJSON.Items.map((item) => {
    var element = document.createElement('li');
    element.innerHTML = item.Name;
    element.className = 'slds-dropdown__item slds-is-selected';
    return element;
  });

  // Add elements to parent
  cartElements.forEach((element) => {
    divitemstable.appendChild(element);
  })
}

function makePayment(event){
  // Create a Stripe client
  var stripe = Stripe('pk_test_OZMKTmRVnm6rE3eYt9LK8adB');

  // Create an instance of Elements
  var elements = stripe.elements();
  var paymentButton = document.getElementById("buy01")
  paymentButton.style.display = "none";

  var paymentCard = document.getElementById("paymentpopover01")
  paymentCard.style.display="block";

  var totalPaymentRequired = responseJSON.Count*100;
  var pymtmsg = document.getElementById("paymentSummary01")
  pymtmsg.innerHTML = 'Total to pay is £ '+totalPaymentRequired;

  paymentJSON = {
    Amount: totalPaymentRequired
  }

  // Create an instance of the card Element
  var card = elements.create('card', {style: style});

  // Add an instance of the card Element into the `card-element` <div>
  card.mount('#card-element');

  // Handle real-time validation errors from the card Element.
  card.addEventListener('change', function(event) {
    var displayError = document.getElementById('card-errors');
    if (event.error) {
      displayError.textContent = event.error.message;
    } else {
      displayError.textContent = '';
    }
  })

  //Form Submission

  var form = document.getElementById('payment-form');
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    console.log('Test');
    stripe.createToken(card).then(function(result) {
      if (result.error) {
        // Inform the user if there was an error
        var errorElement = document.getElementById('card-errors');
        errorElement.textContent = result.error.message;
      } else {
        // Send the token to your server
        makepymt(result.token, totalPaymentRequired);
      }
    });
  })

  //makepymt(paymentJSON);

  // var xhr = new XMLHttpRequest();
  // xhr.open("POST", '/pay');
  // xhr.setRequestHeader("Content-type", "application/json");
  // xhr.send(JSON.stringify(paymentJSON));
  //
  // xhr.onload = function() {
  //   console.log(this.responseText)
  // }
}

function makepymt(token, totalPaymentRequired){
  console.log(token)
  paymentJSON = {
    amount: totalPaymentRequired,
    token: token
  }
  //stripeTokenHandler();
  var xmlhttp = new XMLHttpRequest();
  // content-type
  xmlhttp.open("POST", '/pay', true);
  xmlhttp.setRequestHeader("Content-type", "application/json");
  xmlhttp.send(JSON.stringify(paymentJSON));

  xmlhttp.onload = function() {
    console.log(this.responseText)
    var pymtmsgSuccess = document.getElementById("paymentSummary01")
    pymtmsgSuccess.innerHTML = this.responseText;
    var popover = document.getElementById('paymentpopover01');
    popover.style.display="none";
    var paymentButton = document.getElementById("buy01")
    paymentButton.style.display = "block";
  }
}
