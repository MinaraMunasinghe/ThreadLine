import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import type { Product, ProductCategory, CreateProductDto } from '../../core/models/product';

@Component({
  selector: 'app-admin-management',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-management.html',
  styleUrl: './admin-management.css',
})
export class AdminManagement implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly fb = inject(FormBuilder);

  protected readonly products = signal<Product[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly editingId = signal<string | null>(null);
  protected readonly message = signal<string | null>(null);
  protected readonly showForm = signal(true);

  protected readonly totalProducts = computed(() => this.products().length);
  protected readonly featuredCount = computed(() => this.products().filter((p) => p.isFeatured).length);
  protected readonly lowStockCount = computed(() => this.products().filter((p) => p.stock > 0 && p.stock <= 10).length);
  protected readonly outOfStockCount = computed(() => this.products().filter((p) => p.stock === 0).length);

  protected readonly form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    category: ['Men' as ProductCategory, Validators.required],
    sizes: ['S,M,L', Validators.required],
    imageUrl: ['', Validators.required],
    stock: [0, [Validators.required, Validators.min(0)]],
    isFeatured: [false],
  });

  protected readonly categories: ProductCategory[] = ['Men', 'Women', 'Accessories'];

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  startCreate(): void {
    this.editingId.set(null);
    this.showForm.set(true);
    this.form.reset({
      title: '',
      description: '',
      price: 0,
      category: 'Men',
      sizes: 'S,M,L',
      imageUrl: '',
      stock: 0,
      isFeatured: false,
    });
  }

  startEdit(product: Product): void {
    this.editingId.set(product._id);
    this.showForm.set(true);
    this.form.patchValue({
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      sizes: product.sizes.join(','),
      imageUrl: product.imageUrl,
      stock: product.stock,
      isFeatured: product.isFeatured,
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();
    const dto: CreateProductDto = {
      title: v.title,
      description: v.description,
      price: v.price,
      category: v.category,
      sizes: v.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      imageUrl: v.imageUrl,
      stock: v.stock,
      isFeatured: v.isFeatured,
    };

    this.saving.set(true);
    const id = this.editingId();

    const request = id
      ? this.productService.update(id, dto)
      : this.productService.create(dto);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.message.set(id ? 'Product updated successfully.' : 'Product created successfully.');
        this.startCreate();
        this.loadProducts();
      },
      error: () => {
        this.saving.set(false);
        this.message.set('Save failed. Check admin API key and server.');
      },
    });
  }

  deleteProduct(id: string): void {
    if (!confirm('Delete this product?')) return;

    this.productService.delete(id).subscribe({
      next: () => {
        this.message.set('Product deleted.');
        this.loadProducts();
      },
      error: () => this.message.set('Delete failed.'),
    });
  }

  stockBadgeClass(stock: number): string {
    if (stock === 0) return 'stock-badge--out';
    if (stock <= 10) return 'stock-badge--low';
    return 'stock-badge--ok';
  }
}
