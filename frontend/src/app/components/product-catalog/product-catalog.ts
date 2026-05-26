import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import type { Product, ProductCategory } from '../../core/models/product';

type SortOption = 'price-asc' | 'price-desc';
type CategoryFilter = ProductCategory | 'All';
type CatalogTab = 'new' | 'all';

@Component({
  selector: 'app-product-catalog',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-catalog.html',
  styleUrl: './product-catalog.css',
})
export class ProductCatalog implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly products = signal<Product[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly activeTab = signal<CatalogTab>('new');
  protected readonly expandedCardId = signal<string | null>(null);

  protected categoryFilter: CategoryFilter = 'All';
  protected sortOption: SortOption = 'price-asc';
  protected selectedSizes = new Map<string, string>();

  protected readonly displayedProducts = computed(() => {
    let list = [...this.products()];

    if (this.activeTab() === 'new') {
      list = list.filter((p) => p.isFeatured);
      if (!list.length) list = [...this.products()];
    }

    list.sort((a, b) =>
      this.sortOption === 'price-asc' ? a.price - b.price : b.price - a.price
    );
    return list;
  });

  protected readonly categories: CategoryFilter[] = ['All', 'Men', 'Women', 'Accessories'];

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const cat = params['category'] as CategoryFilter | undefined;
      if (cat && this.categories.includes(cat)) {
        this.categoryFilter = cat;
      }
      this.loadProducts();
    });
  }

  setTab(tab: CatalogTab): void {
    this.activeTab.set(tab);
  }

  onCategoryChange(): void {
    this.router.navigate([], {
      queryParams: { category: this.categoryFilter === 'All' ? null : this.categoryFilter },
      queryParamsHandling: 'merge',
    });
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.error.set(null);
    this.productService.getAll(this.categoryFilter).subscribe({
      next: (data) => {
        this.products.set(data);
        data.forEach((p) => {
          if (!this.selectedSizes.has(p._id) && p.sizes.length) {
            this.selectedSizes.set(p._id, p.sizes[0]);
          }
        });
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Unable to load products. Is the API running?');
        this.loading.set(false);
      },
    });
  }

  getSelectedSize(product: Product): string {
    return this.selectedSizes.get(product._id) ?? product.sizes[0] ?? '';
  }

  setSelectedSize(productId: string, size: string): void {
    this.selectedSizes.set(productId, size);
  }

  quickAdd(product: Product, event: Event): void {
    event.stopPropagation();
    if (product.sizes.length > 1 && this.expandedCardId() !== product._id) {
      this.expandedCardId.set(product._id);
      return;
    }
    this.addToCart(product);
    this.expandedCardId.set(null);
  }

  addToCart(product: Product): void {
    const size = this.getSelectedSize(product);
    if (!size || product.stock === 0) return;
    this.cartService.addToCart(product, size);
  }

  sizesLabel(product: Product): string {
    const n = product.sizes.length;
    return n === 1 ? '1 size available' : `${n} sizes available`;
  }
}
