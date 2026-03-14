import { ArrowRight, X, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ShoppingBag from "./ShoppingBag";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/hooks/useCart";
import luxoraLogo from "@/assets/luxora-logo.jpeg";

const Navigation = () => {
  const { user, signOut } = useAuth();
  const { cartItems, cartCount, updateQuantity } = useCart();
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [offCanvasType, setOffCanvasType] = useState<'favorites' | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShoppingBagOpen, setIsShoppingBagOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  // Preload dropdown images for faster display
  useEffect(() => {
    const imagesToPreload = [
      "/rings-collection.png",
      "/earrings-collection.png", 
      "/arcus-bracelet.png",
      "/span-bracelet.png",
      "/founders.png"
    ];
    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const popularSearches = [
    "Gold Rings", "Silver Necklaces", "Pearl Earrings",
    "Designer Bracelets", "Wedding Rings", "Vintage Collection"
  ];
  
  const navItems = [
    { 
      name: "Shop", 
      href: "/category/shop",
      submenuItems: ["Rings", "Necklaces", "Earrings", "Bracelets", "Watches", "Clothing"],
      images: [
        { src: "/rings-collection.png", alt: "Rings Collection", label: "Rings" },
        { src: "/earrings-collection.png", alt: "Earrings Collection", label: "Earrings" }
      ]
    },
    { 
      name: "Clothing", 
      href: "/category/clothing",
      submenuItems: ["Blouses", "Dresses", "Blazers", "Skirts"],
      images: [
        { src: "/arcus-bracelet.png", alt: "New Collection", label: "Women's Collection" },
        { src: "/span-bracelet.png", alt: "Featured", label: "Featured" }
      ]
    },
    { 
      name: "New in", 
      href: "/category/new-in",
      submenuItems: ["This Week's Arrivals", "Spring Collection", "Featured Designers", "Limited Edition", "Pre-Orders"],
      images: [
        { src: "/arcus-bracelet.png", alt: "Arcus Bracelet", label: "Arcus Bracelet" },
        { src: "/span-bracelet.png", alt: "Span Bracelet", label: "Span Bracelet" }
      ]
    },
    { 
      name: "About", 
      href: "/about/our-story",
      submenuItems: ["Our Story", "Sustainability", "Size Guide", "Customer Care", "Store Locator"],
      images: [
        { src: "/founders.png", alt: "Company Founders", label: "Read our story" }
      ]
    }
  ];

  // Convert cart items for ShoppingBag component format
  const shoppingBagItems = cartItems.map(item => ({
    id: item.id as any,
    name: item.product.name,
    price: `€${item.product.price.toLocaleString('en-EU', { minimumFractionDigits: 0 })}`,
    image: item.product.image_url || "/placeholder.svg",
    quantity: item.quantity,
    category: item.product.category,
  }));

  const handleUpdateQuantity = (id: any, newQuantity: number) => {
    updateQuantity(id as string, newQuantity);
  };

  return (
    <nav 
      className="relative" 
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <div className="flex items-center justify-between h-16 px-6">
        {/* Mobile hamburger button */}
        <button
          className="lg:hidden p-2 mt-0.5 text-nav-foreground hover:text-nav-hover transition-colors duration-200"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-5 h-5 relative">
            <span className={`absolute block w-5 h-px bg-current transform transition-all duration-300 ${
              isMobileMenuOpen ? 'rotate-45 top-2.5' : 'top-1.5'
            }`}></span>
            <span className={`absolute block w-5 h-px bg-current transform transition-all duration-300 top-2.5 ${
              isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
            }`}></span>
            <span className={`absolute block w-5 h-px bg-current transform transition-all duration-300 ${
              isMobileMenuOpen ? '-rotate-45 top-2.5' : 'top-3.5'
            }`}></span>
          </div>
        </button>

        {/* Left navigation */}
        <div className="hidden lg:flex space-x-8">
          {navItems.map((item) => (
            <div
              key={item.name}
              className="relative"
              onMouseEnter={() => setActiveDropdown(item.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                to={item.href}
                className="text-nav-foreground hover:text-nav-hover transition-colors duration-200 text-sm font-light py-6 block"
              >
                {item.name}
              </Link>
            </div>
          ))}
        </div>

        {/* Center logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link to="/" className="block">
            <img 
              src={luxoraLogo} 
              alt="LUXORA" 
              className="h-10 w-auto rounded-sm"
            />
          </Link>
        </div>

        {/* Right icons */}
        <div className="flex items-center space-x-2">
          <button 
            className="p-2 text-nav-foreground hover:text-nav-hover transition-colors duration-200"
            aria-label="Search"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button>
          <button 
            className="hidden lg:block p-2 text-nav-foreground hover:text-nav-hover transition-colors duration-200"
            aria-label="Favorites"
            onClick={() => setOffCanvasType('favorites')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </button>
          
          {/* Account icon */}
          <div className="relative">
            <button 
              className="p-2 text-nav-foreground hover:text-nav-hover transition-colors duration-200"
              aria-label="Account"
              onClick={() => setIsAccountOpen(!isAccountOpen)}
            >
              <User size={20} />
            </button>
            {isAccountOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsAccountOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border shadow-lg z-50">
                  {user ? (
                    <div className="p-2">
                      <p className="px-3 py-2 text-xs text-muted-foreground font-light truncate">{user.email}</p>
                      <button
                        onClick={() => { signOut(); setIsAccountOpen(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm font-light text-foreground hover:bg-muted transition-colors"
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="p-2">
                      <Link
                        to="/auth"
                        onClick={() => setIsAccountOpen(false)}
                        className="block px-3 py-2 text-sm font-light text-foreground hover:bg-muted transition-colors"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/auth"
                        onClick={() => setIsAccountOpen(false)}
                        className="block px-3 py-2 text-sm font-light text-foreground hover:bg-muted transition-colors"
                      >
                        Create Account
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <button 
            className="p-2 text-nav-foreground hover:text-nav-hover transition-colors duration-200 relative"
            aria-label="Shopping bag"
            onClick={() => setIsShoppingBagOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[30%] text-[0.5rem] font-semibold text-black pointer-events-none">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Full width dropdown */}
      {activeDropdown && (
        <div 
          className="absolute top-full left-0 right-0 bg-nav border-b border-border z-50"
          onMouseEnter={() => setActiveDropdown(activeDropdown)}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <div className="px-6 py-8">
            <div className="flex justify-between w-full">
              <div className="flex-1">
                <ul className="space-y-2">
                  {navItems
                    .find(item => item.name === activeDropdown)
                    ?.submenuItems.map((subItem, index) => (
                    <li key={index}>
                      <Link 
                        to={activeDropdown === "About" ? `/about/${subItem.toLowerCase().replace(/\s+/g, '-')}` : `/category/${subItem.toLowerCase()}`}
                        className="text-nav-foreground hover:text-nav-hover transition-colors duration-200 text-sm font-light block py-2"
                      >
                        {subItem}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex space-x-6">
                {navItems
                  .find(item => item.name === activeDropdown)
                  ?.images.map((image, index) => {
                    let linkTo = "/";
                    if (activeDropdown === "Shop") {
                      if (image.label === "Rings") linkTo = "/category/rings";
                      else if (image.label === "Earrings") linkTo = "/category/earrings";
                    } else if (activeDropdown === "Clothing") {
                      linkTo = "/category/clothing";
                    } else if (activeDropdown === "New in") {
                      if (image.label === "Arcus Bracelet") linkTo = "/product/arcus-bracelet";
                      else if (image.label === "Span Bracelet") linkTo = "/product/span-bracelet";
                    } else if (activeDropdown === "About") {
                      linkTo = "/about/our-story";
                    }
                    return (
                      <Link key={index} to={linkTo} className="w-[400px] h-[280px] cursor-pointer group relative overflow-hidden block">
                        <img src={image.src} alt={image.alt} className="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-90" />
                        <div className="absolute bottom-2 left-2 text-white text-xs font-light flex items-center gap-1">
                          <span>{image.label}</span>
                          <ArrowRight size={12} />
                        </div>
                      </Link>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search overlay */}
      {isSearchOpen && (
        <div className="absolute top-full left-0 right-0 bg-nav border-b border-border z-50">
          <div className="px-6 py-8">
            <div className="max-w-2xl mx-auto">
              <div className="relative mb-8">
                <div className="flex items-center border-b border-border pb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-nav-foreground mr-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                  <input type="text" placeholder="Search for jewelry..." className="flex-1 bg-transparent text-nav-foreground placeholder:text-nav-foreground/60 outline-none text-lg" autoFocus />
                </div>
              </div>
              <div>
                <h3 className="text-nav-foreground text-sm font-light mb-4">Popular Searches</h3>
                <div className="flex flex-wrap gap-3">
                  {popularSearches.map((search, index) => (
                    <button key={index} className="text-nav-foreground hover:text-nav-hover text-sm font-light py-2 px-4 border border-border rounded-full transition-colors duration-200 hover:border-nav-hover">
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile navigation menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-nav border-b border-border z-50">
          <div className="px-6 py-8">
            <div className="space-y-6">
              {navItems.map((item) => (
                <div key={item.name}>
                  <Link to={item.href} className="text-nav-foreground hover:text-nav-hover transition-colors duration-200 text-lg font-light block py-2" onClick={() => setIsMobileMenuOpen(false)}>
                    {item.name}
                  </Link>
                  <div className="mt-3 pl-4 space-y-2">
                    {item.submenuItems.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        to={item.name === "About" ? `/about/${subItem.toLowerCase().replace(/\s+/g, '-')}` : `/category/${subItem.toLowerCase()}`}
                        className="text-nav-foreground/70 hover:text-nav-hover text-sm font-light block py-1"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {subItem}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Shopping Bag */}
      <ShoppingBag 
        isOpen={isShoppingBagOpen}
        onClose={() => setIsShoppingBagOpen(false)}
        cartItems={shoppingBagItems}
        updateQuantity={handleUpdateQuantity}
        onViewFavorites={() => {
          setIsShoppingBagOpen(false);
          setOffCanvasType('favorites');
        }}
      />
      
      {/* Favorites Off-canvas */}
      {offCanvasType === 'favorites' && (
        <div className="fixed inset-0 z-50 h-screen">
          <div className="absolute inset-0 bg-black/50 h-screen" onClick={() => setOffCanvasType(null)} />
          <div className="absolute right-0 top-0 h-screen w-96 bg-background border-l border-border animate-slide-in-right flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-light text-foreground">Your Favorites</h2>
              <button onClick={() => setOffCanvasType(null)} className="p-2 text-foreground hover:text-muted-foreground transition-colors" aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-muted-foreground text-sm mb-6">
                You haven't added any favorites yet. Browse our collection and click the heart icon to save items you love.
              </p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
