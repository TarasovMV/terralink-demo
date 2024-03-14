import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonComponent} from "@terralink-demo/ui";
import {PHONE_MASK} from "../../domain";
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {POLYMORPHEUS_CONTEXT} from "@tinkoff/ng-polymorpheus";
import {TuiDialogContext, TuiLoaderModule} from "@taiga-ui/core";
import {SupabaseService} from "../../services/supabase.service";
import {finalize, takeUntil} from "rxjs";
import {TuiDestroyService} from "@taiga-ui/cdk";

@Component({
    selector: 'presentation-send',
    standalone: true,
    imports: [CommonModule, ButtonComponent, FormsModule, ReactiveFormsModule, TuiLoaderModule],
    templateUrl: './presentation-send.component.html',
    styleUrl: './presentation-send.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresentationSendComponent {
    private readonly context = inject(POLYMORPHEUS_CONTEXT) as TuiDialogContext<boolean, number>;
    private readonly supabaseService = inject(SupabaseService);
    private readonly destroy$ = inject(TuiDestroyService);

    readonly showLoader = signal(false);
    readonly viewType = signal<'form' | 'banner'>('form');
    readonly sessionEmail = inject(SupabaseService).session?.user.email ?? '';
    readonly control = new FormControl<string>(this.sessionEmail, {
        validators: [Validators.required, Validators.email]
    })

    checkControlError(): boolean {
        return !!this.control.errors && this.control.touched;
    }

    close(): void {
        const res = this.viewType() === 'banner';
        this.context.completeWith(res);
    }

    submit(): void {
        if (!this.control.valid) {
            this.control.markAsTouched();

            return;
        }

        this.showLoader.set(true);
        this.supabaseService.requestPresentation(+this.context.data + 1, this.control.value!).pipe(finalize(() => {
            this.showLoader.set(false);
            this.viewType.set('banner');
        }), takeUntil(this.destroy$)).subscribe();
    }
}
