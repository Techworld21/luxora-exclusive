import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import Pagination from "./Pagination";
import { useProducts, formatPrice, resolveImageUrl } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";

const ProductGrid = () => {
  const { category } = useParams();
  const { products, loading } = useProducts(category);

  if (loading) {
    return (
      <section className="w-full px-6 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="aspect-square mb-3" />
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="w-full px-6 mb-16">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <Link key={product.id} to={`/product/${product.id}`}>
            <Card className="border-none shadow-none bg-transparent group cursor-pointer">
              <CardContent className="p-0">
                <div className="aspect-square mb-3 overflow-hidden bg-muted/10 relative">
                  <img
                    src={resolveImageUrl(product.image_url)}
                    alt={product.name}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-0"
                  />
                  <img
                    src={resolveImageUrl(product.hover_image_url)}
                    alt={`${product.name} lifestyle`}
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-300 opacity-0 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-black/[0.03]"></div>
                  {product.is_new && (
                    <div className="absolute top-2 left-2 px-2 py-1 text-xs font-medium text-black">
                      NEW
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-light text-foreground">{product.category}</p>
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-foreground">{product.name}</h3>
                    <p className="text-sm font-light text-foreground">{formatPrice(product.price)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      {products.length > 0 && <Pagination />}
    </section>
  );
};

export default ProductGrid;
