# Stich naija 

Build a full-stack mobile-responsive e-commerce web app called 'StyleNaija' (or 'Ordering App' for stylish clothing, shoes, and loungewear). It's a personalized fashion styling companion for Nigerian users, focused on confident shopping with accurate sizing, cultural trends, and community.

Overall Vibe: Modern, vibrant, aspirational African fashion — use bold colors, high-quality lifestyle images of diverse models (various body types, skin tones), clean typography, smooth animations. Dark/light mode support. Mobile-first PWA-like experience.

Key Sections & Features (Customer Side):

Home/Dashboard: Personalized feed with 'Recommended for You' (based on profile/size), trending Nigerian styles, new arrivals, sales carousel (no auto-rotate), 'Complete the Look' bundles.

Shop/Catalog: Categories (Men, Women, Kids, Shoes, House Wears, Suits, etc.). Advanced filters/search by size, color, price, material, brand, body type, occasion. Product grid with quick add to cart/wishlist.

Product Detail: High-res zoomable photos + short fabric/movement videos, interactive size guide/chart, stock levels, price, detailed description, real user reviews/photos/ratings, 'Virtual Try-On' button (AI size rec based on height/weight or photo), 'Add to Look' suggestions.

Cart & Wishlist: Save for later, easy edit.

Checkout: Multiple payments (Card via gateway, Bank Transfer, Cash on Delivery). Shipping calculator (Lagos/Nigeria focus), order summary, address saving.

Order Tracking: Status flow (Received → Packed → Shipped → Delivered). Notifications.

Account: Sign up/login (Supabase auth), profile with sizes/addresses, order history, reviews, wishlist, virtual wardrobe.

Community/Engagement: Push notifications for new arrivals/sales/orders, promo codes, WhatsApp chat support integration, user styling uploads/challenges.

Other: Size recommender, return policy info, 'Video for Products' clips.

Admin/Seller Dashboard (protected routes):

Inventory management (track stock by size/color, auto out-of-stock).

Order management (view, update status, print waybills).

Product upload (photos, descriptions, variants, prices).

Sales analytics (best-sellers, revenue, size trends).

Customer management, promo/discount creator.

Tech & Security:

Use Supabase for auth, database, storage.

Secure payments, SSL, input validation.

Responsive, fast, accessible.

Integrate mock analytics and notifications.

Generate the full app with beautiful UI, realistic sample data (Nigerian fashion items), and make it editable. Prioritize intuitive UX for discovery, sizing confidence, and checkout to minimize cart abandonment."

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8899ebff-7c77-4266-bad7-ddacb241d324).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
