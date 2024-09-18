(function() {
  // Esperamos a que la página esté completamente cargada
  window.addEventListener('load', function() {
    // Verificamos que la URL no contenga la palabra 'success'
    if (!window.location.href.includes('success')) {
      // Aseguramos que LS.cart y cartId existan
      if (typeof LS !== 'undefined' && LS.cart && LS.cart.id) {
        var cartId = LS.cart.id;  // Capturamos el cartId
        var storeId = LS.store ? LS.store.id : null;  // Capturamos el storeId si existe
        var successKey = `checkout_success_${cartId}`; // Generamos una clave única por checkout

        console.log("cartId:", cartId);
        console.log("storeId:", storeId);

        // Verificamos si el checkout ya fue enviado con éxito previamente
        if (!localStorage.getItem(successKey)) {
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
            .then(data => {
              console.log('Checkout enviado:', data);
              // Almacenamos en localStorage que este checkout ya fue enviado con éxito
              localStorage.setItem(successKey, 'true');
            })
            .catch(error => console.error('Error enviando checkout:', error));
          } else {
            console.error('No se pudo obtener el cartId o storeId');
          }
        } else {
          console.log('Este checkout ya fue enviado previamente.');
        }
      } else {
        console.error('No se encontró LS.cart o el cartId');
      }
    } else {
      console.log("La URL contiene 'success', no se envía el checkout.");
    }
  });
})();
