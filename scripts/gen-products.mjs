import fs from 'fs';

const categories = [
  { id: 'industrial-machinery', name: 'Industrial Machinery' },
  { id: 'power-tools', name: 'Power Tools' },
  { id: 'compressors', name: 'Compressors' },
  { id: 'generators', name: 'Generators' },
  { id: 'safety-equipment', name: 'Safety Equipment' },
  { id: 'hydraulics', name: 'Hydraulics' },
  { id: 'metal-working', name: 'Metal Working' },
  { id: 'construction', name: 'Construction' },
  { id: 'electrical', name: 'Electrical' },
  { id: 'automation', name: 'Automation' },
];

const brands = [
  'VoltMaster', 'AeroForce', 'ForgeSteel', 'ArcTech', 'LiftPro',
  'TorqueLine', 'IronClad', 'DuraDrive', 'PrecisionWorks', 'HydraForce'
];

const imagePool = {
  'industrial-machinery': [
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80',
    'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
  ],
  'power-tools': [
    'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=80',
    'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&q=80',
    'https://images.unsplash.com/photo-1581147036324-c1c9c1c1c1c1?w=800&q=80',
  ],
  'compressors': [
    'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80',
  ],
  'generators': [
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80',
  ],
  'safety-equipment': [
    'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800&q=80',
  ],
  'hydraulics': [
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80',
  ],
  'metal-working': [
    'https://images.unsplash.com/photo-1565608087341-404b25492fee?w=800&q=80',
  ],
  'construction': [
    'https://images.unsplash.com/photo-1541976590-713941681591?w=800&q=80',
  ],
  'electrical': [
    'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80',
  ],
  'automation': [
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80',
  ],
};

const nameParts = {
  'industrial-machinery': ['CNC Milling Center', 'Industrial Lathe', 'Hydraulic Press 20-Ton', 'Sheet Metal Bender', 'Conveyor System Module', 'Industrial Shredder', 'Vertical Band Saw', 'Plate Rolling Machine'],
  'power-tools': ['Cordless Power Drill', 'Angle Grinder 9-Inch', 'Rotary Hammer SDS-Plus', 'Impact Wrench 1/2"', 'Electric Jigsaw', 'Circular Saw 190mm', 'Reciprocating Saw', 'Cordless Impact Driver'],
  'compressors': ['Heavy-Duty Air Compressor 200L', 'Rotary Screw Compressor', 'Portable Air Compressor 50L', 'Oil-Free Compressor', 'Two-Stage Piston Compressor'],
  'generators': ['Diesel Generator 500kVA', 'Portable Generator 10kW', 'Silent Inverter Generator', 'Standby Power Generator', 'Industrial Generator 250kVA'],
  'safety-equipment': ['Industrial Safety Helmet', 'High-Visibility Safety Vest', 'Safety Goggles Anti-Fog', 'Cut-Resistant Work Gloves', 'Fall Protection Harness', 'Respirator Mask Kit'],
  'hydraulics': ['Hydraulic Cylinder Assembly', 'Hydraulic Pump Unit', 'Hydraulic Hose Kit', 'Hydraulic Jack 20-Ton', 'Hydraulic Power Pack'],
  'metal-working': ['MIG Welding Machine', 'TIG Welder Inverter', 'Metal Cutting Bandsaw', 'Bench Grinder 8-Inch', 'Sheet Metal Shear', 'Plasma Cutter 60A'],
  'construction': ['Concrete Mixer 500L', 'Vibratory Plate Compactor', 'Scaffolding Tower Kit', 'Demolition Hammer', 'Laser Level Tool'],
  'electrical': ['Industrial Circuit Breaker Panel', 'Cable Management System', 'Voltage Stabilizer 10kVA', 'Industrial Extension Reel', 'Distribution Transformer'],
  'automation': ['PLC Control Module', 'Industrial Robotic Arm', 'Conveyor Sensor Kit', 'SCADA Control Panel', 'Automated Guided Vehicle'],
};

function pick(arr, i) { return arr[i % arr.length]; }
function seededRand(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const products = [];
let id = 1;

categories.forEach((cat, catIdx) => {
  const names = nameParts[cat.id];
  const perCat = 10 + (catIdx % 3); // ~100-110 total
  for (let i = 0; i < perCat; i++) {
    const rand = seededRand(id * 17 + 3);
    const brand = pick(brands, id + catIdx);
    const baseName = pick(names, i);
    const variant = ['Pro', 'Industrial', 'Heavy-Duty', 'Standard', 'XR Series', 'Elite', ''][id % 7];
    const name = variant ? `${baseName} ${variant}` : baseName;
    const price = Math.round((150 + rand() * 45000)) * 10;
    const rating = (3.8 + rand() * 1.2).toFixed(1);
    const stock = Math.floor(rand() * 120);
    const img = pick(imagePool[cat.id], i);

    products.push({
      id,
      slug: `${cat.id}-${id}`,
      name,
      brand,
      category: cat.id,
      categoryName: cat.name,
      price,
      currency: 'USD',
      rating: Number(rating),
      reviewCount: Math.floor(rand() * 340) + 4,
      stock,
      status: stock === 0 ? 'Out of Stock' : stock < 10 ? 'Limited' : 'In Stock',
      description: `The ${name} by ${brand} is engineered for demanding industrial environments, combining durability, precision, and performance to keep your operations running at peak efficiency. Built to meet enterprise procurement standards with certified components and extended service life.`,
      images: [img, img, img],
      specifications: {
        'Brand': brand,
        'Model No.': `${brand.slice(0,3).toUpperCase()}-${1000 + id}`,
        'Category': cat.name,
        'Warranty': `${1 + (id % 3)} Year${(1 + (id % 3)) > 1 ? 's' : ''}`,
        'Power Rating': `${100 + (id % 20) * 50}W`,
        'Weight': `${(5 + rand() * 200).toFixed(1)} kg`,
        'Country of Origin': ['Germany', 'USA', 'Japan', 'South Korea', 'Italy'][id % 5],
      },
      badges: [cat.name, brand],
    });
    id++;
  }
});

fs.writeFileSync(
  new URL('../src/data/products.json', import.meta.url),
  JSON.stringify(products, null, 2)
);

console.log(`Generated ${products.length} products.`);
