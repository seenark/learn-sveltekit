/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        handwritting: ['Kalam', 'cursive'],
        mono: ['Source Code Pro', 'monospace'],
        sansSerif: ['Source Sans 3', 'sans-serif'],
      },
      colors: {
        // caribbeanGreen: "#00ca9e",
        blueGem: "#3813a0",
        caribbeanGreen: "#1cc6a0",
        daisyBush: "#4714a5",
        fog: "#decaec",
        gallery: "#efeaf2",
        goldenFizz: "#feff40",
        larvenderIndigo: "#8657E1",
        monsoon: "#777878",
        pastelPurple: "#b2a1bb",
        prim: "#ede6ef",
        purple: "#7209b7",
        robinEggBlue: "#00e9c0",
        scarlet: "#f72f45",
        silver: "#c0c0c0",
        whisper: "#f9f4f9",
      },
      zIndex: {
        toaster: 1000,
        modal: 999,
        modalOverlay: 998,
        slidePanel: 997,
        overlay: 996,
        navBarToggle: 91,
        navBar: 90,
        row: 5,
        rowActions: 1
      },
      boxShadow: {
        colored: "0px 7px 16px rgba(127,91,220,0.002)",
        coloredHover: "0px 16px 25px rgba(127,91,220,0.3)",
        tableRow: "0px 0px 6px rgba(0,0,0,0.16)",
        slidePanel: "-4px 0px 44px rgba(0, 0, 0, 0.25)",
        invoice: "-4px 0px 44px rgba(0, 0, 0, 0.25)",
      },
      gridTemplateColumns: {
        clientTable: "100px 1fr 125px 125px 32px 32px",
        clientTableMobile: "1fr 90px",
        invoiceLineItem: "1fr 100px 100px 100px 65px",
        invoiceTable: "100px 100px 60px 1fr 116px 32px 32px",
        invoiceTableMobile: "1fr 90px",

      },
      borderWidth: {
        '1': "1px"
      },
      backgroundImage: {
        circle: "url(/images/circle.svg)",
        arrowRightUp: "url(/images/arrow-right-up.svg)",
        arrowLeftUp: "url(/images/arrow-left-up.svg)",
        chevronDown: "url(/images/chevron-down.svg)",
        thankYou: "url(/images/bg-thankYou.svg)",
        bg404: "url(/images/bg-404.svg)",
        auth: "url('/images/bg-auth.svg')",
      },
      backgroundPosition: {
        "right-center": "97% center"
      }
    },
  },
  plugins: [],
}



