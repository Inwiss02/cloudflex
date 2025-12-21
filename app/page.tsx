"use client";

import type React from "react";
import Image from "next/image";
import { Shield } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState, useEffect, useRef } from "react";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const [shouldAnimateTaglineOnly, setShouldAnimateTaglineOnly] =
    useState(false);
  const [hasCompletedFirstAnimation, setHasCompletedFirstAnimation] =
    useState(false);
  const [hasScrolledDown, setHasScrolledDown] = useState(false);

  const [typedLine1, setTypedLine1] = useState("");
  const [typedLine2, setTypedLine2] = useState("");
  const [typedTagline, setTypedTagline] = useState("");

  const [showCursor1, setShowCursor1] = useState(true);
  const [showCursor2, setShowCursor2] = useState(false);
  const [showCursorTagline, setShowCursorTagline] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => {
    const sections = document.querySelectorAll(".animate-on-scroll");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          } else {
            entry.target.classList.remove("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
          setHasScrolledDown(true);
        }
        if (entry.isIntersecting && hasScrolledDown) {
          setShouldAnimateTaglineOnly(true);
        }
      },
      { threshold: 0.5 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, [hasScrolledDown]);

  useEffect(() => {
    if (!shouldAnimate || hasCompletedFirstAnimation) return;

    const line1 = "Cinéma illimité.";
    const line2 = "Un seul endroit.";
    const tagline = "Une plateforme qui s'adapte à vous, pas l'inverse.";

    let index1 = 0;
    let index2 = 0;
    let indexTagline = 0;

    const interval1 = setInterval(() => {
      if (index1 <= line1.length) {
        setTypedLine1(line1.slice(0, index1));
        index1++;
      } else {
        clearInterval(interval1);
        setShowCursor1(false);

        setShowCursor2(true);
        setTimeout(() => {
          const interval2 = setInterval(() => {
            if (index2 <= line2.length) {
              setTypedLine2(line2.slice(0, index2));
              index2++;
            } else {
              clearInterval(interval2);
              setShowCursor2(false);

              setShowCursorTagline(true);
              setTimeout(() => {
                const intervalTagline = setInterval(() => {
                  if (indexTagline <= tagline.length) {
                    setTypedTagline(tagline.slice(0, indexTagline));
                    indexTagline++;
                  } else {
                    clearInterval(intervalTagline);
                    setTimeout(() => setShowCursorTagline(false), 3000);
                    setShouldAnimate(false);
                    setHasCompletedFirstAnimation(true);
                  }
                }, 50);
              }, 300);
            }
          }, 50);
        }, 300);
      }
    }, 50);

    return () => {
      clearInterval(interval1);
    };
  }, [shouldAnimate, hasCompletedFirstAnimation]);

  useEffect(() => {
    if (!shouldAnimateTaglineOnly) return;

    const tagline = "Une plateforme qui s'adapte à vous, pas l'inverse.";
    let indexTagline = 0;

    setTypedTagline("");
    setShowCursorTagline(true);

    const intervalTagline = setInterval(() => {
      if (indexTagline <= tagline.length) {
        setTypedTagline(tagline.slice(0, indexTagline));
        indexTagline++;
      } else {
        clearInterval(intervalTagline);
        setTimeout(() => setShowCursorTagline(false), 3000);
        setShouldAnimateTaglineOnly(false);
      }
    }, 50);

    return () => clearInterval(intervalTagline);
  }, [shouldAnimateTaglineOnly]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      window.location.href = `/payment?email=${encodeURIComponent(email)}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Image
            src="/images/logo.png"
            alt="CloudFlex"
            width={120}
            height={32}
            className="h-8 w-auto rounded-lg"
          />

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="https://www.cloudflex.art/mon-compte"
              className="text-white hover:text-gray-300 transition relative group"
            >
              Mon compte
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a
              href="https://www.cloudflex.art/support"
              className="text-white hover:text-gray-300 transition relative group"
            >
              Support
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a
              href="https://overseerr-inwiss.karma.usbx.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300 transition relative group"
            >
              Overseerr
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 group-hover:w-full transition-all duration-300"></span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-sm border-t border-white/10">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <a
                href="https://www.cloudflex.art/mon-compte"
                className="text-white hover:text-gray-300 transition py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Mon compte
              </a>
              <a
                href="https://www.cloudflex.art/support"
                className="text-white hover:text-gray-300 transition py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Support
              </a>
              <a
                href="https://overseerr-inwiss.karma.usbx.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Overseerr
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center pt-20"
      >
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url(/images/leon.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.3,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50 z-0" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-3">
            <h1 className="text-5xl md:text-7xl font-bold [text-shadow:_0_4px_12px_rgb(0_0_0_/_80%)]">
              {typedLine1}
              {showCursor1 && (
                <span className="inline-block w-1 h-16 bg-white ml-1 animate-pulse" />
              )}
            </h1>
            <p className="text-2xl md:text-3xl text-gray-200 [text-shadow:_0_2px_8px_rgb(0_0_0_/_80%)] leading-tight">
              {typedLine2}
              {showCursor2 && (
                <span className="inline-block w-1 h-10 bg-white ml-1 animate-pulse" />
              )}
            </p>
            <p className="text-xl md:text-2xl bg-gradient-to-r from-orange-400 via-yellow-400 to-red-400 bg-clip-text text-transparent font-semibold [text-shadow:_0_2px_8px_rgb(0_0_0_/_40%)] leading-relaxed">
              {typedTagline}
              {showCursorTagline && (
                <span className="inline-block w-1 h-8 bg-gradient-to-r from-orange-400 via-yellow-400 to-red-400 ml-1 animate-pulse" />
              )}
            </p>

            <form onSubmit={handleSubmit} className="mt-8 max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Votre email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-6 py-4 rounded bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                  required
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded transition flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  Commencer
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 relative z-10 animate-on-scroll">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl text-gray-200 leading-relaxed mb-4">
              <span className="font-bold text-white">
                Plus besoin de plusieurs abonnements Netflix, Disney+, HBO,
                Amazon Prime, Apple TV...
              </span>
            </h2>
            <p className="text-2xl md:text-3xl text-gray-200 leading-relaxed">
              Toute la richesse CloudFlex à petit budget
            </p>
            <p className="text-2xl md:text-3xl text-gray-200 leading-relaxed mt-4">
              <span className="font-bold text-white text-3xl md:text-4xl animate-price-pulse">
                à partir de 40 MAD/mois
              </span>{" "}
              <span className="text-lg text-gray-400"></span>
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="pb-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-purple-900/60 via-blue-900/60 to-black/80 backdrop-blur-sm p-8 rounded-lg border border-white/10 relative overflow-hidden animate-on-scroll min-h-[320px] flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10" />
              <h3 className="text-2xl font-bold mb-4 relative z-10">
                Tous vos films et séries sans limitations à la région, où que
                vous soyez, avec une haute qualité 1080p
              </h3>
              <p className="text-gray-300 relative z-10 leading-relaxed">
                Pas besoin de VPN pour regarder les films et séries d'autres
                pays.
                <br />
                <br />
              </p>
              <div className="absolute bottom-6 right-6 opacity-30">
                <Image
                  src="/images/1080p-full-hd.png"
                  alt="1080p Full HD"
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-purple-900/60 via-blue-900/60 to-black/80 backdrop-blur-sm p-8 rounded-lg border border-white/10 relative overflow-hidden animate-on-scroll min-h-[320px] flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10" />
              <h3 className="text-2xl font-bold mb-4 relative z-10">
                Les dernières sorties de films et épisodes de vos séries
                préférées sont automatiquement ajoutées à la bibliothèque
                CloudFlex
              </h3>
              <p className="text-gray-300 relative z-10">
                Disponibilité immédiate des films les mieux notés avec un score
                minimum de 7.1/10
              </p>
              <div className="absolute bottom-6 right-6 opacity-30">
                <Image
                  src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg"
                  alt="TMDB"
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-purple-900/60 via-blue-900/60 to-black/80 backdrop-blur-sm p-8 rounded-lg border border-white/10 relative overflow-hidden animate-on-scroll min-h-[320px] flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10" />
              <h3 className="text-2xl font-bold mb-4 relative z-10">
                Découvrez notre outil Overseerr L'accès illimité à vos envies
              </h3>
              <p className="text-gray-300 relative z-10">
                Peu importe le pays, l'année ou la plateforme : si ça existe,
                vous pouvez le demander et ça s'ajoute automatiquement à la
                bibliothèque CloudFlex
              </p>
              <div className="absolute bottom-6 right-6 opacity-30">
                <Image
                  src="https://raw.githubusercontent.com/sct/overseerr/develop/public/os_icon.svg"
                  alt="Overseerr"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-purple-900/60 via-blue-900/60 to-black/80 backdrop-blur-sm p-8 rounded-lg border border-white/10 relative overflow-hidden animate-on-scroll min-h-[320px] flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10" />
              <h3 className="text-2xl font-bold mb-4 relative z-10">
                Créez des profils sécurisés pour vos enfants
              </h3>
              <p className="text-gray-300 relative z-10 leading-relaxed">
                Toute la richesse CloudFlex, plus un espace Enfants sûr et
                adapté.
              </p>
              <div className="absolute bottom-6 right-6 opacity-30">
                <Shield className="w-12 h-12" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Left side: Image */}
              <div className="relative h-[400px] rounded-lg overflow-hidden animate-on-scroll">
                <Image
                  src="/images/questions.jpg"
                  alt="Questions"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Right side: FAQ */}
              <div className="animate-on-scroll">
                <h2 className="text-4xl font-bold mb-8">
                  Questions fréquentes
                </h2>
                <Accordion type="single" collapsible className="space-y-4">
                  <AccordionItem
                    value="item-1"
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-6"
                  >
                    <AccordionTrigger className="text-lg font-semibold hover:text-gray-300">
                      Qu'est-ce que CloudFlex ?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-300">
                      CloudFlex est un service privé de streaming qui vous donne
                      accès à une large bibliothèque de films, séries, animes et
                      documentaires en haute qualité. Vous pouvez également
                      demander des titres supplémentaires grâce à l’outil
                      intégré Overseerr.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem
                    value="item-2"
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-6"
                  >
                    <AccordionTrigger className="text-lg font-semibold hover:text-gray-300">
                      Combien coûte l'abonnement ?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-300">
                      CloudFlex propose trois plans tarifaires selon vos besoins
                      : 320 MAD pour 6mois, 600 MAD pour 1 an et 960 MAD pour 2
                      ans.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem
                    value="item-4"
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-6"
                  >
                    <AccordionTrigger className="text-lg font-semibold hover:text-gray-300">
                      Sur quels appareils puis-je regarder ?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-300">
                      CloudFlex fonctionne sur : Smart TV (Samsung / LG...)
                      Android TV & Google TV Smartphones Android iPhone / iPad
                      Ordinateurs (Windows, Mac) Box TV (Fire TV, Android Box)
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem
                    value="item-3"
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-6"
                  >
                    <AccordionTrigger className="text-lg font-semibold hover:text-gray-300">
                      Puis-je demander des films ou séries qui ne sont pas dans
                      la bibliothèque ?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-300">
                      Oui. Grâce à l’outil Overseerr, vous pouvez rechercher
                      n’importe quel titre et envoyer une demande. Les demandes
                      sont automatiquement approuvées selon disponibilité.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem
                    value="item-3"
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-6"
                  >
                    <AccordionTrigger className="text-lg font-semibold hover:text-gray-300">
                      Combien d’utilisateurs par compte ?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-300">
                      Chaque abonnement inclut jusqu’à 5 profils, avec
                      visionnage indépendant.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem
                    value="item-3"
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-6"
                  >
                    <AccordionTrigger className="text-lg font-semibold hover:text-gray-300">
                      Comment se passe le renouvellement ?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-300">
                      Un rappel est envoyé avant la fin de votre période
                      d’accès. Vous pouvez renouveler facilement en un seul
                      paiement.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 relative z-10 animate-on-scroll">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <p className="text-3xl md:text-4xl font-semibold text-white">
              Prêt à vous amuser ?
            </p>
            <form onSubmit={handleSubmit} className="mt-6">
              <div className="flex flex-col gap-4">
                <input
                  type="email"
                  placeholder="Votre email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-4 rounded bg-black/50 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                  required
                />
                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded transition flex items-center justify-center gap-2"
                >
                  Commencer
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Popcorn Image Section */}
      <section className="py-8 relative z-10 animate-on-scroll">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="relative h-[200px] rounded-lg overflow-hidden">
              <Image
                src="/images/popcorn.jpg"
                alt="Popcorn"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/80 backdrop-blur-sm py-8 mt-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Image
              src="/images/logo.png"
              alt="CloudFlex"
              width={120}
              height={32}
              className="h-8 w-auto rounded-lg"
            />
            <div className="flex gap-8 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition">
                Conditions d'utilisation
              </a>
              <a href="#" className="hover:text-white transition">
                Confidentialité
              </a>
              <a href="#" className="hover:text-white transition">
                Aide
              </a>
            </div>
          </div>
          <div className="text-center text-gray-500 text-sm mt-6">
            © 2025 CloudFlex. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}
