(function() {
  // Esperamos a que la página esté completamente cargada
  window.addEventListener('load', function() {
    // Aseguramos que LS.cart y cartId existan
    if (typeof LS !== 'undefined' && LS.cart && LS.cart.id) {
      var cartId = LS.cart.id;  // Capturamos el cartId
      var storeId = LS.store ? LS.store.id : null;  // Capturamos el storeId si existe
      
      console.log("cartId:", cartId);
      console.log("storeId:", storeId);

      // Verificamos si tenemos los valores necesarios
      if (cartId && storeId) {
        // Hacemos la llamada AJAX para enviar el cartId y storeId a tu backend en Bubble
        fetch('https://mailsqueeze.bubbleapps.io/version-test/api/1.1/wf/checkout/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            checkout_id: cartId,  // Enviamos el cartId como checkout_id
            store_id: storeId     // Enviamos también el store_id
          })
        })
        .then(response => response.json())
        .then(data => console.log('Checkout enviado:', data))
        .catch(error => console.error('Error enviando checkout:', error));
      } else {
        console.error('No se pudo obtener el cartId o storeId');
      }
    } else {
      console.error('No se encontró LS.cart o el cartId');
    }
  });
})();
