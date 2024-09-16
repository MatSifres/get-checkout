(function() {
  window.addEventListener('load', function() {
    // Aseguramos que el objeto SDKCheckout esté disponible
    if (window.SDKCheckout && window.SDKCheckout.data) {
      var cartId = window.SDKCheckout.data.cartId;  // El ID del carrito
      var storeId = window.SDKCheckout.data.storeId;  // El ID de la tienda

      // Verificamos si tenemos los valores necesarios
      if (cartId && storeId) {
        // Hacemos la llamada AJAX para enviar el cartId y storeId a tu backend en Bubble
        fetch('https://webhook.site/81672c65-892f-427b-89eb-5294a0d13fe8', {
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
      console.error('No se encontró el objeto SDKCheckout o sus datos');
    }
  });
})();
