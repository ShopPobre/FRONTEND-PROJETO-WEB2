import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class SwalService {

  private toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timerProgressBar: true,
  });

  success(title: string, timer = 2000) {
    this.toast.fire({ icon: 'success', title, timer });
  }

  error(title: string, timer = 3000) {
    this.toast.fire({ icon: 'error', title, timer });
  }

  warning(title: string, timer = 3000) {
    this.toast.fire({ icon: 'warning', title, timer });
  }

  info(title: string, timer = 3000) {
    this.toast.fire({ icon: 'info', title, timer });
  }
}