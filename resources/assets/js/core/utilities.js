Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


//Update PHP cart qty

var classname = document.querySelectorAll('#quantity');

Array.from(classname).forEach(function (element) {
    element.addEventListener('change', function () {

        let id = element.getAttribute('data-id');
        let data = element.getAttribute('data');

        axios.patch(`/cart/${id}`, {
            quantity:this.value,
            id:data
        })
            .then(function (response) {
                console.log(response)
                window.location.href='/cart'
            }).catch(function (error) {
            console.log(error)
        })


    })
})



//PASSWORD TOGGLE
if(location.pathname === "/login"){


    show_password.addEventListener('click', function () {

        if (password.type == 'password'){

            show_password.setAttribute("uk-icon", "icon:lock");
            password.type = 'text';
        }else{
            password.type = 'password';
            show_password.setAttribute("uk-icon", "icon:unlock");

        }

    })
}
if(location.pathname ==="/register"){
    show_password.addEventListener('click', function () {

        if (password.type == 'password'){

            show_password.setAttribute("uk-icon", "icon:lock");
            password.type = 'text';
        }else{
            password.type = 'password';
            show_password.setAttribute("uk-icon", "icon:unlock");

        }

    })

    show_password_confirmation.addEventListener('click', function () {

        if (password_confirmation.type == 'password'){

            show_password_confirmation.setAttribute("uk-icon", "icon:lock");
            password_confirmation.type = 'text';
        }else{
            show_password_confirmation.setAttribute("uk-icon", "icon:unlock");
            password_confirmation.type = 'password';

        }

    })
}






//stripe payment processing

if(location.pathname=="/checkout")
    (function () {
        // Create a Stripe client.
        var stripe = Stripe('pk_test_RUZqAN8CkTK39VGr7FuIxPWE');

        // Create an instance of Elements.
        var elements = stripe.elements();

        // Custom styling can be passed to options when creating an Element.
        // (Note that this demo uses a wider set of styles than the guide below.)
        var style = {
            base: {
                color: '#32325d',
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

        // Create an instance of the card Element.
        var card = elements.create('card', {

            style: style,
            hidePostalCode: true

        });

        // Add an instance of the card Element into the `card-element` <div>.
        card.mount('#card-element');

        // Handle real-time validation errors from the card Element.
        card.addEventListener('change', function(event) {
            var displayError = document.getElementById('card-errors');
            if (event.error) {
                displayError.textContent = event.error.message;
            } else {
                displayError.textContent = '';
            }
        });




        var form = document.getElementById('payment-form');

        var options = {
            name: document.getElementById('name').value,
            address_line1: document.getElementById('address').value,
            address_line2: document.getElementById('address2').value,
            address_city: document.getElementById('city').value,
            address_state: document.getElementById('state').value,
            address_zip: document.getElementById('zip').value,
            address_country: document.getElementById('country').value
        }

        form.addEventListener('submit', function(event) {
            event.preventDefault();


            stripe.createToken(card, options).then(function(result) {
                if (result.error) {
                    // Inform the customer that there was an error.
                    var errorElement = document.getElementById('card-errors');
                    errorElement.textContent = result.error.message;
                } else {
                    // Send the token to your server.
                    stripeTokenHandler(result.token);
                }
            });
        });

        function stripeTokenHandler(token) {
            // Insert the token ID into the form so it gets submitted to the server
            var form = document.getElementById('payment-form');
            var hiddenInput = document.createElement('input');
            hiddenInput.setAttribute('type', 'hidden');
            hiddenInput.setAttribute('name', 'stripeToken');
            hiddenInput.setAttribute('value', token.id);
            form.appendChild(hiddenInput);

            // Submit the form
            form.submit();
        }



    })();
