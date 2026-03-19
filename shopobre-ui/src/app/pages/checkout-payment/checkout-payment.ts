import {
  Component,
  inject,
  ViewChild,
  ElementRef,
  signal,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';
import { SwalService } from '../../core/services/swal.service';
import { ApiService } from '../../core/services/api.service';
import { PaymentService } from '../../core/services/payment.service';
import { CheckoutDataService } from '../../core/services/checkout-data.service';
import { CartService } from '../../core/services/cart.service';

declare const Stripe: any;

@Component({
  selector: 'app-checkout-payment',
  standalone: true,
  imports: [CommonModule, Header, Footer, RouterLink],
  templateUrl: './checkout-payment.html',
  styleUrl: './checkout-payment.scss',
})
export class CheckoutPayment implements OnInit, AfterViewInit {
  @ViewChild('cardElement') cardElementRef!: ElementRef<HTMLDivElement>;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private swalService = inject(SwalService);
  private http = inject(HttpClient);
  private api = inject(ApiService);
  private paymentService = inject(PaymentService);
  private checkoutData = inject(CheckoutDataService);
  private cartService = inject(CartService);

  orderId: number | null = null;
  clientSecret: string | null = null;
  orderTotal: number | null = null;

  stripePublishableKey = signal<string | null>(null);
  configLoaded = signal(false);
  loadingPayment = signal(false);
  cardReady = signal(false);
  paying = signal(false);
  message = signal<'success' | 'error' | null>(null);
  messageText = signal('');

  private stripe: any = null;
  private cardElement: any = null;

  ngOnInit() {
    this.orderId = Number(this.route.snapshot.paramMap.get('orderId')) || null;

    const fromService = this.checkoutData.getPaymentData();
    if (fromService.clientSecret) {
      this.clientSecret = fromService.clientSecret;
      this.orderTotal = fromService.orderTotal ?? this.orderTotal;
      if (fromService.orderId != null) this.orderId = fromService.orderId;
    }
    if (!this.clientSecret) {
      const nav = this.router.getCurrentNavigation();
      const state = (nav?.extras?.state as Record<string, unknown>) ?? (window.history.state as Record<string, unknown>) ?? {};
      this.clientSecret = (state['clientSecret'] as string) ?? null;
      this.orderTotal = (state['orderTotal'] as number) ?? this.orderTotal;
    }

    if (this.orderId && !this.clientSecret) {
      this.loadingPayment.set(true);
      this.paymentService.getClientSecretByOrderId(this.orderId).subscribe({
        next: (data) => {
          this.clientSecret = data.clientSecret ?? null;
          this.orderTotal = data.orderTotal ?? null;
          this.loadingPayment.set(false);
          const key = this.stripePublishableKey();
          if (key && this.clientSecret) {
            setTimeout(() => this.mountStripe(key), 100);
          }
        },
        error: () => {
          this.loadingPayment.set(false);
        },
      });
    }

    this.http
      .get<{ stripePublishableKey: string }>(`${this.api.getBaseUrl()}/config`)
      .subscribe({
        next: (data) => {
          const key = (data?.stripePublishableKey || '').trim();
          this.stripePublishableKey.set(key || null);
          this.configLoaded.set(true);
          if (key && this.clientSecret) {
            setTimeout(() => this.mountStripe(key), 100);
          }
        },
        error: () => {
          this.configLoaded.set(true);
          this.stripePublishableKey.set(null);
        },
      });
  }

  ngAfterViewInit() {
    const key = this.stripePublishableKey();
    if (key && this.clientSecret && this.cardElementRef?.nativeElement) {
      setTimeout(() => this.mountStripe(key), 150);
    }
  }

  private mountStripe(key: string) {
    const el = this.cardElementRef?.nativeElement ?? document.getElementById('card-element');
    if (!el || typeof Stripe !== 'function' || !key || !this.clientSecret) {
      return;
    }
    if (this.stripe) return;
    try {
      this.stripe = Stripe(key);
      const elements = this.stripe.elements();
      this.cardElement = elements.create('card', {
        style: { base: { fontSize: '16px' } },
      });
      this.cardElement.mount(el);
      this.cardReady.set(true);
    } catch (e) {
      this.cardReady.set(false);
      this.message.set('error');
      this.messageText.set('Erro ao carregar o formulário de pagamento.');
    }
  }

  pay() {
    if (!this.stripe || !this.cardElement || !this.clientSecret) {
      this.swalService.error('Formulário de pagamento não está pronto.');
      return;
    }
    this.message.set(null);
    this.paying.set(true);
    this.stripe
      .confirmCardPayment(this.clientSecret, {
        payment_method: { card: this.cardElement },
      })
      .then((result: { error?: { message?: string }; paymentIntent?: unknown }) => {
        this.paying.set(false);
        if (result.error) {
          this.message.set('error');
          this.messageText.set(result.error.message || 'Pagamento falhou.');
          return;
        }
        this.message.set('success');
        this.messageText.set('Pagamento confirmado! Redirecionando para seus pedidos.');
        this.swalService.success('Pagamento confirmado!');
        this.cartService.clear();
        setTimeout(() => {
          this.router.navigate(['/orders']);
        }, 1500);
      })
      .catch((err: Error) => {
        this.paying.set(false);
        this.message.set('error');
        this.messageText.set(err?.message || 'Erro ao processar pagamento.');
      });
  }

  backToCart() {
    this.router.navigate(['/cart']);
  }
}
