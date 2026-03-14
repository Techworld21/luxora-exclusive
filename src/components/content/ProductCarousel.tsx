import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useProducts, formatPrice, resolveImageUrl } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";

const ProductCarousel = () => {
  const { products, loading } = useProducts();

  if (loading) {
    return (
      <section className="w-full mb-16 px-6">
        <div className="flex gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
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
    <section className="w-full mb-16 px-6">
      <Carousel opts={{ align: "start", loop: false }} className="w-full">
        <CarouselContent>
          {products.slice(0, 8).map((product) => (
            <CarouselItem
              key={product.id}
              className="basis-1/2 md:basis-1/3 lg:basis-1/4 pr-2 md:pr-4"
            >
              <Link to={`/product/${product.id}`}>
                <Card className="border-none shadow-none bg-transparent group">
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
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default ProductCarousel;
