export const SITE = {
  name: "VigiXpress",
  tagline: "Food & grocery delivery with eyes on every order.",
  url: "https://vigilxpress.com",
  email: "chopfastadmin@gmail.com",
  whatsapp: "2349154430373",
  whatsappDisplay: "+234 915 443 0373",
  instagram: "https://www.instagram.com/vigilxpress",
  facebook: "https://www.facebook.com/profile.php?id=61594991821249&mibextid=ZbWKwL",
  x: "https://x.com/ChopFastAd",
  area: "Selected communities in Ogun State, Nigeria",
} as const;

export const waLink = (t?: string) =>
  `https://wa.me/${SITE.whatsapp}${t ? `?text=${encodeURIComponent(t)}` : ""}`;