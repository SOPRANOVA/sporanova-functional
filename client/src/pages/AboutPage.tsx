import GenericPage from "./GenericPage";
export default function AboutPage() {
  return GenericPage({ label:"About", title:"Building the intelligence layer for enterprise.", subtitle:"SOPRANOVA was founded with a simple belief: enterprise intelligence should feel effortless.", sections:[{heading:"Our Mission",body:"Make every enterprise decision faster, more informed, and more confident."},{heading:"Our Approach",body:"We believe the best technology disappears — it amplifies human intelligence rather than replacing it."},{heading:"Our Team",body:"Former operators, AI researchers, and enterprise software veterans from leading technology companies."},{heading:"Investors",body:"Backed by leading enterprise and deep tech venture firms."}]});
}
