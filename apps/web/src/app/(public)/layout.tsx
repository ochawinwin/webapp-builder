import { AuthHeader } from "@/components/AuthHeader";
import { Footer } from "@futurecareer/ui";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthHeader />
      <main>{children}</main>
      <Footer />
    </>
  );
}
