import React from "react";
import GooglePayButton from "@google-pay/button-react";

export default function GPayButton({ totalAmount, onPaymentSuccess, disabled }) {
  // Prevent rendering if amount is invalid
  if (!totalAmount || totalAmount <= 0) return null;

  return (
    <div className="w-full mt-3 relative">
      {/* 1. The Actual Google Pay Button */}
      <div className={disabled ? "opacity-50 grayscale transition-all" : "transition-all"}>
        <GooglePayButton
          environment="PRODUCTION" // ✅ LIVE MODE
          paymentRequest={{
            apiVersion: 2,
            apiVersionMinor: 0,
            allowedPaymentMethods: [
              {
                type: "CARD",
                parameters: {
                  allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                  allowedCardNetworks: ["MASTERCARD", "VISA"],
                },
                tokenizationSpecification: {
                  type: "PAYMENT_GATEWAY",
                  parameters: {
                    // Since you are using UPI mainly, we use 'example' here.
                    // If you have a specific gateway (Razorpay/Stripe), change this.
                    gateway: "example", 
                    gatewayMerchantId: "exampleGatewayMerchantId",
                  },
                },
              },
              {
                type: "UPI",
                parameters: {
                  // ✅ YOUR REAL BUSINESS UPI ID
                  payeeVpa: "stk-7417410714-1@okbizaxis", 
                  
                  // Your Business Name (Must match bank records)
                  payeeName: "Curtain Story",
                  
                  // Merchant Category Code (5714 = Furnishings/Upholstery)
                  mcc: "5714", 
                  
                  transactionReferenceId: Date.now().toString(),
                }
              }
            ],
            merchantInfo: {
              // ✅ YOUR GOOGLE MERCHANT ID
              merchantId: "BCR2DN7TZDA5NBLS", 
              merchantName: "Curtain Story",
            },
            transactionInfo: {
              totalPriceStatus: "FINAL",
              totalPriceLabel: "Total",
              totalPrice: totalAmount.toString(),
              currencyCode: "INR",
              countryCode: "IN",
            },
          }}
          onLoadPaymentData={onPaymentSuccess}
          buttonColor="black"
          buttonType="pay"
          buttonSizeMode="fill"
          style={{ width: "100%", height: "48px" }}
        />
      </div>

      {/* 2. Click Interceptor (Prevents clicking if form is empty) */}
      {disabled && (
        <div 
          className="absolute inset-0 z-10 cursor-not-allowed"
          onClick={() => alert("Please enter your Name and Phone Number first.")}
        ></div>
      )}
    </div>
  );
}