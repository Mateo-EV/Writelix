import { Navbar } from "@/components/layout/Navbar";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  return (
    <>
      <Navbar hasMaxWidth />
      <section className="space-y-6 pb-12 pt-16 lg:py-28">
        <div className="container flex flex-col items-center gap-5 text-center">
          <h1
            className="animate-fade-up text-balance text-4xl font-extrabold tracking-tight opacity-0 sm:text-5xl md:text-6xl lg:text-7xl"
            style={{
              animationDelay: "0.3s",
              animationFillMode: "forwards",
              lineHeight: 1.25,
            }}
          >
            Empower your writing skills with AI now using{" "}
            <span className="font-extrabold text-primary">WriteLix</span>
          </h1>
          <p
            className="max-w-[42rem] animate-fade-up text-balance leading-normal text-muted-foreground opacity-0 sm:text-xl  sm:leading-8"
            style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
          >
            Integrate advanced AI tools to elevate your writing experience and
            explore the future of education and unlock the full potential of
            your study sessions.
          </p>
          <div
            className="flex animate-fade-up justify-center gap-2 opacity-0  md:gap-4"
            style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
          >
            <Link href="/pricing" className={buttonVariants({ size: "lg" })}>
              Go Pricing
            </Link>
            <Link
              href="/login"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              Login
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
