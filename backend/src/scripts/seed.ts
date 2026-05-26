import { connectDatabase } from '../config/db';
import { Product } from '../models/Product';

const seedProducts = [
  {
    title: 'Classic Oxford Shirt',
    description: 'Premium cotton oxford shirt with a relaxed fit.',
    price: 4500,
    category: 'Men' as const,
    sizes: ['S', 'M', 'L', 'XL'],
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600',
    stock: 25,
    isFeatured: true,
  },
  {
    title: 'Linen Summer Dress',
    description: 'Breathable linen dress perfect for warm weather.',
    price: 6200,
    category: 'Women' as const,
    sizes: ['XS', 'S', 'M', 'L'],
    imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e03d9?w=600',
    stock: 18,
    isFeatured: true,
  },
  {
    title: 'Leather Belt',
    description: 'Handcrafted full-grain leather belt with brass buckle.',
    price: 2800,
    category: 'Accessories' as const,
    sizes: ['32', '34', '36', '38'],
    imageUrl: 'https://images.unsplash.com/photo-1624222247344-550fb60583fd?w=600',
    stock: 40,
    isFeatured: false,
  },
  {
    title: 'Slim Fit Chinos',
    description: 'Stretch cotton chinos in a modern slim silhouette.',
    price: 3900,
    category: 'Men' as const,
    sizes: ['30', '32', '34', '36'],
    imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600',
    stock: 30,
    isFeatured: false,
  },
  {
    title: 'Cashmere Wrap Scarf',
    description: 'Soft cashmere blend scarf in neutral tones.',
    price: 3500,
    category: 'Women' as const,
    sizes: ['One Size'],
    imageUrl: 'https://images.unsplash.com/photo-1520903923143-35206c1740a0?w=600',
    stock: 22,
    isFeatured: true,
  },
  {
    title: 'Canvas Tote Bag',
    description: 'Durable organic canvas tote with interior pocket.',
    price: 2200,
    category: 'Accessories' as const,
    sizes: ['One Size'],
    imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600',
    stock: 50,
    isFeatured: false,
  },
];

async function seed(): Promise<void> {
  await connectDatabase();
  await Product.deleteMany({});
  await Product.insertMany(seedProducts);
  console.log(`Seeded ${seedProducts.length} products`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
