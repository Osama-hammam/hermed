const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true },
    customer: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      country: String,
    },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        price: Number,
        qty: Number,
      },
    ],
    subtotal: Number,
    shipping: Number,
    total: Number,
    paymentMethod: { type: String, enum: ["cod", "card"], default: "cod" },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    notes: String,
  },
  {
    timestamps: true,
  },
);

orderSchema.pre("save", function (next) {
  if (!this.orderId) this.orderId = `ORD-${Date.now().toString().slice(-6)}`;
  next();
});

module.exports = mongoose.model("Order", orderSchema);
