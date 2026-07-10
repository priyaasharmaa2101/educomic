import type { IFooter } from "../types";

export const footerData: IFooter[] = [
    {
        title: "Platform",
        links: [
            { name: "Generate", href: "http://localhost:5173/generate" },
            { name: "My Generation", href: "http://localhost:5173/generate" },
            // { name: "Pricing", href: "#pricing" },
            // { name: "Affiliate", href: "#affiliate" },
        ]
    },
    {
        title: "Resources",
        links: [
            // { name: "Company", href: "#company" },
            // { name: "Blogs", href: "#blogs" },
            // { name: "Community", href: "#community" },
            // { name: "Careers", href: "#careers" },
            { name: "About Us", href: "http://localhost:5173/contact" },
        ]
    },
    {
        title: "Legal",
        links: [
            { name: "Privacy", href: "http://localhost:5173/privacy" },
            { name: "Terms", href: "http://localhost:5173/terms" },
        ]
    }
];