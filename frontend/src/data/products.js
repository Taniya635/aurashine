import headphonesImg from '../assets/headphones.png';
import smartwatchImg from '../assets/smartwatch.png';
import sunglassesImg from '../assets/sunglasses.png';
import leatherBagImg from '../assets/leather_bag.png';
import speakerImg from '../assets/speaker.png';
import keyboardImg from '../assets/keyboard.png';

const products = [
  {
    id: 1,
    name: 'Aurora Model 100',
    subtitle: 'Wireless Over-Ear Headphones',
    price: 349.99,
    image: headphonesImg,
    category: 'Audio',
    rating: 4.9,
    reviews: 2847,
    description:
      'Immerse yourself in unparalleled audio with the Aurora Model 100. Featuring 40mm custom titanium drivers, adaptive noise cancellation, and luxurious memory foam ear cushions wrapped in genuine lambskin leather. The matte black finish with 24K gold accents makes a bold statement. Up to 38 hours of battery life ensures your music never stops.',
    features: [
      '40mm Custom Titanium Drivers',
      'Adaptive Noise Cancellation',
      'Genuine Lambskin Leather Cushions',
      '38-Hour Battery Life',
      'Bluetooth 5.3 & Hi-Res Audio',
      '24K Gold Accents',
    ],
  },
  {
    id: 2,
    name: 'Titanium Chrono Pro',
    subtitle: 'Luxury Smartwatch',
    price: 599.99,
    image: smartwatchImg,
    category: 'Watches',
    rating: 4.8,
    reviews: 1563,
    description:
      'The Titanium Chrono Pro merges timeless watchmaking with cutting-edge technology. Crafted from Grade 5 titanium with a sapphire crystal display, this smartwatch features a deep ocean-blue dial that shifts with the light. Advanced health monitoring, GPS, and 5ATM water resistance make it your perfect companion.',
    features: [
      'Grade 5 Titanium Case',
      'Sapphire Crystal Display',
      'Advanced Health Monitoring',
      'Built-in GPS & NFC',
      '5ATM Water Resistance',
      '7-Day Battery Life',
    ],
  },
  {
    id: 3,
    name: 'Aurum Aviator',
    subtitle: 'Premium Sunglasses',
    price: 249.99,
    image: sunglassesImg,
    category: 'Eyewear',
    rating: 4.7,
    reviews: 982,
    description:
      'Handcrafted in Italy, the Aurum Aviator sunglasses feature ultra-thin 18K gold-plated frames and polarized gradient lenses that provide 100% UV protection. The lightweight design weighs only 22 grams, ensuring all-day comfort without compromising on luxury aesthetics.',
    features: [
      '18K Gold-Plated Frames',
      'Polarized Gradient Lenses',
      '100% UV400 Protection',
      'Handcrafted in Italy',
      'Ultra-Light 22g Design',
      'Premium Leather Case Included',
    ],
  },
  {
    id: 4,
    name: 'Aveline Messenger',
    subtitle: 'Leather Crossbody Bag',
    price: 425.00,
    image: leatherBagImg,
    category: 'Bags',
    rating: 4.9,
    reviews: 1247,
    description:
      'The Aveline Messenger is crafted from full-grain Tuscan leather that develops a rich patina over time. Featuring solid brass hardware, a magnetic closure, and an adjustable shoulder strap, this bag seamlessly transitions from boardroom to weekend. Multiple interior compartments keep your essentials organized.',
    features: [
      'Full-Grain Tuscan Leather',
      'Solid Brass Hardware',
      'Magnetic Closure System',
      'Adjustable Shoulder Strap',
      'Interior Laptop Sleeve (13")',
      'Develops Rich Patina Over Time',
    ],
  },
  {
    id: 5,
    name: 'Aurora Resonance',
    subtitle: 'Wireless Speaker',
    price: 199.99,
    image: speakerImg,
    category: 'Audio',
    rating: 4.6,
    reviews: 3156,
    description:
      'The Aurora Resonance delivers 360° immersive sound from a beautifully minimal form. The woven fabric body in cloud white pairs with rose gold accents for a design that elevates any space. With 24-hour battery life, multi-room pairing, and IPX5 water resistance, premium audio goes wherever you do.',
    features: [
      '360° Immersive Sound',
      '24-Hour Battery Life',
      'IPX5 Water Resistance',
      'Multi-Room Pairing',
      'USB-C Fast Charging',
      'Touch-Sensitive Controls',
    ],
  },
  {
    id: 6,
    name: 'Apex 65 Mechanical',
    subtitle: 'Premium Keyboard',
    price: 289.99,
    image: keyboardImg,
    category: 'Tech',
    rating: 4.8,
    reviews: 2091,
    description:
      'The Apex 65 is a 65% mechanical keyboard built for discerning typists. The CNC-machined aluminum chassis in space gray houses premium hot-swappable switches with per-key RGB backlighting. A braided USB-C cable with aviator connector completes the premium experience. QMK/VIA compatible for ultimate customization.',
    features: [
      'CNC-Machined Aluminum Chassis',
      'Hot-Swappable Switches',
      'Per-Key RGB Backlighting',
      'QMK/VIA Compatible',
      'Braided USB-C with Aviator Connector',
      'Sound-Dampening Foam Layers',
    ],
  },
];

export default products;
