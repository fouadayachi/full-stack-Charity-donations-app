export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Vite + HeroUI",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Our work",
      href: "#ourWork",
      scroll: () => {
        
        const element = document.getElementById("ourWork");

        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      },
    },
    {
      label: "Give help",
      href: "#giveHelp",
      scroll: () => {
        console.log("it works")
        const element = document.getElementById("giveHelp");

        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      },
    },
    {
      label: "Get help",
      href: "/getHelp",
    },
    {
      label: "Contact us",
      href: "#Contact",
      scroll: () => {
        console.log("it works")
        const element = document.getElementById("contactUs");

        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      },
    },
    {
      label: "About us",
      href: "#About",
      scroll: () => {
        console.log("it works")
        const element = document.getElementById("aboutUs");

        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      },
    },
  ],
  footerItems: [
    {
      label: "Our work",
      href: "#ourWork",
      scroll: () => {
        
        const element = document.getElementById("ourWork");

        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      },
    },
    {
      label: "Give help",
      href: "#giveHelp",
      scroll: () => {
        
        const element = document.getElementById("giveHelp");

        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      },
    },
    {
      label: "Get help",
      href: "/getHelp",
    },
    {
      label: "Contact us",
      href: "#Contact",
      scroll: () => {
        console.log("it works")
        const element = document.getElementById("contactUs");

        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      },
    },
  ],
  links: {
    github: "https://github.com/frontio-ai/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
  signUpFormControl: [
    {
      label: "First Name",
      name: "firstName",
      type: "text",
      required: true,
      placeholder: "Enter your first name",
      componentType: "input",
    },
    {
      label: "Last Name",
      name: "lastName",
      type: "text",
      required: true,
      placeholder: "Enter your last name",
      componentType: "input",
    },

    {
      label: "Email",
      name: "email",
      type: "email",
      required: true,
      placeholder: "Enter your user email",
      componentType: "input",
    },

    {
      label: "Phone",
      name: "phone",
      type: "text",
      required: false,
      placeholder: "Enter your phone number",
      componentType: "input",
    },
    {
      label: "Address",
      name: "address",
      type: "text",
      required: false,
      placeholder: "Enter your address",
      componentType: "input",
    },
    {
      label: "Password",
      name: "password",
      type: "password",
      required: true,
      placeholder: "Enter your password",
      componentType: "input",
    },
  ],
  signInFormControl: [
    {
      label: "Email",
      name: "email",
      type: "email",
      required: true,
      placeholder: "Enter your user email",
      componentType: "input",
    },
    {
      label: "Password",
      name: "password",
      type: "password",
      required: true,
      placeholder: "Enter your password",
      componentType: "input",
    },
  ],
};
