import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PLANS = {
  "petit-kiff": {
    name: "Petit Kiff",
    monthly: 1200,
    annual: 960,
    trial_days: 14,
  },
  "gros-kiff": {
    name: "Gros Kiff",
    monthly: 4900,
    annual: 3920,
    trial_days: 0,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { planId, billing } = req.body;
    const plan = PLANS[planId];

    if (!plan) {
      return res.status(400).json({ error: "Plan inconnu" });
    }

    const isAnnual = billing === "annual";
    const unitAmount = isAnnual ? plan.annual : plan.monthly;
    const origin = req.headers.origin || "https://maison-du-bonheur-2026.vercel.app";

    const sessionConfig = {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: `La Maison du Bonheur — ${plan.name}` },
            unit_amount: unitAmount,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}?checkout=success`,
      cancel_url: `${origin}?checkout=cancel`,
    };

    if (plan.trial_days > 0) {
      sessionConfig.subscription_data = {
        trial_period_days: plan.trial_days,
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);
    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    return res.status(500).json({ error: err.message });
  }
}
