import { db } from "@/integrations/firebase/client";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  onSnapshot, 
  deleteDoc, 
  doc 
} from "firebase/firestore";
import { Product } from "@/types";

// Sample t-shirts and shorts data (shortened for brevity)
const tshirts = [
  {
    name: "Classic Cotton T-Shirt",
    description: "A comfortable classic cotton t-shirt perfect for everyday wear. Made with premium cotton for maximum comfort and durability.",
    price: 2000, // ₹20.00 (price in paise)
    category: "t-shirts",
    rating: 4.5,
    reviews: 120,
    inStock: true,
    featured: true,
    images: [
      "https://img.freepik.com/free-photo/black-t-shirt-with-word-ultra-it_1340-37775.jpg",
      "https://img.freepik.com/free-photo/gray-t-shirt_1339-6395.jpg",
    ],
    variants: [
      {
        id: "v1",
        size: "S",
        color: "Black",
        colorCode: "#000000",
        stock: 25
      },
      {
        id: "v2",
        size: "M",
        color: "Black",
        colorCode: "#000000",
        stock: 30
      },
      {
        id: "v3",
        size: "L",
        color: "Black",
        colorCode: "#000000",
        stock: 20
      },
      {
        id: "v4",
        size: "M",
        color: "White",
        colorCode: "#FFFFFF", 
        stock: 15
      }
    ]
  },
  {
    name: "Premium Logo Tee",
    description: "Show off your style with our premium logo t-shirt. Features our iconic design on high-quality fabric that's both comfortable and durable.",
    price: 2500, // ₹25.00
    originalPrice: 3000, // ₹30.00
    category: "t-shirts",
    rating: 4.8,
    reviews: 85,
    inStock: true,
    featured: true,
    images: [
      "https://img.freepik.com/free-photo/white-t-shirt-with-word-it_1340-37779.jpg",
      "https://img.freepik.com/free-photo/white-t-shirt-men-cloth_1203-8211.jpg"
    ],
    variants: [
      {
        id: "v5",
        size: "S",
        color: "White",
        colorCode: "#FFFFFF",
        stock: 12
      },
      {
        id: "v6",
        size: "M",
        color: "White",
        colorCode: "#FFFFFF",
        stock: 18
      },
      {
        id: "v7",
        size: "S",
        color: "Blue",
        colorCode: "#0000FF",
        stock: 10
      }
    ]
  },
  {
    name: "Athletic Fit T-Shirt",
    description: "Designed for performance and comfort. This athletic fit t-shirt wicks away moisture and helps you stay cool during workouts.",
    price: 2200, // ₹22.00
    category: "t-shirts",
    rating: 4.3,
    reviews: 62,
    inStock: true,
    featured: false,
    images: [
      "https://img.freepik.com/free-photo/blue-t-shirt-with-word-it_1340-37780.jpg",
      "https://img.freepik.com/free-photo/men-blue-t-shirt-sportswear-apparel-shoot_53876-102418.jpg"
    ],
    variants: [
      {
        id: "v8",
        size: "M",
        color: "Blue",
        colorCode: "#0000FF",
        stock: 22
      },
      {
        id: "v9",
        size: "L",
        color: "Blue",
        colorCode: "#0000FF",
        stock: 18
      }
    ]
  },
  {
    name: "Vintage Graphic Tee",
    description: "Express your vintage style with our graphic printed t-shirt. Features retro designs on soft, pre-washed cotton.",
    price: 2800,
    category: "t-shirts",
    rating: 4.7,
    reviews: 95,
    inStock: true,
    featured: true,
    images: [
      "https://img.freepik.com/free-photo/crew-neck-t-shirt_1409-4867.jpg",
      "https://img.freepik.com/free-photo/red-t-shirt-with-word-it_1340-37778.jpg"
    ],
    variants: [
      {
        id: "v10",
        size: "S",
        color: "Red",
        colorCode: "#FF0000",
        stock: 15
      },
      {
        id: "v11",
        size: "M",
        color: "Red",
        colorCode: "#FF0000",
        stock: 20
      }
    ]
  },
  {
    name: "Organic Cotton Basic Tee",
    description: "Eco-friendly and sustainable t-shirt made from 100% organic cotton. Kind to your skin and the environment.",
    price: 3000,
    originalPrice: 3500,
    category: "t-shirts",
    rating: 4.9,
    reviews: 110,
    inStock: true,
    featured: false,
    images: [
      "https://img.freepik.com/free-photo/green-t-shirt-wooden-hanger-isolated_187299-36776.jpg",
      "https://img.freepik.com/free-photo/green-t-shirt_1339-6438.jpg"
    ],
    variants: [
      {
        id: "v12",
        size: "S",
        color: "Green",
        colorCode: "#008000",
        stock: 18
      },
      {
        id: "v13",
        size: "M",
        color: "Green",
        colorCode: "#008000",
        stock: 22
      },
      {
        id: "v14",
        size: "L",
        color: "Green",
        colorCode: "#008000",
        stock: 15
      }
    ]
  },
  {
    name: "Striped Sailor Tee",
    description: "Classic nautical-inspired t-shirt with horizontal stripes. Perfect for a casual day out or a beach visit.",
    price: 2600,
    category: "t-shirts",
    rating: 4.4,
    reviews: 78,
    inStock: true,
    featured: false,
    images: [
      "https://img.freepik.com/free-photo/blue-striped-shirt_1203-8356.jpg",
      "https://img.freepik.com/free-photo/men-shirt_1203-8358.jpg"
    ],
    variants: [
      {
        id: "v15",
        size: "M",
        color: "Navy",
        colorCode: "#000080",
        stock: 20
      },
      {
        id: "v16",
        size: "L",
        color: "Navy",
        colorCode: "#000080",
        stock: 15
      }
    ]
  },
  {
    name: "Premium Pocket Tee",
    description: "Stylish t-shirt with a premium pocket detail. Combines comfort with a touch of sophistication.",
    price: 2700,
    category: "t-shirts",
    rating: 4.5,
    reviews: 65,
    inStock: true,
    featured: false,
    images: [
      "https://img.freepik.com/free-photo/man-posing-while-doing-hush-sign_23-2149129361.jpg",
      "https://img.freepik.com/free-photo/white-tee-man-city-street_53876-97228.jpg"
    ],
    variants: [
      {
        id: "v17",
        size: "S",
        color: "Gray",
        colorCode: "#808080",
        stock: 16
      },
      {
        id: "v18",
        size: "M",
        color: "Gray",
        colorCode: "#808080",
        stock: 24
      }
    ]
  },
  {
    name: "Long Sleeve Tee",
    description: "Perfect for cooler days, our long sleeve t-shirt offers extra comfort and warmth without sacrificing style.",
    price: 3200,
    category: "t-shirts",
    rating: 4.7,
    reviews: 88,
    inStock: true,
    featured: true,
    images: [
      "https://img.freepik.com/free-photo/white-sweater-mockup-wooden-block_53876-96751.jpg",
      "https://img.freepik.com/free-photo/black-sweater-apparel-wooden-block_53876-97216.jpg"
    ],
    variants: [
      {
        id: "v19",
        size: "M",
        color: "Black",
        colorCode: "#000000",
        stock: 18
      },
      {
        id: "v20",
        size: "L",
        color: "Black",
        colorCode: "#000000",
        stock: 22
      },
      {
        id: "v21",
        size: "M",
        color: "White",
        colorCode: "#FFFFFF",
        stock: 15
      }
    ]
  },
  {
    name: "V-Neck Premium Tee",
    description: "Stylish v-neck t-shirt made from premium cotton. A versatile addition to any wardrobe.",
    price: 2400,
    originalPrice: 2800,
    category: "t-shirts",
    rating: 4.6,
    reviews: 72,
    inStock: true,
    featured: false,
    images: [
      "https://img.freepik.com/free-photo/basic-white-shirt-men-s-fashion-apparel-shoot_53876-101197.jpg",
      "https://img.freepik.com/free-photo/basic-khaki-v-neck-tee-men-s-casual-wear_53876-105551.jpg"
    ],
    variants: [
      {
        id: "v22",
        size: "S",
        color: "Khaki",
        colorCode: "#C3B091",
        stock: 14
      },
      {
        id: "v23",
        size: "M",
        color: "Khaki",
        colorCode: "#C3B091",
        stock: 19
      }
    ]
  },
  {
    name: "Slim Fit Crew Neck",
    description: "Modern slim fit t-shirt with a classic crew neck design. Perfect for a streamlined look.",
    price: 2300,
    category: "t-shirts",
    rating: 4.4,
    reviews: 60,
    inStock: true,
    featured: false,
    images: [
      "https://img.freepik.com/free-photo/red-t-shirt-with-red-tag_1409-3741.jpg",
      "https://img.freepik.com/free-photo/red-t-shirt-men-s-casual-wear-men-s-fashion_53876-104069.jpg"
    ],
    variants: [
      {
        id: "v24",
        size: "S",
        color: "Burgundy",
        colorCode: "#800020",
        stock: 16
      },
      {
        id: "v25",
        size: "M",
        color: "Burgundy",
        colorCode: "#800020",
        stock: 20
      }
    ]
  }
];

// Sample shorts data
const shorts = [
  {
    name: "Casual Cotton Shorts",
    description: "Comfortable cotton shorts perfect for casual everyday wear. Features deep pockets and a relaxed fit.",
    price: 3000, // ₹30.00
    category: "shorts",
    rating: 4.6,
    reviews: 78,
    inStock: true,
    featured: true,
    images: [
      "https://img.freepik.com/free-photo/portrait-handsome-smiling-stylish-young-man-model-dressed-red-checkered-shirt-fashion-man-wearing-sunglasses_158538-19179.jpg",
      "https://img.freepik.com/free-photo/green-front-sweater_125540-736.jpg"
    ],
    variants: [
      {
        id: "vs1",
        size: "S",
        color: "Khaki",
        colorCode: "#C3B091",
        stock: 15
      },
      {
        id: "vs2",
        size: "M",
        color: "Khaki",
        colorCode: "#C3B091",
        stock: 20
      },
      {
        id: "vs3",
        size: "L",
        color: "Khaki",
        colorCode: "#C3B091",
        stock: 15
      }
    ]
  },
  {
    name: "Athletic Performance Shorts",
    description: "Designed for maximum performance during workouts. These lightweight shorts feature moisture-wicking technology and a comfortable fit.",
    price: 3500, // ₹35.00
    originalPrice: 4000, // ₹40.00
    category: "shorts",
    rating: 4.9,
    reviews: 92,
    inStock: true,
    featured: true,
    images: [
      "https://img.freepik.com/free-photo/man-street-fashion-photoshoot_23-2150771033.jpg",
      "https://img.freepik.com/free-photo/man-wearing-brown-shorts-close-up_53876-102239.jpg"
    ],
    variants: [
      {
        id: "vs4",
        size: "M",
        color: "Black",
        colorCode: "#000000",
        stock: 25
      },
      {
        id: "vs5",
        size: "L",
        color: "Black",
        colorCode: "#000000",
        stock: 20
      },
      {
        id: "vs6",
        size: "M",
        color: "Navy",
        colorCode: "#000080",
        stock: 15
      }
    ]
  },
  {
    name: "Denim Shorts",
    description: "Classic denim shorts with a modern twist. Perfect for summer days and casual outings.",
    price: 4000, // ₹40.00
    category: "shorts",
    rating: 4.4,
    reviews: 56,
    inStock: true,
    featured: false,
    images: [
      "https://img.freepik.com/free-photo/pair-blue-denim-jean-shorts_53876-165824.jpg",
      "https://img.freepik.com/free-photo/shorts-pants_1203-8302.jpg"
    ],
    variants: [
      {
        id: "vs7",
        size: "S",
        color: "Blue",
        colorCode: "#0000FF",
        stock: 12
      },
      {
        id: "vs8",
        size: "M",
        color: "Blue",
        colorCode: "#0000FF",
        stock: 18
      },
      {
        id: "vs9",
        size: "L",
        color: "Blue",
        colorCode: "#0000FF",
        stock: 14
      }
    ]
  },
  {
    name: "Cargo Shorts",
    description: "Practical and stylish cargo shorts with multiple pockets. Perfect for outdoor activities.",
    price: 3800,
    category: "shorts",
    rating: 4.5,
    reviews: 68,
    inStock: true,
    featured: false,
    images: [
      "https://img.freepik.com/free-photo/green-shorts_1203-8291.jpg",
      "https://img.freepik.com/free-photo/khaki-mens-short-pants_1203-8329.jpg"
    ],
    variants: [
      {
        id: "vs10",
        size: "M",
        color: "Olive",
        colorCode: "#808000",
        stock: 22
      },
      {
        id: "vs11",
        size: "L",
        color: "Olive",
        colorCode: "#808000",
        stock: 18
      }
    ]
  },
  {
    name: "Chino Shorts",
    description: "Classic chino shorts with a clean, tailored look. Versatile enough for casual and semi-formal occasions.",
    price: 3600,
    originalPrice: 4200,
    category: "shorts",
    rating: 4.7,
    reviews: 85,
    inStock: true,
    featured: true,
    images: [
      "https://img.freepik.com/free-photo/men-jeans-shorts_1203-8290.jpg",
      "https://img.freepik.com/free-photo/brown-pants_1203-8298.jpg"
    ],
    variants: [
      {
        id: "vs12",
        size: "S",
        color: "Beige",
        colorCode: "#F5F5DC",
        stock: 16
      },
      {
        id: "vs13",
        size: "M",
        color: "Beige",
        colorCode: "#F5F5DC",
        stock: 24
      },
      {
        id: "vs14",
        size: "L",
        color: "Beige",
        colorCode: "#F5F5DC",
        stock: 18
      }
    ]
  }
];

// Function to add products to Firestore
export const seedProductsToFirestore = async () => {
  try {
    const productsCollection = collection(db, "products");
    
    // Check if products already exist
    const querySnapshot = await getDocs(productsCollection);
    if (!querySnapshot.empty) {
      console.log("Products already exist in Firestore");
      return;
    }
    
    // Add t-shirts
    for (const tshirt of tshirts) {
      await addDoc(productsCollection, {
        ...tshirt,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // Add shorts
    for (const short of shorts) {
      await addDoc(productsCollection, {
        ...short,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    console.log("Products added to Firestore successfully");
  } catch (error) {
    console.error("Error adding products to Firestore:", error);
    throw error; // Re-throw to allow caller to handle
  }
};

// Enhanced error handling for product fetching
export const getProductsFromFirestore = async (): Promise<Product[]> => {
  try {
    const productsCollection = collection(db, "products");
    const querySnapshot = await getDocs(productsCollection);
    
    if (querySnapshot.empty) {
      console.warn("No products found in Firestore");
      return [];
    }
    
    const products: Product[] = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || '',
        description: data.description || '',
        price: data.price || 0,
        originalPrice: data.originalPrice,
        category: data.category || '',
        images: data.images || [],
        variants: data.variants || [],
        rating: data.rating || 0,
        reviews: data.reviews || 0,
        inStock: data.inStock !== undefined ? data.inStock : true,
        featured: data.featured || false
      };
    });
    
    return products;
  } catch (error) {
    console.error("Error getting products from Firestore:", error);
    throw error; // Re-throw to allow caller to handle
  }
};

// Additional utility functions can be added as needed
