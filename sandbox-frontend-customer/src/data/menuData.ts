export const menuData = {
  globalOptions: {
    wingFlavors: [
      "Sriracha",
      "Garlic Parmesan",
      "Soy Garlic",
      "Honey Butter",
      "Buffalo",
      "Creamy Cajun"
    ],
    dips: [
      "Creamy Cheese",
      "Garlic Mayo",
      "Sriracha Mayo",
      "Catsup / Hot sauce"
    ],
    rice: [
      "Plain Rice",
      "Java Rice",
      "Garlic Rice"
    ],
    friesFlavors: [
      "Cheese",
      "BBQ",
      "Sour Cream"
    ],
    beverages: [
      "Ice Tea Glass",
      "Iced Tea Pitcher",
      "Coke Mismo",
      "Bottled Water",
      "Coke Pitcher"
    ]
  },
  menu: [
    {
      category: "Unlimited",
      items: [
        {
          id: "unli-a",
          name: "UNLI A",
          description: "Unlimited wings with rice.",
          basePrice: 299.00,
          configuration: {
            flavors: {
              min: 1,
              max: 1
            },
            dips: {
              min: 1,
              max: 1
            },
            rice: {
              min: 1,
              max: 1
            },
            specialInstructions: true
          }
        },
        {
          id: "unli-b",
          name: "UNLI B",
          description: "Unlimited wings with rice and fries.",
          basePrice: 329.00,
          configuration: {
            flavors: {
              min: 1,
              max: 1
            },
            dips: {
              min: 1,
              max: 1
            },
            rice: {
              min: 1,
              max: 1
            },
            fries: {
              min: 1,
              max: 1
            },
            specialInstructions: true
          }
        },
        {
          id: "unli-c",
          name: "UNLI C",
          description: "Unlimited wings with rice, fries, and iced tea.",
          basePrice: 349.00,
          configuration: {
            flavors: {
              min: 1,
              max: 1
            },
            dips: {
              min: 1,
              max: 1
            },
            rice: {
              min: 1,
              max: 1
            },
            fries: {
              min: 1,
              max: 1
            },
            beverages: {
              min: 1,
              max: 1,
              allowed: [
                "Ice Tea Glass",
                "Iced Tea Pitcher"
              ]
            },
            specialInstructions: true
          }
        },
        {
          id: "unli-d",
          name: "UNLI D",
          description: "Unlimited wings only.",
          basePrice: 289.00,
          configuration: {
            flavors: {
              min: 1,
              max: 1
            },
            dips: {
              min: 1,
              max: 1
            },
            specialInstructions: true
          }
        }
      ]
    },
    {
      category: "Ala Carte",
      items: [
        {
          id: "ala-carte-2pc-rice",
          name: "2pcs Wings + Rice",
          description: "Perfect for a light solo meal. (1 flavor only)",
          basePrice: 89.00,
          configuration: {
            flavors: {
              min: 1,
              max: 1
            },
            dips: {
              min: 1,
              max: 1
            },
            rice: {
              min: 1,
              max: 1
            },
            specialInstructions: true
          }
        },
        {
          id: "ala-carte-3pc-rice",
          name: "3pcs Wings + Rice",
          description: "Simple rice meal with extra wings. (1 flavor only)",
          basePrice: 110.00,
          configuration: {
            flavors: {
              min: 1,
              max: 1
            },
            dips: {
              min: 1,
              max: 1
            },
            rice: {
              min: 1,
              max: 1
            },
            specialInstructions: true
          }
        },
        {
          id: "ala-carte-3pc-fries",
          name: "3pcs Wings + Fries",
          description: "Wings paired with crispy fries. (1 flavor only)",
          basePrice: 139.00,
          configuration: {
            flavors: {
              min: 1,
              max: 1
            },
            dips: {
              min: 1,
              max: 1
            },
            fries: {
              min: 1,
              max: 1
            },
            specialInstructions: true
          }
        },
        {
          id: "ala-carte-6pc-fries",
          name: "6pcs Wings + Fries",
          description: "Shareable wings and fries combo. (up to 2 flavors)",
          basePrice: 199.00,
          configuration: {
            flavors: {
              min: 1,
              max: 2
            },
            dips: {
              min: 1,
              max: 1
            },
            fries: {
              min: 1,
              max: 1
            },
            specialInstructions: true
          }
        }
      ]
    },
    {
      category: "Wings to Share",
      items: [
        {
          id: "share-9pc",
          name: "9pcs Wings",
          description: "Good for sharing. (up to 3 flavors)",
          basePrice: 279.00,
          configuration: {
            flavors: {
              min: 1,
              max: 3
            },
            dips: {
              min: 1,
              max: 2
            },
            rice: {
              optional: true
            },
            beverages: {
              optional: true,
              allowed: [
                "Iced Tea Pitcher",
                "Coke Pitcher"
              ]
            },
            specialInstructions: true
          }
        },
        {
          id: "share-12pc",
          name: "12pcs Wings",
          description: "Perfect for small groups. (up to 3 flavors)",
          basePrice: 349.00,
          configuration: {
            flavors: {
              min: 1,
              max: 3
            },
            dips: {
              min: 1,
              max: 2
            },
            rice: {
              optional: true
            },
            beverages: {
              optional: true,
              allowed: [
                "Iced Tea Pitcher",
                "Coke Pitcher"
              ]
            },
            specialInstructions: true
          }
        },
        {
          id: "share-16pc",
          name: "16pcs Wings",
          description: "Bigger shareable serving. (up to 4 flavors)",
          basePrice: 449.00,
          configuration: {
            flavors: {
              min: 1,
              max: 4
            },
            dips: {
              min: 1,
              max: 3
            },
            rice: {
              optional: true
            },
            beverages: {
              optional: true,
              allowed: [
                "Iced Tea Pitcher",
                "Coke Pitcher"
              ]
            },
            specialInstructions: true
          }
        },
        {
          id: "share-20pc",
          name: "20pcs Wings",
          description: "Great for barkada meals. (up to 4 flavors)",
          basePrice: 549.00,
          configuration: {
            flavors: {
              min: 1,
              max: 4
            },
            dips: {
              min: 1,
              max: 3
            },
            rice: {
              optional: true
            },
            beverages: {
              optional: true,
              allowed: [
                "Iced Tea Pitcher",
                "Coke Pitcher"
              ]
            },
            specialInstructions: true
          }
        }
      ]
    },
    {
      category: "Sides",
      items: [
        {
          id: "side-plain-rice",
          name: "Plain Rice",
          description: "Extra steamed rice, perfect with saucy wings.",
          basePrice: 20.00
        },
        {
          id: "side-java-rice",
          name: "Java Rice",
          description: "Flavorful rice for a more filling meal.",
          basePrice: 35.00
        },
        {
          id: "side-garlic-rice",
          name: "Garlic Rice",
          description: "Savory rice with garlic flavor.",
          basePrice: 30.00
        },
        {
          id: "side-fries",
          name: "Flavored Fries",
          description: "Crispy fries with Cheese, BBQ, or Sour Cream flavor.",
          basePrice: 90.00
        }
      ]
    },
    {
      category: "Add on Dips",
      items: [
        {
          id: "dip-cheese",
          name: "Creamy Cheese",
          description: "Rich and cheesy dip.",
          basePrice: 20.00
        },
        {
          id: "dip-garlic-mayo",
          name: "Garlic Mayo",
          description: "Creamy dip with garlic flavor.",
          basePrice: 20.00
        },
        {
          id: "dip-sriracha-mayo",
          name: "Sriracha Mayo",
          description: "Spicy and creamy dip.",
          basePrice: 20.00
        },
        {
          id: "dip-catsup",
          name: "Catsup / Hot sauce",
          description: "Classic sweet or spicy dip.",
          basePrice: 15.00
        }
      ]
    },
    {
      category: "Drinks",
      items: [
        {
          id: "drink-ice-tea-glass",
          name: "Ice Tea Glass",
          description: "Refreshing drink good for one",
          basePrice: 35.00
        },
        {
          id: "drink-ice-tea-pitcher",
          name: "Iced Tea Pitcher",
          description: "Refreshing drink good for sharing.",
          basePrice: 80.00
        },
        {
          id: "drink-coke-mismo",
          name: "Coke Mismo",
          description: "Classic soft drink for solo meals.",
          basePrice: 0.00
        },
        {
          id: "drink-water",
          name: "Bottled Water",
          description: "Simple and refreshing water.",
          basePrice: 20.00
        }
      ]
    }
  ]
} as const;