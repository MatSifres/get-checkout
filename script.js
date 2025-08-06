(function() {
  // Deshabilitar para 'lumea-ar.com'
  if (
    window.location.hostname === 'lumea-ar.com' ||
    window.location.hostname.endsWith('.lumea-ar.com')
  ) {
    console.log('Script deshabilitado para lumea-ar.com');
    return;
  }

  window.addEventListener('load', function() {
    var pageLoadTimestamp = sessionStorage.getItem('pageLoadTimestamp');
    var currentTime = Date.now();

    // Solo si es la primera carga o pasaron >5 s
    if (!pageLoadTimestamp || (currentTime - pageLoadTimestamp > 5000)) {
      sessionStorage.setItem('pageLoadTimestamp', currentTime);

      if (typeof LS !== 'undefined' && LS.cart && LS.cart.id) {
        var cartId  = LS.cart.id;
        var storeId = LS.store ? LS.store.id : null;
        var baseUrl = window.location.origin;
        var path    = LS.cart.pathname || window.location.pathname;
        var cartUrl = baseUrl + path;

        console.log('cartId:', cartId);
        console.log('storeId:', storeId);
        console.log('URL del carrito:', cartUrl);

        if (cartId && storeId && !window.location.href.includes('success')) {
          var requestId    = cartId + '-' + path;
          var sentRequests = JSON.parse(sessionStorage.getItem('sentRequests') || '{}');

          if (!sentRequests[requestId]) {
            // Siempre enviamos a tu backend Vercel
            var endpoint = 'https://alerti-backend.vercel.app/api/checkout';

            fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                checkout_id: cartId,
                store_id:    storeId,
                cart_url:    cartUrl
              })
            })
              .then(function(res) {
                return res.json().catch(function(){ return {}; });
              })
              .then(function(data) {
                console.log('Checkout enviado a', endpoint, data);
                sentRequests[requestId] = currentTime;
                sessionStorage.setItem('sentRequests', JSON.stringify(sentRequests));
              })
              .catch(function(err) {
                console.error('Error enviando checkout a', endpoint, err);
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
