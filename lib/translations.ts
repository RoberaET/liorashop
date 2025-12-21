export const translations = {
    en: {
        navbar: {
            clothes: "Clothes",
            shoes: "Shoes",
            cosmetics: "Cosmetics",
            perfumes: "Perfumes",
            searchPlaceholder: "Search products...",
            search: "Search",
            wishlist: "Wishlist",
            cart: "Cart",
            account: "Account",
            myAccount: "My Account",
            signIn: "Sign In",
            menu: "Menu",
            close: "Close",
        },
        hero: {
            newSeason: "NEW SEASON COLLECTION",
            title: "Discover your personal style",
            description: "Curated fashion, beauty, and lifestyle essentials for the modern individual. Premium quality meets timeless design.",
            shopNow: "Shop Now",
            browseCategories: "Browse Categories",
        },
        footer: {
            description: "Premium fashion and lifestyle products curated for the modern individual.",
            shop: "Shop",
            support: "Support",
            legal: "Legal",
            contactUs: "Contact Us",
            faqs: "FAQs",
            shippingInfo: "Shipping Info",
            returns: "Returns",
            privacyPolicy: "Privacy Policy",
            termsOfService: "Terms of Service",
            cookiePolicy: "Cookie Policy",
            rightsReserved: "All rights reserved.",
        },
        common: {
            featuredProducts: "Featured Products",
            addToCart: "Add to Cart",
            outOfStock: "Out of Stock",
        }
    },
    am: {
        navbar: {
            clothes: "ልብሶች",
            shoes: "ጫማዎች",
            cosmetics: "ኮስሜቲክስ",
            perfumes: "ሽቶዎች",
            searchPlaceholder: "ምርቶችን ይፈልጉ...",
            search: "ፈልግ",
            wishlist: "የምኞት ዝርዝር",
            cart: "ጋሪ",
            account: "መለያ",
            myAccount: "የእኔ መለያ",
            signIn: "ግባ",
            menu: "ምናሌ",
            close: "ዝጋ",
        },
        hero: {
            newSeason: "አዲስ የውድድር ዘመን ስብስብ",
            title: "የራስዎን ዘይቤ ያግኙ",
            description: "ለዘመናዊው ግለሰብ የተመረጡ ፋሽን፣ ውበት እና የአኗኗር ዘይቤዎች። ፕሪሚየም ጥራት ጊዜ የማይሽረው ንድፍ ያሟላል።",
            shopNow: "አሁን ይግዙ",
            browseCategories: "ምድቦችን ያስሱ",
        },
        footer: {
            description: "ለዘመናዊው ግለሰብ የተመረጡ የፕሪሚየም ፋሽን እና የአኗኗር ዘይቤ ምርቶች።",
            shop: "ይግዙ",
            support: "ድጋፍ",
            legal: "ሕጋዊ",
            contactUs: "ያግኙን",
            faqs: "ተደጋጋሚ ጥያቄዎች",
            shippingInfo: "የመርከብ መረጃ",
            returns: "ምላሾች",
            privacyPolicy: "የ ግል የሆነ",
            termsOfService: "የአገልግሎት ውል",
            cookiePolicy: "የኩኪ ፖሊሲ",
            rightsReserved: "መብቱ በህግ የተጠበቀ ነው.",
        },
        common: {
            featuredProducts: "ተለይተው የቀረቡ ምርቶች",
            addToCart: "ወደ ጋሪ ጨምር",
            outOfStock: "አልቋል",
        }
    }
} as const;

export type Language = keyof typeof translations;
export type Translation = typeof translations.en;
// We need to widen the type of Translation to allow for different string values
// but keep the structure.
export type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>;
};

// Effectively making the Translation type structurally the same as 'en' but values are string
export type TranslationType = {
    [K in keyof typeof translations.en]: {
        [P in keyof typeof translations.en[K]]: string
    }
}
