import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { HandCoins, HandHelping } from "lucide-react";

const HeroSection = () => {
  const scrollToSection = (id: any) => {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden flex items-center justify-between">
      <div
        className="absolute inset-0 z-0 "
        style={{
          backgroundImage: 'url("/images/hero.avif")',
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        <div className=" relative z-10 container mx-auto px-4 h-full  gap-14 text-center flex flex-col items-center justify-center">
          <div className=" max-w-3xl mx-auto space-y-6 ">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Together, We Can Make a Difference
            </h1>
            <p className="text-md md:text-xl text-gray-300 mb-8 leading-relaxed">
              At Hope Foundation, we believe in the power of community to create
              change. Whether you&apos;re looking to lend a hand or need
              support, you&apos;re in the right place. Join us in our mission to
              provide food for families in need. Every action counts—let&apos;s
              build a better future together.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            <Button
              color="primary"
              radius="md"
              size="lg"
              startContent={<HandCoins />}
              onPress={() => scrollToSection("giveHelp")}
            >
              Give help
            </Button>
            <Button
              as={Link}
              className="text-white"
              color="primary"
              href="/getHelp"
              radius="md"
              size="lg"
              startContent={<HandHelping />}
              variant="bordered"
            >
              Get help
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
