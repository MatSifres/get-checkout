(function() {
  if (window.location.hostname === 'lumea-ar.com' || window.location.hostname.endsWith('.lumea-ar.com')) {
    console.log('Script deshabilitado para lumea-ar.com');
    return;
  }

  // Ejecutamos solo una vez cuando se carga la página
  window.addEventListener('load', function() {
    var pageLoadTimestamp = sessionStorage.getItem('pageLoadTimestamp');
    var currentTime = new Date().getTime();

    if (!pageLoadTimestamp || (currentTime - pageLoadTimestamp > 5000)) {
      sessionStorage.setItem('pageLoadTimestamp', currentTime);

      if (typeof LS !== 'undefined' && LS.cart && LS.cart.id) {
        var cartId = LS.cart.id;
        var storeId = LS.store ? LS.store.id : null;
        var url = window.location.origin;
        var pathname = LS.cart.pathname || window.location.pathname;
        var fullCartUrl = url + pathname;

        console.log("cartId:", cartId);
        console.log("storeId:", storeId);
        console.log("URL del carrito:", fullCartUrl);

        if (cartId && storeId && !window.location.href.includes("success")) {
          var requestId = cartId + '-' + window.location.pathname;
          var sentRequests = JSON.parse(sessionStorage.getItem('sentRequests') || '{}');

          if (!sentRequests[requestId]) {
            // Elegir endpoint según dominio
            var endpoint;
            if (window.location.hostname === 'www.fuled.com.ar' || window.location.hostname === 'fuled.com.ar') {
              endpoint = 'https://alerti-backend.onrender.com/checkout'; // tu backend en Render
            } else {
              endpoint = 'https://dashboard.alerti.app/api/1.1/wf/checkout/'; // el original
            }

            fetch(endpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                checkout_id: cartId,
                store_id: storeId,
                cart_url: fullCartUrl
              })
            })
            .then(response => response.json().catch(() => ({})))
            .then(data => {
              console.log('Checkout enviado a', endpoint, data);
              sentRequests[requestId] = currentTime;
              sessionStorage.setItem('sentRequests', JSON.stringify(sentRequests));
            })
            .catch(error => {
              console.error('Error enviando checkout a', endpoint, error);
            });
          } else {
            console.log('Este checkout ya fue enviado recientemente en esta página');
          }
        }
      } else {
        console.error('No se encontró LS.cart o el cartId');
      }
    } else {
      console.log('Página recargada muy rápidamente, evitando envío duplicado');
    }
  });
})();
