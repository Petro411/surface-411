const siteConfig = {
    title: "Surface Data Made Simple",
    description: "Discover detailed Surface ownership data with Surface. Subscribe to access verified property and ownership information quickly and easily.",
    domain: "https://surface.com",

    keywords: [
        "Surface Data",
        "Surface Owners",
        "Land Ownership",
        "Property Search",
        "surface",
        "Subscription Surface Platform",
    ],

    author: "Surface Team",
    logo: "/assets/logo.svg", // adjust as needed
    socialLinks: {
        twitter: "https://twitter.com/surface",
        linkedin: "https://linkedin.com/company/surface",
    },
    UserTypes: {
        user: "user",
        admin: "admin"
    },
    subscription: [
        {
            name: "Intern",
            price: "$29.99",
            stripePriceId: 'price_1RKKbBQfgzh7GyQWxuVstmFZ',
            billingCycle: "Monthly Subscription",
            features: {
                noOfCounties: 1,
                noOfUsers: 1,
                noOfDownloads: 1,
            },
            summary:
                "Search and viewing of individual Surface Owner Name, Address, and Legal Description. Free viewing of Surface lists without phone numbers.",
        },
        {
            name: "Entry Level",
            price: "$49.99",
            stripePriceId: 'price_1RKfMtQfgzh7GyQW5FO0RMyC',
            billingCycle: "Monthly Subscription",
            features: {
                noOfCounties: 3,
                noOfUsers: 2,
                noOfDownloads: 20,
            },
            summary:
                "Access expanded county data. View Surface owner contact info and download up to 20 records per month.",
        },
        {
            name: "Professional",
            price: "$99.99",
            stripePriceId: 'price_1RKfNWQfgzh7GyQWE1gUVpmZ',
            billingCycle: "Monthly Subscription",
            features: {
                noOfCounties: 10,
                noOfUsers: 5,
                noOfDownloads: 100,
            },
            recommended: true,
            summary:
                "Ideal for professionals managing multiple counties. Includes downloads, full Surface lists with contacts, and more users.",
        },
        // {
        //     name: "Management",
        //     price: "$199.99",
        //     billingCycle: "Monthly Subscription",
        //     features: {
        //         noOfCounties: 25,
        //         noOfUsers: 10,
        //         noOfDownloads: 500,
        //     },
        //     summary:
        //         "Perfect for teams. Manage wide regions with generous downloads and team access. Includes enhanced filtering and data tools.",
        // },
        // {
        //     name: "Executive",
        //     price: "$299.99",
        //     billingCycle: "Monthly Subscription",
        //     features: {
        //         noOfCounties: 50,
        //         noOfUsers: 20,
        //         noOfDownloads: "Unlimited",
        //     },
        //     summary:
        //         "Complete platform access for large organizations. Unlimited downloads, priority support, and the full suite of Surface ownership data tools.",
        // },
    ]
};

export default siteConfig;