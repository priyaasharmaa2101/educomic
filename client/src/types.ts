export interface SectionTitleProps {
    text1: string;
    text2: string;
    text3: string;
}





export interface IFooter {
    title: string;
    links: IFooterLink[];
}

export interface IFooterLink {
    name: string;
    href: string;
 }

export interface NavbarProps {
    navlinks: INavLink[];
}

export interface INavLink {
    name: string;
    href: string;
}


export interface SectionProps {
    title: string;
    description: string;
    buttonText: string;
    buttonHref: string;
}