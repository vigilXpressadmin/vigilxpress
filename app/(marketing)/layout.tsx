import FloatingNavbar from "@/components/layout/floating-navbar";
import Footer from "@/components/Footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FloatingNavbar />
      {children}
      <Footer />
    </>
  );
}