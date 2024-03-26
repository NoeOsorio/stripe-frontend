import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PaymentForm.css"; // Asegúrate de crear este archivo CSS

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
const CheckoutForm = () => {
  const stripe = useStripe(); // Se utiliza para interactuar con la API de Stripe.
  const elements = useElements(); // Se usa para obtener una instancia del elemento CardElement.
  const navigate = useNavigate(); // Hook de React Router para redirigir programáticamente.
  const [name, setName] = useState(""); // Estado para el nombre del cliente.
  const [email, setEmail] = useState(""); // Estado para el correo electrónico del cliente.


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Verifica si Stripe.js ha cargado correctamente.
      return;
    }

    const cardElement = elements.getElement(CardElement); // Obtiene el CardElement.

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement, // Usa los datos del CardElement para crear un método de pago.
    });

    if (error) {
      console.error("[error]", error);
    } else {
      try {
        const { id: paymentMethodId } = paymentMethod;
        // Envía una solicitud al backend para crear un PaymentIntent con el ID del método de pago y la información adicional.
        const {
          data: { clientSecret },
        } = await axios.post(
          `${process.env.REACT_APP_API_URL}/create-payment-intent`,
          {
            paymentMethodId,
            amount: 2000, // La cantidad fija a pagar.
            name,
            email,
          }
        );

        // Usa el clientSecret para confirmar el pago desde el frontend.
        const result = await stripe.confirmCardPayment(clientSecret);

        if (result.error) {
          console.error(result.error.message);
        } else {
          if (result.paymentIntent.status === "succeeded") {
            console.log("Pago realizado con éxito!");
            navigate("/success"); // Redirige al usuario a la página de éxito tras un pago exitoso.
          }
        }
      } catch (error) {
        console.error("Error al procesar el pago", error);
      }
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Pagar ahora</h2>
      <form onSubmit={handleSubmit} className="payment-form">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo electrónico"
          required
        />
        <CardElement />
        <button type="submit" className="submit-button" disabled={!stripe}>
          Pagar $20.00 MXN
        </button>
      </form>
    </div>
  );
};

const PaymentForm = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default PaymentForm;
