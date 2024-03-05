import {TuiRootModule, TuiDialogModule} from '@taiga-ui/core';
import {Component} from '@angular/core';
import {RouterModule} from '@angular/router';

@Component({
    standalone: true,
    imports: [RouterModule, TuiRootModule, TuiDialogModule],
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.less',
})
export class AppComponent {
    title = 'terralink-demo';
}
