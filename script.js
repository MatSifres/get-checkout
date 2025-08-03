(function() {
  if (window.location.hostname === 'lumea-ar.com' || window.location.hostname.endsWith('.lumea-ar.com')) {
    console.log('Script deshabilitado para lumea-ar.com');
    return;
  }

  // Ejecutamos solo una vez cuando se carga la página
  // Usamos una bandera en sessionStorage que se limpia cuando el navegador se cierra
  window.addEventListener('load', function() {
    // Verificar si la página acaba de cargar
    var pageLoadTimestamp = sessionStorage.getItem('pageLoadTimestamp');
    var currentTime = new Date().getTime();

    // Si es la primera carga o han pasado más de 5 segundos desde la última carga
    if (!pageLoadTimestamp || (currentTime - pageLoadTimestamp > 5000)) {
      // Actualizar timestamp
      sessionStorage.setItem('pageLoadTimestamp', currentTime);

      // Verificamos que LS.cart y cartId existan
      if (typeof LS !== 'undefined' && LS.cart && LS.cart.id) {
        var cartId = LS.cart.id;
        var storeId = LS.store ? LS.store.id : null;
        var url = window.location.origin;
        var pathname = LS.cart.pathname || window.location.pathname;
        var fullCartUrl = url + pathname;

        console.log("cartId:", cartId);
        console.log("storeId:", storeId);
        console.log("URL del carrito:", fullCartUrl);

        // Verificamos si tenemos los valores necesarios y si la URL no es de éxito
        if (cartId && storeId && !window.location.href.includes("success")) {
          // Crear un identificador único para esta combinación de carrito y página
          var requestId = cartId + '-' + window.location.pathname;

          // Verificar si ya enviamos este carrito en esta página en los últimos X segundos
          var sentRequests = JSON.parse(sessionStorage.getItem('sentRequests') || '{}');

          if (!sentRequests[requestId]) {
            // Elegir endpoint: Render para fuled, Bubble para los demás
            var endpoint;
            var payload;
            if (window.location.hostname === 'www.fuled.com.ar' || window.location.hostname === 'fuled.com.ar') {
              endpoint = 'https://alerti-backend.onrender.com/checkout';
              payload = {
                order_id: cartId,
                store_id: storeId,
                cart_url: fullCartUrl
              };
            } else {
              endpoint = 'https://dashboard.alerti.app/api/1.1/wf/checkout/';
              payload = {
                checkout_id: cartId,
                store_id: storeId,
                cart_url: fullCartUrl
              };
            }

            fetch(endpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(payload)
            })
            .then(response => response.json().catch(() => ({})))
            .then(data => {
              console.log('Checkout enviado a', endpoint, data);
              // Marcar como enviado con timestamp
              sentRequests[requestId] = currentTime;
              sessionStorage.setItem('sentRequests', JSON.stringify(sentRequests));
            })
            .catch(error => console.error('Error enviando checkout a', endpoint, error));
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
