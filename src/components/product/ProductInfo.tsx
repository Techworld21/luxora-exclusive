import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Minus, Plus } from "lucide-react";
import { useProduct, formatPrice } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const ProductInfo = () => {
  const { productId } = useParams();
  const { product, loading } = useProduct(productId || "");
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const handleAddToBag = async () => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to add items to your bag.", variant: "destructive" });
      navigate("/auth");
      return;
    }
    setAdding(true);
    await addToCart(product!.id, quantity);
    toast({ title: "Added to bag", description: `${product!.name} added to your shopping bag.` });
    setAdding(false);
    setQuantity(1);
  };

  if (loading || !product) {
    return <div className="space-y-6 animate-pulse"><div className="h-8 bg-muted rounded w-1/2" /><div className="h-6 bg-muted rounded w-1/3" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="hidden lg:block">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink asChild><Link to={`/category/${product.category.toLowerCase()}`}>{product.category}</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>{product.name}</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-light text-muted-foreground mb-1">{product.category}</p>
            <h1 className="text-2xl md:text-3xl font-light text-foreground">{product.name}</h1>
          </div>
          <div className="text-right">
            <p className="text-xl font-light text-foreground">{formatPrice(product.price)}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 py-4 border-b border-border">
        {product.material && (
          <div className="space-y-2">
            <h3 className="text-sm font-light text-foreground">Material</h3>
            <p className="text-sm font-light text-muted-foreground">{product.material}</p>
          </div>
        )}
        {product.dimensions && (
          <div className="space-y-2">
            <h3 className="text-sm font-light text-foreground">Dimensions</h3>
            <p className="text-sm font-light text-muted-foreground">{product.dimensions}</p>
          </div>
        )}
        {product.weight && (
          <div className="space-y-2">
            <h3 className="text-sm font-light text-foreground">Weight</h3>
            <p className="text-sm font-light text-muted-foreground">{product.weight}</p>
          </div>
        )}
        {product.editors_notes && (
          <div className="space-y-2">
            <h3 className="text-sm font-light text-foreground">Editor's notes</h3>
            <p className="text-sm font-light text-muted-foreground italic">"{product.editors_notes}"</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-light text-foreground">Quantity</span>
          <div className="flex items-center border border-border">
            <Button variant="ghost" size="sm" onClick={decrementQuantity} className="h-10 w-10 p-0 hover:bg-transparent hover:opacity-50 rounded-none border-none">
              <Minus className="h-4 w-4" />
            </Button>
            <span className="h-10 flex items-center px-4 text-sm font-light min-w-12 justify-center border-l border-r border-border">{quantity}</span>
            <Button variant="ghost" size="sm" onClick={incrementQuantity} className="h-10 w-10 p-0 hover:bg-transparent hover:opacity-50 rounded-none border-none">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button
          onClick={handleAddToBag}
          disabled={adding}
          className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 font-light rounded-none"
        >
          {adding ? "Adding..." : "Add to Bag"}
        </Button>
      </div>
    </div>
  );
};

export default ProductInfo;
