(function() {
  // Esperamos a que la página esté completamente cargada
  window.addEventListener('load', function() {
    // Verificamos que LS.cart y cartId existan
    if (typeof LS !== 'undefined' && LS.cart && LS.cart.id) {
      var cartId = LS.cart.id;  // Capturamos el cartId
      var storeId = LS.store ? LS.store.id : null;  // Capturamos el storeId si existe
      var url = window.location.origin;  // Capturamos la URL base
      var pathname = LS.cart.pathname || window.location.pathname;  // Capturamos el pathname si está disponible en los datos

      console.log("cartId:", cartId);
      console.log("storeId:", storeId);
      console.log("URL del carrito:", url + pathname);  // Mostramos la URL completa del carrito

      // Verificamos si tenemos los valores necesarios y si la URL no es de éxito
      if (cartId && storeId && !window.location.href.includes("success")) {
        // Hacemos la llamada AJAX para enviar el cartId, storeId y la URL del carrito
        fetch('https://mailsqueeze.bubbleapps.io/version-test/api/1.1/wf/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            checkout_id: cartId,  // Enviamos el cartId como checkout_id
            store_id: storeId,     // Enviamos también el store_id
            cart_url: url + pathname  // Enviamos la URL del carrito
          })
        })
        .then(response => response.json())
        .then(data => console.log('Checkout enviado:', data))
        .catch(error => console.error('Error enviando checkout:', error));
      } else {
        console.error('No se pudo obtener el cartId, storeId o ya se procesó el checkout con éxito');
      }
    } else {
      console.error('No se encontró LS.cart o el cartId');
    }
  });
})();
