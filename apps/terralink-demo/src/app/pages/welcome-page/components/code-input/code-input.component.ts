import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    ElementRef,
    inject,
    Input,
    OnInit,
    QueryList,
    signal,
    ViewChildren,
    WritableSignal,
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MaskitoDirective} from '@maskito/angular';
import {MaskitoOptions} from '@maskito/core';
import {map, merge, takeUntil} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
    selector: 'code-input',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MaskitoDirective],
    templateUrl: './code-input.component.html',
    styleUrl: './code-input.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeInputComponent implements OnInit {
    @ViewChildren('input') inputsRef!: QueryList<ElementRef>;
    @Input({required: true}) result!: WritableSignal<string>;

    private readonly destroyRef = inject(DestroyRef);

    readonly control1 = new FormControl<number | null>(null);
    readonly control2 = new FormControl<number | null>(null);
    readonly control3 = new FormControl<number | null>(null);
    readonly control4 = new FormControl<number | null>(null);

    readonly hiddenControl = new FormControl<string>('');
    readonly focus = signal(false);

    readonly mask: MaskitoOptions = {
        mask: [/\d/],
    };

    readonly hiddenMask: MaskitoOptions = {
        mask: [/\d/, /\d/, /\d/, /\d/],
    };

    ngOnInit(): void {
        // merge(
        //     this.control1.valueChanges.pipe(map(value => ({idx: 0, value}))),
        //     this.control2.valueChanges.pipe(map(value => ({idx: 1, value}))),
        //     this.control3.valueChanges.pipe(map(value => ({idx: 2, value}))),
        //     this.control4.valueChanges.pipe(map(value => ({idx: 3, value}))),
        // ).subscribe(res => {
        //     console.log('res', res);
        //
        //     if (res.idx < 3 && res.value !== null) {
        //         this.inputsRef.get(res.idx + 1)?.nativeElement.focus();
        //     }
        //
        //     if (res.idx > 0 && res.value === null) {
        //         this.inputsRef.get(res.idx - 1)?.nativeElement.focus();
        //     }
        //
        //     this.result.set(`${this.control1.value}${this.control2.value}${this.control3.value}${this.control4.value}`);
        // });

        this.hiddenControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
            this.result.set(res || '');
        });
    }

    showCursor(idx: number): boolean {
        return this.focus() && this.hiddenControl.value?.length === idx;
    }
}
