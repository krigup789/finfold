import arcjet, { tokenBucket } from "@arcjet/next";

const rules =
  process.env.NODE_ENV === "production"
    ? [
        tokenBucket({
          mode: "LIVE",
          refillRate: 10,  // 10 tokens refill
          interval: 3600,  // every hour
          capacity: 10,    // max burst
        }),
      ]
    : []; // 👈 No rules in dev

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["userId"], // Track based on Clerk userId
  rules,
});

export default aj;
