import GenericPage from "./GenericPage";
export default function EnterprisePage() {
  return GenericPage({ label:"Enterprise", title:"Enterprise-grade. From day one.", subtitle:"SOPRANOVA is designed for the security, compliance, and scalability requirements of large organizations.", sections:[{heading:"SOC 2 Type II Certified",body:"Independently audited security controls across all systems and processes."},{heading:"Private Deployment",body:"Deploy SOPRANOVA within your own cloud environment — AWS, Azure, or GCP."},{heading:"SSO & SCIM",body:"Native integration with Okta, Azure AD, and all major identity providers."},{heading:"Data Residency",body:"Choose where your data lives — with full sovereignty guarantees."}]});
}
